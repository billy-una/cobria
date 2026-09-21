#!/usr/bin/env python3
"""Ejecuta y valida el laboratorio COBRIA Engineering."""
import json
from pathlib import Path
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'specification/phase-20'
LAB=ROOT/'replication/examples/engineering-lab'
errors=[]
status=json.loads((BASE/'status.json').read_text(encoding='utf-8'))
expected={f'ENG-{i:03d}' for i in range(1,9)}
if set(status.get('contractsCovered',[])) != expected: errors.append('cobertura ENG incompleta')
if status.get('state') != 'executed-local-not-production-validated': errors.append('estado experimental incorrecto')
if status.get('tests') != 9: errors.append('recuento esperado de pruebas incorrecto')
package=json.loads((LAB/'package.json').read_text(encoding='utf-8'))
if package.get('dependencies') or package.get('devDependencies'): errors.append('el laboratorio debe permanecer sin dependencias externas')
for name in ('estado-operativo.mjs','autoridad-transaccional.mjs','offline-governado.mjs','release-gate.mjs','telemetria-privada.mjs','legado-verificable.mjs'):
    if not (LAB/'src'/name).is_file(): errors.append(f'falta {name}')
run=subprocess.run(['npm','test'],cwd=LAB,capture_output=True,text=True)
if run.returncode: errors.append(run.stdout+run.stderr)
elif '# pass 9' not in run.stdout and 'pass 9' not in run.stdout: errors.append('no se observaron nueve pruebas aprobadas')
roadmap=(ROOT/'manuales/11-estado-y-roadmap-integral.md').read_text(encoding='utf-8')
if 'Fase 20 — Laboratorio COBRIA Engineering' not in roadmap: errors.append('roadmap sin fase 20')
site=(ROOT/'sitio/app/manual.tsx').read_text(encoding='utf-8')
if 'make verificar-fase-20' not in site: errors.append('sitio sin laboratorio ejecutable')
if errors:
    print('Fase 20 inválida:'); print('\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print('Fase 20 válida: 9 pruebas, 8 contratos cubiertos y laboratorio neutral sin dependencias externas.')
