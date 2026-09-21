#!/usr/bin/env python3
import json,subprocess,hashlib,sys
from pathlib import Path
r=Path(__file__).resolve().parents[2];subprocess.run(['node','replication/scripts/build-phase35-candidate.mjs'],cwd=r,check=True);d=json.loads((r/'output/release/phase35-candidate/MANIFEST-SHA256.json').read_text());ok=not d['signed'] and not d['published'] and not d['officialRelease'] and all(hashlib.sha256((r/x['path']).read_bytes()).hexdigest()==x['sha256'] for x in d['files']);print(f"Fase 35 válida: candidato local con {len(d['files'])} huellas, no firmado ni publicado.") if ok else sys.exit(1)
