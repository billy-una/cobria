"""Revisión por página de integridad, estructura y geometría. No certifica PDF/UA."""
from pathlib import Path
import collections
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import xml.etree.ElementTree as ET
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/review/ep9'
def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()
def structure(catalog):
    roles, missing_alt, seen = collections.Counter(), [], set()
    def visit(obj):
        if hasattr(obj, 'idnum'):
            key = (obj.idnum, obj.generation)
            if key in seen:
                return
            seen.add(key)
            obj = obj.get_object()
        if isinstance(obj, list):
            for child in obj:
                visit(child)
        elif isinstance(obj, dict):
            role = str(obj.get('/S', ''))
            if role:
                roles[role] += 1
                if role == '/Figure' and not obj.get('/Alt') and not obj.get('/ActualText'):
                    missing_alt.append(str(obj.get('/ID', len(missing_alt)+1)))
            if '/K' in obj:
                visit(obj['/K'])
    tree = catalog.get('/StructTreeRoot')
    if tree:
        visit(tree)
    return {'present': bool(tree), 'roles': dict(roles), 'figuresWithoutAlt': missing_alt}

def audit(label):
    directory = OUT / label
    directory.mkdir(parents=True, exist_ok=True)
    tool = os.environ.get('COBRIA_PDFTOTEXT_BIN') or shutil.which('pdftotext')
    report = {'kind': 'revision-editorial-por-pagina', 'date': '2026-10-25', 'pdfUaCertified': False, 'humanScreenReaderReview': False, 'allPagesVisuallyRead': False, 'documents': []}
    for item in json.loads((ROOT / 'editorial/ep9/products.json').read_text())['products']:
        file = ROOT / item['pdf']
        reader = PdfReader(file)
        catalog = reader.trailer['/Root']
        texts = [p.extract_text() or '' for p in reader.pages]
        words_by_page = {}
        if tool:
            xml = directory / (item['id'] + '-bbox.html')
            subprocess.run([tool, '-bbox-layout', str(file), str(xml)], check=True, capture_output=True)
            # Algunos mapas de fuentes contienen controles XML 1.0 inválidos.
            # Se sanea solo la representación de diagnóstico, nunca el PDF.
            raw = xml.read_text()
            clean = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', raw)
            parsed = ET.ElementTree(ET.fromstring(clean))
            pages = [e for e in parsed.iter() if e.tag.split('}')[-1] == 'page']
            if len(pages) != len(texts):
                raise ValueError('Páginas geométricas divergentes: ' + item['id'])
            words_by_page = {i: [w for w in e.iter() if w.tag.split('}')[-1] == 'word'] for i, e in enumerate(pages)}
        records = []
        for index, (page, text) in enumerate(zip(reader.pages, texts)):
            width, height = float(page.mediabox.width), float(page.mediabox.height)
            outside = []
            for word in words_by_page.get(index, []):
                a = word.attrib
                if float(a['xMin']) < 2 or float(a['yMin']) < 2 or float(a['xMax']) > width-2 or float(a['yMax']) > height-2:
                    outside.append({'text': word.text, 'bounds': a})
            records.append({'page': index+1, 'textCharacters': len(text.strip()), 'emptyText': not text.strip(), 'outsidePaper': outside, 'isolatedDiacriticTail': bool(re.search(r'(?m)^\s*[ÁÉÍÓÚÜÑ]{1,5}\s*$', text.strip().splitlines()[-1] if text.strip() else ''))})
        s = structure(catalog)
        report['documents'].append({**item, 'sha256': sha(file), 'bytes': file.stat().st_size, 'pageCount': len(texts), 'language': str(catalog.get('/Lang', '')), 'title': reader.metadata.title, 'outlineItems': len(reader.outline), 'structure': s, 'geometryChecked': bool(tool), 'pages': records, 'emptyPages': [r['page'] for r in records if r['emptyText']], 'outsidePaperPages': [r['page'] for r in records if r['outsidePaper']], 'pdfUaClaim': False, 'screenReaderOrderVerified': False})
        print(item['id'], len(texts), 'páginas; etiquetas:', s['present'], 'vacías:', report['documents'][-1]['emptyPages'], 'fuera:', report['documents'][-1]['outsidePaperPages'], flush=True)
    (directory / 'PDF.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    return report

if __name__ == '__main__':
    audit(sys.argv[1] if len(sys.argv)>1 else 'actual')
