import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";

export const stable = value => JSON.stringify(value, Object.keys(value).sort());
export const sha256 = value => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");

export class CanonicalEntity {
  constructor({ id, scope, revision = 0, schemaVersion = 1, status = "active", category = "general", value = 0, eventTime = 0 }) {
    if (!id || !scope) throw new Error("id and scope are required");
    this.id = String(id); this.scope = String(scope); this.revision = revision;
    this.schemaVersion = schemaVersion; this.status = status; this.category = category;
    this.value = value; this.eventTime = eventTime;
  }
  withPatch(patch) { return new CanonicalEntity({ ...this, ...patch, revision: this.revision + 1 }); }
}

export class EntityMapper {
  toRaw(e) { return { t: e.scope, s: e.status, c: e.category, v: e.value, et: e.eventTime, r: e.revision, sv: e.schemaVersion }; }
  toDomain(id, raw) { return new CanonicalEntity({ id, scope: raw.t, status: raw.s, category: raw.c, value: raw.v, eventTime: raw.et, revision: raw.r, schemaVersion: raw.sv }); }
}

export class Metrics {
  constructor() { this.reset(); }
  reset() { this.reads = 0; this.writes = 0; this.bytesRead = 0; this.bytesWritten = 0; }
  read(value) { this.reads++; this.bytesRead += Buffer.byteLength(JSON.stringify(value ?? null)); }
  write(value) { this.writes++; this.bytesWritten += Buffer.byteLength(JSON.stringify(value ?? null)); }
  snapshot() { return { reads: this.reads, writes: this.writes, bytesRead: this.bytesRead, bytesWritten: this.bytesWritten }; }
}

export class MemoryConnector {
  constructor(metrics = new Metrics()) { this.metrics = metrics; this.data = new Map(); }
  key(scope, id) { if (!scope) throw new Error("scope required"); return `${scope}\u0000${id}`; }
  put(scope, id, raw) { this.data.set(this.key(scope, id), structuredClone(raw)); this.metrics.write(raw); }
  get(scope, id) { const raw = this.data.get(this.key(scope, id)); this.metrics.read(raw); return raw ? structuredClone(raw) : null; }
  remove(scope, id) { this.data.delete(this.key(scope, id)); this.metrics.write(null); }
  list(scope) { if (!scope) throw new Error("scope required"); const out=[]; for (const [key,raw] of this.data) if (key.startsWith(`${scope}\u0000`)) { this.metrics.read(raw); out.push([key.split("\u0000")[1], structuredClone(raw)]); } return out; }
  storageBytes() { let n=0; for (const [k,v] of this.data) n += Buffer.byteLength(k)+Buffer.byteLength(JSON.stringify(v)); return n; }
}

export class EntityRepository {
  constructor(connector, mapper = new EntityMapper()) { this.connector=connector; this.mapper=mapper; }
  save(entity, expectedRevision = null) {
    if (expectedRevision !== null) {
      const current=this.connector.get(entity.scope, entity.id);
      if (!current || current.r !== expectedRevision) throw new Error("revision conflict");
    }
    this.connector.put(entity.scope, entity.id, this.mapper.toRaw(entity)); return entity;
  }
  get(scope,id) { const raw=this.connector.get(scope,id); return raw ? this.mapper.toDomain(id,raw) : null; }
  list(scope) { return this.connector.list(scope).map(([id,raw])=>this.mapper.toDomain(id,raw)); }
}

export class ProjectionStore {
  constructor(metrics = new Metrics()) { this.metrics=metrics; this.byStatus=new Map(); this.version=1; }
  key(scope,status){ if(!scope) throw new Error("scope required"); return `${scope}\u0000${status}`; }
  upsert(e) { this.removeId(e.scope,e.id); const k=this.key(e.scope,e.status); if(!this.byStatus.has(k)) this.byStatus.set(k,new Map()); this.byStatus.get(k).set(e.id,{id:e.id,revision:e.revision,value:e.value}); this.metrics.write({id:e.id}); }
  removeId(scope,id) { for (const [k,m] of this.byStatus) if(k.startsWith(`${scope}\u0000`) && m.delete(id)) this.metrics.write(null); }
  query(scope,status) { const values=[...(this.byStatus.get(this.key(scope,status))?.values() || [])]; this.metrics.read(values); return structuredClone(values); }
  clearScope(scope) { for(const k of [...this.byStatus.keys()]) if(k.startsWith(`${scope}\u0000`)) this.byStatus.delete(k); }
  storageBytes(){ let n=0; for(const [k,v] of this.byStatus) n += Buffer.byteLength(k)+Buffer.byteLength(JSON.stringify([...v])); return n; }
}

export class ProjectionManager {
  constructor(repository, projection) { this.repository=repository; this.projection=projection; this.changes=[]; this.processed=new Set(); }
  record(entity){ this.changes.push({id:entity.id,scope:entity.scope,revision:entity.revision}); }
  apply(entity,eventId=`${entity.scope}:${entity.id}:${entity.revision}`){ if(this.processed.has(eventId)) return false; this.projection.upsert(entity); this.processed.add(eventId); return true; }
  rebuildFull(scope,{failAfter=Infinity}={}) { const entities=this.repository.list(scope); this.projection.clearScope(scope); for(const id of [...this.processed]) if(id.startsWith(`rebuild:${scope}:`)) this.processed.delete(id); let count=0; for(const e of entities){ if(count===failAfter) throw Object.assign(new Error("injected failure"),{checkpoint:count}); this.apply(e,`rebuild:${scope}:${e.id}:${e.revision}`); count++; } return count; }
  rebuildIncremental(scope, sinceRevision=-1){ let count=0; for(const c of this.changes) if(c.scope===scope && c.revision>sinceRevision){ const e=this.repository.get(scope,c.id); if(e){ this.apply(e,`incremental:${scope}:${e.id}:${e.revision}`); count++; } } return count; }
  verify(scope){ const expected=new Map(this.repository.list(scope).map(e=>[e.id,e])); const observed=[]; for(const status of ["active","inactive","archived"]) observed.push(...this.projection.query(scope,status)); const seen=new Map(observed.map(x=>[x.id,x])); let missing=0,extra=0,different=0; for(const [id,e] of expected){ const p=seen.get(id); if(!p) missing++; else if(p.revision!==e.revision || p.value!==e.value) different++; } for(const id of seen.keys()) if(!expected.has(id)) extra++; return {expected:expected.size,observed:seen.size,missing,extra,different,accuracy:1-(missing+extra+different)/Math.max(expected.size,1)}; }
}

export class ScopedCache {
  constructor(ttlMs=1000){ this.ttlMs=ttlMs; this.map=new Map(); }
  key(scope,id){ if(!scope) throw new Error("scope required"); return `${scope}\u0000${id}`; }
  set(scope,id,value,now=performance.now()){ this.map.set(this.key(scope,id),{value:structuredClone(value),at:now}); }
  get(scope,id,now=performance.now()){ const x=this.map.get(this.key(scope,id)); if(!x || now-x.at>this.ttlMs){ this.map.delete(this.key(scope,id)); return null; } return structuredClone(x.value); }
  invalidate(scope,id){ this.map.delete(this.key(scope,id)); }
}

export function timed(fn){ const start=performance.now(); const value=fn(); return {value,durationMs:performance.now()-start}; }
