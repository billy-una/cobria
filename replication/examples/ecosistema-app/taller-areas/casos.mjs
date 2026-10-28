import assert from 'node:assert/strict';
import { crearAplicacion } from '../src/composition.mjs';
import { Observacion } from '../src/domain/observacion.mjs';
import { RepositorioMemoria } from '../src/infrastructure/repositorio-memoria.mjs';
import { ObservacionDater } from '../src/infrastructure/data/observacion-dater.mjs';
import {
  migrarObservacion,
  leerObservacionVersionada,
} from '../src/infrastructure/data/taller-datos.mjs';
import { traducirErrorEs } from '../src/presentation/i18n/mensajes-es.mjs';
import {
  crearRespaldo,
  restaurarRespaldo,
  reproducirDefectoCache,
  crearLecturaSegura,
} from '../../operacion-c6/operacion.mjs';
import { crearAsistente } from '../../analitica-c7/taller.mjs';
import { calcularHuellaSha256 } from '../src/infrastructure/crypto/huella-sha256.mjs';

// Datos sintéticos compartidos: cada caso crea una aplicación nueva.
export const entrada = (cantidad = 3) => ({
  id: 'obs-area-001',
  ambito: 'reserva-sur',
  especie: 'colibri',
  cantidad,
  revision: 1,
  observadaEn: '2026-10-19T12:00:00Z',
});
export const contexto = () => ({
  actorId: 'aprendiz',
  finalidad: 'aprendizaje',
  ambitos: ['reserva-sur'],
  permisos: ['observaciones:leer', 'observaciones:escribir'],
  claveIdempotencia: 'visita-area-001',
});

export async function fundamentos(cantidad = 3) {
  const observacion = new Observacion(entrada(cantidad));
  assert.equal(observacion.cantidad, cantidad);
  assert.throws(() => new Observacion(entrada(0)), { codigo: 'OBS_QUANTITY_INVALID' });
  assert.throws(() => {
    observacion.cantidad = 99;
  }, TypeError);
  return {
    cantidad: observacion.cantidad,
    revision: observacion.revision,
    congelada: Object.isFrozen(observacion),
  };
}

export async function arquitectura(cantidad = 3) {
  const repositorio = new RepositorioMemoria();
  const app = crearAplicacion({ repositorio });
  await app.registrar.ejecutar(entrada(cantidad), contexto());
  const documentos = await repositorio.listar('reserva-sur');
  assert.equal(app.repositorio, repositorio);
  assert.equal(documentos.length, 1);
  assert.throws(() => crearAplicacion({ repositorio: {} }), /Repositorio sin método/);
  return {
    documentos: documentos.length,
    cantidad: documentos[0].cantidad,
    puertoIncompleto: 'rechazado',
  };
}

export async function capas(cantidad = 3) {
  const app = crearAplicacion();
  const solicitud = { cuerpo: entrada(cantidad), contexto: contexto() };
  const correcta = await app.registrarController.ejecutar(solicitud);
  const invalida = await app.registrarController.ejecutar({
    cuerpo: entrada(0),
    contexto: { ...contexto(), claveIdempotencia: 'visita-cero' },
  });
  const prohibida = await app.registrarController.ejecutar({
    ...solicitud,
    contexto: { ...contexto(), permisos: [] },
  });
  assert.equal(correcta.estado, 201);
  assert.equal(invalida.estado, 400);
  assert.equal(prohibida.estado, 403);
  return {
    aceptada: correcta.estado,
    invalida: invalida.estado,
    denegada: prohibida.estado,
    mensaje: prohibida.cuerpo.mensaje,
  };
}

export async function codigo(cantidad = 3) {
  const observacion = new Observacion(entrada(cantidad));
  const instanteMs = Date.parse(observacion.observadaEn);
  // Date recibe milisegundos. Dividir por 1000 aquí cambiaría la unidad.
  const fechaUtc = new Date(instanteMs).toISOString();
  const descripcion = `${observacion.especie}: ${observacion.cantidad} (${fechaUtc})`;
  assert.equal(fechaUtc, observacion.observadaEn);
  assert.notEqual(new Date(instanteMs / 1000).toISOString(), fechaUtc);
  return { descripcion, errorCantidad: traducirErrorEs('OBS_QUANTITY_INVALID') };
}

export async function datos(cantidad = 3) {
  const dater = new ObservacionDater();
  const documento = dater.haciaFisico(new Observacion(entrada(cantidad)));
  const migrado = migrarObservacion(documento, '2026.1');
  const leido = leerObservacionVersionada(migrado);
  assert.equal(leido.observacion.cantidad, cantidad);
  assert.equal(leido.observacion.revision, 1);
  assert.throws(() => migrarObservacion(documento), { codigo: 'CAT_VERSION_REQUIRED' });
  assert.deepEqual(migrarObservacion(migrado, '2026.1'), migrado);
  return {
    cantidad: leido.observacion.cantidad,
    revision: leido.observacion.revision,
    catalogo: leido.catalogoVersion,
    etiqueta: leido.clasificacion.etiqueta,
  };
}

export async function core(cantidad = 3) {
  const app = crearAplicacion(),
    actor = contexto();
  await app.registrar.ejecutar(entrada(cantidad), actor);
  const antes = await app.reconstruir.ejecutar('reserva-sur', actor);
  // Corrupción deliberada de la copia derivada, solo dentro de este ensayo.
  await app.proyecciones.publicar('reserva-sur', { conteos: { colibri: 99 } });
  const reparada = await app.reconstruir.ejecutar('reserva-sur', actor);
  assert.deepEqual(reparada, antes);
  assert.equal(
    (await app.listar.ejecutar({ ambito: 'reserva-sur' }, actor)).items[0].cantidad,
    cantidad,
  );
  await assert.rejects(() => app.reconstruir.ejecutar('reserva-norte', actor), {
    codigo: 'ACCESS_DENIED',
  });
  return {
    canonico: cantidad,
    reconstruida: reparada.conteos.colibri,
    equivalenciaDelCaso: true,
  };
}

export async function patrones(cantidad = 3) {
  const app = crearAplicacion(),
    actor = contexto();
  const primera = await app.registrar.ejecutar(entrada(cantidad), actor);
  const repetida = await app.registrar.ejecutar(entrada(cantidad), actor);
  assert.deepEqual(repetida, primera);
  await assert.rejects(() => app.registrar.ejecutar(entrada(cantidad + 1), actor), {
    codigo: 'IDEMPOTENCY_CONFLICT',
  });
  const lista = await app.listar.ejecutar({ ambito: 'reserva-sur' }, actor);
  assert.equal(lista.items.length, 1);
  return {
    documentos: lista.items.length,
    conflicto: 'IDEMPOTENCY_CONFLICT',
    garantiaConcurrente: false,
  };
}

export async function seguridad(cantidad = 3) {
  const app = crearAplicacion();
  await assert.rejects(
    () => app.registrar.ejecutar(entrada(cantidad), { ...contexto(), permisos: [] }),
    { codigo: 'ACCESS_DENIED' },
  );
  await assert.rejects(
    () =>
      app.registrar.ejecutar(
        { ...entrada(cantidad), ambito: 'reserva-norte' },
        contexto(),
      ),
    { codigo: 'ACCESS_DENIED' },
  );
  assert.equal(
    (await app.listar.ejecutar({ ambito: 'reserva-sur' }, contexto())).items.length,
    0,
  );
  await app.registrar.ejecutar(entrada(cantidad), contexto());
  return {
    rechazos: 2,
    escriturasTrasRechazos: 0,
    documentosAutorizados: 1,
    autenticacionReal: false,
  };
}

export async function calidad() {
  const defecto = await reproducirDefectoCache();
  assert.notEqual(defecto.esperado, defecto.obtenido);
  let cargas = 0;
  const lectura = crearLecturaSegura({
    reloj: () => 0, // Reloj controlado: aquí contamos cargas, no medimos latencia.
    cargar: async (ambito) => {
      cargas++;
      return [{ ambito }];
    },
  });
  await lectura.leer('reserva-sur', contexto());
  await lectura.leer('reserva-sur', contexto());
  await assert.rejects(
    () => lectura.leer('reserva-sur', { ...contexto(), permisos: [] }),
    { codigo: 'ACCESS_DENIED' },
  );
  assert.equal(cargas, 1);
  return {
    defectoReproducido: defecto.causa,
    cargasParaDosLecturas: cargas,
    autorizacionEnCache: true,
  };
}

export async function operaciones(cantidad = 3) {
  const documentos = [new Observacion(entrada(cantidad))];
  const respaldo = crearRespaldo(documentos, 'reserva-sur', contexto());
  const restaurado = await restaurarRespaldo(
    respaldo.bytes,
    respaldo.sha256,
    'reserva-sur',
    contexto(),
  );
  assert.equal((await restaurado.listar('reserva-sur'))[0].cantidad, cantidad);
  const alterado = Buffer.from(respaldo.bytes);
  alterado[0] ^= 1;
  await assert.rejects(
    () => restaurarRespaldo(alterado, respaldo.sha256, 'reserva-sur', contexto()),
    /HUELLA_INCOMPATIBLE/,
  );
  return {
    documentosRestaurados: 1,
    huella: respaldo.sha256,
    copiaAlterada: 'rechazada',
    despliegueReal: false,
  };
}

export async function ia(cantidad = 3) {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada(cantidad), contexto());
  const consultar = crearAsistente({ repositorio: app.repositorio });
  const evidencia = await consultar(
    { consulta: 'colibri', ambito: 'reserva-sur' },
    contexto(),
  );
  const ausente = await consultar(
    { consulta: 'tucan', ambito: 'reserva-sur' },
    contexto(),
  );
  assert.equal(evidencia.citas[0].id, 'obs-area-001');
  assert.equal(ausente.estado, 'abstencion');
  assert.equal(evidencia.autoridadEscritura, false);
  return {
    citas: evidencia.citas.length,
    revision: evidencia.citas[0].revision,
    sinEvidencia: ausente.estado,
    tipo: evidencia.tipo,
  };
}

export async function evidencia(cantidad = 3) {
  const fuente = new Observacion(entrada(cantidad));
  const huella = calcularHuellaSha256(fuente);
  assert.equal(calcularHuellaSha256({ ...fuente }), huella);
  assert.notEqual(calcularHuellaSha256({ ...fuente, cantidad: cantidad + 1 }), huella);
  return {
    id: fuente.id,
    revision: fuente.revision,
    huella,
    integridadNoEsAutoria: true,
  };
}

export const casos = {
  fundamentos,
  arquitectura,
  capas,
  codigo,
  datos,
  core,
  patrones,
  seguridad,
  calidad,
  operaciones,
  ia,
  evidencia,
};
