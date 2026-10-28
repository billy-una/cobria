#!/usr/bin/env python3
"""Registra la verificación local de una candidata existente, sin reconstruirla."""
import argparse
from datetime import date
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True, help='carpeta del paquete R9 existente')
parser.add_argument('--date', required=True, help='fecha de la verificación, AAAA-MM-DD')
args = parser.parse_args()
date.fromisoformat(args.date)
base = Path(args.output).resolve()
subprocess.run([sys.executable, str(ROOT / 'replication/scripts/validate-remediation-r9.py'),
                '--output', str(base)], check=True, cwd=ROOT)
summary = json.loads((base / 'BUILD-SUMMARY.json').read_text())
stage = base / 'COBRIA-Ecosistema-1.0.0-rc2'
manifest_path = stage / 'MANIFEST-SHA256.json'
manifest = json.loads(manifest_path.read_text())
comparison_path = stage / 'COMPARACION-DOBLE-CONSTRUCCION.json'
comparison = json.loads(comparison_path.read_text())
commit = summary['commit']
if not all(item.get('commit') == commit for item in
           (manifest, comparison, comparison['first'], comparison['second'])):
    raise SystemExit('Los documentos del paquete no identifican el mismo commit')
archive = base / 'COBRIA-Ecosistema-1.0.0-rc2.zip'
with zipfile.ZipFile(archive) as package:
    if package.testzip() is not None:
        raise SystemExit('ZIP con un archivo corrupto')
    for item in stage.iterdir():
        if item.is_file():
            archived = package.read(f'{stage.name}/{item.name}')
            if archived != item.read_bytes():
                raise SystemExit(f'Contenido distinto dentro del ZIP: {item.name}')
receipt = {
    'schemaVersion': '1.0.0',
    'kind': 'automatic-local-verification-not-independent-review',
    'verifiedOn': args.date,
    'release': summary['release'],
    'candidateCommit': commit,
    'archive': {'path': archive.relative_to(ROOT).as_posix(),
                'bytes': archive.stat().st_size, 'sha256': summary['sha256']},
    'manifestSha256': hashlib.sha256(manifest_path.read_bytes()).hexdigest(),
    'comparisonSha256': hashlib.sha256(comparison_path.read_bytes()).hexdigest(),
    'builds': comparison['builds'],
    'decision': comparison['decision'],
    'referenceInputs': comparison['referenceInputs'],
    'published': False,
    'remoteCiVerified': False,
    'externalReplicationVerified': False,
    'humanReviewVerifiedByThisReceipt': False,
    'scope': 'Atestación local; el ZIP no contiene modificaciones posteriores a candidateCommit.',
}
target = ROOT / 'review' / f'RC2-LOCAL-{args.date}.json'
if target.exists():
    raise SystemExit('El registro ya existe; no se sobrescriben verificaciones anteriores')
target.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Registro automático local: {target.relative_to(ROOT)}')
