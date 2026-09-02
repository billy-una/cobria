import fs from "node:fs/promises";
import path from "node:path";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { huella } from "../src/core/cobria.mjs";

const scope = "bosque-sur";
const rows = [];
const normalize = values => values
  .map(({ id, scope: itemScope, revision, value }) => ({ id, scope: itemScope, revision, value }))
  .sort((left, right) => left.id.localeCompare(right.id));
const equivalent = (left, right) => huella(normalize(left)) === huella(normalize(right));

for (let run = 1; run <= 30; run++) {
  const adapter = new LokiJsAdapter();
  const startMem = process.memoryUsage().heapUsed;
  const cpu = process.cpuUsage();
  await Promise.all(Array.from({ length: 1000 }, (_, index) => adapter.put("canonical", scope, `doc-${index}`, {
    id: `doc-${index}`, scope, revision: 1, value: index
  })));

  const snapshot = await adapter.list("canonical", scope);
  const rebuild = Promise.all(snapshot.map(doc => adapter.put("candidate", scope, doc.id, doc)));
  const updates = Promise.all(Array.from({ length: 100 }, (_, index) => adapter.put("canonical", scope, `doc-${index}`, {
    id: `doc-${index}`, scope, revision: 2, value: index + 1
  })));
  await Promise.all([rebuild, updates]);

  const canonicalAfterRace = await adapter.list("canonical", scope);
  const candidateAfterRace = await adapter.list("candidate", scope);
  const staleIds = canonicalAfterRace
    .filter(doc => candidateAfterRace.find(item => item.id === doc.id)?.revision !== doc.revision)
    .map(doc => doc.id);
  const staleDetected = staleIds.length > 0 && !equivalent(canonicalAfterRace, candidateAfterRace);

  // Reparación incremental: solo sustituye identidades cuya revisión quedó atrás.
  for (const id of staleIds) {
    const current = canonicalAfterRace.find(doc => doc.id === id);
    await adapter.put("candidate", scope, id, current);
  }
  const repaired = await adapter.list("candidate", scope);
  const repairEquivalent = equivalent(canonicalAfterRace, repaired);
  const used = process.cpuUsage(cpu);
  rows.push({
    run,
    canonical: canonicalAfterRace.length,
    candidate: candidateAfterRace.length,
    updated: canonicalAfterRace.filter(doc => doc.revision === 2).length,
    staleCount: staleIds.length,
    staleDetected,
    repairEquivalent,
    heapDeltaBytes: process.memoryUsage().heapUsed - startMem,
    cpuUserMicros: used.user,
    cpuSystemMicros: used.system,
    pass: canonicalAfterRace.length === 1000 && candidateAfterRace.length === 1000 && staleDetected && repairEquivalent
  });
  await adapter.close();
}

const median = (values, key) => values.map(value => value[key]).sort((left, right) => left - right)[Math.floor(values.length / 2)];
const summary = {
  runs: rows.length,
  pass: rows.every(row => row.pass),
  racesWithStalenessDetected: rows.filter(row => row.staleDetected).length,
  repairsEquivalent: rows.filter(row => row.repairEquivalent).length,
  staleMedian: median(rows, "staleCount"),
  heapDeltaMedianBytes: median(rows, "heapDeltaBytes"),
  cpuUserMedianMicros: median(rows, "cpuUserMicros"),
  cpuSystemMedianMicros: median(rows, "cpuSystemMicros"),
  interpretation: "Una reconstrucción sobre una instantánea puede quedar obsoleta si coexiste con escrituras; COBRIA debe detectarlo antes de publicar o reparar por revisión.",
  limits: "Concurrencia de promesas sobre LokiJS en un proceso; no demuestra bloqueo, consenso, aislamiento transaccional ni comportamiento de red en un clúster."
};
const out = path.resolve("results/core-1.2-concurrency");
await fs.mkdir(out, { recursive: true });
await fs.writeFile(path.join(out, "raw.json"), JSON.stringify(rows, null, 2));
await fs.writeFile(path.join(out, "summary.json"), JSON.stringify(summary, null, 2));
await fs.writeFile(path.join(out, "REPORT.md"), `# Concurrencia y recursos COBRIA 1.2\n\n${summary.runs} repeticiones: **${summary.pass ? "detección y reparación conformes" : "con fallos"}**. Carreras con obsolescencia detectada: ${summary.racesWithStalenessDetected}/${summary.runs}; reparaciones equivalentes: ${summary.repairsEquivalent}/${summary.runs}; documentos obsoletos (mediana): ${summary.staleMedian}.\n\nMemoria heap mediana: ${summary.heapDeltaMedianBytes} bytes; CPU usuario mediana: ${summary.cpuUserMedianMicros} μs; CPU sistema mediana: ${summary.cpuSystemMedianMicros} μs.\n\n**Interpretación:** ${summary.interpretation}\n\n**Límite:** ${summary.limits}\n`);
console.log(summary);
