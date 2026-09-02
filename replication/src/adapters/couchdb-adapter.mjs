import { exigirAmbito, exigirCoincidenciaAmbito } from "../core/cobria.mjs";

export class CouchDbAdapter {
  constructor({url, database, username, password, fetchImpl = fetch}) {
    this.base = `${url.replace(/\/$/, "")}/${encodeURIComponent(database)}`;
    this.auth = username ? `Basic ${Buffer.from(`${username}:${password ?? ""}`).toString("base64")}` : null;
    this.fetch = fetchImpl;
    this.metrics = { reads: 0, writes: 0, bytesRead: 0, bytesWritten: 0 };
  }
  key(kind, scope, id) { return `${kind}:${encodeURIComponent(exigirAmbito(scope))}:${id}`; }
  headers() { return {"content-type":"application/json", ...(this.auth ? {authorization:this.auth} : {})}; }
  async request(path="", options={}) {
    const response = await this.fetch(`${this.base}${path}`, {...options, headers:{...this.headers(), ...options.headers}});
    if (!response.ok && response.status !== 404) throw new Error(`CouchDB ${response.status}: ${await response.text()}`);
    return response;
  }
  async reset() {
    await this.fetch(this.base, {method:"DELETE", headers:this.headers()});
    const created = await this.fetch(this.base, {method:"PUT", headers:this.headers()});
    if (!created.ok && created.status !== 412) throw new Error(`CouchDB ${created.status}`);
    this.metrics = { reads: 0, writes: 0, bytesRead: 0, bytesWritten: 0 };
  }
  async put(kind, scope, id, value) {
    const safeScope=exigirCoincidenciaAmbito(scope,value);
    const _id = this.key(kind, safeScope, id);
    const current = await this.request(`/${encodeURIComponent(_id)}`);
    const old = current.ok ? await current.json() : null;
    const body = JSON.stringify({_id, ...(old?._rev ? {_rev:old._rev} : {}), kind, scope:safeScope, payload:value});
    const response = await this.request(`/${encodeURIComponent(_id)}`, {method:"PUT", body});
    if (!response.ok) throw new Error(`CouchDB no guardó ${_id}`);
    this.metrics.writes++;
    this.metrics.bytesWritten += Buffer.byteLength(JSON.stringify(value));
  }
  async putMany(kind, scope, values) {
    const safeScope=exigirAmbito(scope);
    values.forEach(value=>exigirCoincidenciaAmbito(safeScope,value));
    if (!values.length) return;
    const docs=values.map(value=>({_id:this.key(kind,safeScope,value.id),kind,scope:safeScope,payload:value}));
    const response=await this.request("/_bulk_docs",{method:"POST",body:JSON.stringify({docs})});
    const result=await response.json();
    const failed=result.filter(row=>row.error);
    if (failed.length) throw new Error(`CouchDB bulk falló: ${JSON.stringify(failed.slice(0,3))}`);
    this.metrics.writes+=values.length;
    this.metrics.bytesWritten+=Buffer.byteLength(JSON.stringify(values));
  }
  async list(kind, scope) {
    const prefix = `${kind}:${encodeURIComponent(exigirAmbito(scope))}:`;
    const query = new URLSearchParams({include_docs:"true", startkey:JSON.stringify(prefix), endkey:JSON.stringify(`${prefix}\ufff0`)});
    const response = await this.request(`/_all_docs?${query}`);
    const data = await response.json();
    const values = data.rows.map(row => row.doc.payload);
    this.metrics.reads += values.length;
    this.metrics.bytesRead += Buffer.byteLength(JSON.stringify(values));
    return values;
  }
  async clear(kind, scope) {
    const prefix = `${kind}:${encodeURIComponent(exigirAmbito(scope))}:`;
    const query = new URLSearchParams({include_docs:"true", startkey:JSON.stringify(prefix), endkey:JSON.stringify(`${prefix}\ufff0`)});
    const response = await this.request(`/_all_docs?${query}`);
    const data = await response.json();
    if (!data.rows.length) return;
    await this.request("/_bulk_docs", {method:"POST", body:JSON.stringify({docs:data.rows.map(row => ({_id:row.id,_rev:row.doc._rev,_deleted:true}))})});
  }
  snapshot() { return {...this.metrics}; }
  async close() {}
}
