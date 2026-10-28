"""Inventario editorial y accesibilidad estructural; no certifica PDF/UA."""
from datetime import datetime, timezone
import hashlib
import json
import sys
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
products = json.loads((ROOT / 'editorial/products.json').read_text())
report = {'kind': 'auditoria-local-seis-pdf', 'documents': [], 'humanReview': False,
          'pdfUaCertified': False, 'completeVisualReview': False, 'published': False}
errors = []
downloads = json.loads((ROOT / 'sitio/public/downloads/manifest.json').read_text()) if '--downloads' in sys.argv else None
for item in products['products']:
    if not item['output'].endswith('.pdf'):
        continue
    path = ROOT / item['output']
    reader = PdfReader(path)
    catalog = reader.trailer['/Root']
    record = {'id': item['id'], 'path': item['output'], 'pages': len(reader.pages),
              'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes': path.stat().st_size,
              'title': reader.metadata.title, 'author': reader.metadata.author,
              'language': str(catalog.get('/Lang', '')), 'structureTree': '/StructTreeRoot' in catalog,
              'outlineItems': len(reader.outline), 'emptyTextPages': [], 'invalidGeometry': []}
    for index, page in enumerate(reader.pages, 1):
        if not (page.extract_text() or '').strip():
            record['emptyTextPages'].append(index)
        if float(page.mediabox.width) <= 0 or float(page.mediabox.height) <= 0:
            record['invalidGeometry'].append(index)
    if not record['title'] or record['author'] != 'Billy Jak Cordero Porras' or record['invalidGeometry']:
        errors.append(item['id'] + ': metadatos o geometría inválidos')
    if item['id'] in ('book', 'workbook', 'technical-annex'):
        if not record['structureTree'] or not record['language'].startswith('es'):
            errors.append(item['id'] + ': estructura semántica o idioma ausentes')
    if downloads is not None:
        download = next(entry for entry in downloads['items'] if entry['source'] == item['output'])
        public = ROOT / 'sitio/public' / download['href'].lstrip('/')
        public_data = public.read_bytes()
        public_reader = PdfReader(public)
        public_root = public_reader.trailer['/Root']
        record['download'] = {'path': download['href'], 'bytes': len(public_data),
                              'pages': len(public_reader.pages), 'structureTree': '/StructTreeRoot' in public_root,
                              'outlineItems': len(public_reader.outline)}
        if (record['download']['pages'] != record['pages'] or
                download['sourceSha256'] != record['sha256'] or
                download['sha256'] != hashlib.sha256(public_data).hexdigest() or
                record['download']['structureTree'] != record['structureTree'] or
                record['download']['outlineItems'] != record['outlineItems']):
            errors.append(item['id'] + ': descarga divergente en bytes, páginas o estructura')
    report['documents'].append(record)
report['errors'] = errors
report['status'] = 'aprobado-estructural' if not errors else 'fallido'
report['pending'] = ['Revisión visual legible de todas las páginas', 'Comprobación con tecnologías de apoyo',
                     'PDF/UA o accesibilidad integral no acreditada', 'Réplica externa y publicación autorizada']
directory = ROOT / 'output/review/ecosistema-13-14' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
directory.mkdir(parents=True, exist_ok=False)
(directory / 'pdf-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({**report, 'reportDirectory': str(directory)}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
