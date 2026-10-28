"""Comprobar paridad del capítulo, no certificar accesibilidad del documento entero."""
import hashlib
import json
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[2]
data = json.loads((root / 'editorial/ep4/recorrido.json').read_text())
report = {'kind': 'paridad-editorial-ep4', 'published': False, 'pdf': []}
for filename in ['COBRIA-proyecto-integral.pdf', 'COBRIA-ecosistema-manual-completo.pdf']:
    path = root / 'output/pdf' / filename
    reader = PdfReader(path)
    texts = [page.extract_text() for page in reader.pages]
    pages = []
    for section in data['sections']:
        found = [i + 1 for i, text in enumerate(texts) if section['title'] in text]
        if not found:
            raise ValueError(f'Falta sección {section["title"]} en {filename}')
        pages.append({'title': section['title'], 'pages': found})
    joined = '\n'.join(texts)
    for marker in ['autoridadEscritura: false', 'entrenamientoHabilitado: false', 'recorrido-ep4.mjs', '1000 operaciones']:
        if marker not in joined:
            raise ValueError(f'Falta {marker} en {filename}')
    if filename == 'COBRIA-proyecto-integral.pdf' and len(reader.pages) != 6:
        raise ValueError('La guía breve cambió su maquetación: revisar las seis páginas')
    report['pdf'].append({'file': str(path.relative_to(root)), 'pages': len(reader.pages),
                          'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'sections': pages})
output = root / 'output/review/ep4/PDF.json'
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
print(json.dumps(report, indent=2, ensure_ascii=False))
