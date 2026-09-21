import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { evaluateCobriaBudget, serializableState, summarize } from '../src/performance.mjs';

const root = new URL('../../', import.meta.url);
const output = new URL('../results/core-1.3-alternatives/', import.meta.url);
const plan = JSON.parse(await readFile(new URL('specification/phase-15/benchmark-plan.json', root)));
const budgets = JSON.parse(await readFile(new URL('specification/phase-15/budgets.json', root)));
const { sizes, runs } = plan.workload;
const warmupRuns = plan.workload.warmupRuns;

function random(seed) {
  let state = seed >>> 0;
  return () => ((state = (state * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function shuffled(values, seed) {
  const result = [...values]; const rng = random(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const selected = Math.floor(rng() * (index + 1));
    [result[index], result[selected]] = [result[selected], result[index]];
  }
  return result;
}

function documents(size) {
  return Array.from({ length: size }, (_, index) => ({ id: `obs-${index}`, scope: `bosque-${index % 5}`, revision: 1, species: ['colibri', 'quetzal', 'rana', 'danta'][index % 4], count: (index % 9) + 1 }));
}
function materialized(docs) {
  return docs.reduce((state, doc) => { const key = `${doc.scope}:${doc.species}`; state[key] = (state[key] ?? 0) + doc.count; return state; }, {});
}
function indexDocuments(docs) {
  const index = new Map();
  for (const doc of docs) { const key = `${doc.scope}:${doc.species}`; if (!index.has(key)) index.set(key, []); index.get(key).push(doc); }
  return index;
}

const strategies = {
  'single-document': (docs) => ({ build: () => docs, query: (state) => state.filter((doc) => doc.scope === 'bosque-2' && doc.species === 'colibri'), recover: () => [...docs], writes: docs.length }),
  'native-index': (docs) => ({ build: () => indexDocuments(docs), query: (state) => state.get('bosque-2:colibri') ?? [], recover: () => indexDocuments(docs), writes: docs.length * 2 }),
  'materialized-view': (docs) => ({ build: () => materialized(docs), query: (state) => state['bosque-2:colibri'] ?? 0, recover: () => materialized(docs), writes: docs.length * 2 }),
  cqrs: (docs) => ({ build: () => ({ write: docs, read: materialized(docs) }), query: (state) => state.read['bosque-2:colibri'] ?? 0, recover: () => ({ write: docs, read: materialized(docs) }), writes: docs.length * 2 }),
  events: (docs) => ({ build: () => docs.map((doc) => ({ type: 'ObservationRecorded', data: doc })), query: (events) => events.filter((event) => event.data.scope === 'bosque-2' && event.data.species === 'colibri'), recover: (events) => events.map((event) => event.data), writes: docs.length }),
  'projection-without-contract': (docs) => ({ build: () => docs.filter((doc) => doc.scope === 'bosque-2'), query: (state) => state.filter((doc) => doc.species === 'colibri'), recover: () => docs.filter((doc) => doc.scope === 'bosque-2'), writes: docs.length + docs.length / 5 }),
  cobria: (docs) => ({ build: () => ({ manifest: { scope: 'bosque-2', sourceRevision: 1, complete: true }, data: docs.filter((doc) => doc.scope === 'bosque-2') }), query: (state) => state.data.filter((doc) => doc.species === 'colibri'), recover: () => ({ manifest: { scope: 'bosque-2', sourceRevision: 1, complete: true }, data: docs.filter((doc) => doc.scope === 'bosque-2') }), writes: docs.length + docs.length / 5 + 1 }),
};

const raw = [];
for (const size of sizes) {
  const docs = documents(size);
  for (const [strategyName, create] of Object.entries(strategies)) for (let warmup = 0; warmup < warmupRuns; warmup += 1) {
    const strategy = create(docs); const state = strategy.build(); strategy.query(state); strategy.recover(state);
  }
  for (let run = 1; run <= runs; run += 1) for (const strategyName of shuffled(Object.keys(strategies), plan.seed + size + run)) {
    const create = strategies[strategyName];
    global.gc?.();
    const memoryStart = process.memoryUsage().heapUsed;
    const cpuStart = process.cpuUsage();
    const strategy = create(docs);
    const buildStart = performance.now(); const state = strategy.build(); const buildMs = performance.now() - buildStart;
    const queryStart = performance.now(); const answer = strategy.query(state); const queryMs = performance.now() - queryStart;
    const recoveryStart = performance.now(); strategy.recover(state); const recoveryMs = performance.now() - recoveryStart;
    const cpu = process.cpuUsage(cpuStart);
    const storageBytes = Buffer.byteLength(JSON.stringify(serializableState(state)));
    const cpuMs = (cpu.user + cpu.system) / 1000;
    raw.push({ strategy: strategyName, size, run, orderSeed: plan.seed + size + run, buildMs, queryMs, recoveryMs, cpuMs, memoryBytes: Math.max(0, process.memoryUsage().heapUsed - memoryStart), storageBytes, writeAmplification: strategy.writes / docs.length, workProxy: cpuMs + storageBytes / 1024, resultCount: Array.isArray(answer) ? answer.length : Number(answer) });
  }
}

const summary = [];
for (const strategy of Object.keys(strategies)) for (const size of sizes) {
  const rows = raw.filter((row) => row.strategy === strategy && row.size === size);
  const metric = (name) => summarize(rows.map((row) => row[name]));
  summary.push({ strategy, size, runs, queryMs: metric('queryMs'), buildMs: metric('buildMs'), recoveryMs: metric('recoveryMs'), cpuMs: metric('cpuMs'), memoryBytes: metric('memoryBytes'), storageBytes: metric('storageBytes'), writeAmplification: metric('writeAmplification'), workProxy: metric('workProxy') });
}
const budgetResults = sizes.map((size) => ({ size, ...evaluateCobriaBudget(summary.find((row) => row.strategy === 'cobria' && row.size === size), summary.find((row) => row.strategy === 'single-document' && row.size === size), budgets.bySize[String(size)]) }));
const result = { method: 'Comparación algorítmica local y controlada; no representa un servicio distribuido ni consumo energético medido.', generatedAt: new Date().toISOString(), planVersion: plan.version, seed: plan.seed, warmupRuns, executionOrder: plan.workload.order, workProxyFormula: 'cpuMs + storageKiB; puntuación convencional sin interpretación física', environment: { node: process.version, platform: process.platform, architecture: process.arch }, sizes, runs, rawCount: raw.length, summary, budgetResults, allBudgetsPassed: budgetResults.every((item) => item.passed) };
await mkdir(output, { recursive: true });
await writeFile(new URL('raw.json', output), JSON.stringify(raw, null, 2));
await writeFile(new URL('summary.json', output), JSON.stringify(result, null, 2));
const lines = ['# Comparación controlada de alternativas', '', '> Alcance: costos algorítmicos en un proceso Node.js. CPU y bytes son proxies de trabajo; no se midió energía. No sustituye pruebas distribuidas.', '', '| Estrategia | n | consulta p50/p95/p99 ms | MAD/IQR | recuperación p50 ms | almacenamiento p50 B | amplificación |', '|---|---:|---:|---:|---:|---:|---:|', ...summary.map((row) => `| ${row.strategy} | ${row.size} | ${row.queryMs.p50.toFixed(4)} / ${row.queryMs.p95.toFixed(4)} / ${row.queryMs.p99.toFixed(4)} | ${row.queryMs.mad.toFixed(4)} / ${row.queryMs.iqr.toFixed(4)} | ${row.recoveryMs.p50.toFixed(4)} | ${Math.round(row.storageBytes.p50)} | ${row.writeAmplification.p50.toFixed(2)} |`)];
await writeFile(new URL('REPORT.md', output), `${lines.join('\n')}\n`);
console.log(`Generadas ${raw.length} observaciones, ${summary.length} resúmenes; presupuestos: ${result.allBudgetsPassed ? 'aprobados' : 'incumplidos'}.`);
