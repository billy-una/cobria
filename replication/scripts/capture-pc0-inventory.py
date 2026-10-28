"""Registra fuentes Git, clasificación y huellas locales sin crear una release."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT).decode('utf-8')


def fingerprint(relative):
    path = ROOT / relative
    if path.is_symlink():
        raise SystemExit(f'No se registra un artefacto enlazado: {relative}')
    return {'path': relative, 'exists': path.is_file(),
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None}


def category(path):
    if path.startswith(('archivo/', 'historical/')):
        return 'historico'
    if path.startswith('specification/'):
        return 'fuente-normativa-o-contrato'
    if path.startswith('replication/results/'):
        return 'evidencia-generada'
    if path.startswith(('editorial/generated/', 'sitio/public/', 'libro-cobria/generated/')) or path in {'editorial/curriculum.json', 'libro-cobria/index.html', 'libro-cobria/cuaderno.html', 'libro-cobria/anexo-tecnico.html', 'replication/RELEASE-MANIFEST.json'}:
        return 'derivado-o-recurso-publico-revisar-procedencia'
    if path.startswith(('manuales/', 'partes/', 'editorial/', 'review/')) or path.endswith(('.md', '.tex', '.bib')):
        return 'fuente-editorial-o-documentacion'
    return 'implementacion-prueba-recurso-o-configuracion'


paths = sorted(set(git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0')) - {''})
payload = {
    'kind': 'inventario-local-no-publicacion',
    'sourceCommit': git('rev-parse', 'HEAD').strip(),
    'workingTreeStatus': git('status', '--short'),
    'scope': 'rutas versionadas y nuevas no ignoradas; no enumera dependencias ni salidas ignoradas',
    'classificationLimit': 'Clasificación por ruta, no dictamen automático de autoridad o licencia.',
    'entries': [{'path': p, 'category': category(p)} for p in paths],
    'replicationManifest': fingerprint('replication/RELEASE-MANIFEST.json'),
    'frozenCore': fingerprint('specification/COBRIA-CORE-1.0.md'),
    'historicalRc2': fingerprint('output/release/ecosistema-1.0.0-rc2-20261017-intento03/COBRIA-Ecosistema-1.0.0-rc2.zip'),
    'published': False,
}
destination = ROOT / 'output/review/pc0'
destination.mkdir(parents=True, exist_ok=True)
target = destination / 'inventory.json'
if target.is_symlink():
    raise SystemExit('Destino enlazado rechazado')
target.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'sourceCommit': payload['sourceCommit'], 'entries': len(paths), 'manifestSha256': payload['replicationManifest']['sha256'], 'output': str(target)}))
