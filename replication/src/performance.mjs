export function percentile(values, probability) {
  if (!values.length) throw new Error('Se requiere al menos una observación.');
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * probability;
  const low = Math.floor(position);
  const high = Math.ceil(position);
  return low === high ? sorted[low] : sorted[low] + (sorted[high] - sorted[low]) * (position - low);
}

export function summarize(values) {
  const p50 = percentile(values, 0.5);
  const deviations = values.map((value) => Math.abs(value - p50));
  return {
    count: values.length,
    p50,
    p95: percentile(values, 0.95),
    p99: percentile(values, 0.99),
    mad: percentile(deviations, 0.5),
    iqr: percentile(values, 0.75) - percentile(values, 0.25),
  };
}

export function serializableState(value) {
  if (value instanceof Map) return [...value.entries()];
  return value;
}

export function evaluateCobriaBudget(row, baseline, budget) {
  const storageRatio = row.storageBytes.p50 / baseline.storageBytes.p50;
  const checks = [
    ['queryP99Ms', row.queryMs.p99, budget.queryP99Ms],
    ['recoveryP50Ms', row.recoveryMs.p50, budget.recoveryP50Ms],
    ['writeAmplification', row.writeAmplification.p50, budget.writeAmplification],
    ['storageRatio', storageRatio, budget.storageRatio],
  ].map(([metric, observed, maximum]) => ({ metric, observed, maximum, passed: observed <= maximum }));
  return { checks, passed: checks.every((check) => check.passed) };
}
