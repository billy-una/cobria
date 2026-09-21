#!/usr/bin/env python3
"""Valida diccionario, claves físicas, ejemplos y casos negativos de fase 3."""

from datetime import datetime
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-3"
dictionary = json.loads((BASE / "data-dictionary.yaml").read_text(encoding="utf-8"))
errors: list[str] = []

required_attribute_fields = {
    "id", "conceptualName", "logicalName", "physicalKey", "type", "required",
    "format", "unit", "scope", "timeMeaning", "provenance", "sensitivity",
    "retention", "introducedIn", "owner", "consumers", "indexes", "example", "rules"
}

attribute_by_logical: dict[str, dict] = {}
physical_keys: set[tuple[str, str]] = set()
for entity in dictionary.get("entities", []):
    node = entity.get("physicalNode")
    if not node or not re.fullmatch(r"n\d+", node):
        errors.append(f"nodo físico inválido: {node!r}")
    for attr in entity.get("attributes", []):
        missing = required_attribute_fields - attr.keys()
        if missing:
            errors.append(f"{attr.get('id', '?')}: faltan {sorted(missing)}")
        logical = attr.get("logicalName")
        key = attr.get("physicalKey")
        if logical in attribute_by_logical:
            errors.append(f"nombre lógico duplicado: {logical}")
        attribute_by_logical[logical] = attr
        pair = (node, key)
        if pair in physical_keys:
            errors.append(f"clave física duplicada en {node}: {key}")
        physical_keys.add(pair)

def load(name: str) -> dict:
    return json.loads((BASE / "examples" / name).read_text(encoding="utf-8"))

def validate_logical(doc: dict) -> list[str]:
    findings: list[str] = []
    for logical, attr in attribute_by_logical.items():
        if attr.get("required") and logical not in doc:
            findings.append(f"falta {logical}")
    if not isinstance(doc.get("revision"), int) or doc.get("revision", 0) < 1:
        findings.append("revision inválida")
    if doc.get("estado") not in {"pendiente", "verificada", "descartada"}:
        findings.append("estado fuera de catálogo")
    for field in ("ocurrioEn",):
        try:
            datetime.fromisoformat(str(doc.get(field)).replace("Z", "+00:00"))
        except ValueError:
            findings.append(f"{field} no es fecha con formato válido")
    if not isinstance(doc.get("procedencia"), dict):
        findings.append("procedencia inválida")
    return findings

valid_logical = load("valid-logical.json")
valid_physical = load("valid-physical.json")
if validate_logical(valid_logical):
    errors.append("el ejemplo lógico válido fue rechazado")

expected_physical = {attr["physicalKey"] for attr in attribute_by_logical.values() if attr["required"]}
if not expected_physical.issubset(valid_physical):
    errors.append("el ejemplo físico no contiene todas las claves obligatorias")

for invalid_name in ("invalid-missing-scope.json", "invalid-unknown-catalog.json"):
    if not validate_logical(load(invalid_name)):
        errors.append(f"el caso inválido fue aceptado: {invalid_name}")

if errors:
    print("Fase 3 inválida:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print(
    "Fase 3 válida: "
    f"{len(dictionary['entities'])} entidad, {len(attribute_by_logical)} atributos, "
    f"{len(dictionary['catalogs'])} catálogo y 4 ejemplos comprobados."
)

