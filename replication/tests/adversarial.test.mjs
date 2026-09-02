import test from "node:test";
import assert from "node:assert/strict";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { runConformance } from "../src/conformance.mjs";

class AdapterConFuga extends LokiJsAdapter {
  async put(kind, scope, id, value) {
    // Mutante deliberado: oculta el ámbito contradictorio para simular una frontera rota.
    return super.put(kind, scope, id, { ...value, scope });
  }
}

class AdapterQueCorrompeCandidata extends LokiJsAdapter {
  async list(kind, scope) {
    const values = await super.list(kind, scope);
    if (kind === "projection-candidate" && values.length) values[0].value = -9999;
    return values;
  }
}

test("el oráculo S1 rechaza un adaptador que oculta una manipulación de ámbito", async () => {
  const adapter = new AdapterConFuga();
  const result = await runConformance(adapter, { engine: "mutante-fuga", size: 60 });
  assert.equal(result.S1.pass, false);
  await adapter.close();
});

test("el oráculo R1 rechaza una candidata corrupta", async () => {
  const adapter = new AdapterQueCorrompeCandidata();
  const result = await runConformance(adapter, { engine: "mutante-corrupcion", size: 60 });
  assert.equal(result.R1.pass, false);
  await adapter.close();
});
