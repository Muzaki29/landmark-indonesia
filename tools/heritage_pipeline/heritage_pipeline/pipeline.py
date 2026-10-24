from __future__ import annotations

import json
import math
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .paths import model_path, output_dir

DIMENSION_STATUSES = {"VERIFIED", "ESTIMATED", "INTERPRETIVE"}
GEOMETRY_CLASSES = {"DOCUMENTED", "DERIVED", "INTERPRETIVE"}
MATERIAL_CLASSES = {"VERIFIED_MATERIAL", "SUPPORTED_MATERIAL", "VISUAL_APPROXIMATION"}


def load_model(landmark_id: str) -> dict[str, Any]:
    path = model_path(landmark_id)
    if not path.is_file():
        raise FileNotFoundError(f"No heritage model for '{landmark_id}': {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def validate_model(model: dict[str, Any]) -> dict[str, Any]:
    errors: list[str] = []
    warnings: list[str] = []
    if model.get("units") != "metres":
        errors.append("units must be metres")
    dimensions = model.get("dimensions", {})
    for name, dimension in dimensions.items():
        value = dimension.get("value")
        status = dimension.get("status")
        if not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
            errors.append(f"dimension {name} must be a positive finite number")
        if status not in DIMENSION_STATUSES:
            errors.append(f"dimension {name} has invalid status")
        if status == "VERIFIED" and not dimension.get("sourceClaimId"):
            errors.append(f"verified dimension {name} requires sourceClaimId")
        if status != "VERIFIED" and dimension.get("sourceClaimId") is None:
            warnings.append(f"{name} is {status.lower()} and has no evidence claim")
    component_ids: set[str] = set()
    for component in model.get("components", []):
        component_id = component.get("id")
        if not component_id or component_id in component_ids:
            errors.append("component IDs must be present and unique")
        component_ids.add(component_id)
        if component.get("geometryClassification") not in GEOMETRY_CLASSES:
            errors.append(f"component {component_id} has invalid geometry classification")
        refs = component.get("dimensionReferences", [])
        if any(ref not in dimensions for ref in refs):
            errors.append(f"component {component_id} references an unknown dimension")
        if component.get("documentedStructural") and not component.get("evidenceReferences"):
            errors.append(f"documented structural component {component_id} requires evidence")
    inspection = model.get("inspection", {})
    if inspection.get("sectionCutCapability") == "AVAILABLE" and not inspection.get("meaningfulInteriorGeometry"):
        errors.append("section cut cannot be AVAILABLE without meaningful interior geometry")
    for material in model.get("materials", []):
        if material.get("classification") not in MATERIAL_CLASSES:
            errors.append(f"material {material.get('id')} has invalid provenance classification")
        if material.get("classification") != "VISUAL_APPROXIMATION" and not material.get("evidenceReferences"):
            errors.append(f"material {material.get('id')} requires evidence references")
    return {
        "status": "FAIL" if errors else "PASS",
        "errors": errors,
        "warnings": warnings,
        "counts": {"dimensions": len(dimensions), "components": len(component_ids)},
    }


def model_study_metadata(model: dict[str, Any], view: str, asset: str, generated_at: str) -> dict[str, Any]:
    if view not in {"FRONT", "SIDE", "TOP"}:
        raise ValueError(f"Unsupported model-study view: {view}")
    return {
        "landmark": model["landmarkId"],
        "view": view,
        "asset": asset,
        "generatedFrom": model["interchange"],
        "modelVersion": model["modelVersion"],
        "classification": "MODEL_STUDY",
        "generatedAt": generated_at,
        "verifiedDimensionReferences": [name for name, item in model["dimensions"].items() if item["status"] == "VERIFIED"],
        "interpretiveNotice": {
            "id": "Visualisasi ini berasal dari model 3D interpretatif dan bukan gambar arsitektur asli.",
            "en": "This visualization is derived from the interpretive 3D model and is not an original architectural drawing.",
        },
    }


def build_manifest(model: dict[str, Any], studies: list[dict[str, Any]], validation: dict[str, Any], generated_at: str | None = None) -> dict[str, Any]:
    generated_at = generated_at or datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    inspection = model["inspection"]
    return {
        "landmarkId": model["landmarkId"],
        "modelVersion": model["modelVersion"],
        "generatedAt": generated_at,
        "sourceType": "GENERATED",
        "geometry": {
            "runtime": model["sourceModel"],
            "glb": None,
            "migrationDecision": "KEEP_PROCEDURAL_R3F",
            "components": [{"id": item["id"], "classification": item["geometryClassification"]} for item in model["components"]],
        },
        "materials": model["materials"],
        "textures": [],
        "elevationViews": studies,
        "blueprintViews": studies,
        "displayModes": {
            "real": {"capability": "AVAILABLE", "classification": "INTERPRETIVE_MODEL"},
            "clay": {"capability": "AVAILABLE", "classification": "INTERPRETIVE_MODEL"},
            "xray": {"capability": inspection.get("xrayCapability", "UNAVAILABLE"), "reason": "NO_MEANINGFUL_INTERIOR_GEOMETRY" if not inspection.get("meaningfulInteriorGeometry") else None},
            "blueprint": {"capability": inspection.get("blueprintCapability", "UNAVAILABLE"), "classification": inspection.get("blueprintClassification", "UNAVAILABLE")},
        },
        "inspection": model["inspection"],
        "validation": validation,
    }


def write_manifest(model: dict[str, Any], studies: list[dict[str, Any]], validation: dict[str, Any], generated_at: str) -> Path:
    destination = output_dir(model["landmarkId"]) / "manifest.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(build_manifest(model, studies, validation, generated_at), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return destination
