#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-29"
errors = []
run = subprocess.run(["node", "replication/scripts/ingest-phase29-responses.mjs"], cwd=ROOT, capture_output=True, text=True)
if run.returncode: errors.append(run.stderr or run.stdout)
status = json.loads((BASE / "status.json").read_text())
report = json.loads((BASE / "intake-report.json").read_text())
if status.get("proposalIndependent") is not True or status.get("officialCertification") is not False: errors.append("identidad de propuesta inválida")
if status.get("responseFilesReceived") != 0 or status.get("agreementComputed") is not False: errors.append("el estado inventa participación")
if report.get("status") != "prepared-awaiting-human-responses": errors.append("estado de ingesta inesperado")
if any(report.get(key) is not None for key in ["observedAgreement", "expectedAgreement", "cohenKappa"]): errors.append("métricas precargadas")
if report.get("pairedJudgments") != 0 or report.get("officialCertification") is not False: errors.append("afirmación indebida")
tests = subprocess.run(["node", "--test", "tests/phase29-dimensional-agreement.test.mjs"], cwd=ROOT/"replication", capture_output=True, text=True)
if tests.returncode: errors.append(tests.stdout + tests.stderr)
if errors:
    print("Fase 29 inválida:\n" + "\n".join(f"- {error}" for error in errors)); sys.exit(1)
print("Fase 29 válida como propuesta independiente: 0/2 respuestas, 0 pares y acuerdo no calculado.")
