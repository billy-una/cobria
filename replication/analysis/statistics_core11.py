#!/usr/bin/env python3
import csv, json, math, random, statistics
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "results" / "nosql-core-1.0" / "raw.jsonl"
OUT = ROOT / "results" / "core-1.1-statistics"
OUT.mkdir(parents=True, exist_ok=True)
random.seed(20260824)

def percentile(values, q):
    values = sorted(values); pos = (len(values)-1)*q
    lo, hi = math.floor(pos), math.ceil(pos)
    return values[lo] if lo == hi else values[lo]*(hi-pos)+values[hi]*(pos-lo)

def bootstrap_ci(values, rounds=4000):
    medians = [statistics.median(random.choices(values, k=len(values))) for _ in range(rounds)]
    return percentile(medians,.025), percentile(medians,.975)

def mad(values):
    center = statistics.median(values)
    return statistics.median([abs(value-center) for value in values])

rows = [json.loads(line) for line in SOURCE.read_text().splitlines() if line.strip()]
groups = defaultdict(list)
for row in rows:
    groups[(row["engine"], row["size"], "canónica")].append(row["P1"]["canonicalMs"])
    groups[(row["engine"], row["size"], "proyección")].append(row["P1"]["projectionMs"])
    groups[(row["engine"], row["size"], "reconstrucción")].append(row["R1"]["rebuildMs"])

summary=[]
for (engine,size,metric), values in sorted(groups.items()):
    low,high=bootstrap_ci(values)
    summary.append({"motor":engine,"n":size,"métrica":metric,"repeticiones":len(values),"p50_ms":statistics.median(values),"p95_ms":percentile(values,.95),"p99_ms":percentile(values,.99),"mad_ms":mad(values),"ic95_mediana_inferior_ms":low,"ic95_mediana_superior_ms":high})

with (OUT/"summary.csv").open("w",newline="") as handle:
    writer=csv.DictWriter(handle,fieldnames=summary[0].keys()); writer.writeheader(); writer.writerows(summary)
(OUT/"summary.json").write_text(json.dumps({"seed":20260824,"bootstrapRounds":4000,"outliersRemoved":0,"groups":summary},ensure_ascii=False,indent=2))
lines=["# Estadística ampliada COBRIA 1.1","","No se eliminaron valores atípicos. IC 95 % con 4 000 remuestras bootstrap de la mediana y semilla 20260824.","","| Motor | N | Métrica | p50 ms | p95 ms | p99 ms | MAD ms | IC95 mediana ms |","|---|---:|---|---:|---:|---:|---:|---|"]
for x in summary:
    lines.append(f'| {x["motor"]} | {x["n"]} | {x["métrica"]} | {x["p50_ms"]:.3f} | {x["p95_ms"]:.3f} | {x["p99_ms"]:.3f} | {x["mad_ms"]:.3f} | [{x["ic95_mediana_inferior_ms"]:.3f}, {x["ic95_mediana_superior_ms"]:.3f}] |')
(OUT/"REPORT.md").write_text("\n".join(lines)+"\n")
print(f"Generados {len(summary)} grupos en {OUT}")
