#!/usr/bin/env python3
"""Impide preparar una versión estable mientras existan hitos humanos pendientes."""

from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
status = json.loads((ROOT / "specification" / "phase-18" / "status.json").read_text(encoding="utf-8"))
required = {"P18-REVIEW", "P18-SCREENING", "P18-TRANSFER", "P18-REPLICATION", "P18-SIGN"}
milestones = {item["id"]: item for item in status.get("milestones", [])}
pending = [
    {"id": identifier, "status": milestones.get(identifier, {}).get("status", "missing")}
    for identifier in sorted(required)
    if milestones.get(identifier, {}).get("status") != "executed"
]
if pending:
    print(json.dumps({
        "state": "stable-release-refused",
        "reason": "human-or-external-gates-pending",
        "pending": pending,
        "instruction": "Conserve ecosistema-1.0.0-rc1; no cree la etiqueta estable.",
    }, ensure_ascii=False, indent=2))
    raise SystemExit(2)

print(json.dumps({
    "state": "human-gates-recorded",
    "next": "Una persona autorizada debe revisar la evidencia antes de publicar.",
}, ensure_ascii=False, indent=2))

