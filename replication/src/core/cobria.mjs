import { createHash } from "node:crypto";

export const huella = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function exigirAmbito(scope) {
  if (typeof scope !== "string" || !scope.trim()) throw new Error("COBRIA-SCP-001: ámbito requerido");
  return scope.trim();
}

export function exigirCoincidenciaAmbito(scope, value) {
  const safe = exigirAmbito(scope);
  if (value?.scope !== undefined && exigirAmbito(value.scope) !== safe) {
    throw new Error("COBRIA-SCP-001: el ámbito del documento no coincide con la operación");
  }
  return safe;
}

export function documentoCobria(input) {
  const scope = exigirAmbito(input.scope);
  if (!input.id) throw new Error("COBRIA-ID-001: identidad requerida");
  if (!Number.isInteger(input.revision) || input.revision < 1) throw new Error("COBRIA-REV-001: revisión inválida");
  return Object.freeze({ schemaVersion: 1, ...input, id: String(input.id), scope });
}

export function manifiestoCobria({ sources, transform, partition, evidence }) {
  if (!sources?.length || sources.some(source => !source.hash || !source.scope)) {
    throw new Error("COBRIA-ANA-001: fuentes incompletas");
  }
  const manifest = {
    contract: "COBRIA Core 1.1",
    createdAt: new Date().toISOString(),
    sources,
    transform,
    partition,
    evidence
  };
  return Object.freeze({ ...manifest, hash: huella(manifest) });
}

export class RepositorioCobria {
  constructor(adapter) { this.adapter = adapter; }
  async guardar(doc) {
    const next = documentoCobria(doc);
    const current = (await this.adapter.list("canonical", next.scope)).find(item => item.id === next.id);
    if (current && current.revision > next.revision) throw new Error("COBRIA-REV-001: revisión obsoleta");
    await this.adapter.put("canonical", next.scope, next.id, next);
    return next;
  }
  listar(scope) { return this.adapter.list("canonical", exigirAmbito(scope)); }
}

export class ProyeccionCobria {
  constructor(adapter, { name, version, transform = value => value, verify }) {
    this.adapter = adapter;
    this.name = name;
    this.version = version;
    this.transform = transform;
    this.verify = verify;
  }
  async reconstruir(scope, canonical) {
    exigirAmbito(scope);
    const candidate = `${this.name}-candidate-v${this.version}`;
    await this.adapter.clear(candidate, scope);
    for (const item of canonical) await this.adapter.put(candidate, scope, item.id, this.transform(item));
    const values = await this.adapter.list(candidate, scope);
    if (!this.verify(canonical, values)) throw new Error("COBRIA-EQV-001: candidata rechazada");
    return { candidate, values, hash: huella(values) };
  }
}

export class AutorizadorAmbito {
  constructor(permissions = {}) { this.permissions = new Map(Object.entries(permissions)); }
  exigir(principal, scope, action = "read") {
    exigirAmbito(scope);
    const allowed = this.permissions.get(principal) || [];
    if (!allowed.some(item => item === "*" || item === action || item === `${action}:${scope}` || item === `*:${scope}`)) {
      throw new Error("COBRIA-AUTH-001: operación no autorizada para el ámbito");
    }
    return true;
  }
}

export class PublicadorVersionado {
  constructor(adapter, { name }) { this.adapter = adapter; this.name = name; }
  async active(scope) {
    const rows = await this.adapter.list("publication-catalog", scope);
    return rows.find(row => row.id === this.name)?.active || null;
  }
  async publicar(scope, candidate, { version, expectedHash }) {
    exigirAmbito(scope);
    if (!version || !expectedHash) throw new Error("COBRIA-PUB-001: versión y huella requeridas");
    const values = await this.adapter.list(candidate, scope);
    if (huella(values) !== expectedHash) throw new Error("COBRIA-EQV-001: candidata no verificable");
    const previous = await this.active(scope);
    await this.adapter.put("publication-catalog", scope, this.name, {
      id: this.name, scope, revision: Date.now(), active: version, previous,
      candidate, hash: expectedHash
    });
    return { active: version, previous };
  }
  async rollback(scope) {
    const rows = await this.adapter.list("publication-catalog", scope);
    const record = rows.find(row => row.id === this.name);
    if (!record?.previous) throw new Error("COBRIA-PUB-002: no existe versión anterior");
    await this.adapter.put("publication-catalog", scope, this.name, {
      ...record, revision: Date.now(), active: record.previous, previous: null
    });
    return record.previous;
  }
}
