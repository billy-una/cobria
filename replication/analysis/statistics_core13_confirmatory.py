#!/usr/bin/env python3
import argparse, csv, json, math, random, statistics
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'results'/'core-1.3-statistics'
ENGINES=('mongodb','couchdb','opensearch')
SIZES=(100,1000,5000)
EXPECTED_RUNS=30

def pct(values,p):
    values=sorted(values); i=(len(values)-1)*p; lo=math.floor(i); hi=math.ceil(i)
    return values[lo] if lo==hi else values[lo]+(values[hi]-values[lo])*(i-lo)

def bootstrap_ci(values,seed,repetitions=5000):
    rng=random.Random(seed); n=len(values)
    estimates=[statistics.median(rng.choices(values,k=n)) for _ in range(repetitions)]
    return pct(estimates,.025),pct(estimates,.975)

def sign_permutation_p(differences,seed,repetitions=20000):
    observed=abs(statistics.fmean(differences)); rng=random.Random(seed); extreme=0
    for _ in range(repetitions):
        candidate=abs(statistics.fmean(value if rng.random()<.5 else -value for value in differences))
        extreme+=candidate>=observed
    return (extreme+1)/(repetitions+1)

def holm(items):
    ordered=sorted(enumerate(items),key=lambda pair:pair[1]['p_raw']); running=0
    for rank,(original,item) in enumerate(ordered):
        adjusted=min(1,item['p_raw']*(len(items)-rank)); running=max(running,adjusted)
        items[original]['p_holm']=running

parser=argparse.ArgumentParser()
parser.add_argument('--allow-incomplete',action='store_true',help='genera un informe preliminar y conserva las celdas ausentes')
args=parser.parse_args()
datasets={}; missing=[]
for engine in ENGINES:
    path=ROOT/'results'/'core-1.3-confirmatory'/engine/'raw.jsonl'
    if not path.exists(): missing.extend(f'{engine}/{size}: archivo ausente' for size in SIZES); continue
    data=[json.loads(line) for line in path.read_text().splitlines() if line.strip()]
    datasets[engine]=data
    for size in SIZES:
        count=sum(item['size']==size for item in data)
        if count!=EXPECTED_RUNS: missing.append(f'{engine}/{size}: {count}/{EXPECTED_RUNS} corridas')
if missing and not args.allow_incomplete:
    raise SystemExit('Conjunto confirmatorio incompleto:\n- '+'\n- '.join(missing)+'\nUse --allow-incomplete únicamente para un informe preliminar.')

rows=[]; comparisons=[]
for engine,data in datasets.items():
    for size in sorted({item['size'] for item in data}):
        group=[item for item in data if item['size']==size]
        for metric,extract in (
            ('consulta_canónica_ms',lambda item:item['P1']['canonicalMs']),
            ('consulta_proyección_ms',lambda item:item['P1']['projectionMs']),
            ('reconstrucción_ms',lambda item:item['R1']['rebuildMs'])):
            values=[extract(item) for item in group]; low,high=bootstrap_ci(values,20260920+size+len(rows))
            rows.append({'motor':engine,'n':size,'métrica':metric,'corridas':len(values),'p50':pct(values,.5),'p95':pct(values,.95),'p99':pct(values,.99),'ic95_mediana_inferior':low,'ic95_mediana_superior':high,'media':statistics.fmean(values),'desviación':statistics.stdev(values) if len(values)>1 else 0})
        differences=[item['P1']['projectionMs']-item['P1']['canonicalMs'] for item in group]
        ratios=[item['P1']['projectionMs']/item['P1']['canonicalMs'] for item in group if item['P1']['canonicalMs']>0]
        deviation=statistics.stdev(differences) if len(differences)>1 else 0
        comparisons.append({'motor':engine,'n':size,'corridas':len(group),'diferencia_pareada_media_ms':statistics.fmean(differences),'razón_pareada_mediana':statistics.median(ratios),'tamaño_efecto_dz':statistics.fmean(differences)/deviation if deviation else 0,'p_raw':sign_permutation_p(differences,20260920+size)})
holm(comparisons)

OUT.mkdir(parents=True,exist_ok=True)
payload={'alcance':'repetición confirmatoria Core 1.3','estado':'preliminar-incompleto' if missing else 'confirmatorio-completo','celdasAusentes':missing,'intervalo':'bootstrap percentil de la mediana, 5000 remuestras','contraste':'permutación pareada de signos, 20000 remuestras; ajuste Holm','filas':rows,'comparaciones':comparisons}
(OUT/'summary.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2))
with (OUT/'summary.csv').open('w',newline='') as file:
    writer=csv.DictWriter(file,fieldnames=rows[0].keys() if rows else ['motor']);writer.writeheader();writer.writerows(rows)
md=['# Estadística confirmatoria COBRIA Core 1.3','',f"**Estado:** {payload['estado']}.",'','Los tiempos describen esta máquina y configuración; no son parámetros universales.','']
if missing: md+=['## Celdas ausentes','',*[f'- {item}' for item in missing],'']
md+=['| Motor | n | Métrica | Corridas | p50 | IC95 % mediana | p95 | p99 |','|---|---:|---|---:|---:|---:|---:|---:|']
for row in rows: md.append(f"| {row['motor']} | {row['n']} | {row['métrica']} | {row['corridas']} | {row['p50']:.3f} | [{row['ic95_mediana_inferior']:.3f}, {row['ic95_mediana_superior']:.3f}] | {row['p95']:.3f} | {row['p99']:.3f} |")
md+=['','## Comparaciones pareadas','','| Motor | n | Diferencia media ms | Razón mediana | dz | p | p Holm |','|---|---:|---:|---:|---:|---:|---:|']
for row in comparisons: md.append(f"| {row['motor']} | {row['n']} | {row['diferencia_pareada_media_ms']:.3f} | {row['razón_pareada_mediana']:.3f} | {row['tamaño_efecto_dz']:.3f} | {row['p_raw']:.4f} | {row['p_holm']:.4f} |")
(OUT/'REPORT.md').write_text('\n'.join(md)+'\n')
print(f"Generadas {len(rows)} filas; estado: {payload['estado']}.")
