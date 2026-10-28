"""Renderiza miniaturas de todas las páginas y una muestra legible por producto."""
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
output = ROOT / 'output/review/ecosistema-13-14' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
output.mkdir(parents=True, exist_ok=False)
report = {'kind': 'renderizado-no-revision-humana', 'allPagesRendered': True,
          'allPagesReadAtLegibleResolution': False, 'documents': []}
for item in json.loads((ROOT / 'editorial/products.json').read_text())['products']:
    if not item['output'].endswith('.pdf'):
        continue
    source = ROOT / item['output']
    directory = output / item['id']
    directory.mkdir()
    subprocess.run(['pdftoppm', '-scale-to', '160', '-png', str(source), str(directory / 'page')], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    thumbs = sorted(directory.glob('page-*.png'))
    count = len(PdfReader(source).pages)
    if len(thumbs) != count:
        raise SystemExit('Renderizado incompleto: ' + item['id'])
    for start in range(0, count, 48):
        sheet = Image.new('RGB', (960, 1408), 'white')
        draw = ImageDraw.Draw(sheet)
        for offset, file in enumerate(thumbs[start:start + 48]):
            x, y = (offset % 6) * 160, (offset // 6) * 176
            with Image.open(file) as image:
                sheet.paste(image.convert('RGB'), (x + (160 - image.width) // 2, y))
            draw.text((x + 8, y + 158), f'{start + offset + 1}', fill='black')
        sheet.save(directory / f'contacto-{start//48 + 1}.png')
    for page in sorted({1, 2, max(1, count // 2), max(1, count - 1), count}):
        subprocess.run(['pdftoppm', '-f', str(page), '-l', str(page), '-scale-to', '1200', '-singlefile', '-png', str(source), str(directory / f'muestra-{page}')], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    report['documents'].append({'id': item['id'], 'pages': count, 'directory': str(directory)})
(output / 'renderizado.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({**report, 'output': str(output)}, ensure_ascii=False, indent=2))
