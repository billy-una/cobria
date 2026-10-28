"""Verificación de solo lectura; no regenera el manifiesto."""
import json
from pathlib import Path
from release_manifest import validate

root = Path(__file__).resolve().parents[1]
canonical = json.loads((root.parent / 'editorial/canonical.json').read_text(encoding='utf-8'))
manifest = root / 'RELEASE-MANIFEST.json'
if manifest.is_symlink():
    raise SystemExit('Manifiesto enlazado rechazado')
data = json.loads(manifest.read_text(encoding='utf-8'))
errors = validate(root, data, canonical)
if errors:
    raise SystemExit('Manifiesto de réplica inválido:\n' + '\n'.join(f'- {error}' for error in errors))
print(f"Manifiesto de réplica válido: {len(data['files'])} archivos; árbol de trabajo, no ZIP histórico.")
