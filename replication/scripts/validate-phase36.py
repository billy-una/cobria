#!/usr/bin/env python3
import json,subprocess,sys
from pathlib import Path
r=Path(__file__).resolve().parents[2];subprocess.run(['node','replication/scripts/generate-phase36-readiness.mjs'],cwd=r,check=True);d=json.loads((r/'specification/phase-36/publication-readiness.json').read_text());ok=d['status']=='prepared-not-published' and d['published'] is False and d['doi'] is None and d['releaseSignature'] is None and len(d['blockers'])==5 and d['officialCertification'] is False;print('Fase 36 válida: propuesta preparada pero no publicada; cinco bloqueadores explícitos.') if ok else sys.exit(1)
