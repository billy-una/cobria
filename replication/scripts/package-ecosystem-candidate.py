"""Prepara una candidata interna desde dos construcciones verificadas; no publica."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import re
import tempfile
import zipfile
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for data in iter(lambda: stream.read(1024 * 1024), b''):
            value.update(data)
    return value.hexdigest()


def validate_builds(report):
    if (report.get('status') != 'aprobado-local' or report.get('deterministicArtifacts') is not True or
            len(report.get('builds', [])) != 2 or report.get('published') is not False):
        raise ValueError('Se requieren dos construcciones aprobadas, comparadas y no publicadas')
    if not re.fullmatch('[0-9a-f]{40}', report.get('snapshotCommit', '')):
        raise ValueError('SHA de instantánea inválido')
    for index, build in enumerate(report['builds'], 1):
        if (build.get('index') != index or build.get('status') != 'aprobado' or
                build.get('cleanBeforeBuild') is not True or build.get('commit') != report.get('snapshotCommit') or
                build.get('referenceAccessAllowed') is not False):
            raise ValueError('Identidad o límites de construcción inválidos')


def pdf_fingerprint(path):
    reader = PdfReader(path)
    texts = [' '.join((page.extract_text() or '').split()) for page in reader.pages]
    value = hashlib.sha256(json.dumps(texts, ensure_ascii=False).encode()).hexdigest()
    return {'pages': len(texts), 'textSha256': value, 'taggedStructure': '/StructTreeRoot' in reader.trailer['/Root']}


def main(report_path, qa_path=None):
    report = json.loads(report_path.read_text())
    validate_builds(report)
    directory = Path(report['directory'])
    if directory.is_symlink() or directory.resolve().parent != Path(tempfile.gettempdir()).resolve() or not directory.name.startswith('cobria-pc8-clean-'):
        raise ValueError('Directorio de construcción no admisible')
    source = directory / 'source'
    clones = [directory / 'clone-1', directory / 'clone-2']
    for checkout in [source, *clones]:
        commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=checkout, text=True).strip()
        if commit != report['snapshotCommit']:
            raise ValueError('El checkout no corresponde a la instantánea')
    inventory_file = report_path.parent / directory.name / 'source-inventory.json'
    inventory = json.loads(inventory_file.read_text())
    listed = subprocess.check_output(['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], cwd=ROOT).decode().split('\0')
    actual = {name for name in listed if name and not (name.startswith(('output/', 'build/')) or
              any(part in {'node_modules', '.git', '__pycache__', 'dist', '.wrangler'} for part in Path(name).parts)) and (ROOT / name).exists()}
    if actual != {item['path'] for item in inventory}:
        raise ValueError('El inventario fuente cambió desde la construcción')
    for item in inventory:
        relative = item['path']
        if Path(relative).is_absolute() or '..' in Path(relative).parts:
            raise ValueError('Ruta fuente inválida')
        file = ROOT / relative
        if file.is_symlink() or not file.is_file() or digest(file) != item['sha256']:
            raise ValueError('El árbol fuente cambió desde la construcción: ' + relative)
    if qa_path is None:
        qa_path = sorted((ROOT / 'output/review/ecosistema-15-16').glob('qa-*/resultado.json'))[-1]
    qa = json.loads(qa_path.read_text())
    if qa.get('status') != 'aprobado-local' or qa.get('published') is not False or not qa.get('sourceInventory'):
        raise ValueError('Falta QA aprobada con inventario de entradas')
    for item in qa['sourceInventory']:
        relative = Path(item['path'])
        if relative.is_absolute() or '..' in relative.parts or digest(source / 'sitio' / relative) != item['sha256']:
            raise ValueError('La entrada web difiere de la QA aprobada: ' + str(relative))
    for build, clone in zip(report['builds'], clones):
        for item in build['artifacts']:
            if digest(clone / item['path']) != item['sha256']:
                raise ValueError('Derivado de construcción alterado')
    products = json.loads((source / 'editorial/products.json').read_text())
    pdfs = [item['output'] for item in products['products'] if item['output'].endswith('.pdf')]
    comparisons = []
    for relative in pdfs:
        first, second = [pdf_fingerprint(clone / relative) for clone in clones]
        if first != second:
            raise ValueError('Contenido PDF divergente: ' + relative)
        comparisons.append({'path': relative, **first, 'binaryIdentityAsserted': False})
    output = ROOT / 'output/release/ecosistema-16-local' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    output.mkdir(parents=True, exist_ok=False)
    (output / 'FUENTES-MANIFEST.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n')
    (output / 'CONSTRUCCIONES.json').write_text(json.dumps({key: value for key, value in report.items() if key != 'directory'}, ensure_ascii=False, indent=2) + '\n')
    (output / 'QA-WEB.json').write_text(json.dumps(qa, ensure_ascii=False, indent=2) + '\n')
    bundle = output / 'fuentes.bundle'
    subprocess.run(['git', 'bundle', 'create', str(bundle), 'HEAD'], cwd=source, check=True)
    subprocess.run(['git', 'bundle', 'verify', str(bundle)], cwd=source, check=True, capture_output=True)
    with tempfile.TemporaryDirectory(prefix='cobria-bundle16-') as temporary:
        checkout = Path(temporary) / 'fuentes'
        subprocess.run(['git', 'clone', '--quiet', str(bundle), str(checkout)], check=True)
        restored = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=checkout, text=True).strip()
        if restored != report['snapshotCommit'] or subprocess.check_output(['git', 'status', '--porcelain'], cwd=checkout):
            raise ValueError('El bundle no reconstruye el commit limpio esperado')
    components = []
    for project in ['replication', 'sitio', 'libro-cobria', 'replication/qa']:
        lock = json.loads((source / project / 'package-lock.json').read_text())
        for name, data in lock['packages'].items():
            if not name:
                continue
            components.append({'type': 'library', 'bom-ref': project + ':' + name,
                               'name': name.split('node_modules/')[-1], 'version': data.get('version', 'no-declarada'),
                               'properties': [{'name': 'cobria:proyecto', 'value': project}]})
    sbom = {'bomFormat': 'CycloneDX', 'specVersion': '1.5', 'version': 1, 'components': components}
    (output / 'SBOM.cdx.json').write_text(json.dumps(sbom, ensure_ascii=False, indent=2) + '\n')
    notes = '''# Candidata interna de inspección COBRIA

No es una release publicada ni reemplaza RC2. El commit de fuentes es una instantánea
de herramienta, no un commit aprobado del repositorio principal. No hay firma humana.
El bundle conserva historia Git necesaria para las puertas de construcción: requiere
revisión de privacidad y licencias antes de compartirlo. No redistribuya automáticamente.

Extraiga el ZIP en una carpeta nueva. Para reconstruir desde las fuentes:

    git clone fuentes.bundle cobria
    cd cobria
    npm ci --prefix replication
    npm ci --prefix sitio
    npm ci --prefix libro-cobria
    make construir-publico

Necesita además Python y requirements-build.txt, LaTeX/Biber, Java, Go, Poppler y el
navegador Chromium de Playwright. Lea README.md y la CI pública de ese commit para las
dependencias de sistema. Los repositorios de referencia no se necesitan para esa puerta.
Las puertas humanas, CI remota y el commit final continúan pendientes. Los PDF se
comparan por páginas y texto; no se promete identidad binaria ni igualdad visual total.
El SBOM inventaría paquetes bloqueados; no equivale a auditoría de vulnerabilidades
ni demuestra por sí solo conformidad de licencias. Los activos de terceros conservan
sus licencias y procedencia. El sitio construido es una salida local, no un despliegue.
'''
    (output / 'LEAME.md').write_text(notes)
    decision = {'kind': 'candidata-interna-no-publicable', 'snapshotCommit': report['snapshotCommit'],
                'originalHead': report['sourceHead'], 'workingTreeCleanAtSnapshot': report['sourceWorkingTreeClean'],
                'equivalentBuilds': 2, 'pdfComparisons': comparisons, 'published': False,
                'bundleCloneVerified': True,
                'remoteCiVerified': False, 'publicationAuthorized': False, 'privacyReviewOfHistory': False,
                'blockers': ['Commit final aprobado del repositorio principal', 'CI remota de ese SHA',
                             'Revisión de privacidad y licencias del archivo y su historia',
                             'Puertas científicas, humanas y editoriales pendientes', 'Autorización de publicación']}
    (output / 'DECISION.json').write_text(json.dumps(decision, ensure_ascii=False, indent=2) + '\n')
    files = {file.name: file for file in output.iterdir() if file.is_file()}
    for relative in ['LICENSE', 'LICENSES.md', 'PROVENANCE.md', 'NOTICE', 'editorial/generated/ecosistema-13-14/trazabilidad.csv']:
        files[relative] = source / relative
    for relative in pdfs:
        files[relative] = clones[0] / relative
    for file in (clones[0] / 'sitio/dist').rglob('*'):
        if file.is_symlink():
            raise ValueError('Enlace en distribución web')
        if file.is_file():
            files[file.relative_to(clones[0]).as_posix()] = file
    manifest = {'kind': 'inventario-de-candidata-interna', 'commit': report['snapshotCommit'],
                'published': False, 'files': [{'path': name, 'bytes': file.stat().st_size, 'sha256': digest(file)}
                                            for name, file in sorted(files.items())]}
    archive = output / 'COBRIA-candidata-interna-ecosistema-16.zip'
    with zipfile.ZipFile(archive, 'x', zipfile.ZIP_DEFLATED) as handle:
        for name, file in sorted(files.items()):
            handle.write(file, name)
        handle.writestr('MANIFEST.json', json.dumps(manifest, ensure_ascii=False, indent=2))
    with zipfile.ZipFile(archive) as handle:
        if set(handle.namelist()) != {'MANIFEST.json', *files}:
            raise ValueError('Inventario ZIP divergente')
        for item in manifest['files']:
            value = hashlib.sha256()
            with handle.open(item['path']) as stream:
                for data in iter(lambda: stream.read(1024 * 1024), b''):
                    value.update(data)
            if value.hexdigest() != item['sha256']:
                raise ValueError('Bytes ZIP divergentes')
    receipt = {'archive': str(archive.relative_to(ROOT)), 'bytes': archive.stat().st_size,
               'sha256': digest(archive), **decision}
    (output / 'RECIBO.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(receipt, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build-report', type=Path, default=ROOT / 'output/review/pc8/clean-builds.json')
    parser.add_argument('--qa-report', type=Path)
    args = parser.parse_args()
    main(args.build_report, args.qa_report)
