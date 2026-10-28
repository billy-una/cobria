"""Compresión sin remuestreo de imágenes ni descarte del árbol semántico."""
from pathlib import Path
import sys
from pypdf import PdfReader, PdfWriter

source, target = map(Path, sys.argv[1:3])
if source.is_symlink() or target.is_symlink() or target.exists() or not source.is_file():
    raise SystemExit('Entrada o destino PDF no admisible')
reader = PdfReader(source)
writer = PdfWriter()
writer.clone_document_from_reader(reader)
for page in writer.pages:
    page.compress_content_streams()
writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
with target.open('xb') as stream:
    writer.write(stream)
check = PdfReader(target)
if len(check.pages) != len(reader.pages):
    raise SystemExit('La compresión cambió el número de páginas')
for key in ('/StructTreeRoot', '/Lang', '/Outlines', '/MarkInfo'):
    if key in reader.trailer['/Root'] and key not in check.trailer['/Root']:
        raise SystemExit('La compresión perdió estructura: ' + key)
