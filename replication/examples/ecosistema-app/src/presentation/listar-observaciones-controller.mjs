import { crearProblemaHttp } from './problema-http.mjs';

export class ListarObservacionesController {
  constructor(listar, traducirError) { this.listar = listar; this.traducirError = traducirError; }
  async ejecutar(solicitud) {
    try {
      const resultado = await this.listar.ejecutar({
        ambito: solicitud.parametros.ambito,
        limite: solicitud.consulta?.limite === undefined ? 20 : Number(solicitud.consulta.limite),
        cursor: solicitud.consulta?.cursor,
      }, solicitud.contexto);
      return { estado: 200, cuerpo: { datos: resultado.items, pagina: { siguienteCursor: resultado.siguienteCursor } } };
    } catch (error) {
      if (!error.codigo) throw error;
      const estados = { ACCESS_DENIED:403, SCOPE_INVALID:400, PAGE_SIZE_INVALID:400, CURSOR_INVALID:400 };
      const estado = estados[error.codigo] ?? 400;
      const problema = crearProblemaHttp(error, estado, this.traducirError, solicitud.contexto?.traceId);
      return { estado, contentType: problema.contentType, cuerpo: { ...problema.body, codigo: problema.body.code, mensaje: problema.body.detail } };
    }
  }
}
