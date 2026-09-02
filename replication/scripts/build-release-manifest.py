import hashlib,json,platform,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
exclude={'node_modules','tmp','.DS_Store'}
files=[]
for p in sorted(root.rglob('*')):
    if not p.is_file() or any(x in exclude for x in p.parts): continue
    if p.name=='RELEASE-MANIFEST.json': continue
    data=p.read_bytes();files.append({'path':str(p.relative_to(root)),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
manifest={'package':'Paquete de reproducción COBRIA','version':'3.0.0','python':sys.version,'platform':platform.platform(),'files':files}
(root/'RELEASE-MANIFEST.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps({'files':len(files),'manifest':str(root/'RELEASE-MANIFEST.json')},indent=2))
