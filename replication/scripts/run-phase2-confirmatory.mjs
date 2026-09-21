import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const engine = String(process.env.COBRIA_ENGINE || "").trim();
if (!["mongodb", "couchdb"].includes(engine)) {
  throw new Error("Fase 2 requiere COBRIA_ENGINE=mongodb o couchdb");
}

const protocol = JSON.parse(fs.readFileSync(new URL("../protocol/preregistered-phase2.json", import.meta.url), "utf8"));
const expectedScales = [1000, 10000, 50000];
const expectedRuns = 30;
if (JSON.stringify(protocol.experiments) !== JSON.stringify(["P1", "P2", "R1"])) throw new Error("Protocolo Fase 2 inesperado");
if (JSON.stringify(protocol.scales) !== JSON.stringify(expectedScales) || Number(protocol.repetitions) !== expectedRuns) throw new Error("Configuración Fase 2 no coincide con el preregistro");

const outputDir = path.resolve(process.env.COBRIA_OUTPUT_DIR || `results/phase2-confirmatory/${engine}`);
const startedAt = new Date().toISOString();
const run = spawnSync(process.execPath, ["scripts/run-distributed-core12.mjs"], {
  cwd: path.resolve(new URL("..", import.meta.url).pathname),
  stdio: "inherit",
  env: {
    ...process.env,
    COBRIA_ENGINE: engine,
    COBRIA_RUNS: String(expectedRuns),
    COBRIA_SIZES: expectedScales.join(","),
    COBRIA_OUTPUT_DIR: outputDir,
  },
});
if (run.status !== 0) process.exit(run.status ?? 1);

const rawPath = path.join(outputDir, "raw.jsonl");
const rows = fs.readFileSync(rawPath, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const expectedRows = expectedScales.length * expectedRuns;
if (rows.length !== expectedRows) throw new Error(`Fase 2 incompleta: ${rows.length}/${expectedRows} corridas`);
for (const size of expectedScales) {
  const group = rows.filter((row) => row.size === size);
  if (group.length !== expectedRuns) throw new Error(`Fase 2 n=${size}: ${group.length}/${expectedRuns}`);
  if (!group.every((row) => row.P1?.pass && row.P2?.pass && row.R1?.pass)) throw new Error(`Fase 2 n=${size}: P1/P2/R1 no conformes`);
}
const completion = {
  phase: 2,
  protocol: protocol.protocol,
  engine,
  scope: protocol.scope,
  experiments: protocol.experiments,
  scales: expectedScales,
  repetitions: expectedRuns,
  rows: rows.length,
  startedAt,
  completedAt: new Date().toISOString(),
  status: "completed",
};
fs.writeFileSync(path.join(outputDir, "PHASE-COMPLETION.json"), JSON.stringify(completion, null, 2) + "\n");
console.log(JSON.stringify(completion, null, 2));
