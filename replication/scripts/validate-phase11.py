#!/usr/bin/env python3
"""Valida identidad, procedencia y referencias de los manifiestos de fase 11."""
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'specification/phase-11'
names=['project.yaml','architecture.yaml','data-dictionary.yaml','nodes.yaml','functions.yaml','security.yaml','quality.yaml','environments.yaml','traceability.yaml']
errors=[]; manifests=[]; ids={}; total=0

check=subprocess.run([sys.executable,str(ROOT/'replication/scripts/generate-phase11-manifests.py'),'--check'],capture_output=True,text=True)
if check.returncode: errors.append(check.stdout.strip() or 'generación determinista falló')

for name in names:
    path=BASE/name
    if not path.is_file(): errors.append(f'falta manifiesto: {name}'); continue
    try: data=json.loads(path.read_text(encoding='utf-8'))
    except json.JSONDecodeError as exc: errors.append(f'{name}: JSON/YAML inválido: {exc}'); continue
    manifests.append((name,data))
    if data.get('schemaVersion')!='1.0.0' or not data.get('manifestId') or not data.get('generatedFrom'): errors.append(f'{name}: sobre incompleto')
    for source in data.get('generatedFrom',[]):
        if not (ROOT/source.split('#')[0]).is_file(): errors.append(f'{name}: fuente generadora no resuelve: {source}')
    for item in data.get('records',[]):
        total+=1
        for field in ('id','source','version','owner','references','data'):
            if field not in item or item[field] in (None,'',[]): errors.append(f"{name}/{item.get('id','?')}: falta {field}")
        identifier=item.get('id')
        if identifier in ids: errors.append(f'ID duplicado: {identifier} en {ids[identifier]} y {name}')
        else: ids[identifier]=name
        if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._:-]*',str(identifier)): errors.append(f'{name}: ID inválido {identifier}')
        if not re.fullmatch(r'\d+\.\d+\.\d+',str(item.get('version',''))): errors.append(f'{identifier}: versión no semántica')
        source=str(item.get('source','')).split('#')[0]
        if not (ROOT/source).is_file(): errors.append(f'{identifier}: source no resuelve: {source}')

for name,data in manifests:
    for item in data.get('records',[]):
        for ref in item.get('references',[]):
            if ref.startswith('test:'): continue
            target=ref.split('#')[0]
            if '/' in target or Path(target).suffix:
                if not (ROOT/target).is_file(): errors.append(f"{item['id']}: referencia no resuelve: {ref}")
            elif target not in ids:
                errors.append(f"{item['id']}: concepto referido no existe: {ref}")

trace=next((d for n,d in manifests if n=='traceability.yaml'),{'records':[]})
if len(trace['records'])!=24: errors.append(f"trazabilidad esperaba 24 requisitos, encontró {len(trace['records'])}")
if errors:
    print('Fase 11 inválida:'); print('\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print(f'Fase 11 válida: {len(manifests)} manifiestos, {total} conceptos, IDs únicos y referencias resolubles.')
