"""Regresión sin red: datos sintéticos, nunca evidencia de un despliegue real."""
from copy import deepcopy
import importlib.util
import json
from pathlib import Path
import sys
import subprocess
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch
from zipfile import ZipFile

SCRIPTS = Path(__file__).resolve().parents[1] / 'scripts'
sys.path.insert(0, str(SCRIPTS))
from public_release_gate import DOWNLOADS, TAG, audit, load_candidate, sha


def fixture(stage):
    entries, items, downloads = [], [], {}
    for key, (public, source) in DOWNLOADS.items():
        original = f'fuente sintética {key}'.encode()
        data = f'descarga optimizada sintética {key}'.encode()
        (stage / source).write_bytes(original)
        entries.append({'path': source, 'bytes': len(original), 'sha256': sha(original)})
        href = f'/downloads/{public}'
        downloads[href] = data
        items.append({'id': key, 'href': href, 'source': f'output/pdf/{source}',
                      'sourceBytes': len(original), 'sourceSha256': sha(original),
                      'bytes': len(data), 'sha256': sha(data)})
    manifest = {'release': TAG, 'items': items}
    site = stage / 'COBRIA-sitio-estatico.zip'
    with ZipFile(site, 'w') as archive:
        archive.writestr('sitio/client/downloads/manifest.json', json.dumps(manifest))
        for href, data in downloads.items():
            archive.writestr(f'sitio/client{href}', data)
    data = site.read_bytes()
    entries.append({'path': site.name, 'bytes': len(data), 'sha256': sha(data)})
    (stage / 'MANIFEST-SHA256.json').write_text(json.dumps({
        'release': TAG, 'published': False, 'commit': 'a' * 40, 'files': entries}))
    return load_candidate(stage)


class PublicGateTests(unittest.TestCase):
    def setUp(self):
        self.temporary = TemporaryDirectory(prefix='cobria-public-gate-test-')
        self.addCleanup(self.temporary.cleanup)
        self.stage = Path(self.temporary.name)
        self.candidate = fixture(self.stage)
        self.remote = deepcopy(self.candidate['manifest'])
        self.downloads = dict(self.candidate['downloads'])
        self.headers = {'content-security-policy': "default-src 'self'",
                        'strict-transport-security': 'max-age=31536000',
                        'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY'}
        self.calls = []
        self.download_type = 'application/pdf'

    def fetch(self, path, limit):
        self.calls.append(path)
        if path == '/downloads/manifest.json':
            return json.dumps(self.remote).encode(), {}
        if path in self.downloads:
            return self.downloads[path], {'content-type': self.download_type}
        return b'COBRIA', self.headers

    def test_accepts_exact_optimized_bytes_without_human_claims(self):
        report = audit(self.candidate, self.fetch)
        self.assertEqual(report['decision'], 'pass')
        self.assertFalse(report['officialPublicationAsserted'])
        self.assertFalse(report['humanValidationAsserted'])

    def test_missing_local_source_is_failure(self):
        (self.stage / DOWNLOADS['libro'][1]).unlink()
        with self.assertRaises(FileNotFoundError):
            load_candidate(self.stage)

    def test_tampered_local_source_is_failure(self):
        (self.stage / DOWNLOADS['libro'][1]).write_bytes(b'alterada')
        with self.assertRaises(ValueError):
            load_candidate(self.stage)

    def test_empty_local_manifest_is_failure(self):
        path = self.stage / 'MANIFEST-SHA256.json'
        data = json.loads(path.read_text())
        data['files'] = []
        path.write_text(json.dumps(data))
        with self.assertRaises(ValueError):
            load_candidate(self.stage)

    def test_rc1_is_rejected(self):
        self.remote['release'] = 'ecosistema-1.0.0-rc1'
        self.assertEqual(audit(self.candidate, self.fetch)['decision'], 'blocked')

    def test_server_cannot_replace_bytes_and_redeclare_hash(self):
        item = self.remote['items'][0]
        self.downloads[item['href']] = b'otra descarga'
        item['sha256'] = sha(b'otra descarga')
        self.assertEqual(audit(self.candidate, self.fetch)['decision'], 'blocked')

    def test_untrusted_href_is_never_requested(self):
        self.remote['items'][0]['href'] = 'https://example.invalid/private'
        self.assertEqual(audit(self.candidate, self.fetch)['decision'], 'blocked')
        self.assertTrue(all(path.startswith('/') and not path.startswith('//') for path in self.calls))

    def test_duplicate_items_are_rejected(self):
        self.remote['items'][-1] = self.remote['items'][0]
        self.assertEqual(audit(self.candidate, self.fetch)['decision'], 'blocked')

    def test_html_instead_of_pdf_is_rejected(self):
        self.download_type = 'text/html'
        self.assertEqual(audit(self.candidate, self.fetch)['decision'], 'blocked')

    def test_missing_security_header_is_rejected(self):
        del self.headers['content-security-policy']
        self.assertEqual(audit(self.candidate, self.fetch)['decision'], 'blocked')

    def test_network_failure_is_not_a_pass(self):
        def unavailable(path, limit):
            raise OSError('red no disponible')
        self.assertEqual(audit(self.candidate, unavailable)['decision'], 'blocked')

    def test_import_of_cli_does_not_start_network_or_write_report(self):
        spec = importlib.util.spec_from_file_location('public_gate_cli', SCRIPTS / 'audit-public-r9.py')
        module = importlib.util.module_from_spec(spec)
        with patch('subprocess.run', side_effect=AssertionError('Proceso durante import')):
            with patch('urllib.request.build_opener', side_effect=AssertionError('Red durante import')):
                spec.loader.exec_module(module)
        self.assertTrue(callable(module.main))

    def test_cli_rejects_invalid_package_before_creating_network_client(self):
        spec = importlib.util.spec_from_file_location('public_gate_cli_preflight', SCRIPTS / 'audit-public-r9.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        with patch.object(sys, 'argv', ['audit-public-r9.py']):
            with patch.object(module.subprocess, 'run', side_effect=subprocess.CalledProcessError(1, 'verificador')):
                with patch.object(module, 'build_opener') as opener:
                    with self.assertRaisesRegex(SystemExit, 'no se consultó la red'):
                        module.main()
                    opener.assert_not_called()


if __name__ == '__main__':
    unittest.main()
