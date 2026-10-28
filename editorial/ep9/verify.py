"""Impide reutilizar la inspección EP9 para PDF diferentes."""
from pathlib import Path
import hashlib
import json

ROOT=Path(__file__).resolve().parents[2]

def verify():
    record=json.loads((ROOT/'editorial/ep9/inspeccion.json').read_text())
    state=json.loads((ROOT/'editorial/ep9/estado.json').read_text())
    products=json.loads((ROOT/'editorial/ep9/products.json').read_text())['products']
    if {x['id'] for x in products}!={x['id'] for x in record['documents']}:
        raise ValueError('Cobertura de inspección incompleta')
    for doc in record['documents']:
        file=ROOT/doc['pdf']
        if hashlib.sha256(file.read_bytes()).hexdigest()!=doc['sha256']:
            raise ValueError('PDF cambió; repetir inspección: '+doc['id'])
        pages=doc['pages']
        if [p['page'] for p in pages]!=list(range(1,len(pages)+1)):
            raise ValueError('Páginas omitidas o repetidas')
        if any(p['inspection']!='inspeccion-macro-en-hoja-de-contacto-por-asistente' for p in pages):
            raise ValueError('Inspección macro pendiente')
    if state['pdfUaCertified'] or state['screenReaderTested'] or record['wordByWordProofread']:
        raise ValueError('Esta evidencia no autoriza declaraciones de accesibilidad o lectura humana')
    print('EP9: inspección macro vinculada a siete PDF vigentes; límites humanos conservados.')

if __name__=='__main__':verify()
