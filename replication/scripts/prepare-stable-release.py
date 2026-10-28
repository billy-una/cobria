#!/usr/bin/env python3
"""Retiene la versión estable: los estados históricos no autorizan una publicación."""
import argparse
import json
from pathlib import Path
import subprocess
from ecosystem_release_review import release_blockers, verify_archive

ROOT = Path(__file__).resolve().parents[2]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--candidate', type=Path)
    parser.add_argument('--audit', type=Path)
    args = parser.parse_args()
    canonical = json.loads((ROOT / 'editorial/canonical.json').read_text())
    policy = json.loads((ROOT / 'editorial/ecosistema-17-18/policy.json').read_text())
    status = json.loads((ROOT / 'specification/phase-18/status.json').read_text())
    required = {'P18-REVIEW', 'P18-SCREENING', 'P18-TRANSFER', 'P18-REPLICATION', 'P18-SIGN'}
    milestones = {item['id']: item for item in status.get('milestones', [])}
    pending = [{'id': key, 'status': milestones.get(key, {}).get('status', 'missing')}
               for key in sorted(required) if milestones.get(key, {}).get('status') != 'executed']
    blockers = ['contexto-de-candidata-y-auditoria-requerido']
    if args.candidate and args.audit:
        receipt = json.loads((args.candidate / 'RECIBO.json').read_text())
        verify_archive(args.candidate / 'COBRIA-candidata-interna-ecosistema-16.zip', receipt)
        audit = json.loads(args.audit.read_text())
        dirty = bool(subprocess.check_output(['git', 'status', '--porcelain'], cwd=ROOT))
        blockers = release_blockers(audit, receipt, dirty, policy)
    print(json.dumps({'state': 'stable-release-refused', 'candidate': canonical['release']['tag'],
                      'reason': 'human-or-external-gates-pending', 'pending': pending, 'blockers': blockers,
                      'instruction': 'Conserve la candidata; no cree la etiqueta estable.',
                      'published': False, 'tagCreated': False}, ensure_ascii=False, indent=2))
    return 2


if __name__ == '__main__':
    raise SystemExit(main())

