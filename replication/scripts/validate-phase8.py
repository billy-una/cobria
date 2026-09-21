#!/usr/bin/env python3
"""Valida ambientes, desplegables, promoción y negativos de la fase 8."""
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-8"
envs = json.loads((BASE / "environments.json").read_text(encoding="utf-8"))
deployables = json.loads((BASE / "deployables.json").read_text(encoding="utf-8"))
errors: list[str] = []

expected = ["local", "test", "preview", "staging", "production", "recovery"]
actual = [item.get("id") for item in envs.get("environments", [])]
if actual != expected: errors.append(f"ambientes o secuencia inválida: {actual}")
for item in envs.get("environments", []):
    for field in ("alias", "project", "accounts", "branches", "dataPolicy", "rollback"):
        if not item.get(field): errors.append(f"{item.get('id')}: falta {field}")
    if item.get("id") in {"test", "preview", "staging"} and "produccion" in item.get("dataPolicy", ""):
        errors.append(f"{item.get('id')}: política parece admitir producción")

required_deployable = {"id","type","name","contract","scope","region","memoryMiB","timeoutSeconds","concurrency","idempotency","retries","deadLetter","secrets","permissions","metrics","costControls","recovery","owner"}
for item in deployables.get("deployables", []):
    missing = required_deployable - set(item)
    if missing: errors.append(f"{item.get('id')}: faltan {sorted(missing)}")
    if item.get("timeoutSeconds", 0) <= 0 or item.get("memoryMiB", 0) <= 0 or item.get("concurrency", 0) <= 0: errors.append(f"{item.get('id')}: límites inválidos")
    if not item.get("permissions") or "*" in item.get("permissions", []): errors.append(f"{item.get('id')}: permisos vacíos o excesivos")

for name in ("MANUAL-DE-AMBIENTES.md","PIPELINE-DE-PROMOCION.md","CHECKLIST-DE-ENTREGA.md","RUNBOOK-ROLLBACK-Y-RECUPERACION.md",".firebaserc.example"):
    if not (BASE / name).is_file(): errors.append(f"falta entregable: {name}")
for path in (ROOT / "replication/templates/cloud-function/procesar-observacion.mjs", ROOT / ".github/workflows/delivery-gates.yml"):
    if not path.is_file(): errors.append(f"falta entregable: {path.relative_to(ROOT)}")
if not (ROOT / "replication/tests/phase8-delivery.test.mjs").is_file(): errors.append("falta prueba de Function y dead-letter")

gate = ROOT / "replication/scripts/deployment-gate.py"
base = [sys.executable, str(gate), "--artifact", "git:" + "a"*40, "--rollback-artifact", "git:" + "b"*40, "--variables-checked", "--rules-tested", "--tests-passed", "--smoke-plan"]
positive = subprocess.run(base + ["--environment","staging","--account","ci-staging","--branch","main","--data-policy","sinteticos-o-anonimizados-verificados"], capture_output=True, text=True)
if positive.returncode != 0: errors.append(f"gate positivo falló: {positive.stdout.strip()}")

negatives = [
    ["--environment","staging","--account","ci-production","--branch","main","--data-policy","sinteticos-o-anonimizados-verificados"],
    ["--environment","production","--account","ci-production","--branch","feature/x","--data-policy","datos-reales-segun-finalidad-y-retencion"],
    ["--environment","staging","--account","ci-staging","--branch","main","--data-policy","datos-personales-reales"],
]
for case in negatives:
    result = subprocess.run(base + case, capture_output=True, text=True)
    if result.returncode == 0: errors.append(f"gate aceptó caso negativo: {' '.join(case)}")

if errors:
    print("Fase 8 inválida:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)
print(f"Fase 8 válida: {len(actual)} ambientes, {len(deployables['deployables'])} desplegables, 1 promoción positiva y {len(negatives)} negativas.")
