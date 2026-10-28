"""Inventario exacto del árbol de réplica; no acredita autenticidad ni publicación."""
import hashlib
import os
from pathlib import PurePosixPath, Path

EXCLUDED_DIRS = {'node_modules', 'tmp', 'dist', '__pycache__', '.git'}
EXCLUDED_FILES = {'.DS_Store'}
MANIFEST_NAME = 'RELEASE-MANIFEST.json'
POLICY = 'replication-tree-v2'


def inventory(root):
    if root.is_symlink() or not root.is_dir():
        raise ValueError('raíz inválida o enlace simbólico')
    files = []

    def visit(directory):
        for entry in sorted(os.scandir(directory), key=lambda item: item.name):
            path = Path(entry.path)
            relative = path.relative_to(root).as_posix()
            if entry.is_symlink():
                raise ValueError(f'enlace simbólico rechazado: {relative}')
            name = entry.name
            if name.startswith('.env') or name in {'.npmrc', '.netrc'} or path.suffix.lower() in {'.pem', '.key', '.p12', '.pfx'}:
                raise ValueError(f'archivo sensible rechazado: {relative}')
            if entry.is_dir(follow_symlinks=False):
                if name not in EXCLUDED_DIRS and relative != 'resources':
                    visit(path)
            elif entry.is_file(follow_symlinks=False):
                if name in EXCLUDED_FILES or relative == MANIFEST_NAME:
                    continue
                content = path.read_bytes()
                files.append({'path': relative, 'bytes': len(content), 'sha256': hashlib.sha256(content).hexdigest()})
            else:
                raise ValueError(f'archivo especial rechazado: {relative}')

    visit(root)
    return sorted(files, key=lambda item: item['path'])


def build(root, canonical):
    return {'package': 'Paquete de reproducción COBRIA',
            'version': canonical['identity']['ecosystemVersion'],
            'release': canonical['release']['tag'], 'status': canonical['release']['status'],
            'proposalIndependent': True, 'manifestFormat': 'cobria-release-manifest-1',
            'inventoryPolicy': POLICY, 'scope': 'working-tree-not-immutable-release',
            'files': inventory(root)}


def validate(root, data, canonical):
    errors = []
    if not isinstance(data, dict):
        return ['manifiesto debe ser objeto']
    metadata = {'version': canonical['identity']['ecosystemVersion'],
                'release': canonical['release']['tag'], 'status': canonical['release']['status'],
                'manifestFormat': 'cobria-release-manifest-1', 'inventoryPolicy': POLICY,
                'scope': 'working-tree-not-immutable-release', 'proposalIndependent': True}
    for field, expected in metadata.items():
        if data.get(field) != expected:
            errors.append(f'metadato inválido: {field}')
    try:
        actual = {item['path']: item for item in inventory(root)}
    except (ValueError, OSError) as error:
        return errors + [str(error)]
    entries = data.get('files')
    if not isinstance(entries, list):
        return errors + ['files debe ser lista']
    paths = set()
    for entry in entries:
        if not isinstance(entry, dict):
            errors.append('entrada debe ser objeto')
            continue
        relative = entry.get('path')
        if (not isinstance(relative, str) or not relative or '\\' in relative or
                PurePosixPath(relative).is_absolute() or
                any(part in {'', '.', '..'} for part in relative.split('/'))):
            errors.append(f'ruta inválida: {relative!r}')
            continue
        if relative in paths:
            errors.append(f'ruta duplicada: {relative}')
        paths.add(relative)
        if relative not in actual:
            errors.append(f'archivo ausente o excluido: {relative}')
            continue
        if type(entry.get('bytes')) is not int or entry['bytes'] != actual[relative]['bytes']:
            errors.append(f'tamaño distinto: {relative}')
        if entry.get('sha256') != actual[relative]['sha256']:
            errors.append(f'huella distinta: {relative}')
    for missing in sorted(set(actual) - paths):
        errors.append(f'archivo sin manifestar: {missing}')
    return errors
