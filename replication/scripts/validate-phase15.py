#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PLAN = json.loads((ROOT/'specification/phase-15/benchmark-plan.json').read_text())
BUDGETS = json.loads((ROOT/'specification/phase-15/budgets.json').read_text())
RESULT = json.loads((ROOT/'replication/results/core-1.3-alternatives/summary.json').read_text())
RAW = json.loads((ROOT/'replication/results/core-1.3-alternatives/raw.json').read_text())
errors = []

strategies = set(PLAN['strategies'])
sizes = set(PLAN['workload']['sizes'])
runs = PLAN['workload']['runs']
expected = len(strategies) * len(sizes) * runs
if len(RAW) != expected or RESULT.get('rawCount') != expected:
    errors.append(f'se esperaban {expected} observaciones')
if {row['strategy'] for row in RESULT.get('summary', [])} != strategies:
    errors.append('las estrategias resumidas no coinciden con el plan')
if {row['size'] for row in RESULT.get('summary', [])} != sizes:
    errors.append('los tamaños resumidos no coinciden con el plan')
for row in RESULT.get('summary', []):
    for metric in PLAN['metrics']:
        stats = row.get(metric, {})
        if any(name not in stats for name in PLAN['statistics']):
            errors.append(f"{row['strategy']}/{row['size']} carece de estadísticas para {metric}")
if set(map(int, BUDGETS['bySize'])) != sizes:
    errors.append('los presupuestos no cubren todos los tamaños')
if len(RESULT.get('budgetResults', [])) != len(sizes):
    errors.append('faltan evaluaciones de presupuesto')
if RESULT.get('warmupRuns') != PLAN['workload'].get('warmupRuns'):
    errors.append('el calentamiento ejecutado no coincide con el plan')
if RESULT.get('executionOrder') != PLAN['workload'].get('order'):
    errors.append('el orden de ejecución no coincide con el plan')
if not RESULT.get('workProxyFormula'):
    errors.append('falta declarar la fórmula y limitación del proxy de trabajo')
if 'consumo energético medido' not in RESULT.get('method', ''):
    errors.append('el resultado no limita la afirmación energética')
for required in ('MANUAL-RENDIMIENTO-COSTO-SOSTENIBILIDAD.md', 'INFORME-DE-DECISION.md'):
    if not (ROOT/'specification/phase-15'/required).exists():
        errors.append(f'falta {required}')

if errors:
    print('Fase 15 inválida:')
    for error in errors: print(f'- {error}')
    raise SystemExit(1)
print(f'Fase 15 válida: {expected} observaciones, {len(strategies)} alternativas, percentiles, dispersión, recursos y presupuestos.')
