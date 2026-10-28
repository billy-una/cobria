#!/usr/bin/env python3
import json,subprocess,tempfile,sys
from pathlib import Path
from frozen_project import frozen_project
ROOT=Path(__file__).resolve().parents[2]; BASE=ROOT/'specification/phase-25'; errors=[]
projects={'posguapiles':ROOT.parent/'POSGUAPILES-1','crmhotel':ROOT.parent/'CRMHOTEL_NUEVO','bshandball':ROOT.parent/'BSHandball'}
repositories={'posguapiles':'https://github.com/billy-una/posguapiles.git','crmhotel':'https://github.com/billy-una/CRMHOTEL.git','bshandball':'https://github.com/billy-una/BSHandball.git'}
expected={'posguapiles':(3,'supported-structural'),'crmhotel':(2,'insufficient-structural'),'bshandball':(3,'supported-structural')}
with tempfile.TemporaryDirectory() as directory:
  for name,repo in projects.items():
    target=Path(directory)/f'{name}.json'; profile=BASE/f'profile.{name}.json'; profile_data=json.loads(profile.read_text())
    try:
      with frozen_project(repo,repositories[name],profile_data['project']['expectedCommit']) as source:
        run=subprocess.run(['node','replication/scripts/assess-phase25-dimensions.mjs','--project',str(source),'--profile',str(profile),'--output',str(target)],cwd=ROOT,capture_output=True,text=True)
    except RuntimeError as error:
      errors.append(str(error)); continue
    if run.returncode: errors.append(run.stderr or run.stdout); continue
    result=json.loads(target.read_text()); saved=json.loads((BASE/f'result.{name}.json').read_text())
    if result!=saved: errors.append(f'resultado no reproducible: {name}')
    if (result['summary']['satisfied'],result['summary']['strictStatus'])!=expected[name]: errors.append(f'resultado inesperado: {name}')
    if 'no certifica' not in result.get('interpretation',''): errors.append(f'límite ausente: {name}')
tests=subprocess.run(['node','--test','tests/phase25-dimensional-evidence.test.mjs'],cwd=ROOT/'replication',capture_output=True,text=True)
if tests.returncode: errors.append(tests.stdout+tests.stderr)
roadmap=(ROOT/'manuales/11-estado-y-roadmap-integral.md').read_text(); site=(ROOT/'editorial/pedagogy.json').read_text(); book=(ROOT/'libro-cobria/build-book.mjs').read_text()
if 'Fase 25 — Calibración dimensional' not in roadmap: errors.append('roadmap sin fase 25')
if 'Tres dimensiones, no una palabra' not in site: errors.append('sitio sin fase 25')
if 'Evidencia por dimensión' not in book: errors.append('libro sin fase 25')
if errors: print('Fase 25 inválida:\n'+'\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print('Fase 25 válida: ENG-007 exige 3 dimensiones; resultados 3/3, 2/3 y 3/3, sin afirmación oficial.')
