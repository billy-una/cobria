"""Contrasta los capítulos desarrollados con las dos ediciones PDF."""
import hashlib
import json
from pathlib import Path
import re
from pypdf import PdfReader

root = Path(__file__).resolve().parents[2]
data = json.loads((root / 'editorial/ep3/areas.json').read_text())
normalize = lambda value: re.sub(r'\s+', '', value).replace('\u02bc', "'").replace('\u2019', "'")
documents = []
for name in ['COBRIA-casos-por-areas.pdf', 'COBRIA-ecosistema-manual-completo.pdf']:
    source = root / 'output/pdf' / name
    reader = PdfReader(source)
    pages = [page.extract_text() or '' for page in reader.pages]
    text = normalize('\n'.join(pages))
    assert all(page.strip() for page in pages), f'{name}: página vacía'
    for area in data['areas']:
        for field in ['problem', 'code', 'exercise', 'solution', 'adverse', 'recovery']:
            assert normalize(area[field]) in text, f'{name}: falta {area["key"]}/{field}'
    for pattern in data['patternReview']:
        assert normalize(pattern['reason']) in text, f'{name}: falta ficha {pattern["id"]}'
    if name == 'COBRIA-casos-por-areas.pdf':
        assert len(pages) == 59, f'Revisar paginación: {len(pages)} páginas'
    documents.append({'file': name, 'pages': len(pages), 'bytes': source.stat().st_size,
                      'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                      'areasMatched': 17, 'patternReviewsMatched': 30, 'emptyPages': 0})
output = root / 'output/review/ep3/PDF.json'
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps({'status': 'aprobado-texto', 'documents': documents,
                             'fullVisualReview': False, 'pdfUaCertified': False}, ensure_ascii=False, indent=2) + '\n')
print(f'EP3: 17 áreas y 30 revisiones contrastadas en los dos PDF. {output}')
