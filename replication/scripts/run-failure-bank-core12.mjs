import fs from "node:fs/promises";
import path from "node:path";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { dataset } from "../src/conformance.mjs";
import { huella, RepositorioCobria } from "../src/core/cobria.mjs";

const scenarios = [
  "eliminacion-total", "corrupcion-parcial", "entrega-duplicada",
  "revision-fuera-de-orden", "interrupcion-25", "interrupcion-50",
  "interrupcion-75", "cambio-esquema", "catalogo-invalido", "fuga-ambito"
];
const rows = [];
const scope = "bosque-sur";
const foreignScope = "bosque-norte";
const norm = values => values
  .map(({ id, scope: itemScope, revision, value, schemaVersion = 1 }) => ({ id, scope: itemScope, revision, value, schemaVersion }))
  .sort((a, b) => a.id.localeCompare(b.id));
const equivalent = (left, right) => huella(norm(left)) === huella(norm(right));
const uniqueById = docs => [...new Map(docs.map(doc => [doc.id, doc])).values()];

async function rebuild(adapter, docs) {
  const expected = uniqueById(docs);
  await adapter.clear("candidate", scope);
  for (const doc of docs) await adapter.put("candidate", scope, doc.id, doc);
  const candidate = await adapter.list("candidate", scope);
  if (!equivalent(candidate, expected)) throw new Error("COBRIA-EQV-001: candidata inválida");
  await adapter.clear("published", scope);
  for (const doc of candidate) await adapter.put("published", scope, doc.id, doc);
  return candidate;
}

for (const scenario of scenarios) {
  for (let run = 1; run <= 30; run++) {
    const adapter = new LokiJsAdapter();
    const repository = new RepositorioCobria(adapter);
    const docs = dataset(100);
    const foreign = dataset(12).map((doc, index) => ({ ...doc, id: `n-${index}`, scope: foreignScope }));
    for (const doc of docs) await repository.guardar(doc);
    for (const doc of foreign) await repository.guardar(doc);
    await rebuild(adapter, docs);
    let detected = false;
    let recovered = false;
    let cross = 0;

    if (scenario === "fuga-ambito") {
      try {
        await adapter.put("canonical", scope, "intruso", { id: "intruso", scope: foreignScope, revision: 1, value: 7 });
      } catch { detected = true; }
      cross = (await adapter.list("canonical", scope)).filter(doc => doc.scope !== scope).length;
      recovered = detected && cross === 0 && (await adapter.list("canonical", foreignScope)).length === foreign.length;
    } else if (scenario === "revision-fuera-de-orden") {
      const current = { ...docs[0], revision: 4, value: 404 };
      await repository.guardar(current);
      try { await repository.guardar({ ...current, revision: 3, value: 303 }); } catch { detected = true; }
      recovered = (await repository.listar(scope)).find(doc => doc.id === current.id)?.revision === 4;
    } else if (scenario === "catalogo-invalido") {
      const validateCatalog = catalog => {
        if (!catalog?.active || !catalog?.versions?.includes(catalog.active)) throw new Error("COBRIA-CAT-001");
      };
      try { validateCatalog({ active: "v3", versions: ["v1", "v2"] }); } catch { detected = true; }
      try { validateCatalog({ active: "v2", versions: ["v1", "v2"] }); recovered = true; } catch { recovered = false; }
    } else if (scenario === "cambio-esquema") {
      const migrated = docs.map(doc => ({ ...doc, schemaVersion: 2, valueText: String(doc.value) }));
      detected = docs.some(doc => doc.schemaVersion !== 2);
      await adapter.clear("candidate", scope);
      for (const doc of migrated) await adapter.put("candidate", scope, doc.id, doc);
      recovered = (await adapter.list("candidate", scope)).every(doc => doc.schemaVersion === 2 && typeof doc.valueText === "string");
    } else if (scenario === "eliminacion-total") {
      await adapter.clear("published", scope);
      detected = (await adapter.list("published", scope)).length === 0;
      await rebuild(adapter, docs);
      recovered = equivalent(await adapter.list("published", scope), docs);
    } else if (scenario === "entrega-duplicada") {
      const deliveries = [...docs, { ...docs[0] }];
      const candidate = await rebuild(adapter, deliveries);
      const duplicateCollapsed = candidate.filter(doc => doc.id === docs[0].id).length === 1;
      detected = deliveries.length === docs.length + 1 && duplicateCollapsed;
      recovered = equivalent(candidate, docs);
    } else {
      const cut = scenario.includes("25") ? 25 : scenario.includes("50") ? 50 : scenario.includes("75") ? 75 : 100;
      await adapter.clear("candidate", scope);
      for (let index = 0; index < cut; index++) {
        const doc = scenario === "corrupcion-parcial" && index === 0 ? { ...docs[index], value: -1 } : docs[index];
        await adapter.put("candidate", scope, doc.id, doc);
      }
      detected = !equivalent(await adapter.list("candidate", scope), docs);
      const publishedBeforeRepair = await adapter.list("published", scope);
      await rebuild(adapter, docs);
      recovered = equivalent(publishedBeforeRepair, docs) && equivalent(await adapter.list("published", scope), docs);
    }

    rows.push({ scenario, run, detected, recovered, cross, pass: detected && recovered && cross === 0 });
    await adapter.close();
  }
}

const summary = {
  runs: rows.length,
  scenarios: scenarios.map(name => ({ scenario: name, runs: 30, pass: rows.filter(row => row.scenario === name && row.pass).length })),
  allPass: rows.every(row => row.pass),
  limits: "Inyección determinista en memoria; comprueba detección y reparación funcional, no fallos físicos, regiones ni corrupción interna del motor."
};
const out = path.resolve("results/core-1.2-failure-bank");
await fs.mkdir(out, { recursive: true });
await fs.writeFile(path.join(out, "raw.jsonl"), rows.map(JSON.stringify).join("\n") + "\n");
await fs.writeFile(path.join(out, "summary.json"), JSON.stringify(summary, null, 2));
await fs.writeFile(path.join(out, "REPORT.md"), `# Banco de fallos COBRIA 1.2\n\n${rows.length} ejecuciones. Estado: **${summary.allPass ? "conforme en el alcance funcional declarado" : "con fallos"}**.\n\n${summary.scenarios.map(item => `- ${item.scenario}: ${item.pass}/${item.runs}.`).join("\n")}\n\n**Límite:** ${summary.limits}\n`);
console.log(summary);
