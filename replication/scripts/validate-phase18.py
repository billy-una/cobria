#!/usr/bin/env python3
import hashlib, json, subprocess, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PHASE = ROOT/'specification/phase-18'
errors = []
status = json.loads((PHASE/'status.json').read_text())
expected = {'P18-LOCAL','P18-REVIEW','P18-SCREENING','P18-TRANSFER','P18-REPLICATION','P18-SIGN','P18-DOI','P18-LICENSE'}
milestones = {item['id']: item for item in status.get('milestones', [])}
if set(milestones) != expected: errors.append('hitos de fase 18 incompletos')
if status.get('state') != 'prepared-not-externally-validated': errors.append('el estado excede la evidencia disponible')
for key in expected - {'P18-LOCAL','P18-LICENSE'}:
    if milestones.get(key, {}).get('status') in {'executed','complete','validated'}: errors.append(f'{key} no puede figurar ejecutado sin evidencia externa')

required = ['PROTOCOLO-REPLICA-EXTERNA.md','PROTOCOLO-REVISION-INDEPENDIENTE.md','PROTOCOLO-TRANSFERENCIA-HUMANA.md','CONSENTIMIENTO-BORRADOR.md','LISTA-PUBLICACION.md','review-response.schema.json','transfer-record.schema.json']
for name in required:
    if not (PHASE/name).exists(): errors.append(f'falta {name}')
if 'No usar para reclutar' not in (PHASE/'CONSENTIMIENTO-BORRADOR.md').read_text(): errors.append('el consentimiento no conserva advertencia ética')
if not (ROOT/'review/blind-article.tex').exists(): errors.append('falta fuente anonimizada')
if milestones['P18-LICENSE'].get('status') != 'executed' or not (ROOT/'LICENSES.md').exists(): errors.append('la licencia declarada no posee evidencia')

with tempfile.TemporaryDirectory() as directory:
    target = Path(directory)/'bundle'
    run = subprocess.run(['node', 'replication/scripts/build-phase18-package.mjs', '--salida', str(target)], cwd=ROOT, capture_output=True, text=True)
    if run.returncode: errors.append(f'falló paquete: {run.stderr.strip()}')
    else:
        manifest_path = target/'MANIFEST-SHA256.json'
        if not manifest_path.exists(): errors.append('paquete sin manifiesto')
        else:
            manifest = json.loads(manifest_path.read_text())
            if manifest.get('signed') is not False or manifest.get('doi') is not None: errors.append('el paquete simula firma o DOI')
            if manifest.get('dirty') not in {True, False, 'unknown'}: errors.append('el manifiesto no declara si el árbol de origen estaba sucio o si ese estado no está disponible')
            if manifest.get('phaseState') != status['state']: errors.append('estado de paquete inconsistente')
            if len(manifest.get('files', [])) < 25: errors.append('paquete de transferencia incompleto')
            for item in manifest.get('files', []):
                file = target/item['path']
                if not file.exists() or hashlib.sha256(file.read_bytes()).hexdigest() != item['sha256']: errors.append(f'huella inválida: {item["path"]}')
        smoke = subprocess.run(['make', 'verificar-fase-2', 'verificar-fase-3', 'verificar-fase-17'], cwd=target, capture_output=True, text=True)
        if smoke.returncode: errors.append(f'el paquete no reproduce sus gates documentales: {smoke.stderr.strip() or smoke.stdout.strip()}')

if errors:
    print('Fase 18 inválida:')
    for error in errors: print(f'- {error}')
    raise SystemExit(1)
print('Fase 18 preparada: paquete verificable, licencias declaradas y 6 hitos externos honestamente pendientes.')
