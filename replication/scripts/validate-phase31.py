#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-31"
errors = []
run = subprocess.run(["node", "replication/scripts/generate-phase31-template.mjs"], cwd=ROOT, capture_output=True, text=True)
if run.returncode: errors.append(run.stderr or run.stdout)
status = json.loads((BASE / "status.json").read_text())
template = json.loads((BASE / "operational-run-template.json").read_text())
expected = {"state":"prepared-not-operationally-executed","proposalIndependent":True,"scenarios":5,"executed":0,"passed":0,"failed":0,"authorizedEnvironmentUsed":False,"operationallyValidated":0,"officialCertification":False}
for key, value in expected.items():
    if status.get(key) != value: errors.append(f"estado inválido: {key}")
if len(template.get("scenarios", [])) != 5 or any(item.get("result") is not None for item in template.get("scenarios", [])): errors.append("plantilla precargada")
if template.get("execution", {}).get("synthetic") is not None or template.get("officialCertification") is not False: errors.append("ejecución inventada")
requirements = json.loads((BASE / "requirements.json").read_text()).get("requirements", [])
if len(requirements) != 4 or len({item["id"] for item in requirements}) != 4: errors.append("requisitos incompletos")
tests = subprocess.run(["node", "--test", "tests/phase31-operational-validation.test.mjs"], cwd=ROOT/"replication", capture_output=True, text=True)
if tests.returncode: errors.append(tests.stdout + tests.stderr)
if errors:
    print("Fase 31 inválida:\n" + "\n".join(f"- {error}" for error in errors)); sys.exit(1)
print("Fase 31 válida como propuesta independiente: 5 escenarios preparados, 0 ejecutados y 0 certificaciones.")
