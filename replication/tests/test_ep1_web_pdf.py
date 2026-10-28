"""Fixtures sintéticos: conservación de estructura, nunca certificación PDF/UA."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.annotations import Link
from pypdf.generic import DictionaryObject, NameObject

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/optimize-web-pdf.py'
spec = importlib.util.spec_from_file_location('ep1_web_pdf', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class WebPdfTests(unittest.TestCase):
    def test_images_keep_dimensions_and_links_and_tagged_root(self):
        with tempfile.TemporaryDirectory(prefix='cobria-ep1-pdf-test-') as folder:
            folder = Path(folder)
            raster, source, target = [folder / name for name in ['raster.pdf', 'source.pdf', 'web.pdf']]
            Image.effect_noise((1024, 1024), 100).convert('RGB').save(raster, 'PDF', quality=99)
            writer = PdfWriter(clone_from=raster)
            writer.add_outline_item('Sección sintética', 0)
            writer.add_annotation(0, Link(rect=(0, 0, 100, 100), url='https://example.invalid/fixture'))
            writer._root_object[NameObject('/StructTreeRoot')] = writer._add_object(DictionaryObject({NameObject('/Type'): NameObject('/StructTreeRoot')}))
            with source.open('wb') as stream:
                writer.write(stream)
            result = module.optimize(source, target)
            self.assertEqual(result['rgbImagesReencoded'], 1)
            self.assertFalse(result['resized'])
            self.assertEqual(PdfReader(target).pages[0].images[0].image.size, (1024, 1024))
            self.assertEqual(module.fingerprint(PdfReader(source)), module.fingerprint(PdfReader(target)))

    def test_existing_output_is_not_overwritten(self):
        with tempfile.TemporaryDirectory(prefix='cobria-ep1-pdf-test-') as folder:
            source, target = Path(folder) / 'source.pdf', Path(folder) / 'web.pdf'
            source.write_bytes(b'fixture-no-interpretar')
            target.write_bytes(b'preservar')
            with self.assertRaises(ValueError):
                module.optimize(source, target)
            self.assertEqual(target.read_bytes(), b'preservar')
