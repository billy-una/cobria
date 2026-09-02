import test from "node:test";
import assert from "node:assert/strict";
import { PouchDbAdapter } from "../src/adapters/pouchdb-adapter.mjs";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { runConformance } from "../src/conformance.mjs";

for (const [engine,Factory] of [["PouchDB",PouchDbAdapter],["LokiJS",LokiJsAdapter]]) {
  test(`${engine} supera P1, P2, R1, S1 y A1`, async () => {
    const adapter=new Factory(`test-${engine.toLowerCase()}-${Date.now()}`);
    try {
      const result=await runConformance(adapter,{engine,size:30});
      for (const code of ["P1","P2","R1","S1","A1"]) assert.equal(result[code].pass,true,`${code} falló`);
      assert.equal(result.R1.idempotent,true);
      assert.equal(result.R1.incrementalEquivalent,true);
      assert.equal(result.R1.invalidRejected,true);
      assert.equal(result.R1.activePreserved,true);
      assert.equal(result.S1.manipulatedScopeRejected,true);
      assert.ok(result.S1.foreignSeeded > 0);
      assert.equal(result.A1.analyticReproducible,true);
      assert.equal(result.A1.noTemporalLeakage,true);
      assert.equal(result.A1.abstainsWithoutEvidence,true);
    } finally { await adapter.close(); }
  });
}
