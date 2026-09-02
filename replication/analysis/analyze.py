import csv, json, math, statistics, random
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'results/raw/measurements.jsonl'
OUT=ROOT/'results/processed'; FIG=ROOT/'results/figures'; TAB=ROOT/'results/tables'
for p in (OUT,FIG,TAB): p.mkdir(parents=True,exist_ok=True)
rows=[json.loads(line) for line in RAW.read_text().splitlines() if line.strip()]

def numeric(values): return [float(v) for v in values if isinstance(v,(int,float)) and math.isfinite(v)]
def bootstrap_ci(values, draws=4000):
    if not values: return (math.nan, math.nan)
    rnd=random.Random(20260820+len(values)); n=len(values)
    boot=sorted(statistics.median(rnd.choices(values,k=n)) for _ in range(draws))
    return boot[int(.025*(draws-1))],boot[int(.975*(draws-1))]
groups={}
for r in rows:
    key=(r.get('experiment'),r.get('profile'),r.get('N'),r.get('configuration'),r.get('projectionCount'),r.get('changeRatio'))
    groups.setdefault(key,[]).append(r)

summary=[]
for key,items in sorted(groups.items(),key=lambda x:str(x[0])):
    base=dict(zip(['experiment','profile','N','configuration','projectionCount','changeRatio'],key)); base['runs']=len(items)
    fields=sorted({k for i in items for k,v in i.items() if isinstance(v,(int,float)) and k not in {'rep','N','projectionCount','changeRatio'}})
    for f in fields:
        vals=numeric([i.get(f) for i in items]);
        if vals:
            lo,hi=bootstrap_ci(vals); base[f'{f}_median']=statistics.median(vals); base[f'{f}_ci_low']=lo; base[f'{f}_ci_high']=hi; base[f'{f}_min']=min(vals); base[f'{f}_max']=max(vals)
    summary.append(base)
cols=sorted({k for r in summary for k in r})
with (OUT/'summary.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=cols); w.writeheader(); w.writerows(summary)

def svg_line(filename,title,series,xlabel,ylabel):
    W,H=900,520; ml,mr,mt,mb=90,30,60,70
    points=[(x,y,label) for label,data in series for x,y in data]
    if not points:return
    xs=[p[0] for p in points]; ys=[p[1] for p in points]; xmin,xmax=min(xs),max(xs); ymin,ymax=min(ys),max(ys)
    if xmax==xmin:xmax+=1
    if ymax==ymin:ymax+=1
    sx=lambda x:ml+(x-xmin)/(xmax-xmin)*(W-ml-mr); sy=lambda y:H-mb-(y-ymin)/(ymax-ymin)*(H-mt-mb)
    colors=['#111','#555','#888','#bbb']; out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">','<rect width="100%" height="100%" fill="white"/>',f'<text x="{W/2}" y="30" text-anchor="middle" font-family="serif" font-size="22">{title}</text>',f'<line x1="{ml}" y1="{H-mb}" x2="{W-mr}" y2="{H-mb}" stroke="black"/>',f'<line x1="{ml}" y1="{mt}" x2="{ml}" y2="{H-mb}" stroke="black"/>']
    for idx,(label,data) in enumerate(series):
        d=' '.join(('M' if i==0 else 'L')+f' {sx(x):.1f} {sy(y):.1f}' for i,(x,y) in enumerate(sorted(data)))
        out.append(f'<path d="{d}" fill="none" stroke="{colors[idx%len(colors)]}" stroke-width="3"/>'); out.append(f'<text x="{W-180}" y="{75+idx*24}" font-family="sans-serif" font-size="16">{label}</text>')
    out += [f'<text x="{W/2}" y="{H-18}" text-anchor="middle" font-family="sans-serif">{xlabel}</text>',f'<text transform="translate(22 {H/2}) rotate(-90)" text-anchor="middle" font-family="sans-serif">{ylabel}</text>','</svg>']
    (FIG/filename).write_text('\n'.join(out))

def tex_escape(x): return str(x).replace('_','\\_')

p1=[]
for conf in ['B0','B1','C1']:
    data=[]
    for s in summary:
        if s['experiment']=='P1' and s['profile']=='R' and s['configuration']==conf: data.append((float(s['N']),float(s.get('p95Ms_median',0))))
    p1.append((conf,data))
svg_line('p1-latency.svg','P1: latencia p95 por configuración',p1,'N','p95 (ms)')
r1=[('R1',[(float(s['N']),float(s.get('durationMs_median',0))) for s in summary if s['experiment']=='R1' and s['profile']=='R'])]
svg_line('r1-rebuild.svg','R1: reconstrucción total',r1,'N','duración (ms)')

def tikz_plot(filename,caption,series,xlabel,ylabel,logx=False):
    marks=['*','square*','triangle*','diamond*']; lines=[]
    lines += ['\\begin{figure}[H]','\\centering','\\begin{tikzpicture}','\\begin{axis}[width=.88\\textwidth,height=7cm,grid=major,legend pos=north west,','xlabel={'+xlabel+'},ylabel={'+ylabel+'},'+('xmode=log,log basis x=10' if logx else '')+']']
    for i,(label,data) in enumerate(series):
        coords=' '.join(f'({x:.8g},{y:.8g})' for x,y in sorted(data)); lines += [f'\\addplot[black,mark={marks[i%len(marks)]},'+('dashed' if i%2 else 'solid')+f'] coordinates {{{coords}}};',f'\\addlegendentry{{{tex_escape(label)}}}']
    lines += ['\\end{axis}','\\end{tikzpicture}',f'\\caption{{{caption}}}','\\end{figure}']
    (FIG/filename).write_text('\n'.join(lines))

tikz_plot('p1-latency.tex','Latencia p95 de P1 para el perfil R.',p1,'Entidades, N','p95 (ms)',True)
tikz_plot('r1-rebuild.tex','Tiempo de reconstrucción total para el perfil R.',r1,'Entidades, N','Duración (ms)',True)
p2=[]
for profile in ['R','A','B']:
    p2.append((profile,[(float(s['projectionCount']),float(s['writeAmplification_median'])) for s in summary if s['experiment']=='P2' and s['profile']==profile and str(s['N'])=='10000']))
tikz_plot('p2-amplification.tex','Amplificación de escritura por número de proyecciones (N=10 000).',p2,'Proyecciones','Escrituras físicas/lógica')
r2=[]
for ratio in [.001,.01,.1,1]:
    r2.append((f'{ratio:g}',[(float(s['N']),float(s['durationMs_median'])) for s in summary if s['experiment']=='R2' and s['profile']=='R' and float(s['changeRatio'])==ratio]))
tikz_plot('r2-incremental.tex','Tiempo de reconstrucción incremental por fracción modificada (perfil R).',r2,'Entidades, N','Duración (ms)',True)

sel=[s for s in summary if s['experiment'] in {'P1','R1','R2','ISO','AI1','AI3','AI5'}]
with (TAB/'results-summary.tex').open('w') as f:
    f.write('\\begin{longtable}{llllrr}\\toprule\nExperimento & Perfil & N & Config. & Métrica & Valor \\\\\midrule\n')
    for s in sel:
        metric='p95Ms' if s['experiment']=='P1' else 'accuracy' if s['experiment'] in {'R1','R2'} else 'scopeViolations' if s['experiment'] in {'ISO','AI3'} else 'reconstructionEqual' if s['experiment']=='AI1' else 'highRiskWithoutConfirmation'
        value=s.get(metric+'_median','--')
        f.write(f"{s['experiment']} & {s['profile']} & {s['N']} & {tex_escape(s['configuration'])} & {tex_escape(metric)} & {value:.6g} \\\\\n" if isinstance(value,(int,float)) else f"{s['experiment']} & {s['profile']} & {s['N']} & {tex_escape(s['configuration'])} & {tex_escape(metric)} & {value} \\\\\n")
    f.write('\\bottomrule\\end{longtable}\n')

print(json.dumps({'rawRows':len(rows),'groups':len(summary),'summary':str(OUT/'summary.csv'),'figures':[str(p) for p in FIG.glob('*.svg')]},indent=2))
