const LEVELS = new Set(['debug', 'info', 'warn', 'error']);

export function crearEventoLog(input, ahora = () => new Date().toISOString()) {
  if (!LEVELS.has(input.level) || !input.event || !input.service || !input.traceId || !input.result) {
    throw new Error('OBSERVABILITY_EVENT_INVALID');
  }
  const allowed = ['actorId', 'scope', 'durationMs', 'errorCode', 'artifactDigest', 'environment'];
  const event = { timestamp: ahora(), level: input.level, event: input.event, service: input.service, traceId: input.traceId, result: input.result };
  for (const key of allowed) if (input[key] !== undefined) event[key] = input[key];
  return Object.freeze(event);
}

export class RegistroMetricas {
  #counters = new Map();
  #observations = new Map();

  incrementar(name, labels = {}, value = 1) {
    const key = this.#key(name, labels);
    this.#counters.set(key, (this.#counters.get(key) ?? 0) + value);
  }

  observar(name, value, labels = {}) {
    if (!Number.isFinite(value)) throw new Error('METRIC_VALUE_INVALID');
    const key = this.#key(name, labels);
    this.#observations.set(key, [...(this.#observations.get(key) ?? []), value]);
  }

  snapshot() {
    return { counters: Object.fromEntries(this.#counters), observations: Object.fromEntries(this.#observations) };
  }

  #key(name, labels) {
    const forbidden = ['documentId', 'message', 'payload', 'actorId'];
    if (Object.keys(labels).some((key) => forbidden.includes(key))) throw new Error('METRIC_LABEL_HIGH_CARDINALITY');
    return `${name}{${Object.entries(labels).sort().map(([k, v]) => `${k}=${v}`).join(',')}}`;
  }
}
