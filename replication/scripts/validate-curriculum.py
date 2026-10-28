#!/usr/bin/env python3
"""Comprueba que libro y sitio comparten una ruta pedagógica completa."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def load(name: str) -> dict:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


curriculum = load("editorial/curriculum.json")
content_map = load("editorial/content-map.json")
assert curriculum["moduleCount"] == 17 == len(curriculum["modules"])
assert curriculum["lessonCount"] == 85
assert curriculum["labCount"] == 30 == len(curriculum["labs"])
assert len(content_map["modules"]) == 17
assert curriculum["practiceCount"] == 12 == len(curriculum["practices"])
assert len({item["id"] for item in curriculum["practices"]}) == 12
for item in curriculum["practices"]:
    assert item["steps"] and item["verification"] and item["limit"]
    assert all(key in {module["key"] for module in curriculum["modules"]} for key in item["modules"])
assert (ROOT / curriculum["practiceSource"]).is_file()
assert (ROOT / curriculum["practiceExample"] / "test/operacion.test.mjs").is_file()

keys = {module["key"] for module in curriculum["modules"]}
ids = {lab["id"] for lab in curriculum["labs"]}
assert len(keys) == 17 and len(ids) == 30
for module in curriculum["modules"]:
    assert len(module["lessons"]) >= 5, module["key"]
    assert module["checkpoint"] and module["sources"]
for lab in curriculum["labs"]:
    assert lab["module"] in keys
    assert lab["steps"] and lab["expected"] and lab["solution"] and lab["command"]

book = (ROOT / "libro-cobria/build-book.mjs").read_text(encoding="utf-8")
site_files = [
    ROOT / "sitio/app/manual.tsx",
    ROOT / "sitio/app/explorar/page.tsx",
    ROOT / "sitio/app/laboratorio/page.tsx",
]
assert 'buildCurriculum' in book
assert 'pedagogy.practices' in book
assert all("curriculum.json" in path.read_text(encoding="utf-8") for path in site_files)

generated_book = ROOT / "libro-cobria/index.html"
if generated_book.exists():
    text = generated_book.read_text(encoding="utf-8")
    assert "Once módulos conectados" not in text
    assert "Fase 23 ·" not in text
    assert "85 lecciones" in text

print("Currículo verificado: 17 partes, 85 lecciones, 30 laboratorios y 12 prácticas; fuente compartida.")
