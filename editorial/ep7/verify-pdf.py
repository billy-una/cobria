"""Contraste editorial y bibliográfico; no certifica estilo ni lectura humana."""
from pathlib import Path
import hashlib
import json
import re
import unicodedata
from pypdf import PdfReader

root = Path(__file__).resolve().parents[2]
data = json.loads((root / 'editorial/ep7/references.json').read_text())
def compact(value):
    value = unicodedata.normalize('NFKD', value)
    return ''.join(c.lower() for c in value if c.isalnum())

report = {'kind': 'contraste-editorial-ep7-ep8', 'externalReview': False, 'fullVisualReview': False, 'pdf': []}
for name in ['COBRIA-articulo-cientifico-actualizado.pdf', 'COBRIA-documento-maestro-ecosistema.pdf', 'COBRIA-articulo-revision-ciega.pdf', 'COBRIA-ecosistema-manual-completo.pdf']:
    file = root / 'output/pdf' / name
    reader = PdfReader(file)
    pages = [p.extract_text() or '' for p in reader.pages]
    text = '\n'.join(pages)
    normalized = compact(text)
    assert all(p.strip() for p in pages), name + ': página vacía'
    assert 'Ang Li' not in text and 'Yaish' not in text, name + ': identidad antigua'
    for old in ['10.1145/1559845.1559937', '10.1109/TKDE.2013.42']:
        assert compact(old) not in normalized, name + ': DOI de otro trabajo'
    if 'manual-completo' in name:
        for row in data['references']:
            assert compact(row['title']) in normalized, name + ': falta título ' + row['id']
        assert normalized.count(compact('Lecturas externas:')) == 17
        markers = ['Cómo se eligieron estas lecturas', 'Bibliografía compartida', 'recibos de generación']
    else:
        markers = ['revisión exploratoria dirigida', 'se excluye justificadamente', 'PC3', 'Comparación conceptual por mecanismos', 'Leakage and the reproducibility crisis', 'Ni,']
        if 'ciega' in name:
            assert not re.search(r'Billy|Cordero|cbilly137', text + str(reader.metadata), re.I)
    for marker in markers:
        assert compact(marker) in normalized, name + ': falta ' + marker
    visual_markers = [m for m in markers if len(compact(m)) >= 15] + ['Lecturas externas:', 'References EP7']
    selected = [i + 1 for i, p in enumerate(pages) if any(compact(m) in compact(p) for m in visual_markers)]
    report['pdf'].append({'file': str(file.relative_to(root)), 'pages': len(pages), 'emptyPages': 0, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'reviewPages': selected})
output = root / 'output/review/ep7/PDF.json'
output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
