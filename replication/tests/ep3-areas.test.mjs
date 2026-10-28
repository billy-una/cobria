import test from 'node:test';
import assert from 'node:assert/strict';
import {casos} from '../examples/ecosistema-app/taller-areas/casos.mjs';
for(const [nombre,ejecutar] of Object.entries(casos)){
  test(`EP3 ${nombre}: ejemplo y adverso del capítulo`,async()=>{
    const resultado=await ejecutar(3);assert.ok(Object.keys(resultado).length>=2);
  });
}
for(const nombre of ['fundamentos','arquitectura','capas','codigo','datos','core','patrones','seguridad','operaciones','ia','evidencia']){
  test(`EP3 ${nombre}: una cantidad inválida no se oculta`,async()=>{
    await assert.rejects(()=>casos[nombre](0));
  });
}
