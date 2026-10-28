import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('candidate', Path(__file__).parents[1] / 'scripts/package-ecosystem-candidate.py')
candidate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(candidate)


class CandidateTests(unittest.TestCase):
    def test_rejects_unverified_or_published_builds(self):
        for record in [{}, {'status': 'aprobado-local', 'deterministicArtifacts': True, 'builds': [], 'published': False}]:
            with self.assertRaises(ValueError):
                candidate.validate_builds(record)

    def test_requires_matching_clean_inputs_and_two_builds(self):
        record = {'status': 'aprobado-local', 'deterministicArtifacts': True, 'snapshotCommit': 'a'*40, 'published': False,
                  'builds': [{'index': i, 'status': 'aprobado', 'cleanBeforeBuild': True,
                              'commit': 'a'*40, 'referenceAccessAllowed': False} for i in [1, 2]]}
        candidate.validate_builds(record)
        record['builds'][1]['commit'] = 'b'*40
        with self.assertRaises(ValueError):
            candidate.validate_builds(record)
