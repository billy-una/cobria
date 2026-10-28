"""Derivado web: JPEG de ilustraciones RGB sin rasterizar texto ni alterar geometría."""
import json
from pathlib import Path
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject


def fingerprint(reader):
    pages = {(page.indirect_reference.idnum, page.indirect_reference.generation): index for index, page in enumerate(reader.pages)}

    def destination(value):
        if isinstance(value, list):
            return [pages.get((item.idnum, item.generation), 'referencia-no-pagina') if hasattr(item, 'idnum') else str(item) for item in value]
        return str(value) if value is not None else None

    def annotations(page):
        result = []
        for reference in page.get('/Annots', []):
            annotation = reference.get_object()
            action = annotation.get('/A', {})
            result.append({'subtype': str(annotation.get('/Subtype')), 'rect': [str(value) for value in annotation.get('/Rect', [])],
                           'action': str(action.get('/S')), 'uri': str(action.get('/URI')),
                           'destination': destination(action.get('/D', annotation.get('/Dest')))})
        return result

    def outlines(items):
        return [outlines(item) if isinstance(item, list) else [str(item.title), reader.get_destination_page_number(item)] for item in items]

    return {'pages': len(reader.pages),
            'text': [' '.join((page.extract_text() or '').split()) for page in reader.pages],
            'annotations': [annotations(page) for page in reader.pages], 'outlines': outlines(reader.outline),
            'geometry': [[str(value) for value in page.mediabox] for page in reader.pages],
            'structures': {key: key in reader.trailer['/Root'] for key in ['/StructTreeRoot', '/Lang', '/Outlines', '/MarkInfo']}}


def optimize(source, target):
    if source.is_symlink() or target.is_symlink() or target.exists() or not source.is_file():
        raise ValueError('Entrada o destino PDF no admisible')
    reader = PdfReader(source)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    seen, replaced = set(), 0
    for page in writer.pages:
        for image in page.images:
            reference = image.indirect_reference
            if reference is None or reference.idnum in seen:
                continue
            seen.add(reference.idnum)
            pixels = image.image
            # Conservar transparencias, máscaras e imágenes pequeñas tal como están.
            if pixels.mode != 'RGB' or len(image.data) < 128 * 1024:
                continue
            original = reference.get_object()
            retained = {key: original[key] for key in ['/StructParent', '/Metadata', '/OC'] if key in original}
            image.replace(pixels, quality=92, subsampling=0)
            for key, value in retained.items():
                reference.get_object()[NameObject(key)] = value
            replaced += 1
        page.compress_content_streams()
    writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    with target.open('xb') as stream:
        writer.write(stream)
    if fingerprint(reader) != fingerprint(PdfReader(target)):
        raise ValueError('El derivado cambió texto, páginas, cantidad de enlaces o estructura declarada')
    if target.stat().st_size > 24 * 1024**2:
        raise ValueError('El derivado supera el presupuesto web de 24 MiB; no se descarta contenido para aprobar')
    return {'sourceBytes': source.stat().st_size, 'webBytes': target.stat().st_size,
            'rgbImagesReencoded': replaced, 'quality': 92, 'resized': False,
            'losslessImages': False, 'semanticFingerprintEqual': True}


if __name__ == '__main__':
    source, target = map(Path, sys.argv[1:3])
    print(json.dumps(optimize(source, target), ensure_ascii=False))
