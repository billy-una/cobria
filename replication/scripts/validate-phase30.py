#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-30"
errors = []
run = subprocess.run(["node", "replication/scripts/process-phase30-adjudication.mjs"], cwd=ROOT, capture_output=True, text=True)
if run.returncode: errors.append(run.stderr or run.stdout)
status = json.loads((BASE / "status.json").read_text())
report = json.loads((BASE / "adjudication-report.json").read_text())
expected = {"state":"prepared-awaiting-review-pair","proposalIndependent":True,"responseFilesReceived":0,"disagreementsAvailable":0,"adjudicationsCompleted":0,"adjudicatorAttested":False,"officialCertification":False}
for key, value in expected.items():
    if status.get(key) != value: errors.append(f"estado inválido: {key}")
if report.get("status") != "prepared-awaiting-review-pair": errors.append("el informe inventa adjudicación")
if report.get("adjudicationsCompleted") != 0 or report.get("officialCertification") is not False: errors.append("afirmación indebida")
requirements = json.loads((BASE / "requirements.json").read_text()).get("requirements", [])
if len(requirements) != 3 or len({item["id"] for item in requirements}) != 3: errors.append("requisitos incompletos")
tests = subprocess.run(["node", "--test", "tests/phase30-dimensional-adjudication.test.mjs"], cwd=ROOT/"replication", capture_output=True, text=True)
if tests.returncode: errors.append(tests.stdout + tests.stderr)
if errors:
    print("Fase 30 inválida:\n" + "\n".join(f"- {error}" for error in errors)); sys.exit(1)
print("Fase 30 válida como propuesta independiente: 0 desacuerdos disponibles y 0 adjudicaciones.")
