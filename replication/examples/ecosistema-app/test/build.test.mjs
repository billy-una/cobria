import test from 'node:test';
import assert from 'node:assert/strict';
import {ejecutarBuild} from '../src/recorrido-build.mjs';

test('Build une registro, reconstrucción, procedencia, citas y abstención sin escritura de IA',async()=>{
  const result=await ejecutarBuild();
  assert.equal(result.documentos,1);
  assert.equal(result.reconstruccionEquivalente,true);
  assert.equal(result.conjunto.fuentes.length,1);
  assert.equal(result.conjunto.autoridadEscritura,false);
  assert.match(result.conjunto.huella,/^[a-f0-9]{64}$/);
  assert.equal(result.evidencia.citas[0].id,'obs-build');
  assert.equal(result.evidencia.autoridadEscritura,false);
  assert.equal(result.abstencion.estado,'abstencion');
  assert.deepEqual(await ejecutarBuild(),result);
});
