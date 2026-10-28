import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const revision='47d54ca1ebb14fd864695f1d39dc734f39017c33';
const assets=[['inter/Inter[opsz,wght].ttf','Inter-variable.ttf'],['inter/OFL.txt','Inter-OFL.txt'],
  ['robotomono/RobotoMono[wght].ttf','RobotoMono-variable.ttf'],['robotomono/OFL.txt','RobotoMono-OFL.txt']];
const records=[];
for(const [source,name] of assets){
  const url=`https://raw.githubusercontent.com/google/fonts/${revision}/ofl/${source}`;
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`Fuente no disponible ${response.status}: ${source}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(name.endsWith('.ttf')&&bytes.readUInt32BE(0)!==0x00010000)throw Error('TTF_INVALID');
  if(name.endsWith('.txt')&&!bytes.toString().includes('SIL OPEN FONT LICENSE'))throw Error('LICENSE_INVALID');
  for(const target of ['libro-cobria/fonts','sitio/public/fonts']){
    const directory=path.join(root,target);await fs.mkdir(directory,{recursive:true});await fs.writeFile(path.join(directory,name),bytes);
  }
  records.push({file:name,source:url,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await fs.writeFile(path.join(root,'editorial/fonts.json'),JSON.stringify({revision,license:'OFL-1.1',files:records},null,2)+'\n');
console.log('Fuentes locales y licencias sincronizadas desde revisión fijada.');
