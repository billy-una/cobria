import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirIntegral, componer } from './composition.mjs';
import { RepositorioPouch } from './infrastructure/repositorio-pouch.mjs';
import { crearAplicacion } from '../ecosistema-app/src/composition.mjs';

/** Un mismo hecho atraviesa memoria, HTTP y motor documental; solo datos sintéticos. */
export async function ejecutarRecorrido({ cantidad = 3 } = {}) {
  assert.ok(Number.isSafeInteger(cantidad) && cantidad > 0, 'Cantidad positiva requerida');
  const directorio = await mkdtemp(path.join(tmpdir(), 'cobria-ep4-'));
  const ambito = 'reserva-sur';
  const dato = { id: 'obs-ep4', ambito, especie: 'colibri', cantidad,
    revision: 1, observadaEn: '2026-10-19T12:00:00.000Z' };
  const contexto = { actorId: 'aprendiz-demo', finalidad: 'aprendizaje-ep4',
    ambitos: [ambito], permisos: ['observaciones:leer', 'observaciones:escribir',
      'observaciones:respaldar', 'observaciones:reconstruir'],
    claveIdempotencia: 'operacion-ep4-01' };
  const memoria = crearAplicacion();
  const inicial = await memoria.registrarController.ejecutar({ cuerpo: dato, contexto });
  assert.equal(inicial.estado, 201);
  const token = 'sesion_demo_ep4_abcdefghijklmnop';
  const sesiones = new Map([[token, { ...contexto, expiraEn: Date.now() + 600000 }]]);
  const abrir = () => abrirIntegral({ directory: path.join(directorio, 'motor'), sesiones });
  let servidor;
  let restaurado;
  try {
    servidor = await abrir();
    const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json',
      'idempotency-key': contexto.claveIdempotencia };
    const escribir = (entrada, clave = contexto.claveIdempotencia) => fetch(
      `${servidor.url}/api/observaciones`, { method: 'POST',
        headers: { ...headers, 'idempotency-key': clave }, body: JSON.stringify(entrada) });
    const leer = async (ruta, parametros = `ambito=${ambito}`) => {
      const respuesta = await fetch(`${servidor.url}/api/${ruta}?${parametros}`, { headers });
      assert.equal(respuesta.status, 200);
      return respuesta.json();
    };
    assert.equal((await escribir(dato)).status, 201);
    const copia = await leer('respaldo');
    // Las entradas inválidas no cambian ni fuente, ni operación, ni proyección.
    assert.equal((await escribir({ ...dato, especie: 'desconocida' }, 'catalogo-ep4-01')).status, 400);
    assert.equal((await escribir({ ...dato, ambito: 'reserva-norte' })).status, 403);
    assert.equal((await escribir({ ...dato, cantidad: cantidad + 1 })).status, 409);
    assert.deepEqual(await servidor.repo.exportar(ambito), copia);
    const resumen = await leer('resumen');
    assert.equal(resumen.conteos.colibri, cantidad);
    const evidencia = await leer('evidencia', `ambito=${ambito}&consulta=colibri`);
    assert.equal(evidencia.citas.length, 1);
    assert.match(evidencia.citas[0].huella, /^[a-f0-9]{64}$/);
    const abstencion = await leer('evidencia', `ambito=${ambito}&consulta=ballena`);
    assert.equal(abstencion.estado, 'abstencion');
    // Analítica descriptiva: no infiere consentimiento ni crea entrenamiento.
    const documentos = await servidor.repo.listar(ambito);
    const analitica = { ambito, documentos: documentos.length,
      cantidad: documentos.reduce((total, d) => total + d.cantidad, 0),
      fuentes: documentos.map(d => ({ id: d.id, revision: d.revision, ambito: d.ambito })),
      fuenteSha256: resumen.fuenteSha256, autoridadEscritura: false,
      entrenamientoHabilitado: false };
    await servidor.cerrar(); servidor = undefined;
    servidor = await abrir();
    assert.equal((await escribir(dato)).status, 201);
    assert.deepEqual(await servidor.repo.exportar(ambito), copia);
    restaurado = new RepositorioPouch(path.join(directorio, 'restaurado'));
    const corrupta = structuredClone(copia); corrupta.sha256 = '0'.repeat(64);
    await assert.rejects(() => restaurado.importarNuevo(corrupta, ambito));
    assert.equal((await restaurado.info()).documentosMotor, 0);
    await restaurado.importarNuevo(copia, ambito);
    const reconstruida = await componer({ repositorio: restaurado }).reconstruirResumen(ambito, contexto);
    assert.deepEqual(reconstruida, resumen);
    assert.deepEqual(await restaurado.exportar(ambito), copia);
    return { fase: 'EP4', tipo: 'recorrido-funcional-local', directorio, cantidad,
      hitos: ['memoria', 'http-catalogo-permisos', 'proyeccion', 'analitica-descriptiva',
        'recuperacion-con-procedencia', 'reapertura-idempotente', 'restauracion-reconstruccion'],
      rechazos: ['catalogo', 'ambito', 'clave-reutilizada', 'respaldo-manipulado'],
      analitica, evidencia, abstencion, sha256: copia.sha256,
      produccion: false, autenticacionReal: false, modeloGenerativo: false };
  } finally {
    if (servidor) await servidor.cerrar();
    if (restaurado) await restaurado.cerrar();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  console.log(JSON.stringify(await ejecutarRecorrido({ cantidad: Number(process.argv[2] ?? 3) }), null, 2));
}
