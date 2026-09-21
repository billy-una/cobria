import { crearProblemaHttp } from './problema-http.mjs';

export class RegistrarObservacionController {
  constructor(registrarObservacion, traducirError) {
    this.registrarObservacion = registrarObservacion;
    this.traducirError = traducirError;
  }

  async ejecutar(solicitud) {
    try {
      const resultado = await this.registrarObservacion.ejecutar(solicitud.cuerpo, solicitud.contexto);
      return { estado: 201, cuerpo: { dato: resultado } };
    } catch (error) {
      const estados = {
        ACCESS_DENIED: 403,
        IDEMPOTENCY_CONFLICT: 409,
        STALE_REVISION: 409,
        PROJECTION_VERIFICATION_FAILED: 422,
        PHYSICAL_VERSION_UNSUPPORTED: 422,
      };
      if (error.codigo) {
        const estado = estados[error.codigo] ?? 400;
        const problema = crearProblemaHttp(error, estado, this.traducirError, solicitud.contexto?.traceId);
        return {
          estado,
          contentType: problema.contentType,
          cuerpo: { ...problema.body, codigo: problema.body.code, mensaje: problema.body.detail },
        };
      }
      throw error;
    }
  }
}
