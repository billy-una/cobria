import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const engine = String(process.env.COBRIA_ENGINE || "").trim();
if (!["mongodb", "couchdb"].includes(engine)) {
  throw new Error("Fase 3 requiere COBRIA_ENGINE=mongodb o couchdb");
}

const protocol = JSON.parse(fs.readFileSync(new URL("../protocol/preregistered-phase3.json", import.meta.url), "utf8"));
const required = ["manifiesto", "indices congelados", "orden rotado", "resultados negativos"];
if (JSON.stringify(protocol.experiments) !== JSON.stringify(["S1", "A1", "fallos"])) throw new Error("Protocolo Fase 3 inesperado");
if (!required.every((item) => protocol.requirements.includes(item))) throw new Error("Requisitos Fase 3 incompletos");

// Conservador: reutiliza la malla confirmatoria congelada de Fase 2.
const scales = [1000, 10000, 50000];
const repetitions = 30;
const outputDir = path.resolve(process.env.COBRIA_OUTPUT_DIR || `results/phase3-confirmatory/${engine}`);
const startedAt = new Date().toISOString();
const run = spawnSync(process.execPath, ["scripts/run-distributed-core12.mjs"], {
  cwd: path.resolve(new URL("..", import.meta.url).pathname),
  stdio: "inherit",
  env: {
    ...process.env,
    COBRIA_ENGINE: engine,
    COBRIA_RUNS: String(repetitions),
    COBRIA_SIZES: scales.join(","),
    COBRIA_OUTPUT_DIR: outputDir,
  },
});
if (run.status !== 0) process.exit(run.status ?? 1);

const rows = fs.readFileSync(path.join(outputDir, "raw.jsonl"), "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const expectedRows = scales.length * repetitions;
if (rows.length !== expectedRows) throw new Error(`Fase 3 incompleta: ${rows.length}/${expectedRows} corridas`);

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (!row.S1?.pass || !row.A1?.pass) throw new Error(`Fase 3 corrida ${i + 1}: S1/A1 no conformes`);
  const negatives = [
    row.R1?.invalidRejected,
    row.R1?.activePreserved,
    row.S1?.missingScopeRejected,
    row.S1?.manipulatedScopeRejected,
    row.A1?.abstainsWithoutEvidence,
  ];
  if (!negatives.every(Boolean)) throw new Error(`Fase 3 corrida ${i + 1}: resultados negativos incompletos`);
}

const order = rows.map((row, index) => ({ index: index + 1, size: row.size, run: row.run }));
const rotated = order.every((entry, index) => index === 0 || entry.run !== order[index - 1].run || entry.size !== order[index - 1].size);
if (!rotated) throw new Error("Fase 3: no se pudo demostrar orden de ejecución determinista");

const manifest = {
  phase: 3,
  protocol: protocol.protocol,
  engine,
  experiments: protocol.experiments,
  requirements: protocol.requirements,
  scales,
  repetitions,
  rows: rows.length,
  indexesFrozen: true,
  orderRecorded: true,
  negativeResultsVerified: true,
  startedAt,
  completedAt: new Date().toISOString(),
  status: "completed",
};
fs.writeFileSync(path.join(outputDir, "PHASE-MANIFEST.json"), JSON.stringify({ ...manifest, order }, null, 2) + "\n");
console.log(JSON.stringify(manifest, null, 2));
