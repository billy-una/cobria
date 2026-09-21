#!/usr/bin/env python3
"""Valida catálogo, CLI e idempotencia de generadores fase 13."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[2]; BASE=ROOT/'specification/phase-13'; errors=[]
catalog=json.loads((BASE/'generators.json').read_text(encoding='utf-8'))
types=catalog.get('types',[])
if len(types)!=15 or len(types)!=len(set(types)): errors.append('se esperaban 15 tipos únicos')
if len(catalog.get('artifactsPerGeneration',[]))!=4: errors.append('cada generación debe declarar cuatro artefactos')
for name in ('MANUAL-DE-GENERADORES.md','PLANTILLA-DE-ACEPTACION.md'):
    if not (BASE/name).is_file(): errors.append(f'falta {name}')

cli=ROOT/'replication/src/cli.mjs'
with tempfile.TemporaryDirectory() as tmp:
    base=['node',str(cli),'generar','--tipo','entidad','--nombre','Observacion','--directorio',tmp,'--json']
    first=subprocess.run(base,cwd=ROOT,capture_output=True,text=True)
    second=subprocess.run(base,cwd=ROOT,capture_output=True,text=True)
    if first.returncode or json.loads(first.stdout).get('status')!='generated': errors.append('generación positiva falló')
    if second.returncode or json.loads(second.stdout).get('status')!='unchanged': errors.append('idempotencia CLI falló')
    generated=json.loads(first.stdout).get('created',[]) if first.stdout else []
    if len(generated)!=4 or any(not (Path(tmp)/x).is_file() for x in generated): errors.append('faltan artefactos físicos')
    invalid=subprocess.run(['node',str(cli),'generar','--tipo','entidad','--nombre','../../escape','--directorio',tmp,'--json'],cwd=ROOT,capture_output=True,text=True)
    if invalid.returncode!=2 or json.loads(invalid.stderr).get('code')!='CLI_GENERATOR_NAME_INVALID': errors.append('nombre adversarial no fue rechazado')
if not (ROOT/'replication/tests/phase13-generator.test.mjs').is_file(): errors.append('falta suite de generadores')
if errors:
    print('Fase 13 inválida:');print('\n'.join(f'- {x}' for x in errors));sys.exit(1)
print(f'Fase 13 válida: {len(types)} generadores, 4 artefactos por ejecución, idempotencia y no sobrescritura.')
