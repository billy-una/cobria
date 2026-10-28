"""Revisión de un ZIP interno por huella y decisión conservadora sin publicar."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PurePosixPath
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[2]
POLICY = ROOT / 'editorial/ecosistema-17-18/policy.json'


def sha(path):
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest()


def safe_name(name):
    path = PurePosixPath(name)
    return bool(name) and not path.is_absolute() and '..' not in path.parts and '\\' not in name


def verify_archive(archive, receipt):
    if archive.is_symlink() or not archive.is_file():
        raise ValueError('El archivo no es un ZIP regular')
    if archive.stat().st_size != receipt.get('bytes') or sha(archive) != receipt.get('sha256'):
        raise ValueError('El ZIP difiere del recibo')
    if receipt.get('published') is not False or receipt.get('publicationAuthorized') is not False:
        raise ValueError('Se esperaba una candidata interna no autorizada')
    with zipfile.ZipFile(archive) as handle:
        members = handle.infolist()
        names = [item.filename for item in members]
        if (len(names) > 10000 or len(names) != len(set(names)) or
                any(not safe_name(name) for name in names) or
                sum(item.file_size for item in members) > 2 * 1024**3 or
                any(item.file_size > 512 * 1024**2 or (item.external_attr >> 16) & 0o170000 == 0o120000 for item in members)):
            raise ValueError('Entradas ZIP inseguras, duplicadas o excesivas')
        if handle.getinfo('MANIFEST.json').file_size > 8 * 1024**2:
            raise ValueError('Manifiesto excesivo')
        manifest = json.loads(handle.read('MANIFEST.json'))
        entries = manifest.get('files', [])
        paths = [item['path'] for item in entries]
        if (len(paths) != len(set(paths)) or set(names) != {'MANIFEST.json', *paths} or
                manifest.get('commit') != receipt.get('snapshotCommit') or manifest.get('published') is not False):
            raise ValueError('Inventario o identidad de ZIP divergentes')
        for item in entries:
            if handle.getinfo(item['path']).file_size != item['bytes']:
                raise ValueError('Tamaño divergente: ' + item['path'])
            value = hashlib.sha256()
            with handle.open(item['path']) as stream:
                for chunk in iter(lambda: stream.read(1024 * 1024), b''):
                    value.update(chunk)
            if value.hexdigest() != item['sha256']:
                raise ValueError('Huella divergente: ' + item['path'])
        required = {'fuentes.bundle', 'CONSTRUCCIONES.json', 'QA-WEB.json', 'DECISION.json',
                    'FUENTES-MANIFEST.json', 'SBOM.cdx.json', 'LICENSE', 'LICENSES.md', 'PROVENANCE.md', 'NOTICE'}
        if not required.issubset(paths):
            raise ValueError('Archivo sin componentes obligatorios de revisión')
        for name in required - {'fuentes.bundle'}:
            if handle.getinfo(name).file_size > 8 * 1024**2:
                raise ValueError('Documento de control excesivo')
        controls = {name: json.loads(handle.read(name)) for name in
                    ['CONSTRUCCIONES.json', 'QA-WEB.json', 'DECISION.json', 'FUENTES-MANIFEST.json', 'SBOM.cdx.json']}
    return manifest, controls


def evaluate_controls(receipt, controls):
    errors = []
    builds, qa, decision = [controls[name] for name in ['CONSTRUCCIONES.json', 'QA-WEB.json', 'DECISION.json']]
    commit = receipt['snapshotCommit']
    if builds.get('snapshotCommit') != commit or builds.get('status') != 'aprobado-local' or builds.get('deterministicArtifacts') is not True:
        errors.append('construcciones-no-acreditadas')
    items = builds.get('builds', [])
    if len(items) != 2 or any(item.get('commit') != commit or item.get('status') != 'aprobado' or
                              item.get('cleanBeforeBuild') is not True for item in items):
        errors.append('dos-clones-no-acreditados')
    if len(items) == 2 and (not items[0].get('artifacts') or items[0].get('artifacts') != items[1].get('artifacts')):
        errors.append('artefactos-no-equivalentes')
    if (qa.get('status') != 'aprobado-local' or qa.get('errors') != [] or
            not qa.get('checks') or any(item.get('ok') is not True for item in qa['checks'])):
        errors.append('qa-no-aprobada')
    policy = qa.get('policy', {})
    cases = {(item.get('width'), item.get('route')) for item in qa.get('axe', [])}
    expected = {(width, route) for width in [390, 1440] for route in
                ['/', '/comenzar', '/explorar', '/laboratorio', '/recursos', '/historia']}
    if cases != expected or any(item.get('violations') for item in qa.get('axe', [])) or policy.get('maximumAxeViolations') != 0:
        errors.append('cobertura-accesibilidad-incompleta')
    for category, minimum in {'accessibility': .95, 'seo': .9, 'best-practices': .9}.items():
        if qa.get('lighthouse', {}).get(category, 0) < minimum:
            errors.append('lighthouse-' + category)
    inventory = {item['path']: item['sha256'] for item in controls['FUENTES-MANIFEST.json']}
    if not qa.get('sourceInventory') or any(inventory.get('sitio/' + item['path']) != item['sha256'] for item in qa.get('sourceInventory', [])):
        errors.append('qa-de-otra-instantanea')
    if decision.get('snapshotCommit') != commit or decision.get('published') is not False or decision.get('publicationAuthorized') is not False:
        errors.append('decision-inconsistente')
    return errors


def verify_checkout(checkout, inventory):
    indexed = {item['path']: item for item in inventory}
    tracked = set(subprocess.check_output(['git', 'ls-files', '-z'], cwd=checkout).decode().rstrip('\0').split('\0'))
    if len(indexed) != len(inventory) or tracked != set(indexed):
        raise ValueError('Inventario del bundle divergente')
    for name, item in indexed.items():
        file = checkout / name
        if (not safe_name(name) or file.is_symlink() or not file.is_file() or
                checkout.resolve() not in file.resolve().parents or sha(file) != item['sha256']):
            raise ValueError('Fuente del bundle divergente: ' + name)


def release_blockers(audit, receipt, dirty, policy):
    blockers = []
    if (audit.get('candidateSha256') != receipt.get('sha256') or
            audit.get('snapshotCommit') != receipt.get('snapshotCommit')):
        blockers.append('auditoria-de-otra-candidata')
    if audit.get('automaticDecision') != 'aprobada' or audit.get('automaticErrors') != []:
        blockers.append('revision-automatica-no-aprobada')
    if audit.get('reviewPolicySha256') != sha(POLICY) or audit.get('reviewToolSha256') != sha(Path(__file__)):
        blockers.append('auditoria-de-otro-procedimiento')
    if dirty:
        blockers.append('arbol-principal-sin-confirmar')
    # Estos requisitos exigen recepción y evaluación humanas; ninguna bandera en el
    # recibo ni un estado histórico los convierte en evidencia de esta candidata.
    blockers += ['pendiente:' + item for item in policy['humanGates'] + policy['requiredProductionEvidence']]
    if policy.get('publicationAuthorized') is not True:
        blockers.append('publicacion-no-autorizada')
    if policy.get('stableTagCreationEnabled') is not True:
        blockers.append('etiqueta-estable-deshabilitada')
    return blockers


def review(stage, output, policy):
    receipt = json.loads((stage / 'RECIBO.json').read_text())
    archive = stage / 'COBRIA-candidata-interna-ecosistema-16.zip'
    output.mkdir(parents=True, exist_ok=False)
    result = {'kind': 'revision-automatizada-no-independiente', 'createdAt': datetime.now(timezone.utc).isoformat(),
              'reviewPolicySha256': sha(POLICY), 'reviewToolSha256': sha(Path(__file__)),
              'candidateSha256': receipt.get('sha256'), 'snapshotCommit': receipt.get('snapshotCommit'),
              'archive': str(archive), 'automaticErrors': [], 'dependencies': [], 'published': False,
              'humanReviewAsserted': False, 'humanPending': policy['humanGates']}
    result['coverage'] = ['integridad-del-ZIP', 'controles-de-construccion-y-QA-manifestados',
                          'restauracion-e-inventario-de-fuentes', 'avisos-npm-de-cuatro-bloqueos']
    result['limitations'] = ['No ejecuta de nuevo los experimentos ni la auditoría de navegador.',
                             'No inspecciona visualmente todas las páginas ni ejecuta corrección ortográfica integral.',
                             'No revisa derechos ni privacidad de toda la historia Git.',
                             'No es revisión independiente, certificación ni autorización de publicación.']
    try:
        manifest, controls = verify_archive(archive, receipt)
        result['verifiedEntries'] = len(manifest['files'])
        result['automaticErrors'] += evaluate_controls(receipt, controls)
        result['manualAccessibilityCases'] = [item for item in controls['QA-WEB.json'].get('axe', []) if item.get('incomplete')]
        result['performanceInformational'] = controls['QA-WEB.json'].get('lighthouse', {}).get('performance')
        with tempfile.TemporaryDirectory(prefix='cobria-review17-') as temporary:
            directory = Path(temporary)
            bundle = directory / 'fuentes.bundle'
            with zipfile.ZipFile(archive) as handle, handle.open('fuentes.bundle') as source, bundle.open('xb') as dest:
                for chunk in iter(lambda: source.read(1024 * 1024), b''):
                    dest.write(chunk)
            checkout = directory / 'fuentes'
            subprocess.run(['git', '-c', 'core.hooksPath=/dev/null', 'clone', '--quiet', str(bundle), str(checkout)], check=True, timeout=120)
            commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=checkout, text=True).strip()
            if commit != receipt['snapshotCommit'] or subprocess.check_output(['git', 'status', '--porcelain'], cwd=checkout):
                raise ValueError('El bundle no restaura la instantánea limpia')
            verify_checkout(checkout, controls['FUENTES-MANIFEST.json'])
            result['bundleRestored'] = True
            for project in policy['dependencyProjects']:
                run = subprocess.run(['npm', 'audit', '--package-lock-only', '--ignore-scripts', '--json'],
                                     cwd=checkout / project, capture_output=True, text=True, timeout=180)
                name = project.replace('/', '-')
                (output / (name + '.audit.json')).write_text(run.stdout)
                (output / (name + '.audit.stderr.log')).write_text(run.stderr)
                audit = json.loads(run.stdout)
                counts = audit.get('metadata', {}).get('vulnerabilities')
                valid = (run.returncode in (0, 1) and not audit.get('error') and isinstance(counts, dict) and
                         all(type(counts.get(level)) is int and counts[level] >= 0 for level in
                             ['info', 'low', 'moderate', 'high', 'critical', 'total']))
                blocked = not valid or any(counts.get(level, 0) > 0 for level in policy['blockingSeverities'])
                result['dependencies'].append({'project': project, 'lockSha256': sha(checkout / project / 'package-lock.json'),
                                               'exitCode': run.returncode, 'counts': counts, 'valid': valid, 'blocked': blocked,
                                               'scope': 'todas-las-dependencias-incluidas-desarrollo'})
                if blocked:
                    result['automaticErrors'].append('dependencias:' + project)
    except (OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError, zipfile.BadZipFile) as error:
        result['automaticErrors'].append(str(error))
    result['automaticDecision'] = 'rechazada' if result['automaticErrors'] else 'aprobada'
    result['stablePublicationDecision'] = 'retenida'
    target = output / 'REVISION.json'
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'report': str(target), 'automaticDecision': result['automaticDecision'], 'errors': result['automaticErrors']}, ensure_ascii=False))
    return 1 if result['automaticErrors'] else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['revisar', 'decidir'])
    parser.add_argument('--candidate', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--audit', type=Path)
    args = parser.parse_args()
    policy = json.loads(POLICY.read_text())
    if args.mode == 'revisar':
        return review(args.candidate, args.output, policy)
    receipt = json.loads((args.candidate / 'RECIBO.json').read_text())
    verify_archive(args.candidate / 'COBRIA-candidata-interna-ecosistema-16.zip', receipt)
    audit = json.loads(args.audit.read_text()) if args.audit else {}
    dirty = bool(subprocess.check_output(['git', 'status', '--porcelain'], cwd=ROOT))
    blockers = release_blockers(audit, receipt, dirty, policy)
    args.output.mkdir(parents=True, exist_ok=False)
    report = {'target': 'ecosistema-1.0.0', 'decision': 'publicacion-retenida', 'blockers': blockers,
              'candidateSha256': receipt['sha256'], 'snapshotCommit': receipt['snapshotCommit'],
              'published': False, 'tagCreated': False, 'humanValidationAsserted': False}
    (args.output / 'DECISION.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 2  # La herramienta prepara una decisión; nunca publica ni crea etiquetas.


if __name__ == '__main__':
    raise SystemExit(main())
