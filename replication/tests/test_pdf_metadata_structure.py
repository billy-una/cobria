from pathlib import Path
import subprocess
import tempfile
import unittest
import json
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, DictionaryObject, BooleanObject


class MetadataStructureTests(unittest.TestCase):
    def test_book_build_identity_matches_canonical_candidate(self):
        root = Path(__file__).parents[2]
        canonical = json.loads((root / 'editorial/canonical.json').read_text())['identity']['ecosystemVersion']
        package = json.loads((root / 'libro-cobria/package.json').read_text())
        lock = json.loads((root / 'libro-cobria/package-lock.json').read_text())
        self.assertEqual(package['version'], canonical)
        self.assertEqual(lock['version'], canonical)
        self.assertEqual(lock['packages']['']['version'], canonical)

    def test_optimization_preserves_semantics_and_navigation(self):
        with tempfile.TemporaryDirectory() as folder:
            source, target = Path(folder) / 'source.pdf', Path(folder) / 'target.pdf'
            writer = PdfWriter()
            writer.add_blank_page(width=612, height=792)
            writer.add_outline_item('Navegación', 0)
            writer._root_object[NameObject('/StructTreeRoot')] = writer._add_object(DictionaryObject({NameObject('/Type'): NameObject('/StructTreeRoot')}))
            with source.open('wb') as stream:
                writer.write(stream)
            script = Path(__file__).parents[1] / 'scripts/optimize-structured-pdf.py'
            result = subprocess.run(['python3', str(script), str(source), str(target)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            reader = PdfReader(target)
            self.assertEqual(len(reader.pages), 1)
            self.assertEqual(len(reader.outline), 1)
            self.assertIn('/StructTreeRoot', reader.trailer['/Root'])

    def test_metadata_preserves_document_structure_and_outline(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'test.pdf'
            writer = PdfWriter()
            writer.add_blank_page(width=612, height=792)
            writer.add_outline_item('Capítulo de prueba', 0)
            writer._root_object[NameObject('/MarkInfo')] = DictionaryObject({NameObject('/Marked'): BooleanObject(True)})
            writer._root_object[NameObject('/StructTreeRoot')] = writer._add_object(DictionaryObject({NameObject('/Type'): NameObject('/StructTreeRoot')}))
            with target.open('wb') as stream:
                writer.write(stream)
            script = Path(__file__).parents[1] / 'scripts/set_pdf_metadata.py'
            result = subprocess.run(['python3', str(script), str(target), 'Prueba', 'Fixture estructural'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            reader = PdfReader(target)
            self.assertIn('/StructTreeRoot', reader.trailer['/Root'])
            self.assertEqual(reader.trailer['/Root']['/Lang'], 'es')
            self.assertEqual(len(reader.outline), 1)
            self.assertEqual(reader.metadata.title, 'Prueba')
