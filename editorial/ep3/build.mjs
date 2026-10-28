import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {chapters} from './chapters.mjs';
import {reviews,entryPatterns,antecedents} from './pattern-review.mjs';
import {escapeHtml as e} from '../ep2/build.mjs';
const root=path.resolve(import.meta.dirname,'../..');
const caseFile='replication/examples/ecosistema-app/taller-areas/casos.mjs';
export const executionNote='Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.';
export function buildEp3(){
  const code=fs.readFileSync(path.join(root,caseFile),'utf8');
  const catalog=JSON.parse(fs.readFileSync(path.join(root,'sitio/public/pattern-catalog.json')));
  const practical=JSON.parse(fs.readFileSync(path.join(root,'libro-cobria/practical-examples.json')));
  const areas=chapters.map(chapter=>{
    for(const filename of chapter.sources)if(!fs.existsSync(path.join(root,filename)))throw new Error(`EP3 fuente ausente: ${filename}`);
    const start=chapter.caseKey?code.indexOf(`export async function ${chapter.caseKey}(`):-1;
    if(chapter.caseKey&&start<0)throw new Error('Caso ausente: '+chapter.caseKey);
    const snippet=start<0?JSON.stringify(chapter.artifact,null,2):code.slice(start,code.indexOf('\n}',start)+2);
    return {...chapter,kind:chapter.caseKey?'código-ejecutable':'artefacto-con-rúbrica',code:snippet,
      codeSource:chapter.caseKey?caseFile:null,codeSha256:createHash('sha256').update(snippet).digest('hex'),
      command:chapter.caseKey?`node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs ${chapter.caseKey}`:null};
  });
  const patternReview=reviews.map(([id,category,reason,reference])=>{
    const original=catalog.items.find(item=>item.id===id),example=practical.find(item=>item.id===id);
    if(!original||!example)throw new Error('Ficha sin fuente o implementación: '+id);
    return {id,name:original.nombre,originalType:original.tipo,category,reason,
      antecedent:reference?antecedents[reference]:null,exampleSources:example.languagesVerified,
      alternative:original.decision.alternativa,limit:original.decision.limite};
  });
  const data={schemaVersion:'1.0.0',status:'desarrollo-editorial-local-no-validacion-humana',
    introduction:'Cada área resuelve una parte de la misma reserva digital. Empieza por el taller inicial y conserva el proyecto conductor. Los ejemplos ejecutables comprueban comportamientos locales; las decisiones de diseño se entregan como artefactos con rúbrica, no como comandos que simulan entender.',
    executionNote,areas,patternReview,entryPatterns:entryPatterns.map(item=>({...item,url:item.reference?antecedents[item.reference]:null})),antecedents};
  fs.writeFileSync(path.join(import.meta.dirname,'areas.json'),JSON.stringify(data,null,2)+'\n');
  const md=areas.map(area=>`# ${area.title}\n\n${area.problem}\n\n## Antes de empezar\n\n${area.prerequisites}\n\n## Vocabulario\n\n${area.vocabulary.map(([term,meaning])=>`- ${term}: ${meaning}`).join('\n')}\n\n## Resolver el problema\n\n${area.reasoning.join('\n\n')}\n\n## Seguir el ejemplo\n\n${area.trace.map((text,index)=>`${index+1}. ${text}`).join('\n')}\n\n${area.command?`Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:\n\n\`\`\`sh\n${area.command}\n\`\`\`\n\nCódigo real de ${caseFile}; la función utiliza imports y datos de ese archivo, no es un programa autónomo:\n\n\`\`\`js\n${area.code}\n\`\`\`\n\nCampos esperados del resultado (puede incluir otros, como una huella):\n\n\`\`\`json\n${JSON.stringify(area.expected,null,2)}\n\`\`\``:`Artefacto trabajado, no programa que se deba ejecutar:\n\n\`\`\`json\n${area.code}\n\`\`\``}\n\n## Alternativa y costo\n\n${area.alternative}\n\n${area.cost}\n\n## Caso adverso y recuperación\n\n${area.adverse}\n\n${area.recovery}\n\n## Tu ejercicio\n\n${area.exercise}\n\n## Solución explicada\n\n${area.solution}\n\n## Revisar la entrega\n\n${area.rubric.map(text=>`- ${text}`).join('\n')}\n\n## Continuar\n\n${area.next}\n\nFuentes del proyecto:\n\n${area.sources.map(file=>`- [${path.basename(file)}](../../${file})`).join('\n')}\n`).join('\n');
  fs.mkdirSync(path.join(root,'manuales/areas'),{recursive:true});
  const sections=md.replaceAll('Campos esperados del resultado (puede incluir otros, como una huella):',executionNote+'\n\nCampos esperados del resultado (puede incluir otros, como una huella):').split(/^# /m).filter(Boolean);
  if(sections.length!==areas.length)throw new Error('Número de capítulos Markdown incorrecto');
  for(let i=0;i<areas.length;i++)fs.writeFileSync(path.join(root,`manuales/areas/${areas[i].key}.md`),'# '+sections[i]);
  return data;
}
const page=(id,content)=>`<section class="book-page ep3-page" id="${id}">${content}</section>`;
const prose=values=>values.map(text=>`<p>${e(text)}</p>`).join('');
const pre=code=>`<pre>${e(code)}</pre>`;
export function areaHtml(area){
  const base=`area-desarrollada-${area.key}`;
  return page(base,`<div class="eyebrow">Caso desarrollado · ${e(area.key)}</div><h1>${e(area.title)}</h1>${prose([area.problem])}<h2>Antes de empezar</h2>${prose([area.prerequisites])}<h2>Palabras que necesitarás</h2>${area.vocabulary.map(([term,meaning])=>`<p><strong>${e(term)}:</strong> ${e(meaning)}</p>`).join('')}<h2>Resolver el problema</h2>${prose(area.reasoning)}`)+
    page(base+'-ejemplo',`<div class="eyebrow">Ejemplo trabajado · ${e(area.key)}</div><h1>Seguir el resultado</h1><ol>${area.trace.map(text=>`<li>${e(text)}</li>`).join('')}</ol>${area.command?`<p>Raíz de COBRIA; Node.js 22.13 o superior, sin paquetes nuevos.</p>${pre(area.command)}<p>${e(executionNote)}</p><p>Función real de ${e(area.codeSource)}. Utiliza imports y datos compartidos del archivo completo; no es un programa autónomo.</p>${pre(area.code)}<h2>Campos esperados</h2>${pre(JSON.stringify(area.expected,null,2))}`:`<p>Artefacto trabajado, no programa para ejecutar.</p>${pre(area.code)}`}`)+
    page(base+'-ejercicio',`<div class="eyebrow">Decidir y practicar · ${e(area.key)}</div><h1>Elegir y comprobar</h1><h2>Alternativa y costo</h2>${prose([area.alternative,area.cost])}<h2>Fallo y recuperación</h2>${prose([area.adverse,area.recovery])}<h2>Tu ejercicio</h2>${prose([area.exercise])}<h2>Solución explicada</h2>${prose([area.solution])}<h2>Revisar la entrega</h2><ul>${area.rubric.map(text=>`<li>${e(text)}</li>`).join('')}</ul><p><strong>Continúa:</strong> ${e(area.next)}</p><p class="ep3-source">Fuentes: ${area.sources.map(e).join(' · ')}</p>`);
}
export function patternReviewHtml(data){
  return page('clasificar-patrones',`<h1>Qué llamamos patrón y qué no</h1><p>Revisión editorial de las treinta fichas y cuatro mecanismos de entrada. No es revisión independiente ni declaración de novedad. Las categorías distinguen antecedentes reconocidos, adaptaciones, contratos, mecanismos, convenciones, heurísticas y propuestas experimentales. Se conserva el tipo anterior para no cambiar su significado silenciosamente.</p>${data.entryPatterns.map(item=>`<h2>${e(item.name)} · ${e(item.category)}</h2><p>${e(item.reason)}</p>${item.url?`<p><a href="${item.url}">Antecedente primario</a></p>`:''}`).join('')}<p>No se promete desarrollar todo el catálogo general de patrones de objetos. Las fichas especializadas conservan implementación, alternativa y límite del ejemplo.</p>`)+
    Array.from({length:6},(_,index)=>page(`revision-patrones-${index+1}`,`<h1>Revisar las fichas ${index*5+1} a ${index*5+5}</h1>${data.patternReview.slice(index*5,index*5+5).map(item=>`<h2>${String(item.id).padStart(2,'0')} ${e(item.name)} · ${e(item.category)}</h2><p>${e(item.reason)}</p><p><strong>Alternativa:</strong> ${e(item.alternative)}</p>${item.antecedent?`<p><a href="${item.antecedent}">Antecedente primario</a></p>`:''}`).join('')}`)).join('');
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.join(import.meta.dirname,'build.mjs')){
  const data=buildEp3();console.log(`EP3: ${data.areas.length} áreas desarrolladas, ${data.patternReview.length} fichas revisadas.`);
}
