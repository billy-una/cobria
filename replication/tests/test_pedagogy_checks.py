import json
import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from pedagogy_checks import require_modules


class PedagogicalBindingTests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory(prefix="cobria-pedagogy-fixture-")
        self.root = Path(self.folder.name)
        self.addCleanup(self.folder.cleanup)
        lesson = {field: "ejemplo" for field in ("title", "situation", "simple", "example", "mistake", "evidence", "code")}
        lesson["steps"] = ["comprobar"]
        self.module = {field: "contenido" for field in ("title", "project", "deliverable", "checkpoint")}
        self.module.update(key="apiux", route="/api-ux", outcomes=["aprender"], lessons=[dict(lesson) for _ in range(5)])
        self.write("sitio/app/manual.tsx", 'import data from "../../editorial/curriculum.json"; page.lessons.map(render)')
        self.write("sitio/app/api-ux/page.tsx", '<ManualPage kind="apiux"/>')
        self.write("sitio/public/sitemap.xml", "".join(f"<loc>https://example.test/aprender/apiux/{index}</loc>" for index in range(1, 6)))

    def write(self, name, content):
        target = self.root / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")

    def check(self):
        self.write("editorial/curriculum.json", json.dumps({"modules": [self.module]}))
        errors = []
        require_modules(self.root, {"apiux": "/api-ux"}, errors)
        return errors

    def test_accepts_complete_binding(self):
        self.assertEqual(self.check(), [])

    def test_rejects_wrong_module_and_empty_lesson(self):
        self.write("sitio/app/api-ux/page.tsx", '<ManualPage kind="otro"/>')
        self.module["lessons"][0]["evidence"] = ""
        errors = self.check()
        self.assertTrue(any("no selecciona" in error for error in errors))
        self.assertTrue(any("lección incompleta" in error for error in errors))

    def test_accepts_explicit_inline_curriculum_binding(self):
        self.write("sitio/app/api-ux/page.tsx", 'import c from "../../../editorial/curriculum.json"; const learningModule = c.modules.find(item => item.key === "apiux"); learningModule.lessons.map(render)')
        self.assertEqual(self.check(), [])

    def test_rejects_unindexed_lessons_and_detached_renderer(self):
        self.write("sitio/public/sitemap.xml", "")
        self.write("sitio/app/manual.tsx", "contenido independiente")
        errors = self.check()
        self.assertEqual(sum("no indexada" in error for error in errors), 5)
        self.assertTrue(any("no renderiza" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
