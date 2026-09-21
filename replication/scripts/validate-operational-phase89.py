#!/usr/bin/env python3
"""Valida huellas y límites del último ensayo operacional controlado."""
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
latest = json.loads((ROOT / "replication/results/operational-phase89/latest.json").read_text(encoding="utf-8"))
run_path = ROOT / latest["path"]
run = json.loads(run_path.read_text(encoding="utf-8"))
errors = []
if run.get("proposalIndependent") is not True or run.get("officialCertification") is not False:
    errors.append("identidad epistémica inválida")
if run.get("environment", {}).get("kind") != "controlled" or run.get("environment", {}).get("containsProductionPersonalData") is not False:
    errors.append("ambiente controlado inválido")
if run.get("execution", {}).get("synthetic") is not False or run.get("execution", {}).get("syntheticData") is not True:
    errors.append("no distingue ejecución real de datos sintéticos")
scenarios = run.get("scenarios", [])
if [item.get("id") for item in scenarios] != [f"OP-0{i}" for i in range(1, 6)]:
    errors.append("escenarios incompletos")
for scenario in scenarios:
    if scenario.get("result") != "pass" or len(scenario.get("evidence", [])) < 2:
        errors.append(f"{scenario.get('id')}: resultado o evidencia insuficiente")
    for item in scenario.get("evidence", []):
        path = ROOT / item["path"]
        if not path.is_file():
            errors.append(f"falta evidencia {item['path']}")
        elif hashlib.sha256(path.read_bytes()).hexdigest() != item.get("sha256"):
            errors.append(f"huella inválida {item['path']}")
if run.get("summary") != {"executed": 5, "passed": 5, "failed": 0}:
    errors.append("resumen inválido")
if len(run.get("limitations", [])) < 4:
    errors.append("límites insuficientes")
if errors:
    print("Ensayo operacional inválido:\n" + "\n".join(f"- {error}" for error in errors)); sys.exit(1)
print(f"Ensayo operacional válido y acotado: {run['execution']['runId']}, 5/5 escenarios, 10 evidencias con huella.")
