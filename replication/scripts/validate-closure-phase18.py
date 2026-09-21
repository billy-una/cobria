#!/usr/bin/env python3
"""Valida preparación pública sin promover COBRIA a versión estable."""

from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import json
import subprocess

ROOT = Path(__file__).resolve().parents[2]
BASE_URL = "https://cobria-atlas.sectagpt.chatgpt.site"
CANDIDATE = "ecosistema-1.0.0-rc1"
STABLE = "ecosistema-1.0.0"
EXPECTED_DOWNLOADS = {
    "/downloads/COBRIA-libro-web.pdf",
    "/downloads/COBRIA-cuaderno.pdf",
    "/downloads/COBRIA-articulo.pdf",
    "/downloads/COBRIA-documento-maestro.pdf",
    "/downloads/COBRIA-especificacion.pdf",
    "/downloads/COBRIA-anexo-tecnico.pdf",
}
REQUIRED = [
    "MAINTENANCE.md", "CONTRIBUTING.md", "SECURITY.md", "CHANGELOG.md",
    "CITATION.cff", "ROADMAP-1.X.md", "ARCHIVO-HISTORICO.md",
    "PUBLICATION-READINESS-1.0.0.md", "CIERRE-FASE-18.md", "LICENSES.md",
    ".github/ISSUE_TEMPLATE/bug.yml", ".github/ISSUE_TEMPLATE/pattern.yml",
    ".github/ISSUE_TEMPLATE/evidence.yml", ".github/ISSUE_TEMPLATE/config.yml",
]


def git(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def public_get(path: str) -> dict:
    request = Request(BASE_URL + path, headers={"User-Agent": "COBRIA-publication-gate/1.0"})
    try:
        with urlopen(request, timeout=20) as response:
            sample = response.read(512)
            return {"path": path, "status": response.status, "bytesSampled": len(sample)}
    except (HTTPError, URLError, TimeoutError) as error:
        return {"path": path, "status": 0, "error": str(error)}


checks = []
missing = [path for path in REQUIRED if not (ROOT / path).is_file()]
checks.append({"id": "governance-files", "passed": not missing, "missing": missing})

remote = git("remote", "get-url", "origin")
checks.append({
    "id": "canonical-remote",
    "passed": remote == "https://github.com/billy-una/cobria.git",
    "value": remote,
})

tags = set(git("tag", "--list").splitlines())
candidate_commit = git("rev-list", "-n", "1", CANDIDATE) if CANDIDATE in tags else ""
checks.append({"id": "candidate-tag", "passed": bool(candidate_commit), "commit": candidate_commit})
checks.append({
    "id": "stable-tag-withheld",
    "passed": STABLE not in tags,
    "detail": "La ausencia es obligatoria mientras existan puertas humanas pendientes.",
})

scope = json.loads((ROOT / "editorial" / "release-scope.json").read_text(encoding="utf-8"))
blockers = scope.get("stableBlockedBy", [])
checks.append({
    "id": "human-gates-explicit",
    "passed": scope.get("status") == "candidata-publica-estable-bloqueada" and len(blockers) >= 5,
    "blockers": blockers,
})

source = (ROOT / "sitio" / "app" / "recursos" / "page.tsx").read_text(encoding="utf-8")
declared = {item for item in EXPECTED_DOWNLOADS if item in source}
checks.append({
    "id": "canonical-download-links",
    "passed": declared == EXPECTED_DOWNLOADS,
    "expected": sorted(EXPECTED_DOWNLOADS),
    "declared": sorted(declared),
})

live = [public_get("/"), public_get("/recursos")]
checks.append({
    "id": "anonymous-live-site",
    "passed": all(item["status"] == 200 for item in live),
    "requests": live,
})

candidate_report = ROOT / "output" / "review" / CANDIDATE / "AUDIT-REPORT.json"
if candidate_report.is_file():
    audit = json.loads(candidate_report.read_text(encoding="utf-8"))
    audit_passed = audit.get("criticalOpen") == 0 and audit.get("decision") == "automatic-gates-passed-human-review-pending"
else:
    audit = {}
    audit_passed = False
checks.append({
    "id": "candidate-audit",
    "passed": audit_passed,
    "decision": audit.get("decision", "missing"),
    "criticalOpen": audit.get("criticalOpen"),
})

failed = [check["id"] for check in checks if not check["passed"]]
report = {
    "schemaVersion": "1.0.0",
    "target": STABLE,
    "candidate": CANDIDATE,
    "state": "candidata-publica-estable-bloqueada" if not failed else "bloqueada-por-fallos-automaticos",
    "proposalIndependent": True,
    "officialCertification": False,
    "stablePublished": False,
    "checks": checks,
    "automaticFailures": failed,
    "humanValidationPending": blockers,
    "interpretation": (
        "La automatización está completa; la versión estable continúa retenida por puertas humanas y externas."
        if not failed else "Existen fallos automáticos adicionales que deben corregirse."
    ),
}
destination = ROOT / "output" / "review" / STABLE
destination.mkdir(parents=True, exist_ok=True)
(destination / "publication-readiness.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps({"state": report["state"], "checks": len(checks), "failed": failed}, ensure_ascii=False))
raise SystemExit(1 if failed else 0)

