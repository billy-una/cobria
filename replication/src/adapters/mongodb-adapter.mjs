import { exigirAmbito, exigirCoincidenciaAmbito } from "../core/cobria.mjs";

// Recibe una Collection del controlador oficial de MongoDB. La dependencia se
// inyecta para que el núcleo no quede acoplado a una versión del proveedor.
export class MongoDbAdapter {
  constructor(collection) {
    if (!collection) throw new Error("MongoDB Collection requerida");
    this.collection = collection;
    this.metrics = { reads: 0, writes: 0, bytesRead: 0, bytesWritten: 0 };
  }
  key(kind, scope, id) { return `${kind}:${encodeURIComponent(exigirAmbito(scope))}:${id}`; }
  async reset() {
    await this.collection.deleteMany({ cobriaManaged: true });
    this.metrics = { reads: 0, writes: 0, bytesRead: 0, bytesWritten: 0 };
  }
  async put(kind, scope, id, value) {
    const safeScope = exigirCoincidenciaAmbito(scope,value);
    const _id = this.key(kind, safeScope, id);
    await this.collection.replaceOne({_id}, {_id, cobriaManaged:true, kind, scope:safeScope, payload:value}, {upsert:true});
    this.metrics.writes++;
    this.metrics.bytesWritten += Buffer.byteLength(JSON.stringify(value));
  }
  async compareAndSwap(kind, scope, id, expectedRevision, value) {
    const safeScope = exigirCoincidenciaAmbito(scope, value);
    const _id = this.key(kind, safeScope, id);
    const replacement = {_id, cobriaManaged:true, kind, scope:safeScope, payload:value};
    if (expectedRevision === null) {
      try {
        await this.collection.insertOne(replacement);
      } catch (error) {
        if (error?.code === 11000) return false;
        throw error;
      }
    } else {
      const result = await this.collection.replaceOne({_id, "payload.revision":expectedRevision}, replacement, {upsert:false});
      if (result.matchedCount !== 1) return false;
    }
    this.metrics.writes++;
    this.metrics.bytesWritten += Buffer.byteLength(JSON.stringify(value));
    return true;
  }
  async putMany(kind, scope, values) {
    const safeScope=exigirAmbito(scope);
    values.forEach(value=>exigirCoincidenciaAmbito(safeScope,value));
    if (!values.length) return;
    await this.collection.bulkWrite(values.map(value=>({replaceOne:{filter:{_id:this.key(kind,safeScope,value.id)},replacement:{_id:this.key(kind,safeScope,value.id),cobriaManaged:true,kind,scope:safeScope,payload:value},upsert:true}})),{ordered:true});
    this.metrics.writes+=values.length;
    this.metrics.bytesWritten+=Buffer.byteLength(JSON.stringify(values));
  }
  async list(kind, scope) {
    const safeScope = exigirAmbito(scope);
    const rows = await this.collection.find({cobriaManaged:true, kind, scope:safeScope}).sort({_id:1}).toArray();
    const values = rows.map(row => row.payload);
    this.metrics.reads += values.length;
    this.metrics.bytesRead += Buffer.byteLength(JSON.stringify(values));
    return values;
  }
  async clear(kind, scope) { await this.collection.deleteMany({cobriaManaged:true, kind, scope:exigirAmbito(scope)}); }
  snapshot() { return {...this.metrics}; }
  async close() {}
}
