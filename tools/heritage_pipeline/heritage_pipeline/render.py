from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

from .paths import output_dir
from .pipeline import model_study_metadata

WIDTH, HEIGHT = 1600, 1200
INK = "#e8c98a"
MUTED = "#8f8066"
BACKGROUND = "#101713"


def _font(size: int):
    for path in (Path("C:/Windows/Fonts/arial.ttf"), Path("C:/Windows/Fonts/segoeui.ttf")):
        if path.is_file():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def _elevation(draw: ImageDraw.ImageDraw, view: str, model: dict[str, Any]) -> None:
    dimensions = {name: item["value"] for name, item in model["dimensions"].items()}
    center = WIDTH // 2
    if view == "TOP":
        scale = 610 / dimensions["museumWidth"]
        half_base = dimensions["museumWidth"] * scale / 2
        half_observation = dimensions["observationWidth"] * scale / 2
        half_shaft = dimensions["shaftBottomWidth"] * scale / 2
        draw.rectangle((center - half_base, 600 - half_base, center + half_base, 600 + half_base), outline=INK, width=5)
        draw.rectangle((center - half_observation, 600 - half_observation, center + half_observation, 600 + half_observation), outline=MUTED, width=3)
        draw.rectangle((center - half_shaft, 600 - half_shaft, center + half_shaft, 600 + half_shaft), outline=INK, width=4)
        return
    ground = 980
    scale = 850 / dimensions["totalHeight"]
    y = lambda metres: ground - metres * scale
    half = lambda metres: metres * scale / 2
    draw.line((290, ground, 1310, ground), fill=MUTED, width=2)
    draw.rectangle((center - half(dimensions["museumWidth"]), y(dimensions["museumHeight"]), center + half(dimensions["museumWidth"]), ground), outline=INK, width=5)
    draw.polygon(((center - half(dimensions["cupWidth"]), y(dimensions["museumHeight"])), (center - half(dimensions["observationWidth"]), y(dimensions["cupTopHeight"])), (center + half(dimensions["observationWidth"]), y(dimensions["cupTopHeight"])), (center + half(dimensions["cupWidth"]), y(dimensions["museumHeight"]))), outline=INK)
    draw.polygon(((center - half(dimensions["shaftBottomWidth"]), y(dimensions["cupTopHeight"])), (center - half(dimensions["shaftTopWidth"]), y(dimensions["towerTopHeight"])), (center + half(dimensions["shaftTopWidth"]), y(dimensions["towerTopHeight"])), (center + half(dimensions["shaftBottomWidth"]), y(dimensions["cupTopHeight"]))), outline=INK)
    draw.rectangle((center - half(dimensions["observationWidth"]), y(dimensions["towerTopHeight"] + 4), center + half(dimensions["observationWidth"]), y(dimensions["towerTopHeight"])), outline=INK, width=4)
    draw.ellipse((center - half(dimensions["flameWidth"]), y(dimensions["totalHeight"]), center + half(dimensions["flameWidth"]), y(dimensions["totalHeight"] - dimensions["flameHeight"])), outline=INK, width=4)


def render_model_studies(model: dict[str, Any], generated_at: str | None = None) -> list[dict[str, Any]]:
    generated_at = generated_at or datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    destination = output_dir(model["landmarkId"]) / "model-study"
    destination.mkdir(parents=True, exist_ok=True)
    studies = []
    for view in ("FRONT", "SIDE", "TOP"):
        image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
        draw = ImageDraw.Draw(image)
        draw.text((80, 62), f"{model['name'].upper()} / {view}", fill=INK, font=_font(38))
        draw.text((80, 112), "MODEL STUDY · INTERPRETIVE 3D GEOMETRY", fill=MUTED, font=_font(20))
        _elevation(draw, view, model)
        draw.text((80, 1090), "NOT AN ORIGINAL ARCHITECTURAL DRAWING", fill=MUTED, font=_font(18))
        filename = f"{view.lower()}.webp"
        image.save(destination / filename, "WEBP", quality=84, method=6)
        studies.append(model_study_metadata(model, view, f"model-study/{filename}", generated_at))
    return studies
