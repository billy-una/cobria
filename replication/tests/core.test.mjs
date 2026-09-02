import test from "node:test";
import assert from "node:assert/strict";
import { CanonicalEntity, EntityMapper, Metrics, MemoryConnector, EntityRepository, ProjectionStore, ProjectionManager, ScopedCache } from "../src/cobria.mjs";

test("mapper preserves semantic round-trip",()=>{ const e=new CanonicalEntity({id:"1",scope:"a",status:"active",value:7}); const m=new EntityMapper(); assert.deepEqual(m.toDomain(e.id,m.toRaw(e)),e); });
test("repository requires and isolates scope",()=>{ const r=new EntityRepository(new MemoryConnector()); r.save(new CanonicalEntity({id:"same",scope:"a",value:1})); r.save(new CanonicalEntity({id:"same",scope:"b",value:2})); assert.equal(r.get("a","same").value,1); assert.equal(r.get("b","same").value,2); assert.throws(()=>r.get("","same")); });
test("optimistic revision rejects stale write",()=>{ const r=new EntityRepository(new MemoryConnector()); const e=new CanonicalEntity({id:"1",scope:"a"}); r.save(e); r.save(e.withPatch({value:2}),0); assert.throws(()=>r.save(e.withPatch({value:3}),0)); });
test("projection rebuild is exact and idempotent",()=>{ const r=new EntityRepository(new MemoryConnector()); const p=new ProjectionStore(); const m=new ProjectionManager(r,p); for(let i=0;i<20;i++) r.save(new CanonicalEntity({id:String(i),scope:"a",status:i%2?"active":"inactive",value:i})); m.rebuildFull("a"); assert.equal(m.verify("a").accuracy,1); m.rebuildFull("a"); assert.equal(m.verify("a").accuracy,1); });
test("cache key contains scope",()=>{ const c=new ScopedCache(); c.set("a","same",{v:1},0); c.set("b","same",{v:2},0); assert.equal(c.get("a","same",1).v,1); assert.equal(c.get("b","same",1).v,2); });
