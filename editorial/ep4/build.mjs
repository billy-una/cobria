import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../..');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function buildEp4(){
  const source='replication/examples/integral-c8/recorrido-ep4.mjs';
  const code=fs.readFileSync(path.join(root,source),'utf8');
  const guide=fs.readFileSync(path.join(import.meta.dirname,'ENTREGA.md'),'utf8');
  const sections=guide.split('\n## ').slice(1).filter(s=>!s.startsWith('Estado de cierre')).map(part=>{
    const [title,...lines]=part.split('\n');
    const blocks=lines.join('\n').trim().split(/(```[\s\S]*?```)/).filter(Boolean).flatMap(block=>block.startsWith('```')?[{kind:'code',text:block.replace(/^```[^\n]*\n/,'').replace(/```$/,'').trim()}]:block.trim().split(/\n\s*\n/).filter(Boolean).map(text=>({kind:text.startsWith('|')?'table':'text',text})));
    return {title,blocks};
  });
  const start=code.indexOf('    const documentos = await servidor.repo.listar(ambito);');
  const end=code.indexOf('    await servidor.cerrar();',start);
  if(start<0||end<0)throw Error('El extracto analítico cambió: revisar el capítulo');
  sections.splice(3,0,{title:'Leer el código sin perder la procedencia',blocks:[
    {kind:'text',text:'Extracto real del programa, no ejecutable por separado. servidor es la aplicación local abierta; ambito es reserva-sur; resumen proviene de la lectura autorizada anterior. Los imports y auxiliares están en el programa completo mostrado en la web.'},
    {kind:'code',text:code.slice(start,end).trim()},
    {kind:'text',text:'listar obtiene observaciones del mismo ámbito. reduce suma cantidades; map conserva la identidad y revisión de cada fuente. La huella enlaza el total con la proyección leída. autoridadEscritura y entrenamientoHabilitado son falsos: un total no recibe permiso para alterar hechos o entrenar un modelo.'},
    {kind:'text',text:'Este bloque pertenece al recorrido local secuencial. No es una API analítica de producción ni garantiza una instantánea frente a otro escritor concurrente. Para exponerlo se necesita un caso de uso autorizado y una política explícita de coherencia de lectura.'}
  ]});
  const data={title:'De una observación a una aplicación recuperable',source,sourceSha256:createHash('sha256').update(code).digest('hex'),sections,code};
  fs.writeFileSync(path.join(import.meta.dirname,'recorrido.json'),JSON.stringify(data,null,2)+'\n');
  return data;
}
export function ep4Html(data){return data.sections.map((s,i)=>`<section class="book-page ep3-page" id="proyecto-integral-${i+1}"><p class="eyebrow">Proyecto conductor · ${i+1} de ${data.sections.length}</p><h1>${esc(s.title)}</h1>${s.blocks.map(b=>b.kind==='code'?`<pre><code>${esc(b.text)}</code></pre>`:b.kind==='table'?`<table>${b.text.split('\n').filter(line=>!/^\|[\s:|-]+\|$/.test(line)).map((line,n)=>`<tr>${line.split('|').slice(1,-1).map(cell=>`<${n?'td':'th'}>${esc(cell.trim().replaceAll('`',''))}</${n?'td':'th'}>`).join('')}</tr>`).join('')}</table>`:`<p>${esc(b.text.replaceAll('`','').replaceAll('\n',' '))}</p>`).join('')}<p class="ep3-source">Fuente: editorial/ep4/ENTREGA.md. Código ejecutable: ${esc(data.source)}.</p></section>`).join('');}
if(process.argv[1]===new URL(import.meta.url).pathname)buildEp4();
