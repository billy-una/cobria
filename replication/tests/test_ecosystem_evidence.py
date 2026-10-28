import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('evidence', Path(__file__).parents[1] / 'scripts/build-ecosystem-evidence.py')
evidence = importlib.util.module_from_spec(spec)
spec.loader.exec_module(evidence)


class EvidenceTests(unittest.TestCase):
    def test_historical_data_are_not_promoted_to_new_results(self):
        result = evidence.build()
        self.assertEqual(result['historicalR7']['observations'], 270)
        self.assertIsNone(result['pc3']['observations'])
        self.assertFalse(result['humanReviewVerified'])
        self.assertEqual({row['family'] for row in result['rows']}, {'P1', 'P2', 'R1', 'S1', 'A1'})

    def test_altered_evidence_is_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'raw.jsonl'
            target.write_text('dato modificado')
            with self.assertRaises(ValueError):
                evidence.verified_bytes(target, '0' * 64)
