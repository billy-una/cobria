#!/usr/bin/env python3
"""Valida esquemas, CLI, ayuda, códigos y casos de fase 12."""
import json
from pathlib import Path
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[2]; BASE=ROOT/'specification/phase-12'; SCHEMAS=BASE/'schemas'
errors=[]
generated=subprocess.run([sys.executable,str(ROOT/'replication/scripts/generate-phase12-schemas.py'),'--check'],capture_output=True,text=True)
if generated.returncode: errors.append(generated.stdout.strip() or 'esquemas desactualizados')
names=['manifest','project','architecture','data-dictionary','nodes','functions','security','quality','environments','traceability']
for name in names:
    path=SCHEMAS/f'{name}.schema.json'
    if not path.is_file(): errors.append(f'falta esquema: {name}'); continue
    data=json.loads(path.read_text(encoding='utf-8'))
    if data.get('$schema')!='https://json-schema.org/draft/2020-12/schema' or not data.get('$id'): errors.append(f'{name}: metadatos JSON Schema inválidos')
base=json.loads((SCHEMAS/'manifest.schema.json').read_text(encoding='utf-8'))
if set(base.get('required',[]))!={'schemaVersion','manifestId','generatedFrom','records'}: errors.append('sobre base incompleto')

catalog=json.loads((BASE/'ERROR-CODES.json').read_text(encoding='utf-8'))
codes=[x.get('code') for x in catalog.get('codes',[])]
if len(codes)!=len(set(codes)) or any(not str(x).startswith('CLI_') for x in codes): errors.append('códigos CLI duplicados o inestables')
cli=ROOT/'replication/src/cli.mjs'
for command in ('init','validar','explicar','contexto','impacto','auditar','medir','verificar'):
    if command not in cli.read_text(encoding='utf-8'): errors.append(f'CLI no contiene {command}')

def run(args): return subprocess.run(['node',str(cli),*args],cwd=ROOT,capture_output=True,text=True)
help_result=run(['--ayuda'])
if help_result.returncode or 'COBRIA Toolkit' not in help_result.stdout: errors.append('ayuda española no funciona')
valid=run(['validar','--json'])
if valid.returncode or not json.loads(valid.stdout).get('ok'): errors.append('validación JSON positiva falló')
negative=run(['explicar','--id','NO-EXISTE','--json'])
if negative.returncode!=3 or json.loads(negative.stderr).get('code')!='CLI_CONCEPT_NOT_FOUND': errors.append('caso negativo o código de salida incorrecto')
if not (ROOT/'replication/tests/phase12-cli.test.mjs').is_file(): errors.append('falta suite CLI')
if errors:
    print('Fase 12 inválida:'); print('\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print(f'Fase 12 válida: {len(names)} esquemas, 8 comandos, {len(codes)} códigos estables y salidas humana/JSON.')
