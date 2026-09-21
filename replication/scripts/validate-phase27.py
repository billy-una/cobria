#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
dossier = json.loads((ROOT / "specification/phase-27/evidence-dossier.json").read_text())
assert dossier["phase"] == 27
assert dossier["status"] == "proposal-evidence-dossier"
assert dossier["officialCertification"] is False
assert len(dossier["assessments"]) == 3
dimensions = [d for p in dossier["assessments"] for c in p["contracts"] for d in c["dimensions"]]
assert all(len(p["contracts"]) == 8 for p in dossier["assessments"])
assert len(dimensions) == 72
assert all(d["decision"] == "pending-semantic-review" for d in dimensions)
assert dossier["summary"]["supported"] == 0
assert dossier["summary"]["operationallyValidated"] == 0
assert "No certifica" in dossier["interpretation"]
print("Fase 27 válida: 3 proyectos, 24 contratos observados y 72 decisiones pendientes; 0 certificaciones.")
