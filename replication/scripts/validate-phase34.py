#!/usr/bin/env python3
import json,subprocess,sys
from pathlib import Path
r=Path(__file__).resolve().parents[2];subprocess.run(['node','replication/scripts/generate-phase34-editorial-snapshot.mjs'],cwd=r,check=True);d=json.loads((r/'editorial/generated/closure-status.json').read_text());ok=len(d['products'])==4 and d['officialCertification'] is False and not any(x['status']=='validated-external' for x in d['claims']);print('Fase 34 válida: cuatro productos sincronizados sin evidencia externa inventada.') if ok else sys.exit(1)
