const stable = value => JSON.stringify(value, Object.keys(value).sort());

export class AutoridadTransaccional {
  #results = new Map();
  #audit = [];
  constructor({authorize, apply}) { this.authorize = authorize; this.apply = apply; }
  async execute({requestId, input, context}) {
    if (!requestId || !context?.actor || !context?.scope || !context?.capability)
      throw Object.assign(new Error('Contexto incompleto'), {code: 'CONTEXT_REQUIRED'});
    this.authorize(context);
    const fingerprint = stable(input);
    const previous = this.#results.get(`${context.scope}:${requestId}`);
    if (previous) {
      if (previous.fingerprint !== fingerprint)
        throw Object.assign(new Error('Clave reutilizada'), {code: 'IDEMPOTENCY_CONFLICT'});
      return {...previous.result, duplicate: true};
    }
    const result = await this.apply(input, context);
    this.#results.set(`${context.scope}:${requestId}`, {fingerprint, result});
    this.#audit.push({actor: context.actor, scope: context.scope, capability: context.capability, requestId, outcome: 'aplicado'});
    return {...result, duplicate: false};
  }
  audit() { return this.#audit.map(item => ({...item})); }
}
