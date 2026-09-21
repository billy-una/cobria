#!/usr/bin/env python3
"""Valida topología, relaciones y casos negativos de COBRIA fase 4."""

import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-4"
manifest = json.loads((BASE / "nodes.yaml").read_text(encoding="utf-8"))

required = {
    "id", "logicalName", "physicalPath", "kind", "need", "owner",
    "writeAuthority", "identity", "scope", "cardinality", "growth", "lifecycle",
    "atomicity", "consistency", "queries", "indexes", "retention", "security",
    "rebuild", "tests", "costs"
}
allowed_kinds = {"canonical", "embedded", "reference", "outbox", "projection", "snapshot"}
errors: list[str] = []
ids: set[str] = set()

def validate_node(node: dict) -> list[str]:
    findings: list[str] = []
    missing = required - node.keys()
    if missing:
        findings.append(f"faltan campos {sorted(missing)}")
    for field in ("id", "logicalName", "physicalPath", "need", "owner", "writeAuthority", "scope"):
        if not node.get(field):
            findings.append(f"{field} vacío")
    if node.get("kind") not in allowed_kinds:
        findings.append("kind inválido")
    if not node.get("identity"):
        findings.append("identity vacía")
    if not node.get("queries"):
        findings.append("queries vacía")
    if not node.get("tests"):
        findings.append("tests vacía")
    if not node.get("costs"):
        findings.append("costs vacía")
    if node.get("kind") in {"projection", "snapshot"} and not node.get("rebuild"):
        findings.append("derivado sin reconstrucción")
    if node.get("kind") in {"projection", "snapshot"} and node.get("writeAuthority") in {"ClienteWeb", "UI"}:
        findings.append("derivado con escritura de cliente")
    return findings

for node in manifest.get("nodes", []):
    node_id = node.get("id", "?")
    if node_id in ids:
        errors.append(f"identificador duplicado: {node_id}")
    ids.add(node_id)
    if not re.match(r"^n\d+", str(node.get("physicalPath", ""))):
        errors.append(f"{node_id}: ruta física no documenta alias nX")
    errors.extend(f"{node_id}: {finding}" for finding in validate_node(node))

for relation in manifest.get("relationships", []):
    if relation.get("from") not in ids or relation.get("to") not in ids:
        errors.append(f"relación rota: {relation}")
    if not relation.get("rule"):
        errors.append(f"relación sin regla: {relation}")

invalid = json.loads((BASE / "examples/invalid-node.json").read_text(encoding="utf-8"))
if not validate_node(invalid):
    errors.append("el nodo inválido fue aceptado")

if len(ids) != 6:
    errors.append(f"se esperaban 6 nodos y se encontraron {len(ids)}")

if errors:
    print("Fase 4 inválida:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print(f"Fase 4 válida: {len(ids)} nodos, {len(manifest['relationships'])} relaciones y caso negativo rechazado.")

