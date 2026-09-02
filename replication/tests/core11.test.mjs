import test from "node:test";
import assert from "node:assert/strict";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { documentoCobria, RepositorioCobria, ProyeccionCobria, huella } from "../src/core/cobria.mjs";

test("documento exige ámbito, identidad y revisión", () => {
  assert.throws(() => documentoCobria({id:"x",revision:1}), /SCP-001/);
  assert.throws(() => documentoCobria({scope:"sur",revision:1}), /ID-001/);
  assert.throws(() => documentoCobria({id:"x",scope:"sur",revision:0}), /REV-001/);
});

test("repositorio rechaza regresión de revisión", async () => {
  const adapter = new LokiJsAdapter();
  const repo = new RepositorioCobria(adapter);
  await repo.guardar({id:"ave-1",scope:"bosque-sur",revision:2,species:"colibrí"});
  await assert.rejects(() => repo.guardar({id:"ave-1",scope:"bosque-sur",revision:1}), /REV-001/);
  await adapter.close();
});

test("adaptador rechaza un documento cuyo ámbito contradice la operación", async () => {
  const adapter = new LokiJsAdapter();
  await assert.rejects(
    () => adapter.put("canonical", "bosque-sur", "ataque-1", {id:"ataque-1",scope:"bosque-norte",revision:1}),
    /SCP-001/
  );
  await adapter.close();
});

test("proyección se reconstruye y verifica fuera de la versión activa", async () => {
  const adapter = new LokiJsAdapter();
  const canonical = [{id:"rana-1",scope:"bosque-sur",revision:1,species:"rana de ojos rojos"}];
  const projection = new ProyeccionCobria(adapter, {name:"busqueda",version:1,verify:(a,b)=>huella(a)===huella(b)});
  const result = await projection.reconstruir("bosque-sur", canonical);
  assert.equal(result.values.length, 1);
  assert.match(result.candidate, /candidate/);
  await adapter.close();
});
