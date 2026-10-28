"""Empaqueta y prueba una réplica funcional acotada; no ejecuta motores remotos."""
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[2]
folder = ROOT / 'output/review/ecosistema-13-14' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
folder.mkdir(parents=True, exist_ok=False)
selected = {'replication/protocol/pc2-freeze-v1.json', 'replication/protocol/pc2-analysis-freeze-01.json',
            'replication/package.json', 'LICENSE', 'LICENSES.md', 'replication/LICENSE',
            'replication/src/pc3/analysis.mjs', 'replication/tests/pc3-analysis.test.mjs'}
for name in ['pc2-freeze-v1.json', 'pc2-analysis-freeze-01.json']:
    manifest = json.loads((ROOT / 'replication/protocol' / name).read_text())
    for relative, digest in manifest['files'].items():
        if hashlib.sha256((ROOT / relative).read_bytes()).hexdigest() != digest:
            raise SystemExit('Congelamiento alterado: ' + relative)
        selected.add(relative)
instructions = '''# Réplica funcional local COBRIA

Este subconjunto conserva los contratos congelados PC2 y el analizador PC3.
No contiene corridas nuevas, no es la distribución completa y no ejecuta make verificar.
Necesita Node 22.13 o superior, npm, conectividad al registro y herramientas nativas
si la dependencia PouchDB las requiere. La prueba registrada usa el equipo del autor.

Desde la carpeta extraída:

    npm ci --prefix replication
    node replication/scripts/freeze-pc2.mjs --check
    node replication/scripts/check-pc2-analysis.mjs --check
    node --test replication/tests/pc2-contracts.test.mjs replication/tests/pc2-analysis.test.mjs replication/tests/pc3-analysis.test.mjs

Las pruebas usan directorios temporales propios y almacenamiento local. No usan
credenciales ni acceden a servicios remotos. No ejecute --freeze: los congelamientos
se conservan. La suite pc2-freeze.test.mjs queda incluida como entrada congelada,
pero no forma parte del comando: su caso de no sobrescritura presupone historia Git.
La salida esperada es cero fallos, no una mejora de rendimiento. Guarde ambiente,
comandos y registros completos, incluidos errores. Un equipo distinto debe repetir
el recorrido antes de hablar de réplica externa. Consentimientos y datos personales
no pertenecen al paquete. Las pruebas sintéticas de estadística no son mediciones.
'''
payload = {'LEAME.md': instructions.encode()}
for relative in sorted(selected):
    p = ROOT / relative
    if any(parent.is_symlink() for parent in [p, *p.parents]) or not p.is_file():
        raise SystemExit('Entrada no regular: ' + relative)
    payload[relative] = p.read_bytes()
manifest = {'kind': 'replica-funcional-local-no-experimento-remoto', 'published': False,
            'externalReplicationVerified': False, 'files': [
                {'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                for name, data in sorted(payload.items())]}
archive = folder / 'COBRIA-replica-funcional-ecosistema-13.zip'
with zipfile.ZipFile(archive, 'x', zipfile.ZIP_DEFLATED) as handle:
    for name, data in payload.items():
        handle.writestr(name, data)
    handle.writestr('MANIFEST.json', json.dumps(manifest, ensure_ascii=False, indent=2))
commands = [['npm', 'ci', '--prefix', 'replication'],
            ['node', 'replication/scripts/freeze-pc2.mjs', '--check'],
            ['node', 'replication/scripts/check-pc2-analysis.mjs', '--check'],
            ['node', '--test', 'replication/tests/pc2-contracts.test.mjs', 'replication/tests/pc2-analysis.test.mjs', 'replication/tests/pc3-analysis.test.mjs']]
receipt = {'archive': str(archive.relative_to(ROOT)), 'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
           'kind': 'extraccion-nueva-local-no-replica-externa', 'steps': [], 'status': 'pendiente',
           'externalReplicationVerified': False, 'published': False}
with tempfile.TemporaryDirectory(prefix='cobria-replica13-') as temporary:
    with zipfile.ZipFile(archive) as handle:
        # Solo extrae el ZIP recién creado por este proceso, no un archivo externo.
        handle.extractall(temporary)
    for index, command in enumerate(commands, 1):
        with (folder / f'paso-{index}.log').open('w') as log:
            try:
                result = subprocess.run(command, cwd=temporary, stdout=log, stderr=subprocess.STDOUT, timeout=180)
                code = result.returncode
            except subprocess.TimeoutExpired:
                code = 124
        receipt['steps'].append({'command': command, 'exit': code})
        if code:
            receipt['status'] = 'fallido'
            break
    else:
        receipt['status'] = 'aprobado-local'
(folder / 'replica.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(receipt, ensure_ascii=False, indent=2))
raise SystemExit(0 if receipt['status'] == 'aprobado-local' else 1)
