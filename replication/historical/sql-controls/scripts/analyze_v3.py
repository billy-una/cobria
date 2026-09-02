import csv,json,math,random,statistics
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'results/phase3/raw'; OUT=ROOT/'results/phase3/processed'; FIG=ROOT/'results/phase3/figures'; TAB=ROOT/'results/phase3/tables'
for p in (OUT,FIG,TAB): p.mkdir(parents=True,exist_ok=True)
rows=[]
for p in RAW.glob('*.jsonl'):
    # Los archivos conservados como evidencia de ejecuciones descartadas no
    # forman parte del conjunto analítico congelado.
    if 'discarded' in p.name:
        continue
    rows.extend(json.loads(x) for x in p.read_text().splitlines() if x.strip())

def boot(v,n=10000):
    rnd=random.Random(20260823+len(v)); b=sorted(statistics.median(rnd.choices(v,k=len(v))) for _ in range(n))
    return b[int(.025*(n-1))],b[int(.975*(n-1))]

groups={}
for r in rows:
    key=tuple(r.get(k) for k in ('experiment','profile','N','configuration'))
    groups.setdefault(key,[]).append(r)
summary=[]
for key,xs in groups.items():
    out=dict(zip(('experiment','profile','N','configuration'),key));out['runs']=len(xs)
    for f in sorted({k for x in xs for k,v in x.items() if isinstance(v,(int,float)) and k not in {'rep','N'}}):
        v=[float(x[f]) for x in xs if isinstance(x.get(f),(int,float)) and math.isfinite(x[f])]
        if v:
            lo,hi=boot(v);out[f+'_median']=statistics.median(v);out[f+'_ci_low']=lo;out[f+'_ci_high']=hi
    summary.append(out)
cols=sorted({k for x in summary for k in x})
with (OUT/'summary-v3.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(sorted(summary,key=lambda x:str(x)))

paired=[]
for profile in ('R','A','B'):
  for N in (1000,10000,50000):
    xs=[r for r in rows if r.get('experiment')=='PG-P1' and r.get('profile')==profile and r.get('N')==N]
    by={}
    for r in xs: by.setdefault(r['rep'],{})[r['configuration']]=r['p95Ms']
    for a,b in (('B0','C1'),('B1','C1')):
      ratios=[v[a]/v[b] for v in by.values() if a in v and b in v and v[b]>0];diffs=[v[a]-v[b] for v in by.values() if a in v and b in v]
      lo,hi=boot(ratios); nz=[d for d in diffs if d!=0];pos=sum(d>0 for d in nz);n=len(nz)
      tail=sum(math.comb(n,k) for k in range(0,min(pos,n-pos)+1))/(2**n) if n else 1;p=min(1,2*tail)
      paired.append({'profile':profile,'N':N,'comparison':a+'/'+b,'runs':len(ratios),'median_ratio':statistics.median(ratios),'ratio_ci_low':lo,'ratio_ci_high':hi,'median_difference_ms':statistics.median(diffs),'sign_test_p':p})
order=sorted(range(len(paired)),key=lambda i:paired[i]['sign_test_p']);running=0
for rank,i in enumerate(order):
    adj=min(1,paired[i]['sign_test_p']*(len(paired)-rank));running=max(running,adj);paired[i]['holm_p']=running
with (OUT/'paired-effects-v3.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=paired[0]);w.writeheader();w.writerows(paired)

economic=[]
for profile in ('R','A','B'):
  for N in (1000,10000,50000):
    q={r['configuration']:r['p95Ms'] for r in rows if r.get('experiment')=='PG-P1' and r.get('profile')==profile and r.get('N')==N and r.get('rep')==0}
    # Usar medianas de todas las corridas, no la repetición cero.
    for c in list(q): q[c]=statistics.median(r['p95Ms'] for r in rows if r.get('experiment')=='PG-P1' and r.get('profile')==profile and r.get('N')==N and r.get('configuration')==c)
    w={c:statistics.median(r['durationMs'] for r in rows if r.get('experiment')=='PG-P2' and r.get('profile')==profile and r.get('N')==N and r.get('configuration')==c) for c in ('B1','C1')}
    saving=q['B1']-q['C1'];penalty=w['C1']-w['B1'];ratio=penalty/saving if saving>0 else None
    economic.append({'profile':profile,'N':N,'b1_query_p95_ms':q['B1'],'c1_query_p95_ms':q['C1'],'query_saving_ms':saving,'b1_write_ms':w['B1'],'c1_write_ms':w['C1'],'write_penalty_ms':penalty,'break_even_reads_per_write':ratio,'decision':('C1 justificable sobre el umbral' if ratio is not None and ratio>0 else 'B1 domina en esta métrica')})
with (OUT/'economic-break-even.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=economic[0]);w.writeheader();w.writerows(economic)

def tex_escape(x): return str(x).replace('_','\\_')
ref=[x for x in summary if x['experiment']=='PG-P1' and x['profile']=='R' and x['N']==50000]
with (TAB/'phase3-summary.tex').open('w') as f:
    f.write('\\begin{table}[H]\\centering\\caption{Resultados PostgreSQL del perfil R con 50\\,000 entidades.}\\label{tab:pg-fase3}\\begin{tabular}{lrrr}\\toprule Configuración & p50 (ms) & p95 (ms) & p99 (ms)\\\\\\midrule\n')
    for x in sorted(ref,key=lambda z:z['configuration']): f.write(f"{x['configuration']} & {x['p50Ms_median']:.2f} & {x['p95Ms_median']:.2f} & {x['p99Ms_median']:.2f}\\\\\n")
    f.write('\\bottomrule\\end{tabular}\\end{table}\n')
coords=' '.join(f"({x['configuration']},{x['p95Ms_median']:.4f})" for x in sorted(ref,key=lambda z:z['configuration']))
(FIG/'pg-p1-latency.tex').write_text('''\\begin{figure}[H]\\centering
\\begin{tikzpicture}\\begin{axis}[ybar,bar width=18pt,width=.82\\textwidth,height=7cm,ylabel={Latencia p95 (ms)},symbolic x coords={B0,B1,C1},xtick=data,ymajorgrids=true,grid style={dashed,gray!35},nodes near coords,nodes near coords align={vertical}]
\\addplot[fill=gray!45,draw=black] coordinates {'''+coords+'''};\\end{axis}\\end{tikzpicture}
\\caption{Mediana p95 en PostgreSQL para el perfil R con 50\\,000 entidades.}\\label{fig:pg-p1-fase3}\\end{figure}\n''')
eco=[x for x in economic if x['profile']=='R'];eco_coords=' '.join(f"({x['N']},{max(0,x['break_even_reads_per_write'] or 0):.5f})" for x in eco)
(FIG/'economic-break-even.tex').write_text('''\\begin{figure}[H]\\centering
\\begin{tikzpicture}\\begin{axis}[width=.82\\textwidth,height=7cm,xmode=log,log basis x=10,xlabel={Entidades},ylabel={Lecturas mínimas por escritura},grid=major,mark=*]
\\addplot[black,thick] coordinates {'''+eco_coords+'''};\\end{axis}\\end{tikzpicture}
\\caption{Umbral temporal para justificar C1 frente a B1 en el perfil R.}\\label{fig:equilibrio-fase3}\\end{figure}\n''')

fail={}
for e in ('PG-F1','PG-F2','PG-F3','PG-F4','PG-F5'):
    xs=[r for r in rows if r.get('experiment')==e];fail[e]=len(xs)
dq=[r for r in rows if r.get('experiment')=='PG-DQ1']
with (TAB/'phase3-robustness.tex').open('w') as f:
    f.write('\\begin{table}[H]\\centering\\caption{Calidad semirrealista y fallos operacionales en PostgreSQL.}\\label{tab:pg-robustez}\\begin{tabular}{p{4.8cm}r l}\\toprule Indicador & Resultado & Criterio\\\\\\midrule\n')
    f.write(f"Duplicados lógicos suprimidos (mediana) & {statistics.median(x['duplicates'] for x in dq):.0f} & observables\\\\\n")
    f.write(f"Registros antiguos reparados (mediana) & {statistics.median(x['repaired'] for x in dq):.0f} & migración explícita\\\\\n")
    f.write(f"Catálogos desconocidos en cuarentena (mediana) & {statistics.median(x['quarantined'] for x in dq):.0f} & no aceptación silenciosa\\\\\n")
    f.write(f"Entrega duplicada con un solo efecto & {sum(x.get('effects')==1 for x in rows if x.get('experiment')=='PG-F1')}/{fail['PG-F1']} & aprobación\\\\\n")
    f.write(f"Interrupción sin pérdida visible & {sum(x.get('visibleLoss')==0 for x in rows if x.get('experiment')=='PG-F2')}/{fail['PG-F2']} & aprobación\\\\\n")
    f.write(f"Revisión obsoleta rechazada & {sum(x.get('staleAccepted')==0 for x in rows if x.get('experiment')=='PG-F3')}/{fail['PG-F3']} & aprobación\\\\\n")
    f.write(f"Corrupción reparada con exactitud 1 & {sum(x.get('recoveredAccuracy')==1 for x in rows if x.get('experiment')=='PG-F4')}/{fail['PG-F4']} & aprobación\\\\\n")
    f.write(f"Ámbito ausente rechazado & {sum(x.get('missingScopeRejected')==1 for x in rows if x.get('experiment')=='PG-F5')}/{fail['PG-F5']} & aprobación\\\\\n")
    f.write('\\bottomrule\\end{tabular}\\end{table}\n')
report={'rawRows':len(rows),'groups':len(summary),'pairedComparisons':len(paired),'economicRows':len(economic),'failureRuns':fail,'outputs':[str(OUT/'summary-v3.csv'),str(OUT/'paired-effects-v3.csv'),str(OUT/'economic-break-even.csv')]}
(lambda vals:(TAB/'phase3-macros.tex').write_text(
    '\\newcommand{\\PGObs}{'+str(len(rows))+'}\n'
    '\\newcommand{\\PGBZero}{'+f"{vals['B0']:.2f}"+'}\n'
    '\\newcommand{\\PGBOne}{'+f"{vals['B1']:.2f}"+'}\n'
    '\\newcommand{\\PGCOne}{'+f"{vals['C1']:.2f}"+'}\n'
    '\\newcommand{\\PGRatioZero}{'+f"{next(x['median_ratio'] for x in paired if x['profile']=='R' and x['N']==50000 and x['comparison']=='B0/C1'):.2f}"+'}\n'
    '\\newcommand{\\PGRatioOne}{'+f"{next(x['median_ratio'] for x in paired if x['profile']=='R' and x['N']==50000 and x['comparison']=='B1/C1'):.2f}"+'}\n'
    '\\newcommand{\\PGEconomic}{'+f"{next((x['break_even_reads_per_write'] or 0) for x in economic if x['profile']=='R' and x['N']==50000):.2f}"+'}\n'
))({c:statistics.median(r['p95Ms'] for r in rows if r.get('experiment')=='PG-P1' and r.get('profile')=='R' and r.get('N')==50000 and r.get('configuration')==c) for c in ('B0','B1','C1')})
(OUT/'analysis-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False));print(json.dumps(report,indent=2,ensure_ascii=False))
