#!/usr/bin/env python3
"""Valida la comparación de transferencia Engineering en tres proyectos."""
import json, subprocess, tempfile, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]; BASE=ROOT/'specification/phase-23'
projects={'posguapiles':ROOT.parent/'POSGUAPILES-1','crmhotel':ROOT.parent/'CRMHOTEL_NUEVO','bshandball':ROOT.parent/'BSHandball'}
errors=[]; expected={f'ENG-{i:03d}' for i in range(1,9)}
status=json.loads((BASE/'status.json').read_text()); comparison=json.loads((BASE/'comparison.json').read_text())
if status.get('state')!='implemented-and-executed-local': errors.append('estado incorrecto')
if comparison.get('summary')!={'projects':3,'contracts':8,'operationallyValidated':0}: errors.append('resumen inesperado')
if len({item.get('commit') for item in comparison.get('projects',[])})!=3: errors.append('commits no distintos')
if {item.get('id') for item in comparison.get('contracts',[])}!=expected: errors.append('faltan contratos')
with tempfile.TemporaryDirectory() as directory:
  fresh=[]
  for name,repo in projects.items():
    manifest=BASE/f'adoption-manifest.{name}.json'; report=BASE/f'report.{name}.json'; target=Path(directory)/f'{name}.json'
    if not repo.is_dir(): errors.append(f'checkout ausente: {name}'); continue
    data=json.loads(manifest.read_text())
    if len(data.get('project',{}).get('expectedCommit',''))!=40: errors.append(f'commit no congelado: {name}')
    if {item.get('id') for item in data.get('contracts',[])}!=expected: errors.append(f'manifiesto incompleto: {name}')
    run=subprocess.run(['node','replication/scripts/assess-engineering-manifest.mjs','--project',str(repo),'--manifest',str(manifest),'--output',str(target)],cwd=ROOT,capture_output=True,text=True)
    if run.returncode: errors.append(run.stderr or run.stdout); continue
    regenerated=json.loads(target.read_text()); fresh.append(target)
    if regenerated!=json.loads(report.read_text()): errors.append(f'informe no reproducible: {name}')
    if regenerated.get('summary',{}).get('operationallyValidated')!=0: errors.append(f'afirmación operacional: {name}')
  if len(fresh)==3:
    target=Path(directory)/'comparison.json'
    run=subprocess.run(['node','replication/scripts/compare-engineering-transfer.mjs','--reports',','.join(map(str,fresh)),'--output',str(target)],cwd=ROOT,capture_output=True,text=True)
    if run.returncode: errors.append(run.stderr or run.stdout)
    elif json.loads(target.read_text())!=comparison: errors.append('comparación no reproducible')
tests=subprocess.run(['node','--test','tests/phase23-engineering-transfer.test.mjs'],cwd=ROOT/'replication',capture_output=True,text=True)
if tests.returncode: errors.append(tests.stdout+tests.stderr)
roadmap=(ROOT/'manuales/11-estado-y-roadmap-integral.md').read_text(); site=(ROOT/'sitio/app/manual.tsx').read_text(); book=(ROOT/'libro-cobria/build-book.mjs').read_text()
if 'Fase 23 — Comparación de transferencia' not in roadmap: errors.append('roadmap sin fase 23')
if 'Tres proyectos, una misma rúbrica' not in site: errors.append('sitio sin fase 23')
if 'Comparar sin clasificar' not in book: errors.append('libro sin fase 23')
if errors: print('Fase 23 inválida:\n'+'\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print('Fase 23 válida: 3 repositorios, 8 contratos, informes deterministas y 0 afirmaciones operacionales.')
