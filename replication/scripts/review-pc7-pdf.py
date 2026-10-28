"""Contrasta texto extraído de PDF con las lecciones fuente, no solo con HTML."""
import json
import re
import unicodedata
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
output = ROOT / 'output/review/pc7'
geometry = json.loads((output / 'book-geometry.json').read_text())
curriculum = json.loads((ROOT / 'editorial/curriculum.json').read_text())
report = {'kind': 'texto-pdf-PC7', 'documents': [], 'mismatches': [], 'humanReview': False,
          'normalization': ['espacios y saltos', 'NFC', 'apóstrofo modificador U+02BC y comilla U+2019 equivalentes']}
normalize = lambda s: re.sub(r'\s+', '', unicodedata.normalize('NFC', s).replace('\u02bc', '\u2019')).casefold()
for document, filename in zip(geometry['documents'], ['COBRIA-ecosistema-manual-completo.pdf', 'COBRIA-cuaderno-de-trabajo.pdf', 'COBRIA-anexo-tecnico.pdf']):
    reader = PdfReader(ROOT / 'output/pdf' / filename)
    texts = [page.extract_text() or '' for page in reader.pages]
    for index, text in enumerate(texts, 1):
        tail = text.strip().splitlines()[-1].strip() if text.strip() else ''
        if tail and re.fullmatch(r'[ÁÉÍÓÚÜÑ\s]+', tail):
            report['mismatches'].append({'file': filename, 'page': index, 'issue': 'Diacríticos aislados al final de página', 'text': tail})
    report['documents'].append({'file': filename, 'pages': len(texts), 'emptyPages': [i+1 for i, text in enumerate(texts) if not text.strip()]})
    if len(texts) != document['sections']:
        report['mismatches'].append({'file': filename, 'issue': 'Páginas PDF y secciones HTML divergen'})
    if document['source'] != 'index.html':
        continue
    by_id = {p['id']: p['index']-1 for p in document['pages'] if p['id']}
    for course in curriculum['modules']:
        for i, lesson in enumerate(course['lessons'], 1):
            for prefix, values in [('leccion', [lesson[k] for k in ['title','situation','simple','example','mistake','evidence','code']] + lesson['steps']),
                                   ('ejercicio', [lesson['practice'][k] for k in ['exercise','solution','recovery']])]:
                identifier = f"{prefix}-{course['number']}-{i}"
                index = by_id[identifier]
                text = normalize(texts[index]) if index < len(texts) else ''
                for value in values:
                    if normalize(value) not in text:
                        report['mismatches'].append({'id': identifier, 'page': index+1, 'text': value})
(output / 'pdf-content.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'documents': report['documents'], 'mismatches': len(report['mismatches'])}, ensure_ascii=False))
if report['mismatches']:
    raise SystemExit(1)
