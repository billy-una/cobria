#!/usr/bin/env python3
"""Compuerta reproducible de cierre para API/UX y Security."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "replication/examples/ecosistema-app"
errors: list[str] = []


def require_tokens(path: Path, tokens: tuple[str, ...]) -> None:
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


require_tokens(ROOT / "manuales/15-api-ux.md", ("RFC 9457", "Idempotencia", "cursor opaco", "WCAG 2.2 AA", "pruebas manuales"))
require_tokens(ROOT / "manuales/16-security.md", ("Modelo de amenazas", "capacidad", "Functions", "Cadena de suministro", "Incidentes"))
require_tokens(APP / "src/presentation/problema-http.mjs", ("application/problem+json", "traceId", "status", "categorias"))
require_tokens(ROOT / "sitio/app/manual.tsx", ('apiux:', 'seguridad:', 'apiux: "/api-ux"', 'seguridad: "/seguridad"'))
for route in ("api-ux", "seguridad"):
    require_tokens(ROOT / f"sitio/app/{route}/page.tsx", ("ManualPage",))

security = json.loads((ROOT / "specification/phase-7/security.json").read_text(encoding="utf-8"))
for operation in security.get("sensitiveOperations", []):
    missing = [field for field in ("actor", "capability", "scope", "purpose", "audit", "negativeTest") if not operation.get(field)]
    if missing:
        errors.append(f"{operation.get('id', 'operación sensible')}: faltan {', '.join(missing)}")

run("contratos API/UX", [sys.executable, "replication/scripts/validate-phase10.py"])
run("contratos de seguridad", [sys.executable, "replication/scripts/validate-phase7.py"])
run("pruebas de la aplicación neutral", ["npm", "test"], APP)

audit = subprocess.run(["npm", "audit", "--json"], cwd=ROOT / "replication", text=True, capture_output=True, check=False)
try:
    vulnerabilities = json.loads(audit.stdout).get("metadata", {}).get("vulnerabilities", {})
    for severity in ("critical", "high"):
        if vulnerabilities.get(severity, 0):
            errors.append(f"npm audit informa {vulnerabilities[severity]} vulnerabilidades {severity}")
except json.JSONDecodeError:
    errors.append("npm audit no produjo JSON interpretable")

if errors:
    print("Cierre de fases 6–7 inválido:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)

print("Cierre de fases 6–7 válido: API/eventos, RFC 9457, estados UX, seguridad, aplicación neutral y dependencias verificados.")
