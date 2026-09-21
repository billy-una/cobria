#!/usr/bin/env python3
import json,subprocess,sys
from pathlib import Path
r=Path(__file__).resolve().parents[2];e=[];subprocess.run(['node','replication/scripts/generate-phase32-package.mjs'],cwd=r,check=True);s=json.loads((r/'specification/phase-32/status.json').read_text());f=json.loads((r/'output/review/phase32/EXTERNAL-REPLICATION-FORM.json').read_text());
if s['externalRunsReceived']!=0 or s['officialCertification'] is not False:e.append('estado externo inventado')
if len(f['tasks'])!=5 or any(x['result'] is not None for x in f['tasks']):e.append('formulario precargado')
print('Fase 32 válida: paquete preparado, 0 repeticiones externas.') if not e else (print(e),sys.exit(1))
