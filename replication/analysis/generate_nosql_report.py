import csv, json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
src=root/'results/nosql-core-1.0/summary.json'
data=json.loads(src.read_text())
rows=data['summary']
out=root/'results/nosql-core-1.0'

lines=[
'# Resultados COBRIA Core 1.0', '',
f'Corridas ejecutadas: **{data["runs"]}**.', '',
'Los resultados corresponden a motores NoSQL documentales embebidos. No representan latencia de servicios administrados, redes, regiones ni facturación.', '',
'| Motor | Escala | Corridas | P1 canónico (ms) | P1 proyección (ms) | R1 (ms) | Amplificación | Fugas | Conformidad |',
'|---|---:|---:|---:|---:|---:|---:|---:|---|']
for r in rows:
    lines.append(f'| {r["engine"]} | {r["size"]} | {r["runs"]} | {r["p1CanonicalMedianMs"]:.3f} | {r["p1ProjectionMedianMs"]:.3f} | {r["r1MedianMs"]:.3f} | {r["writeAmplification"]:.1f} | {r["foreignDocuments"]} | {"superada" if r["allPass"] else "fallida"} |')
(out/'REPORT.md').write_text('\n'.join(lines)+'\n')

tex=['% Generado automáticamente. No editar.',f'\\newcommand{{\\CobriaNoSQLRuns}}{{{data["runs"]}}}',f'\\newcommand{{\\CobriaNoSQLGroups}}{{{len(rows)}}}',f'\\newcommand{{\\CobriaNoSQLAllPass}}{{{"sí" if all(r["allPass"] for r in rows) else "no"}}}']
(out/'results-macros.tex').write_text('\n'.join(tex)+'\n')
print(out/'REPORT.md')
