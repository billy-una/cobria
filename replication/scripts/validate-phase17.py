#!/usr/bin/env python3
import json, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
errors = []
canonical = json.loads((ROOT/'editorial/canonical.json').read_text())
products = json.loads((ROOT/'editorial/products.json').read_text())
evidence = json.loads((ROOT/'replication/results/core-1.3-alternatives/summary.json').read_text())

sync = subprocess.run(['node', 'replication/scripts/sync-editorial.mjs', '--check'], cwd=ROOT, capture_output=True, text=True)
if sync.returncode: errors.append(sync.stderr.strip() or 'derivados editoriales desactualizados')
if canonical['ecosystem']['moduleCount'] != len(canonical['ecosystem']['modules']): errors.append('recuento de módulos inconsistente')
claim = next((item for item in canonical['claims'] if item['id'] == 'CLAIM-ALT-630'), None)
if not claim or claim['value'] != evidence['rawCount'] or claim['status'] != 'ejecutado': errors.append('CLAIM-ALT-630 no coincide con evidencia')
expected_products = {'specification','article','master','book','workbook','technical-annex','site','toolkit','evidence'}
if {item['id'] for item in products['products']} != expected_products: errors.append('registro de productos incompleto')

consumers = {
  'main.tex': 'editorial/generated/identity.tex',
  'articulo-cobria.tex': 'editorial/generated/identity.tex',
  'libro-cobria/build-book.mjs': 'generated/cobria-canonical.json',
  'sitio/app/page.tsx': 'cobria-canonical',
  'sitio/app/layout.tsx': 'cobria-canonical',
}
for file, marker in consumers.items():
    if marker not in (ROOT/file).read_text(): errors.append(f'{file} no consume su derivado canónico')

site = (ROOT/'sitio/app/page.tsx').read_text()
for obsolete in ('9 módulos conectados', 'nueve estaciones'):
    if obsolete in site: errors.append(f'contradicción web conservada: {obsolete}')

for document in ('MANUAL-DE-SINCRONIZACION-EDITORIAL.md','MATRIZ-DE-PRODUCTOS.md'):
    if not (ROOT/'specification/phase-17'/document).exists(): errors.append(f'falta {document}')

if errors:
    print('Fase 17 inválida:')
    for error in errors: print(f'- {error}')
    raise SystemExit(1)
print(f'Fase 17 válida: {len(products["products"])} productos, {len(canonical["claims"])} afirmaciones registradas y derivados sincronizados.')
