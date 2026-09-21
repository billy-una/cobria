import { RegistrarObservacion } from './application/registrar-observacion.mjs';
import { ReconstruirResumen } from './application/reconstruir-resumen.mjs';
import { ListarObservaciones } from './application/listar-observaciones.mjs';
import { RepositorioMemoria, AlmacenProyeccionesMemoria } from './infrastructure/repositorio-memoria.mjs';
import { calcularHuellaSha256 } from './infrastructure/crypto/huella-sha256.mjs';
import { RegistrarObservacionController } from './presentation/registrar-observacion-controller.mjs';
import { traducirErrorEs } from './presentation/i18n/mensajes-es.mjs';
import { crearAutorizador } from './application/security/autorizar-capacidad.mjs';
import { AuditoriaMemoria } from './infrastructure/security/auditoria-memoria.mjs';
import { ListarObservacionesController } from './presentation/listar-observaciones-controller.mjs';
import { RecuperarEvidencia } from './application/ai/recuperar-evidencia.mjs';

export function crearAplicacion() {
  const repositorio = new RepositorioMemoria();
  const proyecciones = new AlmacenProyeccionesMemoria();
  const auditoria = new AuditoriaMemoria();
  const autorizar = crearAutorizador({ auditar: (evento) => auditoria.registrar(evento) });
  const registrar = new RegistrarObservacion({ repositorio, autorizar, calcularHuella: calcularHuellaSha256 });
  const listar = new ListarObservaciones({ repositorio, autorizar });
  return {
    repositorio,
    proyecciones,
    auditoria,
    registrar,
    listar,
    recuperarEvidencia: new RecuperarEvidencia({ repositorio, autorizar }),
    listarController: new ListarObservacionesController(listar, traducirErrorEs),
    registrarController: new RegistrarObservacionController(registrar, traducirErrorEs),
    reconstruir: new ReconstruirResumen({ repositorio, proyecciones, autorizar })
  };
}
