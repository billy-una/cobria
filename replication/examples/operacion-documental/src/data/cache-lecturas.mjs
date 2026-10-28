// La autorización ocurre antes de esta caché. La clave conserva el contexto de lectura.
export class CacheLecturas {
  constructor({ maxEntradas = 20, ttlMs = 1000, reloj = Date.now } = {}) {
    if (!Number.isInteger(maxEntradas) || maxEntradas < 1 || !Number.isFinite(ttlMs) || ttlMs < 1) {
      throw new Error('LIMITES_INVALIDOS');
    }
    this.maxEntradas = maxEntradas;
    this.ttlMs = ttlMs;
    this.reloj = reloj;
    this.entradas = new Map();
  }

  leer({ ambito, politica, recurso }, cargar) {
    if (![ambito, politica, recurso].every(valor => typeof valor === 'string' && valor.trim())) {
      throw new Error('CONTEXTO_REQUERIDO');
    }
    const clave = JSON.stringify([ambito, politica, recurso]);
    const previa = this.entradas.get(clave);
    if (previa && (previa.pendiente || previa.vence > this.reloj())) return previa.promesa.then(valor => structuredClone(valor));
    this.entradas.delete(clave);
    while (this.entradas.size >= this.maxEntradas) this.entradas.delete(this.entradas.keys().next().value);
    const entrada = { pendiente: true, vence: 0, promesa: null };
    entrada.promesa = Promise.resolve().then(cargar).then(valor => {
      entrada.pendiente = false;
      entrada.vence = this.reloj() + this.ttlMs;
      // Un resultado invalidado no se reinserta al terminar la petición antigua.
      return structuredClone(valor);
    }, error => {
      if (this.entradas.get(clave) === entrada) this.entradas.delete(clave);
      throw error;
    });
    this.entradas.set(clave, entrada);
    // Cada consumidor recibe una copia para no modificar el valor compartido.
    return entrada.promesa.then(valor => structuredClone(valor));
  }

  invalidar({ ambito }) {
    if (typeof ambito !== 'string' || !ambito.trim()) throw new Error('AMBITO_REQUERIDO');
    for (const clave of this.entradas.keys()) {
      if (JSON.parse(clave)[0] === ambito) this.entradas.delete(clave);
    }
  }

  limpiar() { this.entradas.clear(); }
}
