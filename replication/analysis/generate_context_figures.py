import csv, json, statistics
from pathlib import Path

root=Path(__file__).resolve().parents[1]
out=root/'results'/'context-figures';out.mkdir(parents=True,exist_ok=True)

long=list(csv.DictReader((root/'results/phase2/longitudinal/architecture-evolution.csv').open()))
coords=' '.join(f"({i},{r['directPresentationDataImports']})" for i,r in enumerate(long))
etiquetas={'baseline':'base','phase1':'fase 1','phase2':'fase 2','phase3':'fase 3','phase7':'fase 7','performance':'rendimiento'}
labels=','.join(etiquetas.get(r['phase'],r['phase']) for r in long)
(out/'evolucion-longitudinal.tex').write_text(r'''\begin{figure}[H]\centering
\begin{tikzpicture}\begin{axis}[width=.86\textwidth,height=7cm,xlabel={Corte de evolución},ylabel={Importaciones directas},xtick={0,1,2,3,4,5},xticklabels={'''+labels+r'''},x tick label style={rotate=25,anchor=east},grid=major,mark=*]
\addplot[black,thick] coordinates {'''+coords+r'''};\end{axis}\end{tikzpicture}
\caption{Evolución longitudinal de accesos directos desde presentación. La figura se genera desde el historial analizado.}\label{fig:evolucion-longitudinal}\end{figure}
''')

ai=[]
for line in (root/'results/phase2/raw/ai-evaluation.jsonl').read_text().splitlines():
    if line.strip(): ai.append(json.loads(line))
rag=[x for x in ai if x.get('experiment')=='AI-RAG']
vals={k:statistics.median(float(x[k]) for x in rag) for k in ('precisionAt10','recallAt10','f1At10')}
coords=' '.join(f"({k},{v})" for k,v in [('Precisión',vals['precisionAt10']),('Exhaustividad',vals['recallAt10']),('F1',vals['f1At10'])])
(out/'contratos-ia.tex').write_text(r'''\begin{figure}[H]\centering
\begin{tikzpicture}\begin{axis}[ybar,bar width=22pt,width=.78\textwidth,height=6.5cm,ymin=0,ymax=1.08,ylabel={Valor},symbolic x coords={Precisión,Exhaustividad,F1},xtick=data,ymajorgrids=true,nodes near coords]
\addplot[fill=gray!45,draw=black] coordinates {'''+coords+r'''};\end{axis}\end{tikzpicture}
\caption{Contratos sintéticos de recuperación en 30 repeticiones. No constituyen evaluación humana de un modelo generativo.}\label{fig:contratos-ia}\end{figure}
''')
print(json.dumps({'figuras':2,'salida':str(out)},ensure_ascii=False))
