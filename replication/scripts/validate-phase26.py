#!/usr/bin/env python3
import json,subprocess,tempfile,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]; BASE=ROOT/'specification/phase-26'; errors=[]
rubric=json.loads((BASE/'engineering-dimensional-rubric.json').read_text()); template=json.loads((BASE/'assessment-template.json').read_text()); status=json.loads((BASE/'status.json').read_text())
if status!={'phase':26,'state':'implemented-proposal','contracts':8,'dimensions':24,'decisionsPreloaded':0,'officialCertification':False}: errors.append('estado de fase 26 incorrecto')
if len(rubric.get('contracts',[]))!=8 or sum(len(item.get('dimensions',[])) for item in rubric.get('contracts',[]))!=24: errors.append('rúbrica incompleta')
if rubric.get('officialCertification') is not False or template.get('officialCertification') is not False: errors.append('afirmación oficial indebida')
if any(d.get('decision') is not None for c in template.get('contracts',[]) for d in c.get('dimensions',[])): errors.append('plantilla con decisiones inventadas')
with tempfile.TemporaryDirectory() as directory:
  target=Path(directory)/'assessment.json'; run=subprocess.run(['node','replication/scripts/generate-phase26-assessment.mjs','--subject','ejemplo-neutral','--output',str(target)],cwd=ROOT,capture_output=True,text=True)
  if run.returncode: errors.append(run.stderr or run.stdout)
  elif json.loads(target.read_text())!=template: errors.append('plantilla no reproducible')
tests=subprocess.run(['node','--test','tests/phase26-engineering-rubric.test.mjs'],cwd=ROOT/'replication',capture_output=True,text=True)
if tests.returncode: errors.append(tests.stdout+tests.stderr)
roadmap=(ROOT/'manuales/11-estado-y-roadmap-integral.md').read_text(); site=(ROOT/'sitio/app/manual.tsx').read_text(); book=(ROOT/'libro-cobria/build-book.mjs').read_text()
if 'Fase 26 — Rúbrica dimensional' not in roadmap: errors.append('roadmap sin fase 26')
if 'Veinticuatro dimensiones' not in site: errors.append('sitio sin fase 26')
if 'Ocho contratos, veinticuatro dimensiones' not in book: errors.append('libro sin fase 26')
if errors: print('Fase 26 inválida:\n'+'\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print('Fase 26 válida: 8 contratos, 24 dimensiones, 0 decisiones precargadas y 0 certificación oficial.')
