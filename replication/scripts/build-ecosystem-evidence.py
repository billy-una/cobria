"""Deriva trazabilidad de evidencia conservada sin inventar observaciones nuevas."""
import argparse
import csv
import hashlib
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def verified_bytes(path, expected):
    data = path.read_bytes()
    if hashlib.sha256(data).hexdigest() != expected:
        raise ValueError('Evidencia alterada: ' + str(path))
    return data


def build(root=ROOT):
    summary = json.loads((root / 'replication/results/core-r7-statistics/summary.json').read_text())
    counts = {}
    inputs = []
    for engine, digest in summary['rawSha256'].items():
        relative = f'replication/results/core-r7-confirmatory/{engine}/raw.jsonl'
        data = verified_bytes(root / relative, digest)
        counts[engine] = sum(1 for line in data.splitlines() if line.strip())
        declared = next(item['observaciones'] for item in summary['correctness'] if item['motor'] == engine)
        if counts[engine] != declared:
            raise ValueError('Conteo histórico divergente: ' + engine)
        inputs.append({'path': relative, 'sha256': digest, 'observations': counts[engine]})
    mapping = [
        ('P1', 'Lectura y proyección', 'Consultas locales y comparación histórica no acreditan planes nativos de los conectores PC3'),
        ('P2', 'Idempotencia y recuperación', 'Dos escrituras recuperables no son una transacción atómica'),
        ('R1', 'Publicación y reconstrucción', 'CAS de un agregado no implica atomicidad entre colecciones'),
        ('S1', 'Autorización y ámbito', 'Rechazo instrumentado no prueba ausencia de canales laterales temporales'),
        ('A1', 'Procedencia y abstención', 'Consumidor determinista; no evalúa un modelo generativo')]
    rows = [{'family': family, 'requirement': title, 'implementation': 'replication/src/pc2/contracts.mjs',
             'test': 'replication/tests/pc2-contracts.test.mjs', 'evidence': 'contratos locales; ejecución con make verificar-pc2',
             'remoteNewResults': 'pendiente', 'threat': threat, 'products': 'articulo-cobria.tex; partes/parte-r8-evidencia-confirmatoria.tex'}
            for family, title, threat in mapping]
    return {'kind': 'trazabilidad-generada-no-corrida-nueva', 'historicalR7': {'observations': sum(counts.values()), 'engines': counts, 'inputs': inputs},
            'pc3': {'observations': None, 'status': 'sin-dataset-admitido', 'meaning': 'No ejecuta ni incorpora nuevas corridas; no deduce ausencia de archivos por sí solo'},
            'humanReviewVerified': False, 'rows': rows}


def outputs(data):
    stream = io.StringIO()
    writer = csv.DictWriter(stream, fieldnames=list(data['rows'][0]))
    writer.writeheader()
    writer.writerows(data['rows'])
    paragraph = r'''La propuesta combina mecanismos existentes, no los sustituye por una
afirmación de novedad absoluta. Separar lectura y escritura puede añadir complejidad
sin beneficio cuando el dominio no lo justifica \parencite{fowler2011cqrs}.
Reconstruir una proyección desde documentos canónicos tampoco exige conservar todos
los cambios como eventos \parencite{fowler2005eventsourcing}. El control de revisión
de un documento debe distinguirse de una transacción entre documentos
\parencite{apacheCouchDocumentApi}. Estas referencias orientan alternativas y amenazas;
no demuestran superioridad de COBRIA. La selección bibliográfica exploratoria asistida
no equivale al doble cribado humano ni a una revisión sistemática completa.
'''
    return {'evidencia.json': json.dumps(data, ensure_ascii=False, indent=2) + '\n', 'trazabilidad.csv': stream.getvalue(), 'interpretacion.tex': paragraph}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    target = ROOT / 'editorial/generated/ecosistema-13-14'
    for name, content in outputs(build()).items():
        file = target / name
        if args.check:
            if not file.exists() or file.read_bytes() != content.encode():
                raise SystemExit('Derivado desactualizado: ' + name)
        else:
            target.mkdir(parents=True, exist_ok=True)
            file.write_bytes(content.encode())
    print('Evidencia histórica íntegra y trazabilidad de cinco familias comprobadas; no son resultados PC3.')
