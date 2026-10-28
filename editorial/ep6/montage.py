"""Planchas de inspección de páginas ya renderizadas; no modifica los PDF."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[2] / 'output/review/ep6'
for name, columns, rows, width in [('articulo', 4, 4, 220), ('maestro', 7, 7, 145)]:
    sources = sorted((root / name).glob('pagina-*.png'))
    height = round(width * 1.3) + 22
    for offset in range(0, len(sources), columns * rows):
        canvas = Image.new('RGB', (columns * width, rows * height), '#d9dfdc')
        draw = ImageDraw.Draw(canvas)
        for index, source in enumerate(sources[offset:offset + columns * rows]):
            with Image.open(source) as image:
                thumbnail = ImageOps.contain(image.convert('RGB'), (width - 8, height - 24))
            x, y = index % columns * width, index // columns * height
            canvas.paste(thumbnail, (x + 4, y + 20))
            draw.text((x + 5, y + 3), source.stem, fill='black')
        canvas.save(root / f'{name}-plancha-{offset // (columns * rows) + 1}.png')
