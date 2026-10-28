import assert from 'node:assert/strict';
import test from 'node:test';
import { ejecutarPatron, ErrorPatron } from '../src/patrones.js';

const rechaza = (id: number, entrada: Record<string, unknown>, codigo: string) =>
  assert.throws(() => ejecutarPatron(id, entrada), (e: unknown) => e instanceof ErrorPatron && e.codigo === codigo);

test('PC1 cuenta claves reservadas sin heredar propiedades', () => {
  const especies = ['constructor', '__proto__', 'toString'];
  const r = ejecutarPatron(5, {ambito: 'sur', observaciones: especies.map(especie => ({ambito: 'sur', especie, cantidad: 2}))});
  for (const especie of especies) assert.equal((r.conteos as Record<string, number>)[especie], 2);
  assert.equal(({} as Record<string, unknown>).contaminado, undefined);
});

test('PC1 no cuenta otro ámbito y rechaza cantidades inválidas', () => {
  const r = ejecutarPatron(5, {ambito:'sur',observaciones:[{ambito:'sur',especie:'ave',cantidad:2},{ambito:'norte',especie:'ave',cantidad:9}]});
  assert.equal((r.conteos as Record<string,number>).ave, 2);
  for (const cantidad of [-1,0,1.5,NaN,Infinity]) rechaza(5,{ambito:'sur',observaciones:[{ambito:'sur',especie:'ave',cantidad}]},Number.isFinite(cantidad)?'QUANTITY_INVALID':'CANTIDAD_INVALID');
});

test('PC1 catálogo rechaza claves o versiones heredadas', () => {
  for (const clave of ['constructor','__proto__','toString','desconocida'])
    rechaza(4,{clave,version:'v1',catalogos:{v1:{ave:'Ave'}}},'CATALOG_VALUE_UNKNOWN');
  rechaza(4,{clave:'ave',version:'constructor',catalogos:{}},'CATALOG_VALUE_UNKNOWN');
});

test('PC1 cobertura no lee propiedades heredadas ni campos repetidos', () => {
  rechaza(6,{documento:{riesgo:'alto'},campos:['constructor']},'FIELD_NOT_COVERED');
  rechaza(6,{documento:Object.create({riesgo:'alto'}),campos:['riesgo']},'FIELD_NOT_COVERED');
  rechaza(6,{documento:{riesgo:'alto'},campos:['riesgo','riesgo']},'FIELD_NOT_COVERED');
});

test('PC1 reconstrucción calcula sin fingir equivalencia', () => {
  const r = ejecutarPatron(7,{fuentes:[{cantidad:2},{cantidad:3}],version:'v1'});
  assert.equal(r.estado,'candidata-calculada');
  assert.equal(r.equivalenciaVerificada,false);
  rechaza(7,{fuentes:[{cantidad:-1},{cantidad:4}],version:'v1'},'REBUILD_INVALID');
});

test('PC1 publicación devuelve propuesta sin modificar entrada ni almacenamiento', () => {
  const entrada={activa:'v1',candidata:'v2',verificada:true};
  const r=ejecutarPatron(9,entrada);
  assert.equal(r.activaPropuesta,'v2');assert.equal(r.persistida,false);
  assert.equal(entrada.activa,'v1');assert.equal(r.activa,undefined);
});

test('PC1 idempotencia soporta claves reservadas como entradas propias', () => {
  for (const eventoId of ['constructor','__proto__','toString']) {
    const procesados: Record<string,string>={};const entrada={eventoId,procesados,payload:{valor:1}};
    assert.equal(ejecutarPatron(10,entrada).aplicado,true);
    assert.equal(Object.hasOwn(procesados,eventoId),true);
    assert.equal(ejecutarPatron(10,entrada).repetido,true);
    rechaza(10,{...entrada,payload:{valor:2}},'IDEMPOTENCY_CONFLICT');
    assert.equal(Object.getPrototypeOf(procesados),Object.prototype);
  }
});

test('PC1 idempotencia exige payload serializable', () => {
  rechaza(10,{eventoId:'e1',procesados:{}},'PAYLOAD_INVALID');
});

test('PC1 manifiesto no acepta huellas heredadas', () => {
  rechaza(26,{fuentes:['ave'],huellas:Object.create({ave:'a'.repeat(64)}),version:'v1',responsable:'equipo'},'PROVENANCE_INCOMPLETE');
});

test('PC1 revisiones son enteros seguros positivos', () => {
  for (const revisionActual of [-1,0,1.5,Number.MAX_SAFE_INTEGER])
    rechaza(11,{revisionActual,revisionEsperada:revisionActual,cambio:{}},'REVISION_INVALID');
});

test('PC1 entrada no hereda los campos requeridos', () => {
  rechaza(1,Object.create({id:'a',ambito:'sur',revision:1,especie:'ave'}),'ID_REQUIRED');
});

test('PC1 confianza queda dentro del intervalo declarado', () => {
  rechaza(28,{confianza:2,minimo:.5,candidatos:['ave']},'CONFIDENCE_INVALID');
});

test('PC1 fechas imposibles no se normalizan silenciosamente', () => {
  rechaza(2,{observadoEn:'2026-02-30T06:15:00Z',conocidoEn:'2026-03-03T06:15:00Z',procedencia:'sensor'},'TIME_INVALID');
});

test('PC1 auditar exige fecha y datos propios válidos', () => {
  rechaza(30,{eventos:[{ocurridoEn:'ayer',revision:1,responsable:'equipo',accion:'registrar'}]},'AUDIT_EVENT_INCOMPLETE');
});

test('PC1 despachador no ejecuta nombres heredados', () => {
  for (const id of ['constructor','toString',-1,0,31,1.5])
    rechaza(id as number,{},'PATTERN_UNKNOWN');
});

test('PC1 acumulación no desborda enteros seguros', () => {
  rechaza(5,{ambito:'sur',observaciones:[{ambito:'sur',especie:'ave',cantidad:Number.MAX_SAFE_INTEGER},{ambito:'sur',especie:'ave',cantidad:1}]},'QUANTITY_INVALID');
});

test('PC1 outbox y retiro no declaran efectos persistidos', () => {
  assert.equal(ejecutarPatron(12,{documentoId:'d',eventoId:'e',mismaTransaccion:true}).persistido,false);
  assert.equal(ejecutarPatron(20,{consumidores:0,fuenteDisponible:true}).persistido,false);
});

test('PC1 serialización circular produce un rechazo estable', () => {
  const payload: Record<string,unknown>={};payload.self=payload;
  rechaza(10,{eventoId:'e',procesados:{},payload},'PAYLOAD_INVALID');
});
