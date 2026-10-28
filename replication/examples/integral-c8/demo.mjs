import { mkdtemp,realpath,lstat,readFile,writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { abrirIntegral } from './composition.mjs';

const token=randomBytes(24).toString('base64url');
let directory;
if(process.argv.length>2){
  if(process.argv.length!==4 || process.argv[2]!=='--reanudar' || !path.isAbsolute(process.argv[3]))throw new Error('Use --reanudar con la ruta absoluta impresa por una ejecución anterior.');
  directory=path.resolve(process.argv[3]);
  if(await realpath(directory)!==directory || !(await lstat(directory)).isDirectory())throw new Error('El directorio debe ser canónico y no un enlace.');
  const marker=path.join(directory,'cobria-c8.json'),stat=await lstat(marker);
  if(!stat.isFile() || stat.isSymbolicLink() || stat.size>1024)throw new Error('Marcador no válido');
  const identity=JSON.parse(await readFile(marker,'utf8'));
  if(identity.kind!=='cobria-c8-local' || identity.version!==1 || await realpath(path.join(directory,'motor'))!==path.join(directory,'motor'))throw new Error('Directorio ajeno al taller');
}else{
  directory=await realpath(await mkdtemp(path.join(tmpdir(),'cobria-c8-datos-')));
  await writeFile(path.join(directory,'cobria-c8.json'),JSON.stringify({kind:'cobria-c8-local',version:1}),{flag:'wx',mode:0o600});
}
const app=await abrirIntegral({directory:path.join(directory,'motor'),sesiones:new Map([[token,{actorId:'brigada-demo',permisos:['observaciones:leer','observaciones:escribir','observaciones:respaldar'],ambitos:['reserva-sur'],expiraEn:Date.now()+30*60*1000}]])});
console.log(`Aplicación local: ${app.url}\nSesión DEMO temporal: ${token}\nMotor conservado en: ${directory}\nPara reabrir: npm start --prefix replication/examples/integral-c8 -- --reanudar ${directory}\nSolo datos ficticios. Ctrl+C cierra sin borrar el motor.`);
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.cerrar();process.exitCode=0;});
