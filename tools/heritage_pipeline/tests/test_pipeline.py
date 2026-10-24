import json
import struct
import tempfile
import unittest
from pathlib import Path

from heritage_pipeline.glb import validate_glb
from heritage_pipeline.pipeline import build_manifest, model_study_metadata, validate_model


def model():
    return {
        "landmarkId": "test",
        "name": "Test",
        "units": "metres",
        "modelVersion": "1",
        "sourceModel": "scene.tsx",
        "interchange": "data/test/heritage-model.json",
        "dimensions": {"height": {"value": 10, "unit": "m", "status": "VERIFIED", "sourceClaimId": "height-claim"}},
        "components": [{"id": "exterior", "geometryClassification": "DERIVED", "dimensionReferences": ["height"], "evidenceReferences": ["height-claim"], "documentedStructural": False}],
        "materials": [],
        "inspection": {"sectionCutCapability": "LIMITED", "meaningfulInteriorGeometry": False},
    }


class PipelineTests(unittest.TestCase):
    def test_verified_dimension_requires_a_source_claim(self):
        value = model()
        value["dimensions"]["height"]["sourceClaimId"] = None
        self.assertEqual(validate_model(value)["status"], "FAIL")

    def test_section_cut_requires_real_interior_geometry(self):
        value = model()
        value["inspection"]["sectionCutCapability"] = "AVAILABLE"
        self.assertIn("meaningful interior", " ".join(validate_model(value)["errors"]))

    def test_generated_view_is_always_a_model_study(self):
        metadata = model_study_metadata(model(), "FRONT", "model-study/front.webp", "2026-10-24T00:00:00Z")
        self.assertEqual(metadata["classification"], "MODEL_STUDY")
        self.assertNotEqual(metadata["classification"], "DOCUMENTED_DRAWING")

    def test_manifest_uses_relative_public_paths(self):
        study = model_study_metadata(model(), "TOP", "model-study/top.webp", "2026-10-24T00:00:00Z")
        manifest = build_manifest(model(), [study], validate_model(model()), "2026-10-24T00:00:00Z")
        serialized = json.dumps(manifest)
        self.assertNotIn(":\\", serialized)
        self.assertEqual(manifest["geometry"]["migrationDecision"], "KEEP_PROCEDURAL_R3F")

    def test_missing_and_invalid_glb_fail_cleanly(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.assertEqual(validate_glb(root / "missing.glb")["status"], "FAIL")
            invalid = root / "invalid.glb"
            invalid.write_bytes(b"not glb")
            self.assertEqual(validate_glb(invalid)["status"], "FAIL")

    def test_minimal_glb_reports_empty_geometry(self):
        document = json.dumps({"asset": {"version": "2.0"}, "scenes": [{}]}).encode()
        document += b" " * ((4 - len(document) % 4) % 4)
        payload = struct.pack("<I4s", len(document), b"JSON") + document
        data = struct.pack("<4sII", b"glTF", 2, 12 + len(payload)) + payload
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "empty.glb"
            path.write_bytes(data)
            result = validate_glb(path)
            self.assertEqual(result["status"], "FAIL")
            self.assertIn("no renderable geometry", " ".join(result["errors"]))


if __name__ == "__main__":
    unittest.main()
