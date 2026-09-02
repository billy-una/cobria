import csv,json,math,random,statistics
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; RAW=ROOT/'results/phase2/raw'; OUT=ROOT/'results/phase2/processed'; OUT.mkdir(parents=True,exist_ok=True)
rows=[]
for p in RAW.glob('*.jsonl'):
    rows += [json.loads(x) for x in p.read_text().splitlines() if x.strip()]
def boot(v,n=10000):
    rnd=random.Random(20260823+len(v)); b=sorted(statistics.median(rnd.choices(v,k=len(v))) for _ in range(n));return b[int(.025*(n-1))],b[int(.975*(n-1))]
groups={}
for r in rows:
    key=tuple(r.get(k) for k in ['experiment','profile','N','configuration'])
    groups.setdefault(key,[]).append(r)
summary=[]
for key,xs in groups.items():
    out=dict(zip(['experiment','profile','N','configuration'],key));out['runs']=len(xs)
    for f in sorted({k for x in xs for k,v in x.items() if isinstance(v,(int,float)) and k not in {'rep','N'}}):
        v=[float(x[f]) for x in xs if isinstance(x.get(f),(int,float)) and math.isfinite(x[f])]
        if v:
            lo,hi=boot(v);out[f+'_median']=statistics.median(v);out[f+'_ci_low']=lo;out[f+'_ci_high']=hi
    summary.append(out)
cols=sorted({k for x in summary for k in x})
with (OUT/'summary-v2.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(sorted(summary,key=lambda x:str(x)))
paired=[]
for profile in ['R','A','B']:
  for N in [1000,10000,50000]:
    xs=[r for r in rows if r.get('experiment')=='SQL-P1' and r.get('profile')==profile and r.get('N')==N]
    by={r['rep']:{} for r in xs}
    for r in xs:by[r['rep']][r['configuration']]=r['p95Ms']
    for a,b in [('B0','C1'),('B1','C1')]:
      ratios=[v[a]/v[b] for v in by.values() if a in v and b in v and v[b]>0];diffs=[v[a]-v[b] for v in by.values() if a in v and b in v]
      lo,hi=boot(ratios)
      nz=[d for d in diffs if d!=0];pos=sum(d>0 for d in nz);n=len(nz)
      tail=sum(math.comb(n,k) for k in range(0,min(pos,n-pos)+1))/(2**n) if n else 1
      p=min(1,2*tail)
      paired.append({'profile':profile,'N':N,'comparison':a+'/'+b,'runs':len(ratios),'median_ratio':statistics.median(ratios),'ratio_ci_low':lo,'ratio_ci_high':hi,'median_difference_ms':statistics.median(diffs),'sign_test_p':p})
order=sorted(range(len(paired)),key=lambda i:paired[i]['sign_test_p']);running=0
for rank,i in enumerate(order):
    adjusted=min(1,paired[i]['sign_test_p']*(len(paired)-rank));running=max(running,adjusted);paired[i]['holm_p']=running
with (OUT/'paired-effects.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=paired[0]);w.writeheader();w.writerows(paired)
print(json.dumps({'rawRows':len(rows),'groups':len(summary),'pairedComparisons':len(paired),'outputs':[str(OUT/'summary-v2.csv'),str(OUT/'paired-effects.csv')]},indent=2))
