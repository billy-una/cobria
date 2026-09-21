export class EstadoOperativo {
  #state = {type: 'reposo'};
  #pending = null;
  get state() { return {...this.#state}; }
  async execute(action) {
    if (this.#pending) return this.#pending;
    this.#state = {type: 'carga'};
    this.#pending = Promise.resolve().then(action).then(value => {
      this.#state = Array.isArray(value) && value.length === 0
        ? {type: 'vacio', value}
        : {type: 'exito', value};
      return value;
    }).catch(error => {
      this.#state = {type: 'error', code: error.code ?? 'UNEXPECTED'};
      throw error;
    }).finally(() => { this.#pending = null; });
    return this.#pending;
  }
  retry(action) { return this.execute(action); }
}
