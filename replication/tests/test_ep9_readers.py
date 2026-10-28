"""Regresiones del empaquetador editorial, sin navegador ni red."""
import importlib.util
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('ep9_reader',ROOT/'editorial/ep9/reader_html.py')
reader=importlib.util.module_from_spec(spec);spec.loader.exec_module(reader)

class Readers(unittest.TestCase):
    def test_preserves_math_and_text(self):
        source='<html><body><h1>Obra</h1><h1>Datos</h1><p>Ámbito &amp; revisión <math><mi>x</mi></math></p></body></html>'
        result,parity=reader.reader(source,'Obra')
        self.assertTrue(parity['visibleTextPreserved'])
        self.assertIn('<math><mi>x</mi></math>',result)
        self.assertEqual(result.count('<h1 '),1)

    def test_preserves_existing_anchor_and_avoids_collision(self):
        result,_=reader.reader('<body><h1 id="lectura-seccion-1">Título</h1><h1>Parte</h1><p><a href="#lectura-seccion-1">Volver</a></p></body>','Obra')
        self.assertEqual(result.count('id="lectura-seccion-1"'),1)
        self.assertIn('id="lectura-seccion-2"',result)

    def test_table_keyboard_and_headers(self):
        result,_=reader.reader('<body><h1>Título</h1><table><tr><th>Dato</th></tr><tr><td>1</td></tr></table></body>','Obra')
        self.assertIn('scope="col"',result)
        self.assertIn('class="table-scroll"',result)
        self.assertIn('tabindex="0"',result)

    def test_figure_has_caption_name(self):
        result,_=reader.reader('<body><h1>Título</h1><figure><img src="x.svg"><figcaption>Flujo de revisión</figcaption></figure></body>','Obra')
        self.assertIn('aria-label="Flujo de revisión"',result)
        self.assertIn('alt="Flujo de revisión"',result)

    def test_no_certification_claim(self):
        result,_=reader.reader('<body><h1>Título</h1></body>','Obra')
        self.assertIn('no se declaran conformes con PDF/UA',result)
        self.assertIn('tecnología de apoyo sigue pendiente',result)

if __name__=='__main__':unittest.main()
