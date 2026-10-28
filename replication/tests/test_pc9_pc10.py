import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location("pc9", Path(__file__).parents[1] / "scripts/prepare-pc9-pc10.py")
pc9 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pc9)


class HandoffTests(unittest.TestCase):
    def test_template_cannot_count_as_participation(self):
        template = json.loads((pc9.ROOT / "editorial/pc9/respuesta-plantilla.json").read_text())
        self.assertTrue(pc9.response_errors(template))
        template.update(type="human", independentWork=True)
        self.assertTrue(pc9.response_errors(template))

    def test_integrity_rejects_tampering_and_extra_files(self):
        for content, extra, valid in [(b"dato", False, True), (b"otro", False, False), (b"dato", True, False)]:
            with tempfile.TemporaryDirectory() as directory:
                target = Path(directory) / "test.zip"
                manifest = {"files": [{"path": "dato.txt", "bytes": 4, "sha256": pc9.sha(b"dato")}]}
                with zipfile.ZipFile(target, "w") as archive:
                    archive.writestr("MANIFEST.json", json.dumps(manifest))
                    archive.writestr("dato.txt", content)
                    if extra:
                        archive.writestr("extra.txt", "no autorizado")
                if valid:
                    pc9.verify_archive(target)
                else:
                    with self.assertRaises(ValueError):
                        pc9.verify_archive(target)

    def test_preregistered_tasks_are_not_participants(self):
        protocol = json.loads((pc9.ROOT / "editorial/pc9/protocolo.json").read_text())
        self.assertEqual(protocol["participantsCommitted"], 0)
        self.assertIsNone(protocol["preregistration"]["sampleSize"])
        self.assertEqual(len(protocol["tasks"]), 6)

    def test_forged_candidate_identity_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "test.zip"
            with zipfile.ZipFile(target, "w") as archive:
                archive.writestr("MANIFEST.json", json.dumps({"candidateDigest": "0" * 64, "files": []}))
            with self.assertRaises(ValueError):
                pc9.verify_archive(target)
