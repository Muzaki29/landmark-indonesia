from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from .glb import validate_glb
from .paths import REPORT_ROOT, output_dir
from .pipeline import load_model, validate_model, write_manifest
from .render import render_model_studies


def timestamp() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def write_report(landmark_id: str, result: dict) -> Path:
    REPORT_ROOT.mkdir(parents=True, exist_ok=True)
    path = REPORT_ROOT / f"{landmark_id}.json"
    path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return path


def print_result(title: str, result: dict) -> None:
    print(title.upper())
    print(f"Heritage metadata: {result['status']}")
    print(f"Dimensions: {'PASS' if not any('dimension' in item for item in result['errors']) else 'FAIL'}")
    print(f"Provenance: {'PASS' if not any('classification' in item or 'evidence' in item for item in result['errors']) else 'FAIL'}")
    print(f"GLB: {result.get('glb', {}).get('status', 'NOT_RUN')}")
    for error in result.get("errors", []):
        print(f"ERROR: {error}")
    for warning in result.get("warnings", []):
        print(f"WARNING: {warning}")


def main() -> int:
    parser = argparse.ArgumentParser(prog="python -m heritage_pipeline")
    parser.add_argument("command", choices=("validate", "model-study", "manifest", "all"))
    parser.add_argument("landmark")
    parser.add_argument("--glb", type=Path)
    args = parser.parse_args()
    try:
        model = load_model(args.landmark)
    except (FileNotFoundError, json.JSONDecodeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2
    generated_at = timestamp()
    validation = validate_model(model)
    if args.glb:
        validation["glb"] = validate_glb(args.glb, model["dimensions"]["totalHeight"]["value"])
        if validation["glb"]["status"] == "FAIL":
            validation["status"] = "FAIL"
            validation["errors"].extend(validation["glb"]["errors"])
    else:
        validation["glb"] = {"status": "NOT_RUN", "reason": "The accepted browser asset is procedural R3F geometry; no GLB is published."}
    studies = []
    if args.command in {"model-study", "manifest", "all"}:
        studies = render_model_studies(model, generated_at)
    if args.command in {"manifest", "all"}:
        manifest_path = write_manifest(model, studies, validation, generated_at)
        print(f"Manifest: {manifest_path.relative_to(output_dir(args.landmark).parents[2]).as_posix()}")
    report_path = write_report(args.landmark, validation)
    print_result(model["name"], validation)
    print(f"Report: {report_path}")
    return 1 if validation["status"] == "FAIL" else 0


if __name__ == "__main__":
    raise SystemExit(main())
