"""Contraste de código y texto del piloto; no certificación de accesibilidad."""
import hashlib
import json
from pathlib import Path
import re
from pypdf import PdfReader

root = Path(__file__).resolve().parents[2]
data = json.loads((root / 'editorial/ep2/recorrido.json').read_text())
normalize = lambda value: re.sub(r'\s+', '', value).replace('\u02bc', "'").replace('\u2019', "'")
documents = []
for name in ['COBRIA-primeros-pasos.pdf', 'COBRIA-ecosistema-manual-completo.pdf']:
    path = root / 'output/pdf' / name
    reader = PdfReader(path)
    pages = [page.extract_text() or '' for page in reader.pages]
    text = normalize('\n'.join(pages))
    assert all(page.strip() for page in pages), f'Página vacía en {name}'
    for unit in data['units']:
        for field in ['code', 'exercise', 'solution']:
            assert normalize(unit[field]) in text, f'{name}: falta {field} de unidad {unit["id"]}'
        for support in unit['support']:
            assert normalize(support['code']) in text, f'{name}: falta archivo de apoyo'
    if name == 'COBRIA-primeros-pasos.pdf':
        assert len(pages) == 4 + 2 * len(data['units']), 'Revisar paginación del capítulo'
    documents.append({'file': name, 'pages': len(pages), 'bytes': path.stat().st_size,
                      'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                      'emptyPages': 0, 'unitsMatched': len(data['units'])})
output = root / 'output/review/ep2/PDF.json'
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps({'status': 'aprobado-texto', 'documents': documents,
                             'fullVisualReview': False, 'pdfUaCertified': False}, ensure_ascii=False, indent=2) + '\n')
print(f'EP2: código, ejercicios y soluciones contrastados en {len(documents)} PDF. {output}')
