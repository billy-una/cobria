#!/usr/bin/env python3
"""Valida Analytics/AI y la aplicación guiada COBRIA Build."""
import json
import re
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "replication/examples/ecosistema-app"
errors = []

def require(path, tokens):
    if not path.is_file():
        errors.append(f"falta {path.relative_to(ROOT)}"); return
    text = path.read_text(encoding="utf-8")
    for token in tokens:
        if token not in text: errors.append(f"{path.relative_to(ROOT)} no declara: {token}")

require(ROOT / "manuales/19-analytics-ai.md", ("tiempo válido", "tiempo conocido", "RAG limitado", "abstención", "autoridad de escritura"))
require(ROOT / "manuales/20-build-reference.md", ("Recorrido completo", "catorce", "HITOS.json", "proyectos originales"))
require(APP / "GUIA-PASO-A-PASO.md", ("B01–B04", "B05–B09", "B10–B11", "B12–B14"))
from pedagogy_checks import require_modules
require_modules(ROOT, {"ia": "/ia", "construir": "/construir"}, errors)

policy = json.loads((ROOT / "specification/analytics-ai/policy.json").read_text(encoding="utf-8"))
if policy.get("authority") != "read-only-consumer" or "write-canonical" not in policy.get("forbidden", []):
    errors.append("la política de IA no prohíbe autoridad canónica")
required_order = ["authenticate", "authorize-capability", "filter-scope", "retrieve", "rank", "verify-citations", "answer-or-abstain"]
if policy.get("retrievalOrder") != required_order: errors.append("orden RAG inválido")

summary = json.loads((ROOT / "replication/results/core-1.1-analytics-ai/summary.json").read_text(encoding="utf-8"))
if summary.get("runs") != 30 or summary.get("pass") is not True or summary.get("temporalLeakage") != 0 or summary.get("foreignDocuments") != 0:
    errors.append("evidencia analítica histórica no satisface sus controles declarados")
if "no evalúa calidad" not in summary.get("limits", ""): errors.append("evidencia histórica sin límite explícito")

milestones = json.loads((APP / "HITOS.json").read_text(encoding="utf-8"))
items = milestones.get("milestones", [])
if [item.get("id") for item in items] != [f"B{i:02d}" for i in range(1, 15)]: errors.append("se requieren B01..B14 ordenados")
for item in items:
    if not item.get("name") or not item.get("test") or not item.get("evidence"): errors.append(f"{item.get('id')}: hito incompleto")
    for relative in item.get("evidence", []):
        if not (APP / relative).resolve().is_file(): errors.append(f"{item.get('id')}: evidencia inexistente {relative}")

for file, tokens in {
    "src/application/analytics/construir-conjunto.mjs": ("consentimientoAnalitico", "tiempoValido", "tiempoConocido", "ANALYTICS_ENTITY_LEAKAGE", "autoridadEscritura: false"),
    "src/application/ai/recuperar-evidencia.mjs": ("this.autorizar", "this.repositorio.listar", "EVIDENCIA_INSUFICIENTE", "autoridadEscritura: false"),
    "src/application/ai/evaluar-deriva.mjs": ("alerta", "autoridadEscritura: false"),
}.items(): require(APP / file, tokens)

tests = subprocess.run(["npm", "test"], cwd=APP, text=True, capture_output=True)
declared_tests = sum(len(re.findall(r"^test\(", file.read_text(encoding="utf-8"), re.MULTILINE)) for file in (APP / "test").glob("*.test.mjs"))
observed = re.search(r"(?:#|ℹ)\s*pass\s+(\d+)", tests.stdout)
if tests.returncode: errors.append("pruebas Build fallaron:\n" + tests.stdout + tests.stderr)
elif declared_tests < 23 or not observed or int(observed.group(1)) != declared_tests:
    errors.append(f"pruebas Build incompletas: declaradas {declared_tests}; no se observaron todas aprobadas")

if errors:
    print("Cierre de fases 10–11 inválido:\n" + "\n".join(f"- {error}" for error in errors)); sys.exit(1)
print(f"Cierre de fases 10–11 válido: política analítica/IA, 30 repeticiones históricas, 14 hitos Build y {declared_tests} pruebas ejecutables.")
