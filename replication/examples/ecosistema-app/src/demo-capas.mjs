import { crearAplicacion } from './composition.mjs';
import { RepositorioDocumentalMemoria } from './infrastructure/repositorio-documental-memoria.mjs';

const documentos = new Map();
const app = crearAplicacion({repositorio:new RepositorioDocumentalMemoria({documentos})});
const contexto = {actorId:'guardaparques-demo',finalidad:'aprendizaje',ambitos:['reserva-sur'],
  permisos:['observaciones:escribir'],claveIdempotencia:'visita-capas-001',traceId:'demo-capas'};
const cuerpo = {id:'obs-001',ambito:'reserva-sur',revision:1,especie:'colibri',cantidad:3,
  observadaEn:'2026-10-17T12:00:00Z'};
const respuesta = await app.registrarController.ejecutar({cuerpo,contexto});
const rechazo = await app.registrarController.ejecutar({cuerpo:{...cuerpo,id:'obs-cero',cantidad:0},
  contexto:{...contexto,claveIdempotencia:'visita-cero'}});
console.log(`Controlador: estado ${respuesta.estado}, cantidad ${respuesta.cuerpo.dato.cantidad}`);
console.log(`Repositorio documental local: ${documentos.size} documento`);
console.log(`Regla de dominio: ${rechazo.cuerpo.codigo}, estado ${rechazo.estado}`);
console.log(`Tras el rechazo: ${documentos.size} documento`);
console.log('Misma aplicación, otra representación. Sin HTTP real, motor remoto ni garantía transaccional.');
