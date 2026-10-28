import {casos} from './casos.mjs';
const [nombre,cantidadTexto='3',...extra]=process.argv.slice(2);
if(!Object.hasOwn(casos,nombre)||extra.length||!/^\d{1,6}$/.test(cantidadTexto)){
  console.error('Uso: node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs AREA [CANTIDAD]');
  process.exitCode=1;
}else{
  try{console.log(JSON.stringify(await casos[nombre](Number(cantidadTexto)),null,2));}
  catch(error){console.error(`Caso rechazado: ${error.codigo??error.code??error.message}`);process.exitCode=1;}
}
