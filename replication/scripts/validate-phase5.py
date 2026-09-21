#!/usr/bin/env python3
"""Valida manifiesto de capas e imports del ejemplo neutral COBRIA."""

import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
SPEC = ROOT / "specification/phase-5"
APP = ROOT / "replication/examples/ecosistema-app/src"
manifest = json.loads((SPEC / "architecture.yaml").read_text(encoding="utf-8"))
errors: list[str] = []

layers = {layer["id"]: layer for layer in manifest.get("layers", [])}
if set(layers) != {"LAY-DOMAIN", "LAY-APPLICATION", "LAY-PRESENTATION", "LAY-INFRASTRUCTURE", "LAY-COMPOSITION"}:
    errors.append("capas requeridas incompletas")
for layer in layers.values():
    for field in ("path", "purpose", "mayDependOn", "mustNotKnow", "artifacts"):
        if not layer.get(field):
            errors.append(f"{layer.get('id')}: falta {field}")
    for target in layer.get("mayDependOn", []):
        if target not in layers:
            errors.append(f"{layer.get('id')}: dependencia desconocida {target}")

layer_by_folder = {
    "domain": "LAY-DOMAIN",
    "application": "LAY-APPLICATION",
    "presentation": "LAY-PRESENTATION",
    "infrastructure": "LAY-INFRASTRUCTURE",
}

def layer_of(path: Path) -> str:
    relative = path.relative_to(APP)
    return layer_by_folder.get(relative.parts[0], "LAY-COMPOSITION")

import_pattern = re.compile(r"(?:import .*? from |import\s*)['\"]([^'\"]+)['\"]")
for source in APP.rglob("*.mjs"):
    source_layer = layer_of(source)
    content = source.read_text(encoding="utf-8")
    for imported in import_pattern.findall(content):
        if imported.startswith("node:"):
            if source_layer in {"LAY-DOMAIN", "LAY-APPLICATION"}:
                errors.append(f"{source.relative_to(ROOT)}: builtin {imported} prohibido en {source_layer}")
            continue
        if not imported.startswith("."):
            if source_layer in {"LAY-DOMAIN", "LAY-APPLICATION"}:
                errors.append(f"{source.relative_to(ROOT)}: SDK {imported} prohibido en {source_layer}")
            continue
        target = (source.parent / imported).resolve()
        try:
            target_layer = layer_of(target)
        except ValueError:
            continue
        if target_layer not in layers[source_layer]["mayDependOn"]:
            errors.append(
                f"{source.relative_to(ROOT)}: {source_layer} no puede depender de {target_layer} ({imported})"
            )

physical_pattern = re.compile(r"(?:['\"/]|\b)(?:n\d+|sn\d+|l\d+)(?:['\"/]|\b)")
for folder in (APP / "domain", APP / "application", APP / "presentation"):
    for source in folder.rglob("*.mjs"):
        if physical_pattern.search(source.read_text(encoding="utf-8")):
            errors.append(f"{source.relative_to(ROOT)}: ruta física fuera de infraestructura")

expected_roles = {
    "ROLE-ENTITY", "ROLE-USE-CASE", "ROLE-PORT", "ROLE-REPOSITORY", "ROLE-DATER",
    "ROLE-SERVICE", "ROLE-CATALOG", "ROLE-INDEXER", "ROLE-CONNECTOR",
    "ROLE-CONTROLLER", "ROLE-COMPOSITION"
}
actual_roles = {role.get("id") for role in manifest.get("roles", [])}
if actual_roles != expected_roles:
    errors.append(f"responsabilidades arquitectónicas incompletas: {sorted(expected_roles - actual_roles)}")

if errors:
    print("Fase 5 inválida:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print(f"Fase 5 válida: {len(layers)} capas, {len(manifest['roles'])} roles e imports conformes.")
