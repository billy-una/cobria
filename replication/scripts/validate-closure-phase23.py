#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
errors = []

required = [
    "manuales/01-fundamentos.md",
    "manuales/02-layers.md",
    "manuales/14-rutas-de-aprendizaje.md",
    "specification/phase-5/MATRIZ-DE-RESPONSABILIDADES.md",
    "specification/phase-5/architecture.yaml",
    "replication/examples/ecosistema-app/package.json",
    "sitio/app/manual.tsx",
]
for relative in required:
    if not (ROOT / relative).is_file():
        errors.append(f"falta {relative}")

fundamentos = (ROOT / required[0]).read_text(encoding="utf-8")
for section in (
    "Resultado de aprendizaje", "Vocabulario esencial", "Primer contrato",
    "Pruebas antes de optimizar", "Laboratorio inicial", "Criterio de avance"
):
    if section not in fundamentos:
        errors.append(f"Fundamentos no contiene {section}")
for concept in ("Problema", "Requisito", "Dato", "Función", "Módulo", "Caso de uso", "Despliegue"):
    if concept not in fundamentos:
        errors.append(f"Fundamentos no define {concept}")

layers = (ROOT / required[1]).read_text(encoding="utf-8")
roles = ("Object", "Dater", "Repository", "UseCase", "Service", "Catalog", "Indexer", "Connector")
for role in roles:
    if role not in layers:
        errors.append(f"Layers no explica {role}")
for section in ("Estructura recomendada", "Dependencias prohibidas", "Migración desde legado", "Laboratorio de capas"):
    if section not in layers:
        errors.append(f"Layers no contiene {section}")

architecture = json.loads((ROOT / required[4]).read_text(encoding="utf-8"))
role_ids = {role["id"] for role in architecture["roles"]}
for required_role in ("ROLE-CATALOG", "ROLE-INDEXER", "ROLE-CONNECTOR"):
    if required_role not in role_ids:
        errors.append(f"manifiesto sin {required_role}")

site = (ROOT / "sitio/app/manual.tsx").read_text(encoding="utf-8")
for marker in ("Ejemplo: observaciones comunitarias", "Catalog, Indexer y Connector", "Migración sin reescritura total"):
    if marker not in site:
        errors.append(f"sitio no publica {marker}")

phase5 = subprocess.run(
    ["python3", "replication/scripts/validate-phase5.py"], cwd=ROOT,
    capture_output=True, text=True
)
if phase5.returncode:
    errors.append(phase5.stdout.strip() or phase5.stderr.strip() or "falló el auditor de capas")

app = subprocess.run(
    ["npm", "test"], cwd=ROOT / "replication/examples/ecosistema-app",
    capture_output=True, text=True
)
if app.returncode:
    errors.append(app.stdout.strip() or app.stderr.strip() or "falló la aplicación de referencia")

if errors:
    print("Fases de cierre 2-3 inválidas:")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print(f"Fases de cierre 2-3 válidas: ruta inicial, {len(role_ids)} roles, auditor de capas y aplicación neutral aprobados.")
