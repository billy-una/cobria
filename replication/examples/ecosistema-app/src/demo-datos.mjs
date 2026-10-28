import { Observacion } from './domain/observacion.mjs';
import { ObservacionDater } from './infrastructure/data/observacion-dater.mjs';
import { migrarObservacion, leerObservacionVersionada, consultarObservaciones } from './infrastructure/data/taller-datos.mjs';

const observacion = new Observacion({id:'obs-001',ambito:'reserva-sur',revision:1,
  especie:'colibri',cantidad:3,observadaEn:'2026-10-17T12:00:00Z'});
const antiguo = new ObservacionDater().haciaFisico(observacion);
const nuevo = migrarObservacion(antiguo, '2026.1');
const lectura = leerObservacionVersionada(nuevo);
console.log(`Diccionario: c = revisión (${nuevo.c}); d = formato (${nuevo.d}); g = cantidad (${nuevo.g})`);
console.log(`Catálogo: ${lectura.clasificacion.etiqueta}, edición ${lectura.catalogoVersion}`);
console.log(`Segunda migración idéntica: ${JSON.stringify(migrarObservacion(nuevo,'2026.1')) === JSON.stringify(nuevo)}`);
console.log(`Consulta reserva-sur/colibri: ${consultarObservaciones([nuevo],{ambito:'reserva-sur',especie:'colibri'}).length} resultado`);
console.log('Taller local en memoria: sin escrituras en disco, sin índice ni motor remoto.');
