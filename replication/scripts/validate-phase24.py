#!/usr/bin/env python3
"""Valida que la revisión semántica esté preparada sin simular participación humana."""
import hashlib, json, subprocess, tempfile, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]; BASE=ROOT/'specification/phase-24'; errors=[]
status=json.loads((BASE/'status.json').read_text())
expected={'state':'proposal-simulation-completed','officialStatus':'not-applicable','externalValidationClaimed':False,'reviewersRequired':2,'samples':3,'responsesExpected':6,'responsesReceived':6,'humanAttestations':6,'agreementComputed':True,'adjudicationCompleted':False}
for key,value in expected.items():
  if status.get(key)!=value: errors.append(f'estado indebido: {key}')
preflight=status.get('syntheticPreflight',{})
if preflight.get('responsesReceived')!=6 or preflight.get('acceptedAsHuman')!=0: errors.append('prepiloto sintético mal clasificado')
for name in ['README.md','INSTRUCCIONES-PARA-REVISORES.md','PROTOCOLO.md','RUBRICA.md','FORMULARIO-REVISION.md','CLAVE-COORDINACION.md','AUDITORIA-PREPILOTO-SINTETICO.md','review-response.schema.json']:
  if not (BASE/name).is_file(): errors.append(f'falta {name}')
agreement=json.loads((BASE/'responses/AGREEMENT.json').read_text())
manifest=json.loads((BASE/'responses/MANIFEST.json').read_text())
if len(manifest.get('responses',[]))!=6: errors.append('no hay seis respuestas ingresadas')
if agreement.get('global',{}).get('agreement')!=0.875 or agreement.get('global',{}).get('cohenKappa')!=0.771: errors.append('acuerdo publicado inconsistente')
if agreement.get('adjudicationRequired') is not True or len(agreement.get('global',{}).get('disagreements',[]))!=3: errors.append('desacuerdos no conservados')
with tempfile.TemporaryDirectory() as directory:
  target=Path(directory)/'package'
  run=subprocess.run(['node','replication/scripts/build-phase24-review-package.mjs','--salida',str(target)],cwd=ROOT,capture_output=True,text=True)
  if run.returncode: errors.append(run.stderr or run.stdout)
  else:
    manifest=json.loads((target/'MANIFEST-SHA256.json').read_text())
    if manifest.get('identityKeyExcluded') is not True or manifest.get('reviewersRequired')!=2: errors.append('paquete no conserva cegamiento parcial')
    if len(manifest.get('packets',[]))!=3: errors.append('paquete sin tres muestras')
    if (target/'CLAVE-COORDINACION.md').exists(): errors.append('el paquete filtró la clave de coordinación')
    for item in manifest.get('packets',[]):
      file=target/item['file']
      if hashlib.sha256(file.read_bytes()).hexdigest()!=item['sha256']: errors.append(f'huella inválida: {item["file"]}')
      packet=json.loads(file.read_text())
      if len(packet.get('contracts',[]))!=8: errors.append(f'muestra incompleta: {item["sample"]}')
      if any(row.get('decision') is not None for row in packet.get('contracts',[])): errors.append('el paquete simula decisiones humanas')
tests=subprocess.run(['node','--test','tests/phase24-semantic-review.test.mjs'],cwd=ROOT/'replication',capture_output=True,text=True)
if tests.returncode: errors.append(tests.stdout+tests.stderr)
roadmap=(ROOT/'manuales/11-estado-y-roadmap-integral.md').read_text(); site=(ROOT/'sitio/app/manual.tsx').read_text(); book=(ROOT/'libro-cobria/build-book.mjs').read_text()
if 'Fase 24 — Revisión semántica independiente' not in roadmap: errors.append('roadmap sin fase 24')
if 'Revisión semántica preparada' not in site: errors.append('sitio sin fase 24')
if 'La independencia no se simula' not in book: errors.append('libro sin fase 24')
if errors: print('Fase 24 inválida:\n'+'\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print('Fase 24 cerrada como simulación de propuesta: acuerdo 0,875, kappa 0,771 y cero validación oficial declarada.')
