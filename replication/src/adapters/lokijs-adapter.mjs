import Loki from "lokijs";
import { exigirCoincidenciaAmbito } from "../core/cobria.mjs";

export class LokiJsAdapter {
  constructor(name = "cobria-loki") {
    this.name = name;
    this.resetSync();
  }
  resetSync() {
    this.db = new Loki(this.name);
    this.docs = this.db.addCollection("documents", { unique: ["key"], indices: ["kind", "scope"] });
    this.metrics = { reads: 0, writes: 0, bytesRead: 0, bytesWritten: 0 };
  }
  async reset() { this.resetSync(); }
  key(kind, scope, id) {
    if (!scope) throw new Error("scope required");
    return `${kind}\u0000${scope}\u0000${id}`;
  }
  async put(kind, scope, id, value) {
    exigirCoincidenciaAmbito(scope,value);
    const key = this.key(kind, scope, id);
    const current = this.docs.by("key", key);
    if (current) { current.value = structuredClone(value); this.docs.update(current); }
    else this.docs.insert({ key, kind, scope, id, value: structuredClone(value) });
    this.metrics.writes++;
    this.metrics.bytesWritten += Buffer.byteLength(JSON.stringify(value));
  }
  async list(kind, scope) {
    if (!scope) throw new Error("scope required");
    const values = this.docs.find({ kind, scope }).map(item => structuredClone(item.value));
    this.metrics.reads += values.length;
    this.metrics.bytesRead += Buffer.byteLength(JSON.stringify(values));
    return values;
  }
  async clear(kind, scope) { this.docs.findAndRemove({ kind, scope }); }
  snapshot() { return { ...this.metrics }; }
  async close() { this.db.close(); }
}
