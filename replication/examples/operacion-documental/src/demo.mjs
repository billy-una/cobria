import { CacheLecturas } from './data/cache-lecturas.mjs';
import { ColaBorradores } from './data/cola-offline.mjs';
import { AccionUnica } from './application/accion-unica.mjs';
import { TelemetriaAcotada } from './data/telemetria-acotada.mjs';

const cache = new CacheLecturas();
const contexto = { ambito: 'reserva-sur', politica: 'guardaparque-v1', recurso: 'observaciones:pagina-1' };
let lecturas = 0;
const cargar = async () => { lecturas++; return [{ id: 'obs-1', ambito: contexto.ambito, revision: 1 }]; };
await Promise.all([cache.leer(contexto, cargar), cache.leer(contexto, cargar)]);
const cola = new ColaBorradores();
cola.encolarLote([{ ruta: 'borradores/reserva-sur/obs-1', valor: { especie: 'colibri' } }]);
try { cola.encolarLote([{ ruta: 'inventario/reserva-sur', valor: 4 }]); }
catch (error) { console.log('Escritura sensible rechazada offline:', error.message); }
const acciones = new AccionUnica();
let ejecuciones = 0;
await Promise.all([acciones.ejecutar('obs-1', () => ++ejecuciones), acciones.ejecutar('obs-1', () => ++ejecuciones)]);
const telemetria = new TelemetriaAcotada();
telemetria.registrar({ metrica: 'lectura-observaciones', duracionMs: 8, ok: true, email: 'dato-omitido' });
console.log(JSON.stringify({ lecturas, ejecuciones, borradores: cola.items.length, telemetria: telemetria.items }, null, 2));
