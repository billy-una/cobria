import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../..');
const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function buildParity(){
  const curriculum=read('editorial/curriculum.json'),areas=read('editorial/ep3/areas.json');
  const data={schemaVersion:'1.0.0',version:curriculum.version,scope:'Trazabilidad editorial; no certificación de comprensión o conformidad',
    sources:['editorial/curriculum.json','editorial/ep3/areas.json','editorial/ep4/recorrido.json'],
    sourcesSha256:{curriculum:hash(curriculum),areas:hash(areas),project:hash(read('editorial/ep4/recorrido.json'))},
    modules:curriculum.modules.map(module=>{
      const area=areas.areas.find(a=>a.key===module.key);if(!area)throw Error(`Falta caso ${module.key}`);
      return {key:module.key,title:module.title,bookPart:module.number,route:module.route,caseRoute:`${module.route}#caso-desarrollado`,caseTitle:area.title,caseSource:area.codeSource,caseCommand:area.command,exampleKind:area.command?'ejecutable-local':'artefacto-de-diseño',checkpoint:module.checkpoint,
        lessons:module.lessons.map((lesson,i)=>({title:lesson.title,route:`/aprender/${module.key}/${i+1}`,sharedContentSha256:hash(lesson),execution:lesson.execution??null})),
        projectRoute:'/comenzar/proyecto-integral'};
    })};
  fs.mkdirSync(path.join(root,'editorial/ep5'),{recursive:true});
  fs.writeFileSync(path.join(root,'editorial/ep5/parity.json'),JSON.stringify(data,null,2)+'\n');return data;
}
if(process.argv[1]===new URL(import.meta.url).pathname)buildParity();
