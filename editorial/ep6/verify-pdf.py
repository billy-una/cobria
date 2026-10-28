"""Verificación editorial de tres derivados; no atribuye revisión externa ni PDF/UA."""
import hashlib
import json
import re
import unicodedata
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[2]
def normalize(text):
    text = unicodedata.normalize('NFKC', text).replace('\u00ad', '')
    return re.sub(r'\s+', ' ', re.sub(r'-\s*\n\s*', '', text)).strip()

paths = ['COBRIA-articulo-cientifico-actualizado.pdf', 'COBRIA-documento-maestro-ecosistema.pdf', 'COBRIA-articulo-revision-ciega.pdf']
report = {'kind': 'verificacion-editorial-ep6', 'externalReview': False, 'pdf': []}
all_text = {}
for name in paths:
    file = root / 'output/pdf' / name
    reader = PdfReader(file)
    pages = [page.extract_text() for page in reader.pages]
    without_folios = [re.sub(r'(?m)^\s*(?:\d+|[ivxlcdm]+)\s*$', '', page) for page in pages]
    text = normalize('\n'.join(without_folios))
    compact = re.sub(r'\s+', '', text)
    all_text[name] = text
    for marker in ['270', '630', 'PC2', 'PC3', 'Holm', 'Estratos de evidencia', 'contrato explícito y refutable', 'no el efecto causal aislado del contrato']:
        if re.sub(r'\s+', '', marker) not in compact:
            raise ValueError(f'{name}: falta {marker}')
    if re.search(r'bshandball|crmhotel|posguapiles|/Users/', text, re.I):
        raise ValueError(f'{name}: identidad de caso o ruta local expuesta')
    if 'ciega' in name:
        metadata = str(reader.metadata)
        if re.search(r'Billy|Cordero|cbilly137', text + metadata, re.I):
            raise ValueError('La copia ciega conserva identidad del autor')
        if 'anonimizado' not in metadata.lower():
            raise ValueError('Falta metadato de autor anonimizado')
    selected = [i + 1 for i, page in enumerate(pages) if any(re.sub(r'\s+', '', marker) in re.sub(r'\s+', '', normalize(page)) for marker in ['Estratos de evidencia', 'Resultados R7', 'PC3 carece', 'Antecedente local', 'contrato explícito y refutable'])]
    report['pdf'].append({'file': str(file.relative_to(root)), 'pages': len(pages), 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'reviewPages': selected, 'author': reader.metadata.get('/Author')})

opening = 'Los sistemas NoSQL documentales pueden mantener'
ending = 'doble cribado bibliográfico.'
abstracts = []
for text in all_text.values():
    text = re.sub(r'\s+', '', text)
    start = text.index(re.sub(r'\s+', '', opening))
    last = re.sub(r'\s+', '', ending)
    end = text.index(last, start) + len(last)
    abstract = text[start:end]
    abstracts.append(abstract)
if len(set(abstracts)) != 1:
    raise ValueError('Los resúmenes extraídos difieren: revisar contenido y saltos de página')
source = (root / 'editorial/ep6/synthesis.tex').read_text()
for macro in ['COBRIAResumenCientifico', 'COBRIAConclusionCientifica']:
    expected = re.search(r'\\newcommand\{\\' + macro + r'\}\{(.*)\}', source).group(1)
    expected = expected.replace('\\COBRIARSevenObservations{}', '270').replace('\\COBRIARSevenAlternatives{}', '630').replace('$', '')
    expected = re.sub(r'\s+', '', normalize(expected))
    for name, text in all_text.items():
        if expected not in re.sub(r'\s+', '', text):
            raise ValueError(f'{name}: el contenido no coincide con la fuente {macro}')
report['abstractsEquivalent'] = True
report['sharedSourceMatches'] = True
report['textComparison'] = 'NFKC, espacios y guiones de fin de línea normalizados; folios aislados excluidos'
output = root / 'output/review/ep6/PDF.json'
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
