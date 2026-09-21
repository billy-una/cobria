#!/usr/bin/env python3
"""Valida el piloto estructural de adopción Engineering."""
import json
from pathlib import Path
import subprocess
import tempfile
import sys

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'specification/phase-21'
POS=ROOT.parent/'POSGUAPILES-1'
errors=[]
status=json.loads((BASE/'status.json').read_text(encoding='utf-8'))
report=json.loads((BASE/'pilot-posguapiles.json').read_text(encoding='utf-8'))
expected={f'ENG-{i:03d}' for i in range(1,9)}

if status.get('state')!='executed-structural-pilot-not-operationally-validated': errors.append('estado del piloto incorrecto')
if report.get('project',{}).get('commit')!=status.get('expectedCommit'): errors.append('commit evaluado no coincide con el congelado')
if report.get('project',{}).get('dirty') is not False: errors.append('el informe original no provino de un checkout limpio')
if {item.get('id') for item in report.get('checks',[])} != expected: errors.append('cobertura ENG incompleta')
if report.get('summary',{}).get('implementedLocal') != 8: errors.append('faltan contratos con evidencia estructural')
if report.get('summary',{}).get('operationallyValidated') != 0 or status.get('operationallyValidated') != 0: errors.append('el piloto simula validación operacional')
for item in report.get('checks',[]):
    if item.get('operationalStatus')!='not-assessed': errors.append(f"{item.get('id')}: estado operacional indebido")
    for evidence in item.get('files',[]):
        if not evidence.get('exists') or len(evidence.get('sha256') or '')!=64: errors.append(f"{item.get('id')}: evidencia sin huella")

if not POS.is_dir(): errors.append('checkout POSGUAPILES-1 no disponible para repetir el piloto')
else:
    with tempfile.TemporaryDirectory() as directory:
        checkout=Path(directory)/'pos-frozen'
        clone=subprocess.run(['git','clone','--quiet','--no-hardlinks',str(POS),str(checkout)],capture_output=True,text=True)
        if clone.returncode: errors.append(clone.stderr or clone.stdout)
        else:
            frozen=status['expectedCommit']
            checkout_run=subprocess.run(['git','checkout','--quiet','--detach',frozen],cwd=checkout,capture_output=True,text=True)
            if checkout_run.returncode: errors.append(checkout_run.stderr or checkout_run.stdout)
            else:
                subprocess.run(['git','remote','set-url','origin',report['project']['remote']],cwd=checkout,check=True)
                fresh=Path(directory)/'pilot.json'
                run=subprocess.run(['node','replication/scripts/assess-engineering-adoption.mjs','--project',str(checkout),'--output',str(fresh)],cwd=ROOT,capture_output=True,text=True)
                if run.returncode: errors.append(run.stderr or run.stdout)
                else:
                    regenerated=json.loads(fresh.read_text(encoding='utf-8'))
                    for key in ('summary','checks','limits'):
                        if regenerated.get(key)!=report.get(key): errors.append(f'informe no reproducible: {key}')
                    if regenerated.get('project',{}).get('commit')!=frozen or regenerated.get('project',{}).get('dirty') is not False:
                        errors.append('el checkout temporal no reproduce el commit limpio')

for name in ('README.md','RUBRICA-DE-ADOPCION.md','BRECHAS-Y-SIGUIENTE-PASO.md','pilot-posguapiles.json','status.json'):
    if not (BASE/name).is_file(): errors.append(f'falta {name}')
roadmap=(ROOT/'manuales/11-estado-y-roadmap-integral.md').read_text(encoding='utf-8')
if 'Fase 21 — Piloto de adopción COBRIA Engineering' not in roadmap: errors.append('roadmap sin fase 21')
site=(ROOT/'sitio/app/manual.tsx').read_text(encoding='utf-8')
book=(ROOT/'libro-cobria/build-book.mjs').read_text(encoding='utf-8')
if '8/8 estructurales · 0 operacionales' not in site: errors.append('sitio sin resultado limitado del piloto')
if '0 presentados como validados operacionalmente' not in book: errors.append('libro sin límite operacional del piloto')
if errors:
    print('Fase 21 inválida:'); print('\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print('Fase 21 válida: 8/8 contratos con evidencia estructural reproducible, 0 presentados como validados operacionalmente.')
