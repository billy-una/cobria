import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {root,readBib,reference} from './bib.mjs';
const read=p=>fs.readFileSync(path.join(root,p));
const sha=b=>createHash('sha256').update(b).digest('hex');
export const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function checkIdentity(row,record){
  if(!record?.doi?.ok)return;
  const m=record.doi.metadata;
  const raw=m.title??[];
  const title=[...raw.map(t=>typeof t==='string'?t:t.title),...(m.subtitle??[])].join(' ');
  const tokens=s=>new Set(s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(x=>x.length>2));
  const a=tokens(row.title),b=tokens(title);const overlap=[...a].filter(x=>b.has(x)).length/Math.min(a.size,b.size);
  if(!Number.isFinite(overlap)||overlap<0.6)throw Error('DOI y título divergentes: '+row.id);
}
export function validateSelection(selection,entries){
  if(selection.systematicReviewComplete!==false||selection.independentScreeners!==0)throw Error('No atribuir cribado independiente sin evidencia humana nueva.');
  const ids=new Set();const dois=new Set();
  for(const r of entries){if(ids.has(r.id))throw Error('Clave duplicada: '+r.id);ids.add(r.id);if(!r.author||!r.title||(!r.url&&!r.doi))throw Error('Identidad incompleta: '+r.id);if(r.doi){const d=r.doi.toLowerCase();if(dois.has(d))throw Error('DOI duplicado: '+d);dois.add(d);}}
  for(const id of [...Object.values(selection.moduleSources).flat(),...selection.comparisons.flatMap(r=>r.sources)])if(!ids.has(id))throw Error('Referencia ausente: '+id);
  const modules=JSON.parse(read('editorial/curriculum.json')).modules;
  if(modules.some(m=>!selection.moduleSources[m.key]?.length))throw Error('Área sin fuentes temáticas');
  return ids;
}
export function buildEp7({check=false}={}){
  const selection=JSON.parse(read('editorial/ep7/selection.json'));const bib=readBib();const ids=validateSelection(selection,bib);
  const network=JSON.parse(read('editorial/ep7/link-check.json'));
  if(network.records.length!==bib.length||network.records.some(r=>!ids.has(r.id))||new Set(network.records.map(r=>r.id)).size!==bib.length)throw Error('Captura de enlaces no cubre el corpus');
  for(const row of bib){const record=network.records.find(r=>r.id===row.id);const expected=selection.sourceOverrides[row.id]?.url??row.url??'https://doi.org/'+row.doi;if(record.link.requestedUrl!==expected)throw Error('Enlace cambió sin consulta: '+row.id);checkIdentity(row,record);}
  const citations=[];
  for(const file of ['main.tex','articulo-cobria.tex',...fs.readdirSync(path.join(root,'partes')).filter(x=>x.endsWith('.tex')).map(x=>'partes/'+x)]){
    for(const m of read(file).toString().matchAll(/\\(?:paren|text|auto|foot)?cite\*?(?:\[[^\]]*\]){0,2}\{([^}]+)\}/g))for(const id of m[1].split(',').map(x=>x.trim())){if(!ids.has(id))throw Error(`${file}: cita inexistente ${id}`);citations.push({file,id});}
  }
  const references=bib.map(row=>{
    const over=selection.sourceOverrides[row.id]??{};const net=network.records.find(x=>x.id===row.id);
    const kind=over.kind??(row.type==='misc'?'prepublicacion':row.type==='online'?'documentacion-tecnica':row.type==='techreport'?'informe-tecnico':row.type==='book'?'libro':'publicacion-academica');
    return {...reference(row),kind,access:over.access??(row.type==='book'?'ficha-editorial; no lectura íntegra acreditada':'identidad editorial; alcance de lectura según extracción temática'),accessUrl:over.url??reference(row).url,checkedAt:net.checkedAt??network.checkedAt,linkStatus:net.link.status,metadataStatus:net.doi?.status??null,verificationLimit:over.note??'La resolución del enlace o del DOI no acredita por sí sola calidad, lectura completa ni apoyo a toda afirmación.'};
  }).sort((a,b)=>a.authors.localeCompare(b.authors,'es')||String(a.year).localeCompare(String(b.year)));
  const provenance=JSON.parse(read('editorial/provenance.json'));const assets=[];
  for(const a of [...provenance.visualAssets,...provenance.historicalArtifacts]){
    const b=read(a.path);if(b.length!==a.bytes||sha(b)!==a.sha256)throw Error('Procedencia divergente: '+a.path);
    if(a.source&&sha(read(a.source))!==a.sha256)throw Error('Copia divergente: '+a.path);
    assets.push({path:a.path,bytes:b.length,sha256:sha(b),source:a.source??null,method:a.method??'artefacto-historico',license:a.license??'segun-fuentes; no se relicencia el artefacto',generationReceipt:a.method?.startsWith('ai-assisted')?'no-acreditado-por-este-inventario':null});
  }
  const fonts=[];for(const manifest of ['editorial/fonts.json','editorial/fonts-static.json'])for(const f of JSON.parse(read(manifest)).files)for(const base of ['libro-cobria/fonts/','sitio/public/fonts/']){
    const p=base+f.file,b=read(p);if(b.length!==f.bytes||sha(b)!==f.sha256)throw Error('Fuente tipográfica divergente: '+p);fonts.push({path:p,sha256:f.sha256,bytes:f.bytes,source:f.source??f.origin,license:'OFL-1.1'});
  }
  const evidencePaths=['LICENSE','LICENSE-CODE.txt','LICENSE-CONTENT.md','LICENSES.md','PROVENANCE.md','editorial/provenance.json','editorial/fonts.json','editorial/fonts-static.json','replication/SBOM.cdx.json','replication/package-lock.json','libro-cobria/package-lock.json','sitio/package-lock.json','referencias.bib','editorial/ep7/selection.json','editorial/ep7/link-check.json'];
  const sourceSha256=Object.fromEntries(evidencePaths.map(p=>[p,sha(read(p))]));
  const report={schemaVersion:'1.0.0',date:selection.date,kind:selection.kind,systematicReviewComplete:false,independentScreeners:0,scope:selection.scope,coverageLimits:selection.coverageLimits,references,moduleSources:selection.moduleSources,comparisons:selection.comparisons,citations,sourceSha256};
  const provenanceReport={schemaVersion:'1.0.0',date:selection.date,sourceSha256,assets,fonts,classes:provenance.licenses,referenceRepositories:provenance.referenceRepositories,limits:['Inventario técnico y declaración de procedencia, no peritaje legal ni garantía de exclusividad.', 'No se deducen herramienta, modelo, fecha o prompt originales de una imagen a partir de su hash.', 'Referencias de terceros se enlazan y parafrasean; sus textos, figuras y licencias no pasan a CC-BY-4.0 por ser citados.', 'Datos sintéticos y pruebas internas no son participantes ni revisión humana.']};
  const method=String.raw`% Generado desde el registro EP7; no editar.
\newcommand{\COBRIAMetodoLiteratura}{Se realizó una revisión exploratoria dirigida del corpus existente y una ampliación temática con búsqueda web pública, consultas por dominio y seguimiento de títulos, DOI y fuentes primarias. El registro conserva doce registros de búsqueda, seis decisiones de exclusión o sustitución y las correcciones de identidad. No es una exportación exhaustiva de ACM, IEEE o Springer; no se estiman conteos totales del buscador. Se distinguen publicaciones académicas, prepublicaciones, documentación técnica y fichas de normas. El corpus compartido contiene ${bib.length} referencias; su comprobación de enlaces y metadatos no implica lectura íntegra de todas ellas. La extracción temática es asistida y no acredita doble cribado independiente.}
`;
  const comparison=String.raw`% Generado desde la extracción temática EP7.
\begin{table}[htbp]\centering\small
\caption{Comparación conceptual por mecanismos, no clasificación de superioridad.}
\label{tab:comparacion-literatura-ep7}
\begin{tabularx}{\textwidth}{p{2.2cm}X X}\toprule
Mecanismo & Aporte del antecedente & Decisión que debe comprobarse en COBRIA\\\midrule
Lectura y escritura & Modelos separados y copias precomputadas & Autoridad, ámbito y costo de mantener el derivado.\\
Historia e inmutabilidad & Cambios conservados y estado derivable & Reconstrucción desde el corte declarado; no exigir historia completa de eventos.\\
Procedencia & Fuentes, actividad, derivación y responsabilidad & Relacionar fuente, transformación, versión y reparación.\\
Evolución de esquema & Mapeo flexible y compensación entre costos & Separar modelo lógico, mapeo físico y proyección versionada.\\
Analítica & Características reutilizables y riesgos de fuga & Comprobar corte temporal y separación de entidades; no inferir calidad predictiva.\\
Capacidades del motor & Revisiones, actualización condicional y alias & Probar precondiciones por adaptador; atomicidad no implica equivalencia ni CAS.\\
\bottomrule\end{tabularx}
\end{table}
`;
  const auditText='# Revisión bibliográfica dirigida y procedencia EP7\n\nCorpus de '+bib.length+' referencias compartidas. Revisión exploratoria asistida; no revisión sistemática concluida.\n\n## Comparación de mecanismos\n\n'+selection.comparisons.map(c=>`### ${c.id}\n\n${c.mechanism} Costo: ${c.cost}\n\nRelación: ${c.relation}\n\nLímite: ${c.limit}\n\nFuentes: ${c.sources.join(', ')}.\n`).join('\n')+'\n## Correcciones de identidad\n\n'+selection.corrections.map(c=>`- ${c.id}: ${c.fields.join(', ')}. Fuente: ${c.source}${c.note?' · '+c.note:''}`).join('\n')+'\n\nLas consultas, exclusiones y limitaciones están en selection.json; los estados HTTP observados, incluidos errores, en link-check.json. No se redistribuye el texto íntegro de terceros.\n';
  const outputs=new Map([['editorial/ep7/references.json',JSON.stringify(report,null,2)+'\n'],['editorial/ep7/provenance-audit.json',JSON.stringify(provenanceReport,null,2)+'\n'],['editorial/ep7/method.tex',method],['editorial/ep7/comparison.tex',comparison],['editorial/ep7/REVISION.md',auditText]]);
  for(const [p,value]of outputs){if(check){if(read(p).toString()!==value)throw Error('Derivado divergente: '+p);}else fs.writeFileSync(path.join(root,p),value);}
  return report;
}
export function moduleCitationsHtml(data,key){return `<p class="module-sources"><strong>Lecturas externas:</strong> ${data.moduleSources[key].map(id=>{const r=data.references.find(x=>x.id===id);const label=r.authors.split(';')[0].split(',')[0]+(r.authors.includes(';')?' y colaboradores':'');return `<a href="#ref-${escapeHtml(id)}">${escapeHtml(label)} (${escapeHtml(r.year)})</a>`;}).join(' · ')}. Referencias y alcance al final del libro.</p>`;}
export function referenceHtml(r){
  const kinds={'prepublicacion':'Prepublicación','publicacion-academica':'Publicación académica','documentacion-tecnica':'Documentación técnica','norma-ficha':'Ficha de norma','informe-tecnico':'Informe técnico','libro':'Libro','recomendacion-tecnica':'Recomendación técnica'};
  const venue=r.venue||(r.kind==='prepublicacion'?'arXiv':'');
  const source=venue?` ${escapeHtml(venue)}${r.volume?' · '+escapeHtml(r.volume):''}${r.issue?'('+escapeHtml(r.issue)+')':''}${r.pages?', '+escapeHtml(r.pages):''}${r.edition?' · edición '+escapeHtml(r.edition):''}.`:'';
  return `<p class="apa-reference" id="ref-${escapeHtml(r.id)}"><strong>${escapeHtml(r.authors)}</strong> (${escapeHtml(r.year)}). <a href="${escapeHtml(r.url)}"><em>${escapeHtml(r.title)}</em></a>.${source}<br><small>${escapeHtml(kinds[r.kind]??r.kind)}. ${escapeHtml(r.note)}</small></p>`;
}
export function bibliographyHtml(data){return `<section class="book-page bibliographic-page" id="bibliografia"><div class="eyebrow">Fuentes y antecedentes</div><h1>Cómo se eligieron estas lecturas</h1><p>Una revisión exploratoria dirigida corrigió el corpus previo y amplió procedencia, reconstrucción y fuga de datos. Se conservaron consultas, exclusiones y discrepancias; no se ha completado una revisión sistemática ni doble cribado independiente.</p><p>Las ${data.references.length} referencias usan la misma fuente BibTeX que artículo y maestro. El listado ofrece autor, fecha, título y fuente; no se declara certificación de estilo APA. Verificar un DOI no equivale a leer el trabajo completo. Se conservan los títulos originales.</p><h2>Procedencia visual y tipográfica</h2><p>Las ilustraciones se declaran originales asistidas por IA bajo dirección conceptual del autor. Este inventario no acredita los recibos de generación, modelos ni prompts originales; no garantiza exclusividad. Inter y Roboto Mono conservan sus licencias OFL. Los diagramas se generan desde código propio. Las fuentes citadas y sus figuras no se relicencian como contenido COBRIA.</p><h2>Alcance de la edición</h2><p>Normas: fichas oficiales, no evaluación de cláusulas. Documentación de motores: comportamiento descrito, no ensayo de la versión instalada. Prepublicaciones: identificadas como tales. Libro y web: ejemplos propios, no transcripción de esas obras.</p></section>`+Array.from({length:Math.ceil(data.references.length/4)},(_,i)=>`<section class="book-page bibliographic-page"><div class="eyebrow">Bibliografía compartida · ${i+1}</div><h1>Referencias</h1>${data.references.slice(i*4,i*4+4).map(referenceHtml).join('')}</section>`).join('');}
if(process.argv[1]===new URL(import.meta.url).pathname){const r=buildEp7({check:process.argv.includes('--check')});console.log(`EP7: ${r.references.length} referencias, 17 áreas, ${r.comparisons.length} comparaciones; sin revisión humana atribuida.`);}
