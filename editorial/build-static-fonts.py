"""Instancias de fuentes fijadas para conservar texto Unicode en los PDF."""
import hashlib
import json
from io import BytesIO
from pathlib import Path
import fontTools
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
records = []
for family, weights, axes in [('Inter', [400,600,700,900], {'opsz':14}), ('RobotoMono', [400,700], {})]:
    original = ROOT / 'libro-cobria/fonts' / f'{family}-variable.ttf'
    for weight in weights:
        settings = {**axes, 'wght':weight}
        font = instantiateVariableFont(TTFont(original), settings, inplace=False)
        font.recalcTimestamp = False
        filename = f'{family}-{weight}.ttf'
        buffer = BytesIO()
        font.save(buffer)
        data = buffer.getvalue()
        for directory in ['libro-cobria/fonts', 'sitio/public/fonts']:
            (ROOT / directory / filename).write_bytes(data)
        records.append({'file':filename, 'origin':original.name, 'axes':settings,
                        'bytes':len(data), 'sha256':hashlib.sha256(data).hexdigest()})
(ROOT / 'editorial/fonts-static.json').write_text(json.dumps({'license':'OFL-1.1', 'generator':f'fontTools {fontTools.__version__}', 'files':records},indent=2)+'\n')
