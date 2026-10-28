"""Renderiza las páginas afectadas; EP9 conserva la inspección integral pendiente."""
from pathlib import Path
import json
import subprocess
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[2]
out = root / 'output/review/ep7'
report = json.loads((out / 'PDF.json').read_text())
for doc, key in zip(report['pdf'], ['articulo', 'maestro', 'ciega', 'libro']):
    directory = out / key
    directory.mkdir(exist_ok=True)
    sources = []
    for number in sorted(set(doc['reviewPages'] + [1])):
        prefix = directory / f'pagina-{number:03d}'
        subprocess.run(['pdftoppm', '-f', str(number), '-l', str(number), '-singlefile', '-scale-to', '1050', '-png', str(root / doc['file']), str(prefix)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        sources.append(prefix.with_suffix('.png'))
    for start in range(0, len(sources), 16):
        canvas = Image.new('RGB', (1000, 1400), '#d9dfdc')
        draw = ImageDraw.Draw(canvas)
        for index, source in enumerate(sources[start:start+16]):
            with Image.open(source) as original:
                thumbnail = ImageOps.contain(original.convert('RGB'), (242, 320))
            x, y = index % 4 * 250, index // 4 * 350
            canvas.paste(thumbnail, (x+4, y+24))
            draw.text((x+6,y+4), source.stem, fill='black')
        canvas.save(out / f'{key}-plancha-{start//16+1}.png')
print('Páginas afectadas y planchas disponibles en', out)
