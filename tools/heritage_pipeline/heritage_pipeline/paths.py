from pathlib import Path

TOOL_ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOL_ROOT.parents[1]
DATA_ROOT = TOOL_ROOT / "data"
PUBLIC_ROOT = PROJECT_ROOT / "public" / "generated" / "heritage"
REPORT_ROOT = PROJECT_ROOT / "artifacts" / "heritage-validation"


def model_path(landmark_id: str) -> Path:
    return DATA_ROOT / landmark_id / "heritage-model.json"


def output_dir(landmark_id: str) -> Path:
    return PUBLIC_ROOT / landmark_id
