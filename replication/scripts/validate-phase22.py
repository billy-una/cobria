#!/usr/bin/env python3
"""Valida la evaluación Engineering dirigida por manifiesto."""
import json
from pathlib import Path
import subprocess
import tempfile
import sys

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'specification/phase-22'
POS=ROOT.parent/'POSGUAPILES-1'
errors=[]
status=json.loads((BASE/'status.json').read_text(encoding='utf-8'))
manifest=json.loads((BASE/'adoption-manifest.posguapiles.json').read_text(encoding='utf-8'))
report=json.loads((BASE/'report.posguapiles.json').read_text(encoding='utf-8'))
expected={f'ENG-{i:03d}' for i in range(1,9)}

if status.get('state')!='implemented-and-executed-local': errors.append('estado de fase 22 incorrecto')
if {item.get('id') for item in manifest.get('contracts',[])}!=expected: errors.append('manifiesto sin ENG-001..ENG-008')
if report.get('summary')!={'contracts':8,'implementedLocal':8,'operationallyValidated':0}: errors.append('resultado del piloto dirigido por manifiesto inesperado')
if report.get('project',{}).get('sourceMode')!='git-ref': errors.append('el motor no leyó desde objetos Git')
engine=(ROOT/'replication/src/engineering-adoption.mjs').read_text(encoding='utf-8')
for forbidden in ('POSGUAPILES','commit-sale.js','OfflinePolicy.js'):
    if forbidden in engine: errors.append(f'el motor contiene conocimiento de proyecto: {forbidden}')
for name in ('README.md','adoption-manifest.schema.json','adoption-manifest.posguapiles.json','report.posguapiles.json','status.json'):
    if not (BASE/name).is_file(): errors.append(f'falta {name}')

tests=subprocess.run(['node','--test','tests/phase22-engineering-manifest.test.mjs'],cwd=ROOT/'replication',capture_output=True,text=True)
if tests.returncode: errors.append(tests.stdout+tests.stderr)
elif '# pass 2' not in tests.stdout and 'pass 2' not in tests.stdout: errors.append('no se observaron dos pruebas de fase 22')

if not POS.is_dir(): errors.append('checkout POSGUAPILES-1 no disponible')
else:
    with tempfile.TemporaryDirectory() as directory:
        fresh=Path(directory)/'report.json'
        run=subprocess.run(['node','replication/scripts/assess-engineering-manifest.mjs','--project',str(POS),'--manifest',str(BASE/'adoption-manifest.posguapiles.json'),'--output',str(fresh)],cwd=ROOT,capture_output=True,text=True)
        if run.returncode: errors.append(run.stderr or run.stdout)
        else:
            regenerated=json.loads(fresh.read_text(encoding='utf-8'))
            if regenerated!=report: errors.append('el informe por manifiesto no es reproducible')

roadmap=(ROOT/'manuales/11-estado-y-roadmap-integral.md').read_text(encoding='utf-8')
if 'Fase 22 — Evaluación Engineering dirigida por manifiesto' not in roadmap: errors.append('roadmap sin fase 22')
site=(ROOT/'sitio/app/manual.tsx').read_text(encoding='utf-8')
book=(ROOT/'libro-cobria/build-book.mjs').read_text(encoding='utf-8')
if 'Manifiesto de adopción' not in site: errors.append('sitio sin manifiesto de adopción')
if 'Declarar para verificar' not in book: errors.append('libro sin fase 22')
if errors:
    print('Fase 22 inválida:'); print('\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print('Fase 22 válida: manifiesto seguro, motor independiente del proyecto, 2 pruebas y resultado 8/8 reproducible desde Git.')
