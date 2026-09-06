import PouchDB from "pouchdb";
import { exigirCoincidenciaAmbito } from "../core/cobria.mjs";

export class PouchDbAdapter {
  constructor(name = `cobria-${Date.now()}-${Math.random()}`) {
    this.name = name;
    this.db = new PouchDB(name);
    this.metrics = { reads: 0, writes: 0, bytesRead: 0, bytesWritten: 0 };
  }
  async reset() {
    await this.db.destroy();
    this.db = new PouchDB(this.name);
    this.metrics = { reads: 0, writes: 0, bytesRead: 0, bytesWritten: 0 };
  }
  key(kind, scope, id) {
    if (!scope) throw new Error("scope required");
    return `${kind}:${encodeURIComponent(scope)}:${id}`;
  }
  async put(kind, scope, id, value) {
    exigirCoincidenciaAmbito(scope,value);
    const _id = this.key(kind, scope, id);
    let current = null;
    try { current = await this.db.get(_id); } catch (error) { if (error.status !== 404) throw error; }
    const doc = { ...value, _id, ...(current?._rev ? { _rev: current._rev } : {}) };
    await this.db.put(doc);
    this.metrics.writes++;
    this.metrics.bytesWritten += Buffer.byteLength(JSON.stringify(value));
  }
  async compareAndSwap(kind, scope, id, expectedRevision, value) {
    exigirCoincidenciaAmbito(scope, value);
    const _id = this.key(kind, scope, id);
    let current = null;
    try { current = await this.db.get(_id); } catch (error) { if (error.status !== 404) throw error; }
    const actualRevision = current?.revision ?? null;
    if (actualRevision !== expectedRevision) return false;
    try {
      await this.db.put({ ...value, _id, ...(current?._rev ? { _rev: current._rev } : {}) });
    } catch (error) {
      if (error.status === 409) return false;
      throw error;
    }
    this.metrics.writes++;
    this.metrics.bytesWritten += Buffer.byteLength(JSON.stringify(value));
    return true;
  }
  async list(kind, scope) {
    if (!scope) throw new Error("scope required");
    const prefix = `${kind}:${encodeURIComponent(scope)}:`;
    const result = await this.db.allDocs({ include_docs: true, startkey: prefix, endkey: `${prefix}\ufff0` });
    const values = result.rows.map(row => { const { _id, _rev, ...value } = row.doc; return value; });
    this.metrics.reads += values.length;
    this.metrics.bytesRead += Buffer.byteLength(JSON.stringify(values));
    return values;
  }
  async clear(kind, scope) {
    const prefix = `${kind}:${encodeURIComponent(scope)}:`;
    const result = await this.db.allDocs({ include_docs: true, startkey: prefix, endkey: `${prefix}\ufff0` });
    if (result.rows.length) await this.db.bulkDocs(result.rows.map(({doc}) => ({ _id: doc._id, _rev: doc._rev, _deleted: true })));
  }
  snapshot() { return { ...this.metrics }; }
  async close() { await this.db.destroy(); }
}
