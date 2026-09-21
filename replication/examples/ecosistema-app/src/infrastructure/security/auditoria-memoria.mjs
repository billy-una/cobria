export class AuditoriaMemoria {
  #eventos = [];

  registrar(evento) {
    // Lista positiva: nunca persiste documentos, credenciales ni claves de idempotencia.
    const { actorId, capacidad, ambito, finalidad, resultado, codigo, ocurridoEn } = evento;
    this.#eventos.push(Object.freeze({ actorId, capacidad, ambito, finalidad, resultado, codigo, ocurridoEn }));
  }

  listar() {
    return this.#eventos.map((evento) => ({ ...evento }));
  }
}
