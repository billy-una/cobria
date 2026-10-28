#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / "specification/COBRIA-CORE-1.0.md"
REGISTRY = ROOT / "specification/requirements-1.0.json"
CONFORMANCE = ROOT / "specification/CONFORMANCE-1.0.json"
SOURCE = ROOT / "specification/COBRIA-ECOSISTEMA-1.0.tex"
PDF = ROOT / "output/pdf/COBRIA-especificacion-ecosistema-1.0.pdf"
FROZEN_CORE_SHA256 = "9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179"
EXPECTED_IDS = {
    "AUT-001", "ID-001", "SCP-001", "REV-001", "WRT-001",
    "TRN-001", "IDM-001", "EQV-001", "REC-001", "PUB-001",
    "PRV-001", "FRS-001", "OBS-001", "OWN-001", "RET-001",
    "ANA-001", "AI-001", "SEC-001",
}
ERRORS: list[str] = []


def fail(message: str) -> None:
    ERRORS.append(message)


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"JSON inválido {path.relative_to(ROOT)}: {exc}")
        return {}


if digest(CORE) != FROZEN_CORE_SHA256:
    fail("COBRIA Core 1.0 cambió respecto a su huella congelada")

registry = load_json(REGISTRY)
conformance = load_json(CONFORMANCE)
requirements = registry.get("requirements", [])
ids = [item.get("id") for item in requirements]

if registry.get("release") != "1.0.0-rc2":
    fail("el registro no corresponde a 1.0.0-rc2")
if registry.get("status") != "candidate-non-stable":
    fail("el registro no declara candidata no estable")
if registry.get("coreSha256") != FROZEN_CORE_SHA256:
    fail("el registro no conserva la huella de Core 1.0")
if len(ids) != len(set(ids)):
    fail("hay identificadores normativos duplicados")
if set(ids) != EXPECTED_IDS:
    fail(f"conjunto de requisitos inesperado: faltan {sorted(EXPECTED_IDS - set(ids))}; sobran {sorted(set(ids) - EXPECTED_IDS)}")

required_fields = {
    "id", "title", "level", "keyword", "statement", "acceptance", "owner",
    "test", "command", "evidence", "threat", "source",
}
for item in requirements:
    item_id = item.get("id", "<sin-id>")
    missing = sorted(required_fields - set(item))
    if missing:
        fail(f"{item_id}: campos ausentes {missing}")
        continue
    if item["level"] not in {"C1", "C2", "C3"}:
        fail(f"{item_id}: nivel inválido")
    if item["keyword"] not in {"DEBE", "NO DEBE", "DEBERÍA", "NO DEBERÍA", "PUEDE"}:
        fail(f"{item_id}: palabra normativa inválida")
    if len(item["acceptance"]) < 2 or not all(str(value).strip() for value in item["acceptance"]):
        fail(f"{item_id}: criterios de aceptación insuficientes")
    if not item["evidence"]:
        fail(f"{item_id}: no declara evidencia")
    for relative in item["evidence"]:
        if not (ROOT / relative).exists():
            fail(f"{item_id}: evidencia no resoluble {relative}")
    command = item["command"]
    if not (command.startswith("make ") or command in {
        "cd replication && npm test",
        "cd replication/examples/ecosistema-app && npm test",
    }):
        fail(f"{item_id}: comando no permitido o no reproducible: {command}")

profiles = conformance.get("profiles", {})
if conformance.get("requirementsRegistry") != "specification/requirements-1.0.json":
    fail("CONFORMANCE no resuelve el registro normativo")
if profiles.get("C1", {}).get("inherits") != []:
    fail("C1 no debe heredar otro perfil")
if profiles.get("C2", {}).get("inherits") != ["C1"]:
    fail("C2 debe heredar C1")
if profiles.get("C3", {}).get("inherits") != ["C1", "C2"]:
    fail("C3 debe declarar herencia acumulativa C1 y C2")
for level in ("C1", "C2", "C3"):
    registered = {item["id"] for item in requirements if item.get("level") == level}
    declared = set(profiles.get(level, {}).get("requirements", []))
    if registered != declared:
        fail(f"{level}: requisitos del perfil y registro divergen")
if conformance.get("allowedResults") != ["conforme", "no-conforme", "no-evaluado"]:
    fail("los resultados de conformidad no distinguen no-evaluado")

generated_requirements = ROOT / "specification/generated/requirements-1.0.tex"
generated_traceability = ROOT / "specification/generated/traceability-1.0.tex"
for path in (generated_requirements, generated_traceability):
    if not path.is_file():
        fail(f"falta derivado {path.relative_to(ROOT)}")
        continue
    content = path.read_text(encoding="utf-8")
    for item_id in EXPECTED_IDS:
        if item_id not in content:
            fail(f"{path.relative_to(ROOT)} omite {item_id}")

generator = subprocess.run(
    ["node", "replication/scripts/generate-specification-r3.mjs", "--check"],
    cwd=ROOT,
    text=True,
    capture_output=True,
)
if generator.returncode:
    fail("los derivados normativos no están sincronizados: " + (generator.stderr or generator.stdout).strip())

source = SOURCE.read_text(encoding="utf-8")
for fragment in (
    "Alcance, audiencia y exclusiones",
    "Lenguaje normativo y declaraciones",
    "Vocabulario canónico",
    "Modelo conceptual",
    "Invariantes y operaciones",
    "Ciclo de vida de una proyección",
    "Requisitos normativos por nivel",
    "Conformidad",
    "Compatibilidad, migración y extensiones",
    "Ejemplos de aplicación",
    "Matriz integral de trazabilidad",
    "Limitaciones de la especificación",
    "generated/requirements-1.0.tex",
    "generated/traceability-1.0.tex",
):
    if fragment not in source:
        fail(f"la fuente normativa omite {fragment}")

if not PDF.is_file():
    fail("falta el PDF normativo construido")
else:
    try:
        reader = PdfReader(PDF)
        if len(reader.pages) < 20:
            fail("el PDF normativo no alcanza la cobertura editorial mínima de 20 páginas")
        pdf_text = "\n".join(page.extract_text() or "" for page in reader.pages)
        for fragment in ("COBRIA Ecosistema 1.0", "candidata pública", "no estable", "no certificada"):
            if fragment not in pdf_text:
                fail(f"el PDF omite el estado o título: {fragment}")
        for item_id in EXPECTED_IDS:
            if item_id not in pdf_text:
                fail(f"el PDF omite el requisito {item_id}")
    except Exception as exc:
        fail(f"no fue posible inspeccionar el PDF: {exc}")

if ERRORS:
    print("R3 no conforme:")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

print(
    f"R3 conforme: {len(requirements)} requisitos trazables, Core 1.0 congelado y PDF sincronizado."
)
