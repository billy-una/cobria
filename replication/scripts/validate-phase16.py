#!/usr/bin/env python3
import json, subprocess, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PHASE = ROOT/'specification/phase-16'
errors = []
agent_files = [ROOT/'AGENTS.md', ROOT/'specification/AGENTS.md', ROOT/'replication/AGENTS.md', ROOT/'replication/examples/ecosistema-app/AGENTS.md', ROOT/'sitio/AGENTS.md', ROOT/'libro-cobria/AGENTS.md']
for file in agent_files:
    if not file.exists() or len(file.read_text().strip()) < 80: errors.append(f'instrucciones ausentes o vacías: {file.relative_to(ROOT)}')

policy = json.loads((PHASE/'agent-policy.json').read_text())
if len(policy.get('invariants', [])) < 5: errors.append('faltan invariantes del agente')
if set(policy.get('commands', {})) != {'readOnly', 'verification', 'generatedWrites', 'humanOnly'}: errors.append('clasificación de comandos incompleta')
if len(policy.get('protectedPaths', [])) < 4: errors.append('rutas protegidas insuficientes')
if set(policy.get('changeContract', [])) != {'objective','scope','authority','files','invariants','tests','risks','humanPending'}: errors.append('contrato de cambio incompleto')

with tempfile.TemporaryDirectory() as directory:
    output = Path(directory)/'context.json'
    run = subprocess.run(['node', str(ROOT/'replication/scripts/generate-agent-context.mjs'), '--salida', str(output)], cwd=ROOT, capture_output=True, text=True)
    if run.returncode: errors.append(f'no se generó contexto: {run.stderr.strip()}')
    elif not output.exists(): errors.append('el generador no produjo salida')
    else:
        context = json.loads(output.read_text())
        if context.get('task', {}).get('id') != 'CHANGE-001': errors.append('contexto sin tarea esperada')
        if len(context.get('instructions', [])) < 3: errors.append('contexto sin instrucciones jerárquicas')

required = ['MANUAL-PARA-AGENTES-IA.md','MAPA-DE-FLUJO-DEL-CAMBIO.md','PROMPT-BASE-DE-CAMBIO.md']
for name in required:
    if not (PHASE/name).exists(): errors.append(f'falta {name}')

if errors:
    print('Fase 16 inválida:')
    for error in errors: print(f'- {error}')
    raise SystemExit(1)
print(f'Fase 16 válida: {len(agent_files)} instrucciones jerárquicas, {len(policy["invariants"])} invariantes y contexto portátil verificable.')
