export class ErrorCobria extends Error {
  constructor(codigo, mensaje, parametros = {}) {
    super(mensaje);
    this.name = 'ErrorCobria';
    this.codigo = codigo;
    this.parametros = Object.freeze({ ...parametros });
  }
}
