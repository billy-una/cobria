import { readFile } from 'node:fs/promises';
import { crearConjunto,crearAsistente,crearHerramientaLectura } from './taller.mjs';
const fixtures=JSON.parse(await readFile(new URL('./fixtures.json',import.meta.url)));
const protocol=JSON.parse(await readFile(new URL('./protocolo.json',import.meta.url)));
const contexto={actorId:'brigada-demo',finalidad:'aprendizaje-c7',permisos:['observaciones:leer'],ambitos:['reserva-sur']};
const conjunto=crearConjunto({documentos:fixtures.documents,ambito:'reserva-sur',corteEntrenamiento:protocol.trainingCutoff,corteEvaluacion:protocol.evaluationCutoff,versionCaracteristica:protocol.featureVersion},contexto);
const repositorio={listar:async ambito=>structuredClone(fixtures.retrievalDocuments.filter(d=>d.ambito===ambito))};
const responder=crearAsistente({repositorio,umbral:protocol.threshold});
const respuesta=await responder({consulta:'colibrí',ambito:'reserva-sur'},contexto);
const abstencion=await responder({consulta:'jilguero',ambito:'reserva-sur'},contexto);
let rechazoHerramienta;
try{await crearHerramientaLectura({repositorio})({herramienta:'borrar-observaciones',ambito:'reserva-sur'},contexto);}catch(error){rechazoHerramienta=error.message;}
console.log(JSON.stringify({kind:'taller-local-sin-modelo-entrenado',conjunto,respuesta,abstencion,rechazoHerramienta,published:false},null,2));
