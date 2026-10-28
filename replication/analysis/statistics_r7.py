#!/usr/bin/env python3
"""Regenera estadística, tablas, gráfico y límites del protocolo R7."""
import csv, hashlib, json, math, random, statistics
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'results'/'core-r7-confirmatory'
ALTERNATIVES=ROOT/'results'/'core-1.3-alternatives'
OUT=ROOT/'results'/'core-r7-statistics'
PROTOCOL=json.loads((ROOT/'protocol/r7-confirmatory.json').read_text())

def percentile(values,p):
    ordered=sorted(values);position=(len(ordered)-1)*p;lower=math.floor(position);upper=math.ceil(position)
    return ordered[lower] if lower==upper else ordered[lower]+(ordered[upper]-ordered[lower])*(position-lower)
def mad(values):
    center=statistics.median(values);return statistics.median(abs(value-center) for value in values)
def bootstrap(values,seed,repetitions=5000):
    rng=random.Random(seed);n=len(values);estimates=[statistics.median(rng.choices(values,k=n)) for _ in range(repetitions)];return percentile(estimates,.025),percentile(estimates,.975)
def sign_permutation(differences,seed,repetitions=20000):
    observed=abs(statistics.fmean(differences));rng=random.Random(seed);extreme=0
    for _ in range(repetitions):
        candidate=abs(statistics.fmean(value if rng.random()<.5 else -value for value in differences));extreme+=candidate>=observed
    return (extreme+1)/(repetitions+1)
def holm(rows):
    running=0
    for rank,(index,row) in enumerate(sorted(enumerate(rows),key=lambda pair:pair[1]['p_raw'])):
        running=max(running,min(1,row['p_raw']*(len(rows)-rank)));rows[index]['p_holm']=running

datasets={};missing=[];hashes={}
for engine in PROTOCOL['engines']:
    raw=SOURCE/engine/'raw.jsonl'
    if not raw.exists():
        datasets[engine]=[];missing.extend(f'{engine}/{size}: 0/{PROTOCOL["runsPerSize"]}' for size in PROTOCOL['sizes']);continue
    hashes[engine]=hashlib.sha256(raw.read_bytes()).hexdigest();datasets[engine]=[json.loads(line) for line in raw.read_text().splitlines() if line.strip()]
    for size in PROTOCOL['sizes']:
        count=sum(row['size']==size for row in datasets[engine])
        if count!=PROTOCOL['runsPerSize']:missing.append(f'{engine}/{size}: {count}/{PROTOCOL["runsPerSize"]}')

metric_extractors={
    'consulta_canónica_ms':lambda row:row['P1']['canonicalMs'],'consulta_proyección_ms':lambda row:row['P1']['projectionMs'],
    'reconstrucción_ms':lambda row:row['R1']['rebuildMs'],'duración_total_ms':lambda row:row['resources']['wallMs'],
    'cpu_usuario_ms':lambda row:row['resources']['cpuUserMicros']/1000,'cpu_sistema_ms':lambda row:row['resources']['cpuSystemMicros']/1000,
    'rss_máximo_bytes':lambda row:row['resources']['maxRssBytes'],'almacenamiento_físico_bytes':lambda row:row['resources']['storageBytes'],
    'almacenamiento_lógico_bytes':lambda row:row['resources']['logicalBytes'],'amplificación_escritura':lambda row:row['P2']['writeAmplification'],
}
rows=[];comparisons=[];correctness=[]
for engine,data in datasets.items():
    correctness.append({'motor':engine,'observaciones':len(data),'todas_conformes':bool(data) and all(all(row[test]['pass'] for test in PROTOCOL['experiments']) for row in data)})
    for size in PROTOCOL['sizes']:
        group=[row for row in data if row['size']==size]
        if not group:continue
        for metric,extract in metric_extractors.items():
            values=[extract(row) for row in group];low,high=bootstrap(values,PROTOCOL['seed']+size+len(rows))
            rows.append({'motor':engine,'n':size,'métrica':metric,'corridas':len(values),'p50':percentile(values,.5),'p95':percentile(values,.95),'p99':percentile(values,.99),'mad':mad(values),'iqr':percentile(values,.75)-percentile(values,.25),'ic95_mediana_inferior':low,'ic95_mediana_superior':high})
        differences=[row['P1']['projectionMs']-row['P1']['canonicalMs'] for row in group];ratios=[row['P1']['projectionMs']/max(row['P1']['canonicalMs'],1e-9) for row in group];deviation=statistics.stdev(differences) if len(differences)>1 else 0
        comparisons.append({'motor':engine,'n':size,'corridas':len(group),'diferencia_pareada_media_ms':statistics.fmean(differences),'razón_pareada_mediana':statistics.median(ratios),'tamaño_efecto_dz':statistics.fmean(differences)/deviation if deviation else 0,'fracción_proyección_más_rápida':sum(value<0 for value in differences)/len(differences),'p_raw':sign_permutation(differences,PROTOCOL['seed']+size+len(comparisons))})
holm(comparisons)
negative=[]
for row in comparisons:
    reasons=[]
    if row['razón_pareada_mediana']>=1: reasons.append('la razón mediana no favoreció la proyección')
    if row['diferencia_pareada_media_ms']>=0: reasons.append('la diferencia media no favoreció la proyección')
    if row['p_holm']>=.05: reasons.append('la comparación no fue concluyente tras el ajuste de Holm')
    if reasons: negative.append({'motor':row['motor'],'n':row['n'],'resultado':'; '.join(reasons),'razón':row['razón_pareada_mediana'],'p_holm':row['p_holm']})

alternative_raw=ALTERNATIVES/'raw.json'
alternative_rows=json.loads(alternative_raw.read_text()) if alternative_raw.exists() else []
alternative_strategies=sorted({row['strategy'] for row in alternative_rows})
alternative_sizes=sorted({row['size'] for row in alternative_rows})
alternatives={
    'scope':'microcomparación algorítmica en un proceso Node.js; no demuestra rendimiento distribuido',
    'observations':len(alternative_rows),'strategies':alternative_strategies,'sizes':alternative_sizes,
    'runsPerCell':30 if alternative_rows else 0,
    'complete':len(alternative_rows)==630 and len(alternative_strategies)==7 and alternative_sizes==[1000,10000,50000],
    'rawSha256':hashlib.sha256(alternative_raw.read_bytes()).hexdigest() if alternative_raw.exists() else None,
}
status='confirmatorio-completo-interno' if not missing else 'confirmatorio-interno-incompleto'
payload={'schemaVersion':'1.0.0','protocol':PROTOCOL['protocol'],'status':status,'scope':'resultados internos de un nodo por motor; no generalizables','rawSha256':hashes,'missingCells':missing,'method':{'percentiles':'interpolación lineal','intervals':'bootstrap percentil de mediana, 5000 remuestras','dispersion':'MAD e IQR','pairedEffect':'dz sobre diferencias pareadas y razón pareada mediana','test':'permutación de signos, 20000 remuestras','multiplicity':'Holm'},'correctness':correctness,'metrics':rows,'comparisons':comparisons,'negativeResults':negative,'alternatives':alternatives,'humanPending':PROTOCOL['humanPending']}
OUT.mkdir(parents=True,exist_ok=True);(OUT/'summary.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
with (OUT/'summary.csv').open('w',newline='') as file:
    writer=csv.DictWriter(file,fieldnames=rows[0].keys() if rows else ['motor']);writer.writeheader();writer.writerows(rows)
report=['# Evidencia confirmatoria interna R7','',f'**Estado:** {status}.','',payload['scope']+'.','',f"Observaciones disponibles: {sum(len(data) for data in datasets.values())}.",'']
if missing:report+=['## Celdas ausentes','',*[f'- {item}' for item in missing],'']
report+=['## Corrección contractual','','| Motor | Observaciones | P1/P2/R1/S1/A1 conformes |','|---|---:|:---:|',*[f"| {row['motor']} | {row['observaciones']} | {'sí' if row['todas_conformes'] else 'no o incompleto'} |" for row in correctness],'','## Comparación pareada de lectura','','| Motor | n | corridas | razón p50 | diferencia media ms | dz | fracción favorable | p Holm |','|---|---:|---:|---:|---:|---:|---:|---:|']
report += [f"| {row['motor']} | {row['n']} | {row['corridas']} | {row['razón_pareada_mediana']:.3f} | {row['diferencia_pareada_media_ms']:.3f} | {row['tamaño_efecto_dz']:.3f} | {row['fracción_proyección_más_rápida']:.2f} | {row['p_holm']:.4f} |" for row in comparisons]
report+=['','## Resultados negativos, no favorables o no concluyentes','']+([*[f"- {row['motor']} n={row['n']}: {row['resultado']} (razón {row['razón']:.3f}; p Holm {row['p_holm']:.4f})." for row in negative]] if negative else ['- No se observaron celdas desfavorables según los criterios preregistrados; esto no implica superioridad universal.'])
report+=['','## Comparación de alternativas','',f"Se conservaron {alternatives['observations']} observaciones de {len(alternatives['strategies'])} estrategias: {', '.join(alternatives['strategies'])}.",alternatives['scope']+'.','', '## Límites','','CPU y RSS describen el proceso cliente; RSS es el máximo acumulado del proceso y no memoria aislada por corrida. El tamaño físico depende del motor y no es directamente comparable entre proveedores. Las corridas usan un nodo local y no incluyen red, clúster ni servicio administrado. La réplica externa, transferencia humana y revisión bibliográfica doble permanecen pendientes.']
(OUT/'REPORT.md').write_text('\n'.join(report)+'\n')

available=[row for row in comparisons if row['corridas']]
width=900;height=80+55*max(1,len(available));bars=[]
for index,row in enumerate(available):
    ratio=min(row['razón_pareada_mediana'],2);bar=ratio/2*520;y=55+index*55;color='#2f7657' if ratio<1 else '#b94d36';bars.append(f'<text x="20" y="{y+18}" font-size="14">{row["motor"]} · n={row["n"]}</text><rect x="230" y="{y}" width="{bar:.1f}" height="24" fill="{color}"/><text x="{240+bar:.1f}" y="{y+18}" font-size="13">{row["razón_pareada_mediana"]:.3f}</text>')
svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><rect width="100%" height="100%" fill="#fffdf7"/><text x="20" y="28" font-size="20" font-weight="700">Razón pareada: proyección / canónica</text><line x1="490" y1="42" x2="490" y2="{height-20}" stroke="#082b23" stroke-dasharray="4 4"/>{"".join(bars)}</svg>'
(OUT/'paired-ratios.svg').write_text(svg)
print(json.dumps({'status':status,'observations':sum(len(data) for data in datasets.values()),'cells':len(rows),'comparisons':len(comparisons),'negativeResults':len(negative)},ensure_ascii=False))
