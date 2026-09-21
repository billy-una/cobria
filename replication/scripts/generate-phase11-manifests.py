#!/usr/bin/env python3
"""Genera manifiestos COBRIA de fase 11 desde fuentes canónicas existentes."""
import argparse
import json
from pathlib import Path
import re
import sys

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'specification/phase-11'

def load(path): return json.loads((ROOT/path).read_text(encoding='utf-8'))
def record(identifier, source, owner, references, data):
    return {'id':identifier,'source':source,'version':'1.0.0','owner':owner,'references':references,'data':data}
def manifest(mid, generated, records):
    return {'schemaVersion':'1.0.0','manifestId':mid,'generatedFrom':generated,'records':records}

def build():
    architecture=load('specification/phase-5/architecture.yaml')
    dictionary=load('specification/phase-3/data-dictionary.yaml')
    nodes=load('specification/phase-4/nodes.yaml')
    deployables=load('specification/phase-8/deployables.json')
    security=load('specification/phase-7/security.json')
    quality=load('specification/phase-9/quality.json')
    environments=load('specification/phase-8/environments.json')
    requirement_text=(ROOT/'specification/phase-2/REQUISITOS-ECOSISTEMA.md').read_text(encoding='utf-8')
    titles=dict(re.findall(r'^### (ECO-R(?:F|NF)-\d{3}) — (.+)$',requirement_text,re.M))
    evidence={x['id']:x for x in quality['requirementEvidence']}

    products=[
      ('PROD-MANIFESTO','COBRIA Manifesto','MANIFESTO.md'),('PROD-CORE','COBRIA Core','specification/COBRIA-CORE-1.0.md'),
      ('PROD-DATA','COBRIA Data','manuales/04-bases-de-datos.md'),('PROD-LAYERS','COBRIA Layers','manuales/02-layers.md'),
      ('PROD-PATTERNS','COBRIA Pattern Design','manuales/03-pattern-design.md'),('PROD-BUILD','COBRIA Build','manuales/07-build.md'),
      ('PROD-SECURITY','COBRIA Security','specification/phase-7/security.json'),('PROD-OPERATIONS','COBRIA Cloud & Operations','specification/phase-8/environments.json'),
      ('PROD-QUALITY','COBRIA Quality','specification/phase-9/quality.json'),('PROD-API-UX','COBRIA API & UX','specification/phase-10/openapi.json'),
      ('PROD-EVIDENCE','COBRIA Evidence','replication/README.md'),('PROD-KNOWLEDGE','COBRIA Knowledge','main.tex')]
    project_records=[record(i,'specification/MAPA-ECOSISTEMA.md','Gobernanza COBRIA',[ref],{'name':name,'kind':'ecosystem-product'}) for i,name,ref in products]

    architecture_records=[record(x['id'],'specification/phase-5/architecture.yaml','COBRIA Layers',['specification/phase-5/MANUAL-DE-CAPAS.md'],x) for x in architecture['layers']]
    data_records=[]
    for entity in dictionary['entities']:
        entity_copy={k:v for k,v in entity.items() if k!='attributes'}
        data_records.append(record(entity['id'],'specification/phase-3/data-dictionary.yaml',entity['owner'],['specification/phase-3/DICCIONARIO-DATOS.md'],entity_copy))
        data_records += [record(a['id'],'specification/phase-3/data-dictionary.yaml',a['owner'],['specification/phase-3/DICCIONARIO-DATOS.md',entity['id']],a) for a in entity['attributes']]
    node_records=[record(x['id'],'specification/phase-4/nodes.yaml',x['owner'],['specification/phase-4/NODOS-Y-AGREGADOS.md','specification/phase-3/data-dictionary.yaml'],x) for x in nodes['nodes']]
    function_records=[record(x['id'],'specification/phase-8/deployables.json',x['owner'],['specification/phase-8/MANUAL-DE-AMBIENTES.md','specification/phase-7/security.json'],x) for x in deployables['deployables']]
    security_records=[record(x['id'],'specification/phase-7/security.json','Responsable de seguridad',['specification/phase-7/MODELO-DE-AMENAZAS.md'],x) for x in security['sensitiveOperations']]
    quality_records=[record(f"TEST-{x['id'].upper()}",'specification/phase-9/quality.json','Responsable de calidad',['specification/phase-9/MANUAL-DE-CALIDAD.md'],x) for x in quality['testTypes']]
    environment_records=[record(f"ENV-{x['id'].upper()}",'specification/phase-8/environments.json','Responsable de operación',['specification/phase-8/MANUAL-DE-AMBIENTES.md'],x) for x in environments['environments']]
    trace_records=[record(i,'specification/phase-2/REQUISITOS-ECOSISTEMA.md','Gobernanza COBRIA',['specification/phase-2/TRAZABILIDAD.md',f"test:{evidence[i]['test']}"],{'title':titles[i],'test':evidence[i]['test'],'status':evidence[i]['status']}) for i in sorted(titles)]
    return {
      'project.yaml':manifest('cobria-project',['specification/MAPA-ECOSISTEMA.md'],project_records),
      'architecture.yaml':manifest('cobria-architecture',['specification/phase-5/architecture.yaml'],architecture_records),
      'data-dictionary.yaml':manifest('cobria-data-dictionary',['specification/phase-3/data-dictionary.yaml'],data_records),
      'nodes.yaml':manifest('cobria-nodes',['specification/phase-4/nodes.yaml'],node_records),
      'functions.yaml':manifest('cobria-functions',['specification/phase-8/deployables.json'],function_records),
      'security.yaml':manifest('cobria-security',['specification/phase-7/security.json'],security_records),
      'quality.yaml':manifest('cobria-quality',['specification/phase-9/quality.json'],quality_records),
      'environments.yaml':manifest('cobria-environments',['specification/phase-8/environments.json'],environment_records),
      'traceability.yaml':manifest('cobria-traceability',['specification/phase-2/REQUISITOS-ECOSISTEMA.md','specification/phase-9/quality.json'],trace_records)
    }

def serialized(value): return json.dumps(value,ensure_ascii=False,indent=2,sort_keys=True)+'\n'
def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--check',action='store_true'); args=parser.parse_args()
    generated=build(); OUT.mkdir(parents=True,exist_ok=True); stale=[]
    for name,value in generated.items():
        path=OUT/name; expected=serialized(value)
        if args.check:
            if not path.is_file() or path.read_text(encoding='utf-8')!=expected: stale.append(name)
        else: path.write_text(expected,encoding='utf-8')
    if stale:
        print('Manifiestos desactualizados: '+', '.join(stale)); return 1
    print(('Manifiestos vigentes' if args.check else 'Manifiestos generados')+f': {len(generated)}')
    return 0
if __name__=='__main__': sys.exit(main())
