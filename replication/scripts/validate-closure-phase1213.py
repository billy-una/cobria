#!/usr/bin/env python3
"""Compuerta integrada de Toolkit, evidencia científica y transferencia."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
errors = []

def run(label, command, cwd=ROOT):
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True)
    if result.returncode: errors.append(f"{label} falló:\n{result.stdout}{result.stderr}")

def require(path, tokens):
    if not path.is_file(): errors.append(f"falta {path.relative_to(ROOT)}"); return
    text = path.read_text(encoding="utf-8")
    for token in tokens:
        if token not in text: errors.append(f"{path.relative_to(ROOT)} no declara: {token}")

require(ROOT / "manuales/21-toolkit.md", ("publicar --simular", "mutations: 0", "HTML", "JSON", "sobrescribir"))
require(ROOT / "manuales/22-evidence-transfer.md", ("630", "cero réplicas externas", "doble cribado", "Afirmación defendible"))
require(ROOT / "sitio/app/manual.tsx", ("Herramientas para personas e IA", "Publicación solo simulada", "mutaciones"))

inventory_path = ROOT / "replication/results/scientific-inventory/current.json"
inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
if inventory.get("proposalIndependent") is not True or inventory.get("officialCertification") is not False:
    errors.append("inventario científico exagera autoridad")
expected = {"E-CONFORMANCE":180, "E-ALTERNATIVES":630, "E-ANALYTICS-AI":30, "E-OPERATIONAL":5}
actual = {item.get("id"):item.get("observations") for item in inventory.get("internalEvidence", [])}
for key, value in expected.items():
    if actual.get(key) != value: errors.append(f"{key}: se esperaban {value} observaciones")
confirmatory = next((item for item in inventory.get("internalEvidence", []) if item.get("id") == "E-STATISTICS-CONFIRMATORY"), {})
if confirmatory.get("status") != "preliminar-incompleto" or not confirmatory.get("missing"):
    errors.append("repetición confirmatoria no conserva sus celdas ausentes")
external = inventory.get("externalEvidence", {})
if external.get("replication", {}).get("runs") != 0 or "pending" not in external.get("independentHumanReview", ""):
    errors.append("evidencia externa pendiente fue presentada como ejecutada")
for item in inventory.get("internalEvidence", []):
    source = ROOT / item.get("source", "")
    if not source.is_file() or hashlib.sha256(source.read_bytes()).hexdigest() != item.get("sha256"):
        errors.append(f"fuente o huella inválida: {item.get('id')}")

run("CLI y esquemas", [sys.executable, "replication/scripts/validate-phase12.py"])
run("generadores", [sys.executable, "replication/scripts/validate-phase13.py"])
run("auditor estático", [sys.executable, "replication/scripts/validate-phase14.py"])
run("contexto para agentes", [sys.executable, "replication/scripts/validate-phase16.py"])
run("preparación externa", [sys.executable, "replication/scripts/validate-phase18.py"])
run("réplica externa honesta", [sys.executable, "replication/scripts/validate-phase32.py"])
run("síntesis condicionada", [sys.executable, "replication/scripts/validate-phase33.py"])

if errors:
    print("Cierre de fases 12–13 inválido:\n" + "\n".join(f"- {error}" for error in errors)); sys.exit(1)
print(f"Cierre de fases 12–13 válido: 10 esquemas, Toolkit seguro, {inventory['traceability']['rows']} filas trazables, 845 observaciones internas inventariadas y 0 réplicas externas.")
