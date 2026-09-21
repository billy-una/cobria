#!/usr/bin/env python3
import hashlib, json, subprocess, tempfile, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-28"
errors = []
status = json.loads((BASE / "status.json").read_text())
expected = {"state":"prepared-not-reviewed","samples":3,"reviewersRequired":2,"judgmentsExpected":144,"judgmentsReceived":0,"humanAttestations":0,"agreementComputed":False,"officialCertification":False}
for key, value in expected.items():
    if status.get(key) != value: errors.append(f"estado inválido: {key}")
with tempfile.TemporaryDirectory() as directory:
    target = Path(directory) / "phase28"
    run = subprocess.run(["node", "replication/scripts/build-phase28-dimensional-review.mjs"], cwd=ROOT, capture_output=True, text=True)
    if run.returncode:
        errors.append(run.stderr or run.stdout)
    package = ROOT / "output/review/phase28"
    manifest_file = package / "MANIFEST-SHA256.json"
    if not manifest_file.is_file():
        errors.append("no se generó MANIFEST-SHA256.json")
    else:
        manifest = json.loads(manifest_file.read_text())
        if manifest.get("identityKeyExcluded") is not True or manifest.get("judgmentsReceived") != 0: errors.append("manifiesto inseguro")
        if (package / "COORDINATOR-KEY.md").exists(): errors.append("el paquete filtró la clave")
        for item in manifest.get("files", []):
            file = package / item["file"]
            if hashlib.sha256(file.read_bytes()).hexdigest() != item["sha256"]: errors.append(f"huella inválida: {item['file']}")
            form = json.loads(file.read_text())
            dimensions = [d for s in form["samples"] for c in s["contracts"] for d in c["dimensions"]]
            if len(dimensions) != 72 or any(d["decision"] is not None for d in dimensions): errors.append(f"formulario precargado: {item['file']}")
            if form.get("type") is not None or form.get("independentWork") is not None: errors.append("atestación precargada")
tests = subprocess.run(["node", "--test", "tests/phase28-dimensional-review.test.mjs"], cwd=ROOT/"replication", capture_output=True, text=True)
if tests.returncode: errors.append(tests.stdout + tests.stderr)
if errors:
    print("Fase 28 inválida:\n" + "\n".join(f"- {error}" for error in errors)); sys.exit(1)
print("Fase 28 válida: 3 muestras, 2 formularios, 144 juicios vacíos y 0 validaciones humanas declaradas.")
