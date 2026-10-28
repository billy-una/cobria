import test from 'node:test';
import assert from 'node:assert/strict';
import diccionario from '../data/diccionario-observaciones.json' with { type: 'json' };
import { Observacion } from '../src/domain/observacion.mjs';
import { ObservacionDater } from '../src/infrastructure/data/observacion-dater.mjs';
import { resolverEspecie, migrarObservacion, leerObservacionVersionada, consultarObservaciones } from '../src/infrastructure/data/taller-datos.mjs';

const entrada = {id:'obs-001',ambito:'reserva-sur',revision:1,especie:'colibri',cantidad:3,observadaEn:'2026-10-17T12:00:00Z'};
const fisico = cambios => new ObservacionDater().haciaFisico(new Observacion({...entrada,...cambios}));
const version2 = cambios => migrarObservacion(fisico(cambios),'2026.1');

test('diccionario C2 coincide con las claves y valores del Dater v1',()=>{
  const documento=fisico();
  const lectura=new ObservacionDater().desdeFisico(documento);
  const base=diccionario.fields.filter(field=>field.since===1);
  assert.deepEqual(base.map(field=>field.physical).sort(),Object.keys(documento).sort());
  assert.equal(new Set(diccionario.fields.map(field=>field.logical)).size,diccionario.fields.length);
  assert.equal(new Set(diccionario.fields.map(field=>field.physical)).size,diccionario.fields.length);
  for(const field of diccionario.fields){
    for(const key of ['meaning','type','rule','origin','sensitivity'])assert.ok(field[key]);
    assert.equal(field.required,true);assert.ok(Object.hasOwn(field,'unit'));
    if(field.since===1)assert.equal(documento[field.physical],field.logical==='versionEsquema'?1:lectura[field.logical]);
  }
});

test('Dater conserva identidad, ámbito, cantidad y tiempo normalizado',()=>{
  const original=new Observacion({...entrada,observadaEn:'2026-10-17T06:00:00-06:00'});
  const dater=new ObservacionDater();
  assert.deepEqual(dater.desdeFisico(dater.haciaFisico(original)),original);
  assert.equal(original.observadaEn,'2026-10-17T12:00:00.000Z');
  assert.equal(dater.haciaFisico(original).g,3);
  for(const clave of ['a','b','c','e','f','g']){
    const incompleto=dater.haciaFisico(original);delete incompleto[clave];
    assert.throws(()=>dater.desdeFisico(incompleto),error=>error.codigo==='DATA_FIELDS_INVALID');
  }
  for(const clave of ['a','b','e','f'])assert.throws(()=>dater.desdeFisico({...dater.haciaFisico(original),[clave]:42}),error=>error.codigo==='DATA_FIELDS_INVALID');
});

test('catálogo conserva etiquetas por edición y rechaza desconocidos',()=>{
  assert.equal(resolverEspecie('colibri','2026.1').etiqueta,'Colibrí');
  assert.equal(resolverEspecie('colibri','2026.2').etiqueta,'Colibrí observado');
  assert.throws(()=>resolverEspecie('tucan','2026.1'),e=>e.codigo==='CAT_CODE_UNKNOWN');
  assert.throws(()=>resolverEspecie('colibri','2099'),e=>e.codigo==='CAT_VERSION_UNKNOWN');
});

test('migración exige una edición explícita sin alterar el original',()=>{
  const original=fisico();const copia=structuredClone(original);
  assert.throws(()=>migrarObservacion(original),e=>e.codigo==='CAT_VERSION_REQUIRED');
  const nuevo=migrarObservacion(original,'2026.1');
  assert.deepEqual(original,copia);assert.equal(nuevo.d,2);assert.equal(nuevo.h,'2026.1');
  assert.equal(nuevo.c,original.c);assert.equal(nuevo.g,original.g);
});

test('migración repetida es idéntica y permite restaurar la copia v1',()=>{
  const original=fisico();const nuevo=migrarObservacion(original,'2026.1');
  assert.deepEqual(migrarObservacion(nuevo,'2026.1'),nuevo);
  assert.deepEqual(leerObservacionVersionada(nuevo).observacion,new ObservacionDater().desdeFisico(original));
  assert.equal(new ObservacionDater().desdeFisico(original).cantidad,3);
  assert.throws(()=>migrarObservacion(nuevo,'2026.2'),e=>e.codigo==='CAT_VERSION_CONFLICT');
});

test('migración rechaza nulos, campos perdidos, extraños y formatos futuros',()=>{
  const original=fisico();
  for(const campo of ['a','b','c','d','e','f','g']){
    for(const valor of [undefined,null])assert.throws(()=>migrarObservacion({...original,[campo]:valor},'2026.1'));
  }
  assert.throws(()=>migrarObservacion({...original,extra:'no perder'},'2026.1'),e=>e.codigo==='DATA_FIELDS_INVALID');
  const heredado=Object.assign(Object.create({a:original.a}),original);delete heredado.a;heredado.extra='no perder';
  assert.throws(()=>migrarObservacion(heredado,'2026.1'),e=>e.codigo==='DATA_FIELDS_INVALID');
  assert.throws(()=>migrarObservacion({...original,d:99},'2026.1'),e=>e.codigo==='PHYSICAL_VERSION_UNSUPPORTED');
  assert.throws(()=>migrarObservacion({...original,g:0},'2026.1'),e=>e.codigo==='OBS_QUANTITY_INVALID');
  assert.throws(()=>migrarObservacion({...original,f:'desconocida'},'2026.1'),e=>e.codigo==='CAT_CODE_UNKNOWN');
});

test('consulta acotada excluye otra reserva y ordena resultados',()=>{
  const documentos=[version2({id:'obs-002'}),version2({id:'obs-ajena',ambito:'reserva-norte'}),
    version2({id:'obs-antigua',observadaEn:'2026-10-16T12:00:00Z'}),version2(),version2({id:'obs-rana',especie:'rana'})];
  const copia=structuredClone(documentos);
  const resultado=consultarObservaciones(documentos,{ambito:'reserva-sur',especie:'colibri',limite:2});
  assert.deepEqual(resultado.map(item=>item.observacion.id),['obs-001','obs-002']);
  assert.deepEqual(documentos,copia);
  assert.equal(consultarObservaciones(documentos,{ambito:'reserva-vacia',especie:'colibri'}).length,0);
});

test('consulta exige ámbito y límite válido antes de devolver datos',()=>{
  for(const ambito of ['',null,undefined])assert.throws(()=>consultarObservaciones([],{ambito,especie:'colibri'}),e=>e.codigo==='DATA_SCOPE_REQUIRED');
  for(const limite of [0,-1,101,1.5])assert.throws(()=>consultarObservaciones([],{ambito:'reserva-sur',especie:'colibri',limite}),e=>e.codigo==='DATA_LIMIT_INVALID');
  assert.throws(()=>consultarObservaciones([],{ambito:'reserva-sur',especie:''}),e=>e.codigo==='DATA_SPECIES_REQUIRED');
});

test('nodos e índice candidato conservan identidad y filtro de ámbito',()=>{
  const nodos=diccionario.nodes;
  assert.deepEqual(nodos.find(item=>item.authority==='canónica').identity,['ambito','id']);
  assert.ok(nodos.find(item=>item.authority==='derivada'));
  const consulta=diccionario.queries[0];
  assert.deepEqual(consulta.logicalIndexCandidate,['ambito','especie','observadaEn desc','id asc']);
  assert.deepEqual(consulta.physicalIndexCandidate,['b','f','e desc','a asc']);
  assert.match(consulta.status,/no índice creado/);
});
