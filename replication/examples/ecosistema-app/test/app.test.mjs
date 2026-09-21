import test from 'node:test';
import assert from 'node:assert/strict';
import { construirConjuntoAnalitico } from '../src/application/analytics/construir-conjunto.mjs';
import { evaluarDeriva } from '../src/application/ai/evaluar-deriva.mjs';
import { crearAplicacion } from '../src/composition.mjs';
import { RepositorioMongoDB } from '../src/infrastructure/repositorio-mongodb.mjs';
import { RepositorioCouchDB } from '../src/infrastructure/repositorio-couchdb.mjs';
import { ObservacionDater } from '../src/infrastructure/data/observacion-dater.mjs';
import { calcularHuellaSha256 } from '../src/infrastructure/crypto/huella-sha256.mjs';

const entrada = { id: 'obs-1', ambito: 'bosque-a', especie: 'colibri', cantidad: 2, revision: 1, observadaEn: '2026-09-04T10:00:00Z' };
const contexto = (clave = 'op-1') => ({ actorId: 'investigador-7', finalidad: 'registro-cientifico', ambitos: ['bosque-a'], permisos: ['observaciones:escribir', 'observaciones:leer'], claveIdempotencia: clave });

test('registra un documento canónico válido', async () => {
  const app = crearAplicacion();
  assert.equal((await app.registrar.ejecutar(entrada, contexto())).id, 'obs-1');
});

test('el controlador traduce protocolo sin conocer infraestructura', async () => {
  const app = crearAplicacion();
  const respuesta = await app.registrarController.ejecutar({ cuerpo: entrada, contexto: contexto() });
  assert.equal(respuesta.estado, 201);
  assert.equal(respuesta.cuerpo.dato.id, 'obs-1');
});

test('el controlador publica código estable y mensaje localizado', async () => {
  const app = crearAplicacion();
  const respuesta = await app.registrarController.ejecutar({ cuerpo: { ...entrada, id: '' }, contexto: contexto() });
  assert.equal(respuesta.estado, 400);
  assert.equal(respuesta.cuerpo.codigo, 'OBS_ID_REQUIRED');
  assert.equal(respuesta.cuerpo.mensaje, 'El identificador es obligatorio.');
  assert.equal(respuesta.contentType, 'application/problem+json');
  assert.equal(respuesta.cuerpo.status, 400);
  assert.equal(respuesta.cuerpo.code, 'OBS_ID_REQUIRED');
  assert.match(respuesta.cuerpo.type, /problemas\/obs-id-required$/);
  assert.equal(respuesta.cuerpo.traceId, 'sin-traza');
});

test('el problema HTTP conserva traceId sin exponer detalles internos', async () => {
  const app = crearAplicacion();
  const respuesta = await app.registrarController.ejecutar({
    cuerpo: { ...entrada, cantidad: 0 },
    contexto: { ...contexto(), traceId: 'traza-42' },
  });
  assert.equal(respuesta.cuerpo.traceId, 'traza-42');
  assert.equal(respuesta.cuerpo.title, 'La solicitud no es válida');
  assert.equal('stack' in respuesta.cuerpo, false);
});

test('el Dater aísla claves físicas del dominio', () => {
  const dater = new ObservacionDater();
  const fisico = dater.haciaFisico(entrada);
  assert.deepEqual(Object.keys(fisico), ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  assert.equal(dater.desdeFisico(fisico).ambito, 'bosque-a');
});

test('rechaza el acceso a otro ámbito antes de tocar el repositorio', async () => {
  const app = crearAplicacion();
  await assert.rejects(() => app.registrar.ejecutar(entrada, { ...contexto(), ambitos: ['bosque-b'] }), /Acceso denegado/);
  assert.equal((await app.repositorio.listar('bosque-a')).length, 0);
});

test('rechaza contexto sin identidad o finalidad declarada', async () => {
  const app = crearAplicacion();
  await assert.rejects(() => app.registrar.ejecutar(entrada, { ...contexto(), actorId: '', finalidad: '' }), /Acceso denegado/);
  assert.equal(app.auditoria.listar().at(-1).resultado, 'denegado');
});

test('rechaza comodines y capacidades no concedidas explícitamente', async () => {
  const app = crearAplicacion();
  await assert.rejects(() => app.registrar.ejecutar(entrada, { ...contexto(), permisos: ['*'] }), /Acceso denegado/);
});

test('rechaza ámbitos manipulados antes de acceder a datos', async () => {
  const app = crearAplicacion();
  await assert.rejects(() => app.registrar.ejecutar({ ...entrada, ambito: '../bosque-a' }, contexto()), /Ámbito inválido/);
  assert.equal((await app.repositorio.listar('bosque-a')).length, 0);
});

test('audita actor, capacidad, ámbito y finalidad sin copiar datos sensibles', async () => {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada, contexto());
  const evento = app.auditoria.listar().at(-1);
  assert.deepEqual(
    { actorId: evento.actorId, capacidad: evento.capacidad, ambito: evento.ambito, finalidad: evento.finalidad, resultado: evento.resultado },
    { actorId: 'investigador-7', capacidad: 'observaciones:escribir', ambito: 'bosque-a', finalidad: 'registro-cientifico', resultado: 'permitido' }
  );
  assert.equal('documento' in evento, false);
  assert.equal('claveIdempotencia' in evento, false);
});

test('repetir la misma operación devuelve el mismo resultado sin duplicar', async () => {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada, contexto());
  await app.registrar.ejecutar(entrada, contexto());
  assert.equal((await app.repositorio.listar('bosque-a')).length, 1);
});

test('una clave de idempotencia no puede ocultar una entrada diferente', async () => {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada, contexto());
  await assert.rejects(() => app.registrar.ejecutar({ ...entrada, cantidad: 9 }, contexto()), /otra entrada/);
});

test('rechaza revisiones obsoletas', async () => {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada, contexto('op-1'));
  await assert.rejects(() => app.registrar.ejecutar(entrada, contexto('op-2')), /Revisión obsoleta/);
});

test('reconstruye una proyección equivalente después de retirarla', async () => {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada, contexto());
  const primera = await app.reconstruir.ejecutar('bosque-a', contexto());
  await app.proyecciones.retirar('bosque-a');
  const segunda = await app.reconstruir.ejecutar('bosque-a', contexto());
  assert.deepEqual(segunda, primera);
});

test('pagina observaciones con cursor opaco y orden estable', async () => {
  const app = crearAplicacion();
  await app.registrar.ejecutar({ ...entrada, id:'obs-2' }, contexto('op-2'));
  await app.registrar.ejecutar({ ...entrada, id:'obs-1' }, contexto('op-1'));
  const primera = await app.listarController.ejecutar({ parametros:{ ambito:'bosque-a' }, consulta:{ limite:'1' }, contexto:contexto() });
  assert.equal(primera.estado, 200);
  assert.equal(primera.cuerpo.datos[0].id, 'obs-1');
  assert.match(primera.cuerpo.pagina.siguienteCursor, /^v1\./);
  const segunda = await app.listarController.ejecutar({ parametros:{ ambito:'bosque-a' }, consulta:{ limite:'1', cursor:primera.cuerpo.pagina.siguienteCursor }, contexto:contexto() });
  assert.equal(segunda.cuerpo.datos[0].id, 'obs-2');
  assert.equal(segunda.cuerpo.pagina.siguienteCursor, null);
});

test('rechaza cursor y tamaño de página inválidos con códigos estables', async () => {
  const app = crearAplicacion();
  const cursor = await app.listarController.ejecutar({ parametros:{ ambito:'bosque-a' }, consulta:{ cursor:'offset=0' }, contexto:contexto() });
  const limite = await app.listarController.ejecutar({ parametros:{ ambito:'bosque-a' }, consulta:{ limite:'1000' }, contexto:contexto() });
  assert.equal(cursor.cuerpo.codigo, 'CURSOR_INVALID');
  assert.equal(limite.cuerpo.codigo, 'PAGE_SIZE_INVALID');
});

test('el adaptador MongoDB conserva el contrato del repositorio', async () => {
  const datos = new Map();
  const coleccion = {
    findOne: async (f) => datos.get(`${f.ambito}:${f.id}`) ?? null,
    replaceOne: async (f, doc) => datos.set(`${f.ambito}:${f.id}`, doc),
    find: (f) => ({ toArray: async () => [...datos.values()].filter((d) => d.ambito === f.ambito) }),
  };
  const operaciones = { findOne: async () => null, updateOne: async () => undefined };
  const repo = new RepositorioMongoDB(coleccion, operaciones);
  await repo.guardar(entrada);
  assert.equal((await repo.listar('bosque-a')).length, 1);
  await assert.rejects(() => repo.guardar(entrada), /Revisión obsoleta/);
});

test('el adaptador CouchDB conserva el contrato del repositorio', async () => {
  const datos = new Map();
  const responder = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
  const falsoFetch = async (url, opciones = {}) => {
    if (url.includes('_all_docs')) return responder(200, { rows: [...datos.values()].map((doc) => ({ doc })) });
    const id=decodeURIComponent(url.split('/').at(-1));
    if (!opciones.method) return datos.has(id) ? responder(200, datos.get(id)) : responder(404, {});
    const doc=JSON.parse(opciones.body); datos.set(id, { ...doc, _rev: '1-prueba' }); return responder(201, { ok: true });
  };
  const repo = new RepositorioCouchDB('http://couch.local', 'cobria', falsoFetch);
  await repo.guardar(entrada);
  assert.equal((await repo.listar('bosque-a')).length, 1);
  await assert.rejects(() => repo.guardar(entrada), /Revisión obsoleta/);
});

test('el conjunto analítico conserva consentimiento, tiempo, partición y huella', () => {
  const documentos = [
    { ...entrada, entidadId:'ave-1', conocidaEn:'2026-09-04T11:00:00Z', consentimientoAnalitico:true },
    { ...entrada, id:'obs-2', entidadId:'ave-2', observadaEn:'2026-10-01T10:00:00Z', conocidaEn:'2026-09-05T11:00:00Z', consentimientoAnalitico:true },
    { ...entrada, id:'obs-3', entidadId:'ave-3', consentimientoAnalitico:false, conocidaEn:'2026-09-04T11:00:00Z' },
  ];
  const config = { documentos, ambito:'bosque-a', corteTemporal:'2026-09-30T23:59:59Z', transformacion:{ nombre:'conteo-especies', version:'1.0.0' }, calcularHuella:calcularHuellaSha256, semilla:42 };
  const primero = construirConjuntoAnalitico(config);
  const segundo = construirConjuntoAnalitico(config);
  assert.equal(primero.huella, segundo.huella);
  assert.deepEqual(primero.particion.entrenamiento, ['obs-1']);
  assert.deepEqual(primero.particion.evaluacion, ['obs-2']);
  assert.equal(primero.exclusiones.sinConsentimientoOAmbito, 1);
  assert.equal(primero.autoridadEscritura, false);
});

test('la partición analítica rechaza fuga de una misma entidad', () => {
  const documentos = [
    { ...entrada, entidadId:'ave-1', conocidaEn:'2026-09-04T11:00:00Z', consentimientoAnalitico:true },
    { ...entrada, id:'obs-2', entidadId:'ave-1', observadaEn:'2026-10-01T10:00:00Z', conocidaEn:'2026-09-05T11:00:00Z', consentimientoAnalitico:true },
  ];
  assert.throws(
    () => construirConjuntoAnalitico({ documentos, ambito:'bosque-a', corteTemporal:'2026-09-30T23:59:59Z', transformacion:{ nombre:'rasgos', version:'1' }, calcularHuella:calcularHuellaSha256 }),
    error => error?.codigo === 'ANALYTICS_ENTITY_LEAKAGE',
  );
});

test('la recuperación filtra ámbito antes de similitud y cita revisiones', async () => {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada, contexto('rag-a'));
  await app.registrar.ejecutar({ ...entrada, id:'obs-b', ambito:'bosque-b', especie:'colibri privado' }, { ...contexto('rag-b'), ambitos:['bosque-b'] });
  const resultado = await app.recuperarEvidencia.ejecutar({ consulta:'colibri', ambito:'bosque-a' }, contexto());
  assert.equal(resultado.estado, 'evidencia-encontrada');
  assert.deepEqual(resultado.citas.map(item => item.id), ['obs-1']);
  assert.equal(resultado.citas[0].revision, 1);
  assert.equal(resultado.autoridadEscritura, false);
});

test('la IA se abstiene sin evidencia y nunca adquiere escritura', async () => {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada, contexto());
  const antes = (await app.repositorio.listar('bosque-a')).length;
  const resultado = await app.recuperarEvidencia.ejecutar({ consulta:'danta nocturna', ambito:'bosque-a' }, contexto());
  assert.deepEqual(resultado, { estado:'abstencion', causa:'EVIDENCIA_INSUFICIENTE', citas:[], autoridadEscritura:false });
  assert.equal((await app.repositorio.listar('bosque-a')).length, antes);
});

test('la evaluación de deriva alerta sin modificar autoridad', () => {
  const resultado = evaluarDeriva({ referencia:[0.1, 0.2, 0.3], actual:[0.7, 0.8, 0.9], umbral:0.4 });
  assert.equal(resultado.alerta, true);
  assert.equal(resultado.autoridadEscritura, false);
});
