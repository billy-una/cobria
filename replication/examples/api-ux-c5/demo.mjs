import { randomBytes } from 'node:crypto';
import { abrirTaller } from './server.mjs';

const token = randomBytes(24).toString('base64url');
const taller = await abrirTaller({sesiones:new Map([[token, {actorId:'guardaparques-demo',permisos:['observaciones:leer','observaciones:escribir'],ambitos:['reserva-sur'],expiraEn:Date.now()+30*60*1000}]])});
console.log(`Taller local: ${taller.url}\nSesión DEMO temporal: ${token}\nCopie esta clave en el formulario. Caduca en 30 minutos. Solo datos ficticios; memoria volátil. Ctrl+C para cerrar.`);
process.once('SIGINT',async()=>{await taller.cerrar();process.exitCode=0;});
process.once('SIGTERM',async()=>{await taller.cerrar();process.exitCode=0;});
