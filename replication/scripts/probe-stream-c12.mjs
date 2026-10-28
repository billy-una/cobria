import assert from 'node:assert/strict';
import { ServerResponse } from 'node:http';
import { sendWebResponse } from '../../sitio/node_modules/vinext/dist/server/prod-server.js';

// Sonda del proveedor instalado, no parche ni prueba del servidor completo.
// Un destino ya destruido modela una desconexión anterior al envío del cuerpo.
const response = new ServerResponse({ method: 'GET' });
response.destroy();
let observed;
try {
  await sendWebResponse(new Response('prueba sintética'), { method: 'GET', headers: {} }, response, false);
} catch (error) { observed = error.code; }
assert.equal(observed, undefined);
console.log(JSON.stringify({
  kind: 'sonda-proveedor-no-servidor-integral', node: process.version,
  observed: observed ?? null, reproduced: false, fixedForClosedDestination: true,
  limit: 'La sonda comprueba el destino destruido con el parche PC8; no sustituye HTTP integral ni cubre todos los mensajes de C10.',
}, null, 2));
