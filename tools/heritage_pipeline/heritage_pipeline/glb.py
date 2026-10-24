from __future__ import annotations

import json
import math
import struct
from pathlib import Path
from typing import Any


def validate_glb(path: Path, expected_height: float | None = None) -> dict[str, Any]:
    result: dict[str, Any] = {"asset": path.as_posix(), "status": "FAIL", "errors": [], "warnings": []}
    if not path.is_file():
        result["errors"].append("asset does not exist")
        return result
    data = path.read_bytes()
    result["fileSizeBytes"] = len(data)
    if len(data) < 20:
        result["errors"].append("file is too small to be a GLB")
        return result
    magic, version, declared_length = struct.unpack_from("<4sII", data)
    if magic != b"glTF" or version != 2 or declared_length != len(data):
        result["errors"].append("invalid GLB header")
        return result
    json_length, json_type = struct.unpack_from("<I4s", data, 12)
    if json_type != b"JSON" or 20 + json_length > len(data):
        result["errors"].append("missing or invalid JSON chunk")
        return result
    try:
        document = json.loads(data[20:20 + json_length].decode("utf-8").rstrip(" \x00"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        result["errors"].append(f"invalid GLB JSON: {error}")
        return result
    binary = b""
    binary_header = 20 + json_length
    if binary_header + 8 <= len(data):
        binary_length, binary_type = struct.unpack_from("<I4s", data, binary_header)
        if binary_type == b"BIN\x00":
            binary = data[binary_header + 8:binary_header + 8 + binary_length]
    accessors = document.get("accessors", [])
    meshes = document.get("meshes", [])
    primitives = [primitive for mesh in meshes for primitive in mesh.get("primitives", [])]
    positions = [accessors[p["attributes"]["POSITION"]] for p in primitives if "POSITION" in p.get("attributes", {})]
    result.update({
        "sceneLoads": True,
        "meshCount": len(meshes),
        "geometryCount": len(primitives),
        "vertexCount": sum(item.get("count", 0) for item in positions),
        "triangleCount": sum(accessors[p["indices"]].get("count", 0) // 3 for p in primitives if "indices" in p),
        "hasNormals": any("NORMAL" in p.get("attributes", {}) for p in primitives),
        "hasUvs": any("TEXCOORD_0" in p.get("attributes", {}) for p in primitives),
        "materialCount": len(document.get("materials", [])),
        "textureCount": len(document.get("textures", [])),
    })
    if not primitives or result["vertexCount"] == 0:
        result["errors"].append("scene contains no renderable geometry")
    invalid_coordinates = _invalid_position_count(document, positions, binary)
    result["invalidCoordinateCount"] = invalid_coordinates
    if invalid_coordinates:
        result["errors"].append(f"geometry contains {invalid_coordinates} invalid coordinates")
    mins = [item.get("min") for item in positions if item.get("min")]
    maxs = [item.get("max") for item in positions if item.get("max")]
    if mins and maxs:
        minimum = [min(values[index] for values in mins) for index in range(3)]
        maximum = [max(values[index] for values in maxs) for index in range(3)]
        dimensions = [maximum[index] - minimum[index] for index in range(3)]
        result.update({"boundingBox": {"min": minimum, "max": maximum}, "dimensions": dimensions})
        if not all(math.isfinite(value) for value in minimum + maximum) or any(value <= 0 for value in dimensions):
            result["errors"].append("invalid or empty bounding box")
        if abs(minimum[1]) > max(dimensions) * 0.02:
            result["warnings"].append("geometry is not aligned to the Y=0 ground plane")
        if expected_height and abs(dimensions[1] - expected_height) / expected_height > 0.05:
            result["errors"].append("asset height differs from the controlled model by more than 5%")
        if max(dimensions) > 10000 or min(dimensions) < 0.0001:
            result["warnings"].append("asset dimensions are unusually extreme")
    else:
        result["warnings"].append("POSITION accessors do not expose bounding-box metadata")
    if not result["hasNormals"]:
        result["warnings"].append("normals are unavailable")
    if not result["hasUvs"]:
        result["warnings"].append("UV coordinates are unavailable")
    if result["materialCount"] == 0:
        result["warnings"].append("materials are unavailable")
    if result["textureCount"] == 0:
        result["warnings"].append("textures are unavailable")
    result["status"] = "FAIL" if result["errors"] else "PASS"
    return result


def _invalid_position_count(document: dict[str, Any], accessors: list[dict[str, Any]], binary: bytes) -> int:
    if not binary:
        return 0
    buffer_views = document.get("bufferViews", [])
    invalid = 0
    for accessor in accessors:
        if accessor.get("componentType") != 5126 or accessor.get("type") != "VEC3" or "bufferView" not in accessor:
            continue
        view = buffer_views[accessor["bufferView"]]
        offset = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
        stride = view.get("byteStride", 12)
        for index in range(accessor.get("count", 0)):
            position = offset + index * stride
            if position + 12 > len(binary):
                invalid += 3
                break
            invalid += sum(not math.isfinite(value) for value in struct.unpack_from("<3f", binary, position))
    return invalid
