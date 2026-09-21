#!/usr/bin/env python3
"""Auditoría automática y honesta de la candidata COBRIA 1.0.0-rc1."""

from pathlib import Path
from tempfile import TemporaryDirectory
from pypdf import PdfReader
import hashlib
import json
import os
import subprocess

ROOT = Path(__file__).resolve().parents[2]
REPORT_DIR = ROOT / "output" / "review" / "ecosistema-1.0.0-rc1"
REPORT_DIR.mkdir(parents=True, exist_ok=True)
checks = []
findings = []


def execute(identifier: str, command: list[str], cwd: Path = ROOT) -> None:
    result = subprocess.run(command, cwd=cwd, capture_output=True, text=True)
    checks.append({"id": identifier, "status": "passed" if result.returncode == 0 else "failed", "command": " ".join(command)})
    if result.returncode:
        findings.append({"severity": "critical", "check": identifier, "detail": (result.stderr or result.stdout)[-2000:]})


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


execute("cierre-14-15", ["make", "verificar-cierre-14-15"])
execute("replication-tests", ["npm", "test"], ROOT / "replication")
execute("reference-application-tests", ["npm", "test"], ROOT / "replication" / "examples" / "ecosistema-app")
execute("site-lint", ["npm", "run", "lint"], ROOT / "sitio")
execute("site-tests", ["node", "--test", "tests/rendered-html.test.mjs"], ROOT / "sitio")

for identifier, directory in (("site-security", ROOT / "sitio"), ("replication-security", ROOT / "replication")):
    result = subprocess.run(["npm", "audit", "--omit=dev", "--json"], cwd=directory, capture_output=True, text=True)
    try:
        audit = json.loads(result.stdout)
        vulnerabilities = audit.get("metadata", {}).get("vulnerabilities", {})
        unsafe = sum(vulnerabilities.get(level, 0) for level in ("moderate", "high", "critical"))
        checks.append({"id": identifier, "status": "passed" if unsafe == 0 else "failed", "vulnerabilities": vulnerabilities})
        if unsafe:
            findings.append({"severity": "critical", "check": identifier, "detail": vulnerabilities})
    except json.JSONDecodeError:
        findings.append({"severity": "critical", "check": identifier, "detail": "npm audit no produjo JSON válido"})

pdf_results = []
for path in sorted((ROOT / "output" / "pdf").glob("COBRIA-*.pdf")):
    if path.name not in {
        "COBRIA-especificacion-ecosistema-1.0.pdf", "COBRIA-articulo-cientifico-actualizado.pdf",
        "COBRIA-documento-maestro-ecosistema.pdf", "COBRIA-ecosistema-manual-completo.pdf",
        "COBRIA-cuaderno-de-trabajo.pdf", "COBRIA-anexo-tecnico.pdf",
    }:
        continue
    reader = PdfReader(path)
    title = str((reader.metadata or {}).get("/Title", ""))
    valid = len(reader.pages) > 0 and bool(title.strip())
    pdf_results.append({"file": path.name, "pages": len(reader.pages), "title": title, "sha256": sha(path), "status": "passed" if valid else "failed"})
    if not valid:
        findings.append({"severity": "critical", "check": "pdf", "detail": path.name})
checks.append({"id": "pdf-integrity", "status": "passed" if all(x["status"] == "passed" for x in pdf_results) and len(pdf_results) == 6 else "failed", "files": pdf_results})

with TemporaryDirectory() as first, TemporaryDirectory() as second:
    execute("candidate-build-1", ["python3", "replication/scripts/build-closure-phase16.py", "--output", first])
    execute("candidate-build-2", ["python3", "replication/scripts/build-closure-phase16.py", "--output", second])
    a = Path(first) / "BUILD-SUMMARY.json"
    b = Path(second) / "BUILD-SUMMARY.json"
    if a.exists() and b.exists():
        one, two = json.loads(a.read_text()), json.loads(b.read_text())
        same = one["sha256"] == two["sha256"]
        checks.append({"id": "double-build-equivalence", "status": "passed" if same else "failed", "first": one["sha256"], "second": two["sha256"]})
        if not same:
            findings.append({"severity": "critical", "check": "double-build-equivalence", "detail": "Las candidatas difieren"})

dirty = subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT, text=True).strip()
checks.append({"id": "clean-tree", "status": "passed" if not dirty else "failed", "changedLines": len(dirty.splitlines()) if dirty else 0})
if dirty:
    findings.append({"severity": "critical", "check": "clean-tree", "detail": "El árbol cambió durante la auditoría"})

pending = [
    "lectura editorial independiente por una persona real",
    "revisión técnica independiente por una persona real",
    "prueba de transferencia con participantes y consentimiento",
    "evaluación humana de claridad y comprensión",
    "certificación profesional de accesibilidad PDF",
]
report = {
    "schemaVersion": "1.0.0", "release": "ecosistema-1.0.0-rc1",
    "proposalIndependent": True, "automatedChecks": checks, "findings": findings,
    "criticalOpen": sum(1 for item in findings if item["severity"] == "critical"),
    "humanValidationPending": pending,
    "decision": "automatic-gates-passed-human-review-pending" if not findings else "blocked-by-automatic-findings",
}
(REPORT_DIR / "AUDIT-REPORT.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
lines = ["# Auditoría de COBRIA Ecosistema 1.0.0-rc1", "", f'**Decisión automática:** `{report["decision"]}`.', "", "## Comprobaciones", ""]
lines += [f'- {item["id"]}: **{item["status"]}**' for item in checks]
lines += ["", "## Validación humana pendiente", ""] + [f"- {item}" for item in pending]
lines += ["", "Ninguna tarea pendiente se presenta como ejecutada ni se sustituye por revisores inventados.", ""]
(REPORT_DIR / "AUDIT-REPORT.md").write_text("\n".join(lines), encoding="utf-8")
print(json.dumps({"decision": report["decision"], "criticalOpen": report["criticalOpen"], "checks": len(checks)}))
raise SystemExit(1 if findings else 0)
