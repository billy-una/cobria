import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import mapa from '../data/arquitectura.json' with {type:'json'};
import { Observacion } from '../src/domain/observacion.mjs';
import { RegistrarObservacion } from '../src/application/registrar-observacion.mjs';
import { crearAutorizador } from '../src/application/security/autorizar-capacidad.mjs';
import { RegistrarObservacionController } from '../src/presentation/registrar-observacion-controller.mjs';
import { traducirErrorEs } from '../src/presentation/i18n/mensajes-es.mjs';
import { calcularHuellaSha256 } from '../src/infrastructure/crypto/huella-sha256.mjs';
import { RepositorioMemoria } from '../src/infrastructure/repositorio-memoria.mjs';
import { RepositorioDocumentalMemoria } from '../src/infrastructure/repositorio-documental-memoria.mjs';
import { crearAplicacion } from '../src/composition.mjs';

const entrada={id:'obs-001',ambito:'reserva-sur',revision:1,especie:'colibri',cantidad:3,observadaEn:'2026-10-17T12:00:00Z'};
const contexto=()=>({actorId:'guardaparques-demo',finalidad:'aprendizaje',ambitos:['reserva-sur'],
  permisos:['observaciones:escribir','observaciones:leer'],claveIdempotencia:'visita-c3',traceId:'traza-c3'});
const metodos=['guardar','listar','buscarOperacion','registrarOperacion'];

test('la entidad aplica su regla sin recibir un repositorio',()=>{
  assert.equal(new Observacion(entrada).cantidad,3);
  assert.throws(()=>new Observacion({...entrada,cantidad:0}),e=>e.codigo==='OBS_QUANTITY_INVALID');
  assert.ok(Object.isFrozen(new Observacion(entrada)));
});

test('el recorrido real autoriza antes de consultar y guardar',async()=>{
  const pasos=[],auditoria=[];const memoria=new RepositorioMemoria();
  const repositorio=Object.fromEntries(metodos.map(nombre=>[nombre,async(...args)=>{pasos.push(nombre);return memoria[nombre](...args);} ]));
  const autorizarReal=crearAutorizador({auditar:evento=>auditoria.push(evento)});
  const registrar=new RegistrarObservacion({repositorio,
    autorizar:(...args)=>{pasos.push('autorizar');return autorizarReal(...args);},
    calcularHuella:valor=>{pasos.push('huella');return calcularHuellaSha256(valor);}});
  const controller=new RegistrarObservacionController(registrar,traducirErrorEs);
  const respuesta=await controller.ejecutar({cuerpo:entrada,contexto:contexto()});
  assert.equal(respuesta.estado,201);
  assert.deepEqual(pasos,['autorizar','huella','buscarOperacion','guardar','registrarOperacion']);
  assert.equal(auditoria[0].actorId,'guardaparques-demo');assert.equal(auditoria[0].finalidad,'aprendizaje');
  assert.equal(auditoria[0].capacidad,'observaciones:escribir');assert.equal(auditoria[0].ambito,'reserva-sur');
});

test('dos repositorios locales cumplen el mismo recorrido de registro',async()=>{
  const resultados=[];
  for(const repositorio of [new RepositorioMemoria(),new RepositorioDocumentalMemoria()]){
    const app=crearAplicacion({repositorio});
    const primera=await app.registrarController.ejecutar({cuerpo:entrada,contexto:contexto()});
    const repetida=await app.registrarController.ejecutar({cuerpo:entrada,contexto:contexto()});
    assert.equal(primera.estado,201);assert.deepEqual(primera,repetida);
    assert.equal((await repositorio.listar('reserva-sur')).length,1);
    resultados.push(primera.cuerpo.dato);
  }
  assert.deepEqual(resultados[0],resultados[1]);
});

test('el controlador rechaza otro ámbito sin llamar al repositorio',async()=>{
  let llamadas=0;
  const repositorio=Object.fromEntries(metodos.map(nombre=>[nombre,async()=>{llamadas++;throw new Error('No debía acceder');}]));
  const app=crearAplicacion({repositorio});
  const respuesta=await app.registrarController.ejecutar({cuerpo:{...entrada,ambito:'reserva-norte'},contexto:contexto()});
  assert.equal(respuesta.estado,403);assert.equal(respuesta.cuerpo.codigo,'ACCESS_DENIED');
  assert.equal(respuesta.cuerpo.traceId,'traza-c3');assert.equal(llamadas,0);
});

test('el inventario asigna responsabilidad a todos los archivos de la aplicación',()=>{
  const raiz=fileURLToPath(new URL('../',import.meta.url));const archivos=[];
  function recorrer(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);if(entry.isDirectory())recorrer(file);else if(entry.name.endsWith('.mjs'))archivos.push(path.relative(raiz,file).split(path.sep).join('/'));
  }}
  recorrer(path.join(raiz,'src'));
  assert.deepEqual(mapa.files.map(item=>item.path).sort(),archivos.sort());
  for(const item of mapa.files){
    assert.ok(item.responsibility);assert.ok(item.notResponsibleFor);assert.ok(item.proof);
    assert.ok(mapa.layers.some(layer=>layer.id===item.layer));
  }
  assert.ok(mapa.flow.every(item=>mapa.files.some(file=>file.path===item.path)));
});

test('una cantidad inválida no se guarda aunque la autorización sea válida',async()=>{
  let escrituras=0;const memoria=new RepositorioMemoria();
  const repositorio=Object.fromEntries(metodos.map(nombre=>[nombre,async(...args)=>{
    if(['guardar','registrarOperacion'].includes(nombre))escrituras++;
    return memoria[nombre](...args);
  }]));
  const app=crearAplicacion({repositorio});
  const respuesta=await app.registrarController.ejecutar({cuerpo:{...entrada,cantidad:0},contexto:contexto()});
  assert.equal(respuesta.estado,400);assert.equal(respuesta.cuerpo.codigo,'OBS_QUANTITY_INVALID');
  assert.equal(escrituras,0);assert.equal((await memoria.listar('reserva-sur')).length,0);
});

test('el puerto expresa las cuatro capacidades usadas por la aplicación',()=>{
  const contrato=fs.readFileSync(new URL('../src/application/ports/repositorio-observaciones.mjs',import.meta.url),'utf8');
  for(const nombre of metodos){assert.ok(contrato.includes(` ${nombre}`));
    for(const repo of [new RepositorioMemoria(),new RepositorioDocumentalMemoria()])assert.equal(typeof repo[nombre],'function');}
  assert.ok(!contrato.includes('obtenerPorId'));
});

test('la composición permite sustituir el puerto y detecta una forma incompleta',()=>{
  assert.ok(crearAplicacion().repositorio instanceof RepositorioMemoria);
  const repo=new RepositorioDocumentalMemoria();assert.equal(crearAplicacion({repositorio:repo}).repositorio,repo);
  assert.throws(()=>crearAplicacion({repositorio:{guardar(){}}}),TypeError);
});

test('el adaptador documental conserva ámbito y revisión al traducir',async()=>{
  const documentos=new Map();const repo=new RepositorioDocumentalMemoria({documentos});
  await repo.guardar(new Observacion(entrada));
  await repo.guardar(new Observacion({...entrada,ambito:'reserva-norte',cantidad:7}));
  await repo.guardar(new Observacion({...entrada,revision:2,cantidad:4}));
  await assert.rejects(()=>repo.guardar(new Observacion(entrada)),e=>e.codigo==='STALE_REVISION');
  const listado=await repo.listar('reserva-sur');
  assert.equal(listado.length,1);assert.equal(listado[0].cantidad,4);assert.equal(listado[0].revision,2);
  assert.deepEqual(Object.keys([...documentos.values()][0]),['a','b','c','d','e','f','g']);
  assert.equal((await repo.listar('reserva-norte'))[0].cantidad,7);
});

test('la demostración de capas muestra el rechazo sin otra escritura',()=>{
  const result=spawnSync(process.execPath,['src/demo-capas.mjs'],{cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8',timeout:10000});
  assert.equal(result.status,0,result.stderr);
  assert.ok(result.stdout.includes('Controlador: estado 201, cantidad 3'));
  assert.ok(result.stdout.includes('Tras el rechazo: 1 documento'));
  assert.ok(result.stdout.includes('Sin HTTP real, motor remoto ni garantía transaccional'));
});
