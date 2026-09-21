#!/usr/bin/env python3
"""Compuerta del roadmap nuevo para Quality/Performance y Cloud/Operations."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
errors: list[str] = []


def require(path: Path, tokens: tuple[str, ...]) -> None:
    if not path.is_file():
        errors.append(f"falta {path.relative_to(ROOT)}")
        return
    text = path.read_text(encoding="utf-8")
    for token in tokens:
        if token not in text:
            errors.append(f"{path.relative_to(ROOT)} no declara: {token}")


def run(label: str, command: list[str], cwd: Path = ROOT) -> None:
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=False)
    if result.returncode:
        errors.append(f"{label} falló:\n{(result.stdout + result.stderr).strip()}")


require(ROOT / "manuales/17-quality-performance.md", ("p50", "p95", "p99", "630 observaciones", "Costo total", "microbenchmark"))
require(ROOT / "manuales/18-cloud-operations.md", ("staging", "Function", "dead-letter", "RPO", "RTO", "simulación"))
require(ROOT / "sitio/app/manual.tsx", ("Calidad y rendimiento", "630 observaciones", "Nube y operaciones", "promover huella"))

plan = json.loads((ROOT / "specification/phase-15/benchmark-plan.json").read_text(encoding="utf-8"))
raw = json.loads((ROOT / "replication/results/core-1.3-alternatives/raw.json").read_text(encoding="utf-8"))
expected = len(plan["strategies"]) * len(plan["workload"]["sizes"]) * plan["workload"]["runs"]
if len(raw) != expected:
    errors.append(f"benchmark: se esperaban {expected} observaciones y existen {len(raw)}")

environments = json.loads((ROOT / "specification/phase-8/environments.json").read_text(encoding="utf-8"))
ids = [item.get("id") for item in environments.get("environments", [])]
if ids != ["local", "test", "preview", "staging", "production", "recovery"]:
    errors.append(f"secuencia de ambientes inválida: {ids}")
for item in environments.get("environments", []):
    if item.get("id") != "production" and item.get("dataPolicy") == "datos-reales-segun-finalidad-y-retencion":
        errors.append(f"{item.get('id')}: acepta datos productivos")

observability = json.loads((ROOT / "specification/phase-9/observability.json").read_text(encoding="utf-8"))
for slo in observability.get("slos", []):
    if "not-production-validated" not in slo.get("status", ""):
        errors.append(f"{slo.get('id')}: se presenta como validado en producción")
for alert in observability.get("alerts", []):
    if not all(alert.get(field) for field in ("condition", "severity", "owner", "runbook")):
        errors.append(f"{alert.get('id')}: alerta no accionable")

run("calidad y observabilidad", [sys.executable, "replication/scripts/validate-phase9.py"])
run("rendimiento y presupuestos", [sys.executable, "replication/scripts/validate-phase15.py"])
run("ambientes y promoción", [sys.executable, "replication/scripts/validate-phase8.py"])
run("pruebas ejecutables", ["npm", "test"], ROOT / "replication")

if errors:
    print("Cierre de fases 8–9 inválido:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print(
    f"Cierre de fases 8–9 válido: {expected} observaciones preservadas, "
    f"{len(ids)} ambientes, {len(observability['slis'])} SLI y "
    f"{len(observability['alerts'])} alertas verificadas."
)
