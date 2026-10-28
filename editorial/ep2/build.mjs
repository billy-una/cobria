import fs from 'node:fs';
import path from 'node:path';
import {workshop} from './recorrido.mjs';
const root=path.resolve(import.meta.dirname,'../..');
export const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function buildEp2(){
  const folder=path.join(root,workshop.directory,'taller-inicial');
  const data={...workshop,units:workshop.units.map(unit=>({...unit,
    code:fs.readFileSync(path.join(folder,unit.file),'utf8').trim(),
    support:unit.id==='07'?[{file:'observacion.json',code:fs.readFileSync(path.join(folder,'observacion.json'),'utf8').trim()}]:
      unit.id==='08'?[{file:'reglas.mjs',code:fs.readFileSync(path.join(folder,'reglas.mjs'),'utf8').trim()}]:[],
    command:unit.id==='10'?`node --test --test-reporter=tap taller-inicial/${unit.file}`:`node taller-inicial/${unit.file}`
  }))};
  fs.writeFileSync(path.join(import.meta.dirname,'recorrido.json'),JSON.stringify(data,null,2)+'\n');
  const markdown=`# ${data.title}\n\n${data.introduction}\n\n## Preparar tu copia de trabajo\n\n${data.preparation.join('\n\n')}\n\n${data.units.map(unit=>`## ${unit.id} ${unit.title}\n\n${unit.paragraphs.join('\n\n')}\n\n### Ejemplo resuelto\n\nAbre \`taller-inicial/${unit.file}\` en tu copia. Lee cada línea antes de ejecutar.\n\n\`\`\`js\n${unit.code}\n\`\`\`\n\n${unit.support.map(item=>`Archivo de apoyo: \`taller-inicial/${item.file}\`.\n\n\`\`\`${item.file.endsWith('.json')?'json':'js'}\n${item.code}\n\`\`\`\n`).join('\n')}Desde la carpeta de la aplicación:\n\n\`\`\`sh\n${unit.command}\n\`\`\`\n\nResultado esperado${unit.id==='10'?' (el informe también incluye nombres y duración)':''}:\n\n\`\`\`text\n${unit.expected}\n\`\`\`\n\n### Tu cambio\n\n${unit.exercise}\n\nResultado del cambio:\n\n\`\`\`text\n${unit.changed}\n\`\`\`\n\n### Provocar y reparar un fallo\n\nAntes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.\n\n${unit.failure.description}\n\n**Recuperación:** ${unit.failure.recovery}\n\n### Solución razonada\n\n${unit.solution}\n`).join('\n')}\n## Tu tarea final\n\n${data.finish.join('\n\n')}\n\n## Continuar\n\n[Tu primer proyecto con COBRIA](26-primer-proyecto-paso-a-paso.md) · [Datos desde cero](27-datos-desde-cero.md).\n\nFuente editorial: editorial/ep2/recorrido.mjs. Código: replication/examples/ecosistema-app/taller-inicial/. Este capítulo se genera; no se edita la copia derivada.\n`;
  fs.mkdirSync(path.join(root,'manuales'),{recursive:true});
  const withFailureOutput=data.units.reduce((text,unit)=>text.replace(unit.failure.description,
    `${unit.failure.description}\n\nTexto que debes encontrar en la salida:\n\n\`\`\`text\n${unit.failure.marker}\n\`\`\``),markdown);
  fs.writeFileSync(path.join(root,'manuales/35-programar-desde-cero.md'),withFailureOutput);
  return data;
}
export function chapterHtml(data){
  const e=escapeHtml;
  const page=(body,id='')=>`<section class="book-page ep2-page" ${id?`id="${id}"`:''}>${body}</section>`;
  const prose=items=>items.map(item=>`<p>${e(item)}</p>`).join('');
  const pre=code=>`<pre>${e(code)}</pre>`;
  return page(`<div class="eyebrow">Primeros pasos · taller ejecutable</div><h1>${e(data.title)}</h1>${prose([data.introduction])}<h2>Preparar tu copia de trabajo</h2>${prose(data.preparation.slice(0,3))}`,'desde-cero')+
    page(`<h1>Ejecutar sin perder el original</h1>${prose(data.preparation.slice(3))}<h2>El camino</h2><ol>${data.units.map(unit=>`<li>${e(unit.title)}</li>`).join('')}</ol><p>En cada unidad: lee, predice, ejecuta, cambia, provoca un fallo y recupera. Las soluciones están después del ejercicio para poder intentarlo primero.</p>`)+
    data.units.map(unit=>page(`<div class="eyebrow">Unidad ${unit.id} · comprender</div><h1>${e(unit.title)}</h1>${prose(unit.paragraphs)}<p><strong>Archivo:</strong> taller-inicial/${e(unit.file)}</p>${pre(unit.code)}${unit.support.map(item=>`<h2>${e(item.file)}</h2>${pre(item.code)}`).join('')}`,
      `desde-cero-${unit.id}`)+page(`<div class="eyebrow">Unidad ${unit.id} · practicar y recuperar</div><h1>Cambiar y comprobar</h1><p>Desde la copia de ecosistema-app, ejecuta:</p>${pre(unit.command)}<h2>Resultado esperado</h2>${pre(unit.expected)}<h2>Tu cambio</h2>${prose([unit.exercise])}${pre(unit.changed)}<h2>Provocar un fallo</h2><p>Restaura primero el ejemplo original para no mezclar cambios.</p>${prose([unit.failure.description])}<p>Texto que debes encontrar en la salida:</p>${pre(unit.failure.marker)}<h2>Recuperación</h2>${prose([unit.failure.recovery])}<h2>Solución razonada</h2>${prose([unit.solution])}`)).join('')+
    page(`<h1>Tu primera entrega independiente</h1>${prose(data.finish)}<p>Continúa con Tu primer proyecto con COBRIA y Datos desde cero. Conserva la misma aplicación: no necesitas crear un proyecto distinto en cada capítulo.</p>`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.join(import.meta.dirname,'build.mjs')){
  const data=buildEp2();console.log(`EP2: ${data.units.length} unidades generadas desde código real.`);
}
