# Heritage asset pipeline

Offline tooling for controlled heritage metadata, model-study images, manifests, and reusable GLB validation. React, React Three Fiber, and Three.js remain the browser runtime; the application never executes or imports Python.

The Monas pilot reads `data/monas/heritage-model.json`. Every dimension is `VERIFIED`, `ESTIMATED`, or `INTERPRETIVE`; verified dimensions require a website claim ID. Generated orthographic images are always classified as `MODEL_STUDY`. They are not archive media or documented architectural drawings. No internal rooms, foundations, beams, services, or hidden structure are generated.

## Environment

- Python 3.13
- Pillow 12 for WebP model-study output
- Standard library for metadata, manifest, CLI, and GLB inspection
- Blender/`bpy` is optional and is not required by this pilot

From the repository root in PowerShell:

```powershell
python -m pip install -r tools/heritage_pipeline/requirements.txt
$env:PYTHONPATH = "tools/heritage_pipeline"
python -m heritage_pipeline validate monas
python -m heritage_pipeline model-study monas
python -m heritage_pipeline manifest monas
python -m heritage_pipeline all monas
python -m unittest discover -s tools/heritage_pipeline/tests -v
```

Pass `--glb path/to/asset.glb` to `validate` or `all` to check a GLB header, scene/mesh/primitive counts, vertices, triangles, accessor bounding boxes, dimensions, finite bounds, ground alignment, normals, UVs, materials, and textures. Missing, malformed, empty, or dimensionally incorrect assets fail with a nonzero exit code. Missing optional normals, UVs, materials, textures, or ground alignment are warnings.

Committed web assets are written below `public/generated/heritage/<landmark>/`. Machine-readable validation reports are local artifacts below `artifacts/heritage-validation/` and remain ignored by Git. Paths in public manifests are relative and portable on Windows.

The accepted Monas procedural R3F scene remains authoritative for the browser. The pilot does not create a replacement GLB because that would duplicate working geometry without a measured quality or performance benefit. The optional GLB validator is ready for a future reviewed asset.
