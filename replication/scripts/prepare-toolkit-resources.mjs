import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {comprobarDestino} from '../src/toolkit.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const output=path.join(root,'replication/resources');
const inventory=[];
for(const directory of ['specification/phase-11','specification/phase-12/schemas']){
  for(const name of (await fs.readdir(path.join(root,directory))).sort()){
    if(!/\.(json|yaml)$/.test(name))continue;
    const relative=path.join(directory,name),source=path.join(root,relative);
    if(!(await fs.lstat(source)).isFile())throw Error('Recurso no regular: '+relative);
    const data=await fs.readFile(source);JSON.parse(data);
    const destination=path.join(output,relative);
    await comprobarDestino(output,[destination]);
    await fs.mkdir(path.dirname(destination),{recursive:true});
    await fs.writeFile(destination,data);
    inventory.push({path:relative,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});
  }
}
await comprobarDestino(output,[path.join(output,'manifest.json')]);
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify({kind:'recursos-documentales-no-certificacion',files:inventory},null,2)+'\n');
console.error(`Recursos del Toolkit preparados: ${inventory.length}.`);
