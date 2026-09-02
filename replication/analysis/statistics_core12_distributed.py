#!/usr/bin/env python3
"""Estadística descriptiva y pareada de la réplica distribuida COBRIA 1.2."""
import csv
import json
import math
import random
from pathlib import Path
from statistics import median

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "results" / "core-1.2-distributed"
OUT = SOURCE / "statistics"
ENGINES = ("mongodb", "couchdb", "opensearch")

def percentile(values, probability):
    ordered = sorted(values)
    position = (len(ordered) - 1) * probability
    lower, upper = math.floor(position), math.ceil(position)
    if lower == upper:
        return ordered[lower]
    return ordered[lower] + (ordered[upper] - ordered[lower]) * (position - lower)

def bootstrap_ci(values, statistic=median, repetitions=5000, seed=12026):
    generator = random.Random(seed)
    samples = [statistic([generator.choice(values) for _ in values]) for _ in range(repetitions)]
    return percentile(samples, .025), percentile(samples, .975)

def cliffs_delta(left, right):
    greater = sum(a > b for a in left for b in right)
    lower = sum(a < b for a in left for b in right)
    return (greater - lower) / (len(left) * len(right))

def mad(values):
    center = median(values)
    return median([abs(value - center) for value in values])

def iqr(values):
    return percentile(values, .75) - percentile(values, .25)

rows = []
for engine in ENGINES:
    raw = SOURCE / engine / "raw.jsonl"
    rows.extend(json.loads(line) for line in raw.read_text().splitlines() if line.strip())

summary = []
for engine in ENGINES:
    for size in (100, 1000, 5000):
        group = [row for row in rows if row["engine"] == engine and row["size"] == size]
        canonical = [row["P1"]["canonicalMs"] for row in group]
        projection = [row["P1"]["projectionMs"] for row in group]
        rebuild = [row["R1"]["rebuildMs"] for row in group]
        ratios = [p / max(c, .000001) for p, c in zip(projection, canonical)]
        ci_low, ci_high = bootstrap_ci(ratios)
        summary.append({
            "engine": engine, "size": size, "runs": len(group),
            "canonical_p50_ms": median(canonical), "canonical_p95_ms": percentile(canonical, .95), "canonical_p99_ms": percentile(canonical, .99),
            "projection_p50_ms": median(projection), "projection_p95_ms": percentile(projection, .95), "projection_p99_ms": percentile(projection, .99),
            "rebuild_p50_ms": median(rebuild), "rebuild_p95_ms": percentile(rebuild, .95), "rebuild_p99_ms": percentile(rebuild, .99),
            "canonical_mad_ms": mad(canonical), "canonical_iqr_ms": iqr(canonical),
            "projection_mad_ms": mad(projection), "projection_iqr_ms": iqr(projection),
            "rebuild_mad_ms": mad(rebuild), "rebuild_iqr_ms": iqr(rebuild),
            "paired_ratio_p50": median(ratios), "paired_ratio_ci95_low": ci_low, "paired_ratio_ci95_high": ci_high,
            "projection_faster_fraction": sum(p < c for p, c in zip(projection, canonical)) / len(group),
            "cliffs_delta_unpaired": cliffs_delta(projection, canonical)
        })

OUT.mkdir(parents=True, exist_ok=True)
(OUT / "summary.json").write_text(json.dumps({
    "method": {
        "percentiles": "interpolación lineal sobre 30 observaciones por celda",
    "confidenceInterval": "bootstrap pareado de la mediana del cociente proyección/canónica, 5000 remuestras, semilla 12026",
        "dispersion": "MAD e IQR por celda para las tres medidas temporales",
        "effectSize": "delta de Cliff no pareada, informada como complemento; el cociente pareado es el estimador principal",
        "multiplicity": "análisis exploratorio descriptivo; no se declaran pruebas confirmatorias múltiples"
    },
    "cells": summary
}, indent=2, ensure_ascii=False) + "\n")
with (OUT / "summary.csv").open("w", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=summary[0].keys())
    writer.writeheader(); writer.writerows(summary)

lines = [
    "# Estadística distribuida COBRIA 1.2", "",
    "Se analizaron 270 corridas históricas (30 por motor y escala). Los intervalos describen esta muestra y configuración; no generalizan a otros despliegues.", "",
    "| Motor | n | p50 canónica | p95/p99 canónica | p50 proyección | p95/p99 proyección | MAD/IQR canónica | MAD/IQR proyección | cociente p50 [IC95%] | fracción proyección más rápida |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|"
]
for row in summary:
    lines.append(f"| {row['engine']} | {row['size']} | {row['canonical_p50_ms']:.3f} | {row['canonical_p95_ms']:.3f}/{row['canonical_p99_ms']:.3f} | {row['projection_p50_ms']:.3f} | {row['projection_p95_ms']:.3f}/{row['projection_p99_ms']:.3f} | {row['canonical_mad_ms']:.3f}/{row['canonical_iqr_ms']:.3f} | {row['projection_mad_ms']:.3f}/{row['projection_iqr_ms']:.3f} | {row['paired_ratio_p50']:.3f} [{row['paired_ratio_ci95_low']:.3f}, {row['paired_ratio_ci95_high']:.3f}] | {row['projection_faster_fraction']:.2f} |")
lines.extend(["", "El cociente menor que 1 favorece la lectura proyectada. No se interpreta causalmente fuera del protocolo ni como clasificación universal de motores."])
(OUT / "REPORT.md").write_text("\n".join(lines) + "\n")
print(json.dumps({"rows": len(rows), "cells": len(summary), "output": str(OUT)}, ensure_ascii=False))
