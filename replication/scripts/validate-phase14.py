#!/usr/bin/env python3
import json
from pathlib import Path
import subprocess
import sys
ROOT=Path(__file__).resolve().parents[2];BASE=ROOT/'specification/phase-14';FIX=ROOT/'replication/fixtures/audit-phase14';CLI=ROOT/'replication/src/cli.mjs';errors=[]
rules=json.loads((BASE/'rules.json').read_text(encoding='utf-8')).get('rules',[])
if [x.get('id') for x in rules] != [f'AUD-{i:03d}' for i in range(1,8)]: errors.append('catálogo de siete reglas inválido')
for name in ('MANUAL-DEL-AUDITOR.md','FALSOS-POSITIVOS-Y-LIMITES.md'):
    if not (BASE/name).is_file():errors.append(f'falta {name}')
valid=subprocess.run(['node',str(CLI),'auditar','--codigo',str(FIX/'valid'),'--json'],cwd=ROOT,capture_output=True,text=True)
invalid=subprocess.run(['node',str(CLI),'auditar','--codigo',str(FIX/'invalid'),'--json'],cwd=ROOT,capture_output=True,text=True)
if valid.returncode or not json.loads(valid.stdout).get('ok'):errors.append('fixture válido rechazado')
if invalid.returncode!=1:errors.append('fixture inválido no bloqueó')
else:
    found={x['rule'] for x in json.loads(invalid.stdout).get('findings',[])}
    expected={f'AUD-{i:03d}' for i in range(1,8)}
    if found!=expected:errors.append(f'reglas observadas difieren: {sorted(found)}')
impact=subprocess.run(['node',str(CLI),'impacto','--archivo','src/domain/entity.mjs','--raiz',str(FIX/'valid'),'--json'],cwd=ROOT,capture_output=True,text=True)
if impact.returncode or len(json.loads(impact.stdout).get('affected',[]))!=1:errors.append('impacto estático falló')
if errors:print('Fase 14 inválida:');print('\n'.join(f'- {x}' for x in errors));sys.exit(1)
print('Fase 14 válida: 7 reglas con fixtures positivos/negativos e impacto estático verificable.')
