#!/usr/bin/env python3
"""Valida calidad, observabilidad y evidencia explícita de fase 9."""
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'specification/phase-9'
quality = json.loads((BASE/'quality.json').read_text(encoding='utf-8'))
observability = json.loads((BASE/'observability.json').read_text(encoding='utf-8'))
errors=[]

requirements=set(re.findall(r'^### (ECO-R(?:F|NF)-\d{3})', (ROOT/'specification/phase-2/REQUISITOS-ECOSISTEMA.md').read_text(encoding='utf-8'), re.M))
evidence=quality.get('requirementEvidence', [])
evidence_ids={item.get('id') for item in evidence}
if evidence_ids != requirements: errors.append(f'trazabilidad de requisitos difiere: faltan {sorted(requirements-evidence_ids)}, sobran {sorted(evidence_ids-requirements)}')
allowed=set(quality.get('allowedStatuses', []))
for item in evidence:
    if not item.get('test') or item.get('status') not in allowed: errors.append(f"evidencia inválida: {item.get('id')}")

types={item.get('id') for item in quality.get('testTypes', [])}
expected={'unit','contract','integration','emulator','real-engine','e2e','accessibility','security','performance','resilience','migration','smoke'}
if types != expected: errors.append(f'tipos de prueba incompletos: {sorted(expected-types)}')
for policy in quality.get('changePolicies', []):
    if not policy.get('change') or not policy.get('required'): errors.append('política de cambio vacía')

schema=observability.get('logSchema', {})
for key in ('required','forbidden'):
    if not schema.get(key): errors.append(f'esquema de log sin {key}')
for service in observability.get('services', []):
    for key in ('owner','health','degradation','recovery','runbook'):
        if not service.get(key): errors.append(f"{service.get('id')}: falta {key}")
for alert in observability.get('alerts', []):
    for key in ('condition','severity','owner','runbook'):
        if not alert.get(key): errors.append(f"{alert.get('id')}: falta {key}")
for slo in observability.get('slos', []):
    if 'not-production-validated' not in slo.get('status',''): errors.append(f"{slo.get('id')}: SLO sin estado epistémico")

for name in ('MANUAL-DE-CALIDAD.md','OBSERVABILIDAD-SLO-Y-ALERTAS.md','EVIDENCIA-POSENTREGA.md','deployment-evidence.schema.json'):
    if not (BASE/name).is_file(): errors.append(f'falta documento: {name}')

with tempfile.TemporaryDirectory() as tmp:
    out=Path(tmp)/'evidence.json'; sha='a'*40
    cmd=[sys.executable,str(ROOT/'replication/scripts/capture-delivery-evidence.py'),'--environment','preview','--revision',sha,'--artifact',f'git:{sha}','--output',str(out)]
    result=subprocess.run(cmd,capture_output=True,text=True)
    if result.returncode: errors.append('no se pudo generar evidencia de entrega')
    else:
        generated=json.loads(out.read_text(encoding='utf-8'))
        if generated.get('status')!='gate-only' or generated.get('smoke')!=[] or not generated.get('limitations'): errors.append('evidencia gate-only exagera lo ejecutado')

workflow=(ROOT/'.github/workflows/delivery-gates.yml').read_text(encoding='utf-8')
if 'capture-delivery-evidence.py' not in workflow: errors.append('pipeline no genera evidencia')
if errors:
    print('Fase 9 inválida:'); print('\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print(f"Fase 9 válida: {len(requirements)} requisitos trazados, {len(types)} tipos de prueba, {len(observability['slis'])} SLI y {len(observability['alerts'])} alertas.")
