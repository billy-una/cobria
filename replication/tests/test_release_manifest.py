import importlib.util
import json
from pathlib import Path
import tempfile
import subprocess
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/release_manifest.py'
spec = importlib.util.spec_from_file_location('release_manifest', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
CANONICAL = {'identity': {'ecosystemVersion': '1.0.0-rc2'}, 'release': {'tag': 'ecosistema-1.0.0-rc2', 'status': 'candidate-non-stable'}}


class ManifestTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='cobria-pc0-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'ejemplo.txt').write_text('contenido', encoding='utf-8')
        self.manifest = module.build(self.root, CANONICAL)

    def errors(self):
        return module.validate(self.root, self.manifest, CANONICAL)

    def test_valid_and_read_only(self):
        before = json.dumps(self.manifest, sort_keys=True)
        self.assertEqual(self.errors(), [])
        self.assertEqual(before, json.dumps(self.manifest, sort_keys=True))

    def test_omitted_entry(self):
        self.manifest['files'] = []
        self.assertTrue(any('sin manifestar' in x for x in self.errors()))

    def test_changed_file(self):
        (self.root / 'ejemplo.txt').write_text('distinto!', encoding='utf-8')
        self.assertTrue(any('huella' in x for x in self.errors()))

    def test_unexpected_file(self):
        (self.root / 'nuevo.txt').write_text('nuevo', encoding='utf-8')
        self.assertTrue(any('sin manifestar' in x for x in self.errors()))

    def test_missing_file(self):
        (self.root / 'ejemplo.txt').unlink()
        self.assertTrue(any('ausente' in x for x in self.errors()))

    def test_duplicate_entry(self):
        self.manifest['files'].append(dict(self.manifest['files'][0]))
        self.assertTrue(any('duplicada' in x for x in self.errors()))

    def test_unsafe_paths(self):
        for path in ['../fuera', '/tmp/fuera', 'a/../ejemplo.txt', './ejemplo.txt', 'a\\b', '']:
            with self.subTest(path=path):
                self.manifest['files'][0]['path'] = path
                self.assertTrue(any('ruta inválida' in x for x in self.errors()))

    def test_symbolic_link(self):
        (self.root / 'enlace').symlink_to(self.root / 'ejemplo.txt')
        with self.assertRaisesRegex(ValueError, 'enlace'):
            module.build(self.root, CANONICAL)
        self.assertTrue(self.errors())

    def test_secret_names_rejected(self):
        for name in ['.env', '.env.local', '.npmrc', '.netrc', 'credencial.pem', 'privada.key']:
            with self.subTest(name=name):
                target = self.root / name
                target.write_text('dato sintético', encoding='utf-8')
                with self.assertRaisesRegex(ValueError, 'sensible'):
                    module.build(self.root, CANONICAL)
                self.assertTrue(self.errors())
                target.unlink()

    def test_explicit_exclusions(self):
        for name in ['node_modules', 'dist', 'tmp', '__pycache__']:
            directory = self.root / name
            directory.mkdir()
            (directory / 'generado').write_text('ignorado', encoding='utf-8')
        self.assertEqual(self.errors(), [])

    def test_invalid_metadata(self):
        self.manifest['version'] = 'otra'
        self.assertTrue(self.errors())

    def test_manifest_not_self_hashed(self):
        (self.root / 'RELEASE-MANIFEST.json').write_text('{}', encoding='utf-8')
        self.assertEqual(self.errors(), [])

    def test_excluded_entry_cannot_be_manifested(self):
        self.manifest['files'].append({'path': 'dist/oculto', 'bytes': 0, 'sha256': '0' * 64})
        self.assertTrue(any('excluido' in x for x in self.errors()))

    def test_dangling_and_directory_links(self):
        target = self.root / 'enlace'
        for destination in [self.root / 'inexistente', self.root]:
            target.symlink_to(destination)
            self.assertTrue(self.errors())
            target.unlink()

    def test_make_verification_does_not_regenerate(self):
        repository = SCRIPT.parents[2]
        result = subprocess.run(['make', '-n', 'verificar-integridad-paquete'], cwd=repository, capture_output=True, text=True, check=True)
        self.assertIn('validate-release-manifest.py', result.stdout)
        self.assertNotIn('build-release-manifest.py', result.stdout)

    def test_ci_verifies_instead_of_rebaselining(self):
        source = (SCRIPT.parents[2] / '.github/workflows/ci.yml').read_text(encoding='utf-8')
        job = source.split('  package-integrity:', 1)[1].split('  infrastructure-config:', 1)[0]
        self.assertIn('make verificar-pc0', job)
        self.assertNotIn('build-release-manifest.py', job)


if __name__ == '__main__':
    unittest.main()
