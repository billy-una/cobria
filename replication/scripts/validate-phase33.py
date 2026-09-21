#!/usr/bin/env python3
import json,subprocess,sys
from pathlib import Path
r=Path(__file__).resolve().parents[2];subprocess.run(['node','replication/scripts/generate-phase33-synthesis.mjs'],cwd=r,check=True);d=json.loads((r/'specification/phase-33/scientific-synthesis.json').read_text());ok=d['effectSizes'] is None and d['confidenceIntervals'] is None and d['officialCertification'] is False and all(d['evidenceLevels'][x]=='pending' for x in ['humanIndependent','operational','externalReplication']);print('Fase 33 válida: síntesis provisional con evidencia externa pendiente.') if ok else sys.exit(1)
