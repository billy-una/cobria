import json
from pathlib import Path
from release_manifest import build
root=Path(__file__).resolve().parents[1]
repository=root.parent
canonical=json.loads((repository/'editorial/canonical.json').read_text(encoding='utf-8'))
manifest=build(root,canonical)
target=root/'RELEASE-MANIFEST.json'
if target.is_symlink():
    raise SystemExit('No se sobrescribe un manifiesto enlazado')
target.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'files':len(manifest['files']),'manifest':str(target)},indent=2))
