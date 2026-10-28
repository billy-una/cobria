"""Compara el sitio con bytes locales manifestados; no acredita revisión humana."""
import hashlib
from io import BytesIO
import json
from pathlib import Path
from zipfile import ZipFile

TAG = 'ecosistema-1.0.0-rc2'
DOWNLOADS = {
    'libro': ('COBRIA-libro-web.pdf', 'COBRIA-ecosistema-manual-completo.pdf'),
    'cuaderno': ('COBRIA-cuaderno.pdf', 'COBRIA-cuaderno-de-trabajo.pdf'),
    'anexo': ('COBRIA-anexo-tecnico.pdf', 'COBRIA-anexo-tecnico.pdf'),
    'articulo': ('COBRIA-articulo.pdf', 'COBRIA-articulo-cientifico-actualizado.pdf'),
    'maestro': ('COBRIA-documento-maestro.pdf', 'COBRIA-documento-maestro-ecosistema.pdf'),
    'especificacion': ('COBRIA-especificacion.pdf', 'COBRIA-especificacion-ecosistema-1.0.pdf'),
}
ROUTES = ('/', '/fundamentos', '/explorar', '/laboratorio', '/recursos', '/evidencia')


def sha(data):
    return hashlib.sha256(data).hexdigest()


def load_candidate(stage: Path):
    manifest = json.loads((stage / 'MANIFEST-SHA256.json').read_text(encoding='utf-8'))
    if manifest.get('release') != TAG or manifest.get('published') is not False:
        raise ValueError('Identidad o estado local incorrectos')
    entries = manifest['files']
    if not entries or len({x['path'] for x in entries}) != len(entries):
        raise ValueError('Manifiesto local vacío o con duplicados')
    indexed = {item['path']: item for item in entries}
    if any(Path(name).name != name or '\\' in name for name in indexed):
        raise ValueError('Ruta no permitida en el manifiesto local')

    def verified(name):
        item = indexed[name]
        target = stage / name
        if target.is_symlink():
            raise ValueError(f'Enlace no permitido: {name}')
        data = target.read_bytes()
        if len(data) != item['bytes'] or sha(data) != item['sha256']:
            raise ValueError(f'Archivo local alterado: {name}')
        return data

    with ZipFile(BytesIO(verified('COBRIA-sitio-estatico.zip'))) as archive:
        def member(name, limit):
            if archive.namelist().count(name) != 1 or archive.getinfo(name).file_size > limit:
                raise ValueError(f'Entrada ausente, duplicada o excesiva: {name}')
            return archive.read(name)
        expected = json.loads(member('sitio/client/downloads/manifest.json', 2 * 1024**2))
        items = expected.get('items', [])
        if (expected.get('release') != TAG or len(items) != 6 or
                {item.get('id') for item in items} != set(DOWNLOADS)):
            raise ValueError('El sitio empaquetado no identifica las seis descargas RC2')
        downloads = {}
        for item in items:
            public_name, source_name = DOWNLOADS[item['id']]
            href = f'/downloads/{public_name}'
            if item.get('href') != href or item.get('source') != f'output/pdf/{source_name}':
                raise ValueError('Ruta de descarga o fuente no canónica')
            original = verified(source_name)
            if sha(original) != item.get('sourceSha256') or len(original) != item.get('sourceBytes'):
                raise ValueError(f'Fuente no coincidente: {item["id"]}')
            data = member(f'sitio/client{href}', 64 * 1024**2)
            if sha(data) != item.get('sha256') or len(data) != item.get('bytes'):
                raise ValueError(f'Descarga empaquetada no coincidente: {item["id"]}')
            downloads[href] = data
    return {'manifest': expected, 'downloads': downloads, 'commit': manifest['commit']}


def audit(candidate, fetch):
    """fetch(ruta, límite) devuelve bytes y cabeceras; las pruebas no usan red."""
    errors = []
    for route in ROUTES:
        try:
            body, headers = fetch(route, 2 * 1024**2)
            if not body or b'COBRIA' not in body:
                errors.append(f'Ruta pública incompleta: {route}')
            if route == '/':
                headers = {k.lower(): v for k, v in headers.items()}
                for name in ('content-security-policy', 'strict-transport-security', 'x-content-type-options', 'x-frame-options'):
                    if not headers.get(name):
                        errors.append(f'Falta encabezado público: {name}')
                if headers.get('x-content-type-options', '').lower() != 'nosniff':
                    errors.append('X-Content-Type-Options no declara nosniff')
                if headers.get('x-frame-options', '').upper() not in ('DENY', 'SAMEORIGIN'):
                    errors.append('X-Frame-Options no restringe marcos')
        except (OSError, ValueError) as error:
            errors.append(f'Ruta pública inaccesible {route}: {error}')
    try:
        data, _ = fetch('/downloads/manifest.json', 2 * 1024**2)
        if json.loads(data) != candidate['manifest']:
            errors.append('El manifiesto público difiere del sitio empaquetado aprobado')
        for href, expected in candidate['downloads'].items():
            data, headers = fetch(href, len(expected))
            if data != expected:
                errors.append(f'Bytes de descarga distintos: {href}')
            content_type = {k.lower(): v for k, v in headers.items()}.get('content-type', '')
            if content_type.split(';')[0].strip().lower() != 'application/pdf':
                errors.append(f'Tipo de descarga incorrecto: {href}')
    except (OSError, ValueError) as error:
        errors.append(f'No se pudo auditar las descargas: {error}')
    return {'schemaVersion': '1.0.0', 'release': TAG,
            'candidateCommit': candidate['commit'],
            'decision': 'blocked' if errors else 'pass', 'automaticBlockers': errors,
            'officialPublicationAsserted': False, 'humanValidationAsserted': False}
