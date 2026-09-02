import test from "node:test";
import assert from "node:assert/strict";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { documentoCobria, RepositorioCobria, ProyeccionCobria, PublicadorVersionado, AutorizadorAmbito, huella } from "../src/core/cobria.mjs";

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

test("publicador cambia versión y permite rollback sin aceptar candidata corrupta", async () => {
  const adapter = new LokiJsAdapter();
  const publisher = new PublicadorVersionado(adapter, { name: "busqueda" });
  const candidate = [{ id: "rana-1", scope: "bosque-sur", revision: 1, value: 1 }];
  await adapter.put("candidate-v1", "bosque-sur", "rana-1", candidate[0]);
  await assert.rejects(() => publisher.publicar("bosque-sur", "candidate-v1", { version: "v1", expectedHash: "bad" }), /EQV-001/);
  const hash = huella(await adapter.list("candidate-v1", "bosque-sur"));
  await publisher.publicar("bosque-sur", "candidate-v1", { version: "v1", expectedHash: hash });
  await adapter.put("candidate-v2", "bosque-sur", "rana-1", { ...candidate[0], value: 2 });
  const hash2 = huella(await adapter.list("candidate-v2", "bosque-sur"));
  await publisher.publicar("bosque-sur", "candidate-v2", { version: "v2", expectedHash: hash2 });
  assert.equal(await publisher.active("bosque-sur"), "v2");
  assert.equal(await publisher.rollback("bosque-sur"), "v1");
  assert.equal(await publisher.active("bosque-sur"), "v1");
  await adapter.close();
});

test("fallo al publicar conserva la versión activa anterior", async () => {
  class FailingCatalogAdapter extends LokiJsAdapter {
    constructor() { super(); this.failCatalog = false; }
    async put(kind, scope, id, value) {
      if (this.failCatalog && kind === "publication-catalog") throw new Error("injected publication failure");
      return super.put(kind, scope, id, value);
    }
  }
  const adapter = new FailingCatalogAdapter();
  const publisher = new PublicadorVersionado(adapter, { name: "busqueda" });
  await adapter.put("candidate-v1", "sur", "a", { id: "a", scope: "sur", revision: 1, value: 1 });
  const hash = huella(await adapter.list("candidate-v1", "sur"));
  await publisher.publicar("sur", "candidate-v1", { version: "v1", expectedHash: hash });
  await adapter.put("candidate-v2", "sur", "a", { id: "a", scope: "sur", revision: 2, value: 2 });
  const hash2 = huella(await adapter.list("candidate-v2", "sur"));
  adapter.failCatalog = true;
  await assert.rejects(() => publisher.publicar("sur", "candidate-v2", { version: "v2", expectedHash: hash2 }), /publication failure/);
  assert.equal(await publisher.active("sur"), "v1");
  await adapter.close();
});

test("autorizador separa permisos de lectura y escritura por ámbito", () => {
  const auth = new AutorizadorAmbito({ lector: ["read:sur"], escritor: ["write:sur"] });
  assert.equal(auth.exigir("lector", "sur", "read"), true);
  assert.throws(() => auth.exigir("lector", "sur", "write"), /AUTH-001/);
  assert.throws(() => auth.exigir("lector", "norte", "read"), /AUTH-001/);
});
