// Evita doble ejecución local; no reemplaza la idempotencia del servidor.
export class AccionUnica {
  constructor() { this.pendientes = new Map(); }
  ejecutar(clave, tarea) {
    if (typeof clave !== 'string' || !clave.trim()) throw new Error('CLAVE_REQUERIDA');
    if (this.pendientes.has(clave)) return this.pendientes.get(clave);
    const promesa = Promise.resolve().then(tarea).finally(() => {
      if (this.pendientes.get(clave) === promesa) this.pendientes.delete(clave);
    });
    this.pendientes.set(clave, promesa);
    return promesa;
  }
}
