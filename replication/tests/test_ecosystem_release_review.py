"""Regresiones sintéticas; no representan revisiones humanas ni autorización."""
from copy import deepcopy
import json
from pathlib import Path
import sys
import subprocess
import tempfile
import unittest
import warnings
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from ecosystem_release_review import evaluate_controls, release_blockers, safe_name, sha, verify_archive


class ReleaseReviewTests(unittest.TestCase):
    def test_paths_reject_escape_and_platform_alias(self):
        for name in ['', '../fuera', '/fuera', 'a/../../fuera', 'a\\fuera']:
            self.assertFalse(safe_name(name))
        self.assertTrue(safe_name('sitio/dist/client/index.html'))

    def test_zip_rejects_alteration_and_duplicates(self):
        with tempfile.TemporaryDirectory() as temporary:
            archive = Path(temporary) / 'prueba.zip'
            with zipfile.ZipFile(archive, 'w') as handle:
                handle.writestr('MANIFEST.json', '{}')
                handle.writestr('../fuera', 'no extraer')
            receipt = {'sha256': sha(archive), 'bytes': archive.stat().st_size,
                       'published': False, 'publicationAuthorized': False}
            with self.assertRaisesRegex(ValueError, 'inseguras'):
                verify_archive(archive, receipt)
            receipt['sha256'] = '0' * 64
            with self.assertRaisesRegex(ValueError, 'difiere'):
                verify_archive(archive, receipt)
            with warnings.catch_warnings():
                warnings.simplefilter('ignore', UserWarning)
                with zipfile.ZipFile(archive, 'w') as handle:
                    handle.writestr('MANIFEST.json', '{}')
                    handle.writestr('MANIFEST.json', '{}')
            receipt.update(sha256=sha(archive), bytes=archive.stat().st_size)
            with self.assertRaisesRegex(ValueError, 'duplicadas'):
                verify_archive(archive, receipt)

    def test_archive_controls_are_not_just_green_flags(self):
        receipt = {'snapshotCommit': 'a' * 40}
        controls = {'CONSTRUCCIONES.json': {'status': 'aprobado-local', 'deterministicArtifacts': True},
                    'QA-WEB.json': {'status': 'aprobado-local', 'errors': []},
                    'DECISION.json': {'published': False, 'publicationAuthorized': False},
                    'FUENTES-MANIFEST.json': []}
        errors = evaluate_controls(receipt, controls)
        self.assertIn('dos-clones-no-acreditados', errors)
        self.assertIn('qa-no-aprobada', errors)
        self.assertIn('cobertura-accesibilidad-incompleta', errors)
        self.assertIn('qa-de-otra-instantanea', errors)

    def test_approval_cannot_be_transferred_between_candidates(self):
        policy = json.loads((Path(__file__).resolve().parents[2] / 'editorial/ecosistema-17-18/policy.json').read_text())
        receipt = {'sha256': 'a' * 64, 'snapshotCommit': 'b' * 40}
        audit = {'candidateSha256': 'c' * 64, 'snapshotCommit': 'b' * 40,
                 'automaticDecision': 'aprobada', 'automaticErrors': []}
        self.assertIn('auditoria-de-otra-candidata', release_blockers(audit, receipt, False, policy))
        audit['candidateSha256'] = receipt['sha256']
        blockers = release_blockers(audit, receipt, True, policy)
        self.assertIn('arbol-principal-sin-confirmar', blockers)
        self.assertIn('pendiente:revision-tecnica', blockers)
        self.assertIn('publicacion-no-autorizada', blockers)
        self.assertIn('etiqueta-estable-deshabilitada', blockers)

    def test_human_flags_do_not_replace_pending_evidence(self):
        policy = json.loads((Path(__file__).resolve().parents[2] / 'editorial/ecosistema-17-18/policy.json').read_text())
        receipt = {'sha256': 'a' * 64, 'snapshotCommit': 'b' * 40, 'type': 'human', 'independentWork': True}
        audit = {'candidateSha256': receipt['sha256'], 'snapshotCommit': receipt['snapshotCommit'],
                 'automaticDecision': 'aprobada', 'automaticErrors': [], 'humanReviewAsserted': True}
        blockers = release_blockers(audit, receipt, False, policy)
        for name in policy['humanGates']:
            self.assertIn('pendiente:' + name, blockers)

    def test_legacy_entry_point_retains_current_candidate(self):
        root = Path(__file__).resolve().parents[2]
        result = subprocess.run([sys.executable, str(root / 'replication/scripts/prepare-stable-release.py')],
                                cwd=root, capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 2)
        data = json.loads(result.stdout)
        canonical = json.loads((root / 'editorial/canonical.json').read_text())
        self.assertEqual(data['candidate'], canonical['release']['tag'])
        self.assertFalse(data['published'])
        self.assertFalse(data['tagCreated'])
        self.assertIn('contexto-de-candidata-y-auditoria-requerido', data['blockers'])


if __name__ == '__main__':
    unittest.main()
