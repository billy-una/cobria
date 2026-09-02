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
