#!/usr/bin/env python3
"""Valida integración y contratos de COBRIA Engineering, fase 19."""
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'specification/phase-19'
errors = []

patterns = json.loads((BASE / 'engineering-patterns.json').read_text(encoding='utf-8'))
status = json.loads((BASE / 'status.json').read_text(encoding='utf-8'))
expected = {f'ENG-{index:03d}' for index in range(1, 9)}
items = patterns.get('patterns', [])
ids = {item.get('id') for item in items}

if patterns.get('coreImpact') != 'none' or status.get('coreImpact') != 'none':
    errors.append('la fase 19 no puede modificar COBRIA Core 1.0')
if ids != expected or len(items) != len(ids):
    errors.append('los ocho contratos ENG-001..ENG-008 deben ser únicos')
for item in items:
    missing = {'id','name','problem','contract','evidence','cost','retirement','owner'} - set(item)
    if missing:
        errors.append(f"{item.get('id', 'sin-id')}: faltan {', '.join(sorted(missing))}")

if status.get('state') != 'implemented-local-not-operationally-validated':
    errors.append('el estado excede o contradice la evidencia local')
if status.get('contracts') != 8 or len(status.get('externalPending', [])) < 4:
    errors.append('estado o pendientes externos incompletos')

required = [
    'README.md','REQUISITOS-ENGINEERING.md','PATRONES-OPERATIVOS.md',
    'MODELO-DE-ADOPCION.md','PROCEDENCIA-POSGUAPILES.md',
    'engineering-patterns.json','status.json'
]
for name in required:
    if not (BASE / name).is_file():
        errors.append(f'falta {name}')

provenance = (BASE / 'PROCEDENCIA-POSGUAPILES.md').read_text(encoding='utf-8')
if 'c61c37577d6c50ec02fc038394f8fffbcd13286c' not in provenance:
    errors.append('la procedencia no congela el commit completo observado')
if 'no prueba' not in provenance.lower():
    errors.append('la procedencia no declara límite de inferencia')

roadmap = (ROOT / 'manuales/11-estado-y-roadmap-integral.md').read_text(encoding='utf-8')
prompts = (ROOT / 'manuales/12-prompts-roadmap-integral.md').read_text(encoding='utf-8')
manual = (ROOT / 'manuales/13-engineering.md').read_text(encoding='utf-8')
site_manual = (ROOT / 'sitio/app/manual.tsx').read_text(encoding='utf-8')
home = (ROOT / 'sitio/app/page.tsx').read_text(encoding='utf-8')
book = (ROOT / 'libro-cobria/build-book.mjs').read_text(encoding='utf-8')
canonical = json.loads((ROOT / 'editorial/canonical.json').read_text(encoding='utf-8'))

checks = {
    'roadmap': 'Fase 19 — COBRIA Engineering' in roadmap,
    'prompt': 'Fase 19 — COBRIA Engineering' in prompts,
    'manual': all(token in manual for token in expected),
    'sitio': 'engineering' in site_manual and '/engineering' in home,
    'libro': 'COBRIA Engineering' in book and 'Promoción ligada al artefacto' in book,
    'canónico': 'Engineering' in canonical.get('ecosystem', {}).get('modules', []),
}
for name, ok in checks.items():
    if not ok:
        errors.append(f'integración ausente: {name}')
if canonical['ecosystem']['moduleCount'] != len(canonical['ecosystem']['modules']):
    errors.append('recuento canónico de módulos inconsistente')

if errors:
    print('Fase 19 inválida:')
    print('\n'.join(f'- {error}' for error in errors))
    sys.exit(1)
print(f'Fase 19 válida: {len(items)} contratos Engineering, procedencia congelada e integración editorial registrada.')
