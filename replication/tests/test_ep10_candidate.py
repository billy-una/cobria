"""La preparación de una candidata no debe convertirla en evidencia externa."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from pypdf import PdfWriter

ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('ep10',ROOT/'editorial/ep10/candidate.py')
ep10=importlib.util.module_from_spec(spec);spec.loader.exec_module(ep10)

class Candidate(unittest.TestCase):
    def test_secret_patterns_do_not_match_documentation_placeholders(self):
        self.assertIsNone(ep10.SECRET.search(b'ghp_EJEMPLO'))
        self.assertIsNotNone(ep10.SECRET.search(b'ghp_'+b'A'*36))

    def test_personal_path_detector_does_not_flag_its_own_prefix(self):
        self.assertIsNone(ep10.PERSONAL.search(b"reject('/Users/')"))
        self.assertIsNotNone(ep10.PERSONAL.search(b'/Users/ejemplo/Documents/archivo'))

    def test_pdf_fingerprint_does_not_equate_metadata_with_content(self):
        with tempfile.TemporaryDirectory() as folder:
            values=[]
            for number in [1,2]:
                path=Path(folder)/f'{number}.pdf';writer=PdfWriter();writer.add_blank_page(width=600,height=800)
                writer.add_metadata({'/Title':'Prueba','/Author':'Ejemplo','/CreationDate':f'D:2026102{number}120000Z'})
                with path.open('wb') as stream:writer.write(stream)
                values.append(ep10.pdf_fingerprint(path))
            self.assertEqual(values[0],values[1])
            self.assertNotEqual(ep10.sha(Path(folder)/'1.pdf'),ep10.sha(Path(folder)/'2.pdf'))

    def test_pdfs_with_different_geometry_are_not_equivalent(self):
        with tempfile.TemporaryDirectory() as folder:
            values=[]
            for width in [600,601]:
                path=Path(folder)/f'{width}.pdf';writer=PdfWriter();writer.add_blank_page(width=width,height=800)
                with path.open('wb') as stream:writer.write(stream)
                values.append(ep10.pdf_fingerprint(path))
            self.assertNotEqual(values[0],values[1])

    def test_snapshot_has_no_history_clone_or_push_command(self):
        source=(ROOT/'editorial/ep10/candidate.py').read_text()
        self.assertIn("'init','--quiet','--initial-branch=instantanea-ep10'",source)
        self.assertNotIn("'push'",source)
        self.assertNotIn("'bundle'",source)

if __name__=='__main__':unittest.main()
