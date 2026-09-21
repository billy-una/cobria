#!/usr/bin/env python3
"""Valida la integridad documental mínima de los requisitos COBRIA fase 2."""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
REQ = ROOT / "specification/phase-2/REQUISITOS-ECOSISTEMA.md"
TRACE = ROOT / "specification/phase-2/TRAZABILIDAD.md"

text = REQ.read_text(encoding="utf-8")
trace = TRACE.read_text(encoding="utf-8")
sections = re.split(r"(?=^### ECO-R(?:F|NF)-\d{3} — )", text, flags=re.MULTILINE)[1:]
errors: list[str] = []
ids: list[str] = []

for section in sections:
    match = re.match(r"### (ECO-R(?:F|NF)-\d{3}) — ", section)
    if not match:
        continue
    requirement_id = match.group(1)
    ids.append(requirement_id)
    for required in ("**Aceptación:**", "**Prueba:**"):
        if required not in section:
            errors.append(f"{requirement_id}: falta {required}")
    if f"| {requirement_id} |" not in trace:
        errors.append(f"{requirement_id}: falta en trazabilidad")

if len(ids) != len(set(ids)):
    errors.append("hay identificadores duplicados")
if len(ids) != 24:
    errors.append(f"se esperaban 24 requisitos y se encontraron {len(ids)}")

if errors:
    print("Fase 2 inválida:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print(f"Fase 2 válida: {len(ids)} requisitos únicos con aceptación, prueba y trazabilidad.")

