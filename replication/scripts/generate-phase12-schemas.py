#!/usr/bin/env python3
"""Genera esquemas específicos que especializan el sobre COBRIA."""
import json
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'specification/phase-12/schemas'
MAPPING={'project':'cobria-project','architecture':'cobria-architecture','data-dictionary':'cobria-data-dictionary','nodes':'cobria-nodes','functions':'cobria-functions','security':'cobria-security','quality':'cobria-quality','environments':'cobria-environments','traceability':'cobria-traceability'}
def content(name,mid): return {'$schema':'https://json-schema.org/draft/2020-12/schema','$id':f'https://cobria.example.invalid/schemas/{name}.schema.json','title':f'Esquema {name} COBRIA','allOf':[{'$ref':'manifest.schema.json'},{'properties':{'manifestId':{'const':mid}}}]}
def main():
    check='--check' in sys.argv; stale=[]
    for name,mid in MAPPING.items():
        path=OUT/f'{name}.schema.json'; expected=json.dumps(content(name,mid),ensure_ascii=False,indent=2,sort_keys=True)+'\n'
        if check:
            if not path.is_file() or path.read_text(encoding='utf-8')!=expected: stale.append(path.name)
        else: path.write_text(expected,encoding='utf-8')
    if stale: print('Esquemas desactualizados: '+', '.join(stale)); return 1
    print(('Esquemas vigentes' if check else 'Esquemas generados')+': 9 específicos + 1 base'); return 0
if __name__=='__main__': sys.exit(main())
