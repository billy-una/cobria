import { createHash } from "node:crypto";

function valorCanonico(value, inArray = false) {
  if (value === null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "bigint") throw new TypeError("COBRIA-HASH-001: BigInt no es JSON canónico");
  if (Array.isArray(value)) return value.map(item => {
    const normalized = valorCanonico(item, true);
    return normalized === undefined ? null : normalized;
  });
  if (typeof value === "object") {
    if (value instanceof Date) return value.toJSON();
    return Object.fromEntries(Object.keys(value).sort().flatMap(key => {
      const normalized = valorCanonico(value[key], false);
      return normalized === undefined ? [] : [[key, normalized]];
    }));
  }
  return inArray ? null : undefined;
}

export const serializarCanonico = value => JSON.stringify(valorCanonico(value));
export const huella = value => createHash("sha256").update(serializarCanonico(value)).digest("hex");

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

class ProtegidoPorAmbito {
  constructor({ authorizer = null, principal = null } = {}) {
    this.authorizer = authorizer;
    this.principal = principal;
  }
  autorizar(scope, action) {
    if (!this.authorizer) return true;
    if (!this.principal) throw new Error("COBRIA-AUTH-002: principal requerido");
    return this.authorizer.exigir(this.principal, scope, action);
  }
}

export class RepositorioCobria extends ProtegidoPorAmbito {
  constructor(adapter, security = {}) {
    super(security);
    this.adapter = adapter;
  }
  async guardar(doc) {
    const next = documentoCobria(doc);
    this.autorizar(next.scope, "write");
    const current = (await this.adapter.list("canonical", next.scope)).find(item => item.id === next.id);
    if (current && current.revision > next.revision) throw new Error("COBRIA-REV-001: revisión obsoleta");
    if (current && current.revision === next.revision) {
      if (huella(current) !== huella(next)) throw new Error("COBRIA-REV-002: conflicto en la misma revisión");
      return current;
    }
    await this.adapter.put("canonical", next.scope, next.id, next);
    return next;
  }
  listar(scope) {
    const safe = exigirAmbito(scope);
    this.autorizar(safe, "read");
    return this.adapter.list("canonical", safe);
  }
}

export class ProyeccionCobria extends ProtegidoPorAmbito {
  constructor(adapter, { name, version, transform = value => value, verify, authorizer = null, principal = null }) {
    super({ authorizer, principal });
    this.adapter = adapter;
    this.name = name;
    this.version = version;
    this.transform = transform;
    this.verify = verify;
  }
  async reconstruir(scope, canonical) {
    const safe = exigirAmbito(scope);
    this.autorizar(safe, "rebuild");
    const candidate = `${this.name}-candidate-v${this.version}`;
    await this.adapter.clear(candidate, safe);
    for (const item of canonical) await this.adapter.put(candidate, safe, item.id, this.transform(item));
    const values = await this.adapter.list(candidate, safe);
    if (!this.verify(canonical, values)) throw new Error("COBRIA-EQV-001: candidata rechazada");
    return { candidate, values, hash: huella(values) };
  }
}

export class AutorizadorAmbito {
  constructor(permissions = {}) { this.permissions = new Map(Object.entries(permissions)); }
  exigir(principal, scope, action = "read") {
    const safe = exigirAmbito(scope);
    if (typeof principal !== "string" || !principal.trim()) throw new Error("COBRIA-AUTH-002: principal requerido");
    if (typeof action !== "string" || !action.trim()) throw new Error("COBRIA-AUTH-003: acción requerida");
    const allowed = this.permissions.get(principal) || [];
    if (!allowed.some(item => item === "*" || item === action || item === `${action}:${safe}` || item === `*:${safe}`)) {
      throw new Error("COBRIA-AUTH-001: operación no autorizada para el ámbito");
    }
    return true;
  }
}

export class PublicadorVersionado extends ProtegidoPorAmbito {
  constructor(adapter, { name, authorizer = null, principal = null }) {
    super({ authorizer, principal });
    this.adapter = adapter;
    this.name = name;
  }
  async catalogRecord(scope) {
    const rows = await this.adapter.list("publication-catalog", exigirAmbito(scope));
    return rows.find(row => row.id === this.name) || null;
  }
  async active(scope) {
    const record = await this.catalogRecord(scope);
    return record?.active || null;
  }
  async writeCatalog(scope, current, next) {
    if (typeof this.adapter.compareAndSwap === "function") {
      const swapped = await this.adapter.compareAndSwap(
        "publication-catalog",
        scope,
        this.name,
        current?.revision ?? null,
        next
      );
      if (!swapped) throw new Error("COBRIA-PUB-003: conflicto concurrente al publicar");
      return;
    }
    await this.adapter.put("publication-catalog", scope, this.name, next);
  }
  async publicar(scope, candidate, { version, expectedHash }) {
    const safe = exigirAmbito(scope);
    this.autorizar(safe, "publish");
    if (!version || !expectedHash) throw new Error("COBRIA-PUB-001: versión y huella requeridas");
    const values = await this.adapter.list(candidate, safe);
    if (huella(values) !== expectedHash) throw new Error("COBRIA-EQV-001: candidata no verificable");
    const current = await this.catalogRecord(safe);
    const next = {
      id: this.name,
      scope: safe,
      revision: (current?.revision ?? 0) + 1,
      active: version,
      previous: current?.active || null,
      candidate,
      hash: expectedHash
    };
    await this.writeCatalog(safe, current, next);
    return { active: version, previous: current?.active || null };
  }
  async rollback(scope) {
    const safe = exigirAmbito(scope);
    this.autorizar(safe, "rollback");
    const current = await this.catalogRecord(safe);
    if (!current?.previous) throw new Error("COBRIA-PUB-002: no existe versión anterior");
    const next = {
      ...current,
      revision: current.revision + 1,
      active: current.previous,
      previous: null
    };
    await this.writeCatalog(safe, current, next);
    return current.previous;
  }
}
