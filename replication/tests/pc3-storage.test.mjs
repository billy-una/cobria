import test from 'node:test';
import assert from 'node:assert/strict';
import {MongoDbAdapter} from '../src/adapters/mongodb-adapter.mjs';
test('PC3 tamaño BSON no se etiqueta como disco físico',async()=>{
  const adapter=new MongoDbAdapter({aggregate:()=>({toArray:async()=>[{logicalBytes:123,documentCount:2}]})});
  const r=await adapter.storage();assert.equal(r.logicalBytes,123);assert.equal(r.documentCount,2);
  assert.equal(r.storageBytes,null);assert.equal(r.physicalBytes,null);assert.ok(r.physicalReason);assert.match(r.logicalMethod,/BSON/);
});
