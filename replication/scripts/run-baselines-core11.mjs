import { performance } from "node:perf_hooks";
import fs from "node:fs/promises";
import path from "node:path";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { dataset } from "../src/conformance.mjs";
import { huella } from "../src/core/cobria.mjs";

const duration = async operation => { const start = performance.now(); const value = await operation(); return { ms: performance.now() - start, value }; };
const modes = ["documento-directo", "indice-filtrado", "proyeccion-no-gobernada", "cqrs-minimo", "bitacora-reconstruible", "cobria-c2"];
const rows = [];
const scope = "bosque-sur";
const normalized = values => values.map(({ id, status, value, revision }) => ({ id, status, value, revision })).sort((a, b) => a.id.localeCompare(b.id));
const equivalent = (left, right) => huella(normalized(left)) === huella(normalized(right));

for (const size of [100, 1000, 5000]) for (let run = 1; run <= 30; run++) for (const mode of modes) {
  const adapter = new LokiJsAdapter();
  const docs = dataset(size);
  const write = await duration(async () => {
    for (const doc of docs) {
      if (mode === "bitacora-reconstruible") {
        await adapter.put("events", scope, `${doc.id}:1`, { ...doc, eventType: "DocumentCreated" });
      } else {
        await adapter.put("canonical", scope, doc.id, doc);
      }
      if (["proyeccion-no-gobernada", "cqrs-minimo", "cobria-c2"].includes(mode) && doc.status === "activo") {
        const kind = mode === "cobria-c2" ? "candidate-v1" : mode;
        await adapter.put(kind, scope, doc.id, doc);
      }
    }
    if (mode === "cobria-c2") {
      const candidate = await adapter.list("candidate-v1", scope);
      const expected = docs.filter(doc => doc.status === "activo");
      if (!equivalent(candidate, expected)) throw new Error("candidata COBRIA no equivalente");
      for (const doc of candidate) await adapter.put("published-v1", scope, doc.id, doc);
    }
  });

  const read = await duration(async () => {
    if (mode === "documento-directo" || mode === "indice-filtrado") return (await adapter.list("canonical", scope)).filter(doc => doc.status === "activo");
    if (mode === "bitacora-reconstruible") return (await adapter.list("events", scope)).filter(event => event.status === "activo");
    return adapter.list(mode === "cobria-c2" ? "published-v1" : mode, scope);
  });

  const recover = await duration(async () => {
    if (mode === "documento-directo" || mode === "indice-filtrado") return { applicable: false, equivalent: true };
    if (mode === "proyeccion-no-gobernada") return { applicable: true, equivalent: false };
    const source = mode === "bitacora-reconstruible" ? await adapter.list("events", scope) : await adapter.list("canonical", scope);
    const expected = source.filter(doc => doc.status === "activo");
    await adapter.clear(`${mode}-recovered`, scope);
    for (const doc of expected) await adapter.put(`${mode}-recovered`, scope, doc.id.replace(/:1$/, ""), doc);
    return { applicable: true, equivalent: equivalent(await adapter.list(`${mode}-recovered`, scope), expected) };
  });

  rows.push({
    mode, size, run, writeMs: write.ms, readMs: read.ms, recoveryMs: recover.ms,
    recoveryApplicable: recover.value.applicable, recoverable: recover.value.equivalent,
    resultCount: read.value.length, writes: adapter.snapshot().writes
  });
  await adapter.close();
}

const out = path.resolve("results/core-1.1-baselines");
await fs.mkdir(out, { recursive: true });
await fs.writeFile(path.join(out, "raw.jsonl"), rows.map(JSON.stringify).join("\n") + "\n");
const summary = [];
for (const mode of modes) for (const size of [100, 1000, 5000]) {
  const cell = rows.filter(row => row.mode === mode && row.size === size);
  const median = key => cell.map(row => row[key]).sort((left, right) => left - right)[Math.floor(cell.length / 2)];
  summary.push({ mode, size, runs: cell.length, writeMedianMs: median("writeMs"), readMedianMs: median("readMs"), recoveryMedianMs: median("recoveryMs"), recoveryApplicable: cell.some(row => row.recoveryApplicable), recoverable: cell.every(row => row.recoverable), medianWrites: median("writes") });
}
await fs.writeFile(path.join(out, "summary.json"), JSON.stringify({
  scope: "modelos funcionales mínimos sobre LokiJS; no equivalen a productos, índices físicos ni marcos industriales completos",
  controls: {
    "documento-directo": "lectura filtrada de la colección canónica",
    "indice-filtrado": "control lógico de consulta; LokiJS no permite aislar un índice físico comparable",
    "proyeccion-no-gobernada": "copia de lectura sin fuente formal de recuperación",
    "cqrs-minimo": "modelo de escritura y modelo de lectura separados, sin mensajería",
    "bitacora-reconstruible": "eventos inmutables simplificados y plegado",
    "cobria-c2": "canónica, candidata, equivalencia y publicación versionada"
  }, summary
}, null, 2));
await fs.writeFile(path.join(out, "REPORT.md"), `# Líneas base funcionales Core 1.1\n\nModelos mínimos delimitados sobre LokiJS. No representan implementaciones industriales completas, un índice físico del motor, CQRS con mensajería ni Event Sourcing con todas sus garantías.\n\n| Control | N | Escritura p50 ms | Lectura p50 ms | Recuperación aplicable | Recuperable |\n|---|---:|---:|---:|---|---|\n${summary.map(item => `| ${item.mode} | ${item.size} | ${item.writeMedianMs.toFixed(3)} | ${item.readMedianMs.toFixed(3)} | ${item.recoveryApplicable ? "sí" : "no"} | ${item.recoverable ? "sí" : "no"} |`).join("\n")}\n`);
console.log(`Generadas ${rows.length} corridas y ${summary.length} celdas.`);
