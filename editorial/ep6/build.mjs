import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p));
const json=p=>JSON.parse(read(p));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function reconcile(){
  const summary=json('replication/results/core-r7-statistics/summary.json');
  const protocol=json('replication/protocol/r7-confirmatory.json');
  const registry=json('editorial/ep6/claims.json');
  const evidence=[];
  let observations=0;
  for(const engine of protocol.engines){
    const file=`replication/results/core-r7-confirmatory/${engine}/raw.jsonl`,bytes=read(file);
    if(sha(bytes)!==summary.rawSha256[engine])throw Error(`Huella R7 divergente: ${engine}`);
    const rows=bytes.toString().trim().split('\n').map(JSON.parse);
    for(const size of protocol.sizes)if(rows.filter(r=>r.size===size).length!==protocol.runsPerSize)throw Error(`Celda incompleta: ${engine}/${size}`);
    if(!rows.every(row=>protocol.experiments.every(id=>row[id]?.pass===true)))throw Error('Control R7 no aprobado');
    observations+=rows.length;evidence.push({file,sha256:sha(bytes),observations:rows.length,classification:'historico-no-PC3'});
  }
  if(observations!==270||summary.comparisons.length!==9||summary.negativeResults.length!==1)throw Error('Revisar interpretación R7');
  if(summary.comparisons.filter(row=>row.p_holm<0.05&&row['diferencia_pareada_media_ms']<0).length!==8)throw Error('Cambió la interpretación de las ocho celdas');
  const alternatives=json('replication/results/core-1.3-alternatives/summary.json');
  if(alternatives.rawCount!==630)throw Error('Revisar microcomparación');
  const alternativeBytes=read('replication/results/core-1.3-alternatives/raw.json');
  if(JSON.parse(alternativeBytes).length!==alternatives.rawCount||sha(alternativeBytes)!==summary.alternatives.rawSha256)throw Error('Crudos de microcomparación divergentes');
  for(const claim of registry.claims)for(const file of claim.sources)read(file);
  const synthesis=String.raw`% Generado por editorial/ep6/build.mjs; no editar.
\newcommand{\COBRIAPerfilesCientificos}{Se consideran tres perfiles documentales anonimizados. Los perfiles A/N1 y B/N2 proceden del inventario original de dos implementaciones; N3 amplía la observación estructural con un corte posterior. La profundidad de observación es desigual y no constituye una muestra de equipos independientes.}
\newcommand{\COBRIAResumenCientifico}{Los sistemas NoSQL documentales pueden mantener representaciones derivadas cuya autoridad, ámbito y reparación resultan difíciles de comprobar. COBRIA propone un contrato reconstruible que reúne fuente canónica, transformación y políticas versionadas, ámbito, frescura, equivalencia y responsabilidad operacional. La contribución es composicional: no atribuye novedad a repositorios, vistas o procedencia por separado. Mediante ciencia del diseño se formaliza el contrato y se distinguen observación estructural, pruebas funcionales y medición histórica. R7 conserva \COBRIARSevenObservations{} corridas internas en tres motores y nueve celdas; ocho favorecen la lectura de la colección proyectada tras ajuste de Holm y OpenSearch con $n=100$ es no concluyente. Ese resultado pertenece al arnés histórico: no valida retrospectivamente los contratos PC2 ni demuestra superioridad arquitectónica. Una microcomparación de \COBRIARSevenAlternatives{} observaciones en un proceso tiene alcance algorítmico. PC2 aporta pruebas locales posteriores; PC3 carece de observaciones confirmatorias nuevas. La recuperación y los consumidores evaluados no acreditan calidad generativa de un modelo de IA. Permanecen pendientes réplica externa, estudio humano de transferencia y doble cribado bibliográfico.}
\newcommand{\COBRIALimiteHistoricoRSeven}{En R7, P1 filtra en el cliente la lista de documentos canónicos y la compara con una colección derivada; no prueba que una consulta canónica nativa óptima sea inferior. P2 comprueba dos escrituras y convergencia, no su atomicidad. R1 verifica reconstrucción y rechazo de una candidata, pero no demuestra un alias persistido mediante CAS ni publicación linealizable. S1 ensaya ámbito en el adaptador, no un proveedor de identidad. A1 reconstruye un producto sintético y observa ausencia de evidencia tras retirarlo, no la respuesta de un LLM. Los nombres P1--A1 identifican familias; compartir sus etiquetas con PC2 no hace equivalentes sus controles.}
\newcommand{\COBRIAConclusionCientifica}{La contribución defendible es un contrato explícito y refutable para gobernar autoridad, ámbito, derivación y reconstrucción en sistemas NoSQL documentales, acompañado de implementación y pruebas de alcance declarado. R7 describe diferencias de lectura en configuraciones internas, no el efecto causal aislado del contrato ni su superioridad universal. Los controles PC2 posteriores no revalidan R7; PC3 sigue sin observaciones confirmatorias nuevas. La evidencia disponible no demuestra productividad humana, seguridad exhaustiva, eficacia pedagógica ni calidad generativa. La propuesta permanece independiente y no certificada.}
\newcommand{\COBRIAAnalisisSeparado}{R7 conserva su análisis histórico: treinta corridas por celda, intervalos puntuales de mediana mediante 5000 remuestras, diferencias pareadas, permutación de signos con 20000 remuestras y ajuste de Holm para nueve celdas. Su interpretación depende de comparabilidad de las parejas y de los supuestos de independencia e intercambiabilidad; no es una inferencia poblacional sobre todos los motores. El diseño posterior PC2, destinado a PC3, fija cinco parejas de calentamiento y diez consultas por ruta dentro de cada corrida; su adenda establece como primaria la prueba exacta bilateral de signos, no la prueba histórica de R7. La permutación queda como sensibilidad bajo sus supuestos. Es una planificación congelada localmente, no prerregistro independiente ni resultado nuevo. Las consultas internas no son unidades inferenciales independientes y las tablas R7 no se recalculan con el protocolo posterior.}
`;
  const matrix={...registry,observationsR7:observations,evidence,sourceSha256:Object.fromEntries([...new Set(registry.claims.flatMap(c=>c.sources))].map(file=>[file,sha(read(file))]))};
  const evidenceTable=String.raw`% Generado por editorial/ep6/build.mjs; no editar.
\begin{table}[htbp]\centering\small
\caption{Estratos de evidencia y límites de interpretación.}
\begin{tabularx}{\textwidth}{p{2.1cm}X X}\toprule
Estrato & Aporte disponible & Inferencia no establecida\\\midrule
Norma & Contrato e invariantes de Core 1.0 & Eficacia o conformidad por el solo uso del nombre\\
Observación & Dos inventarios originales y un perfil complementario & Prevalencia, causalidad o muestra independiente\\
R7 histórico & 270 corridas; ocho celdas favorables y una no concluyente & Validación retrospectiva de PC2 o superioridad del contrato\\
Microensayo & 630 observaciones en un proceso & Rendimiento distribuido de arquitecturas completas\\
PC2 local & Pruebas de persistencia, publicación, autorización y consumidor & Nuevas cifras en tres motores o calidad de un LLM\\
PC3 pendiente & Diseño y análisis preparado sin observaciones nuevas & Resultado confirmatorio, celdas imputadas o mejora estimada\\
Evaluación externa & Protocolos y material de transferencia & Revisión independiente, aprendizaje o productividad demostrados\\
\bottomrule\end{tabularx}\end{table}
`;
  const traceText='# Afirmaciones científicas y sus límites\n\nRegistro editorial de afirmaciones principales, no revisión independiente ni inventario de cada frase. R7 es histórico; PC2 es prueba local; PC3 no aporta observaciones nuevas.\n\n'+registry.claims.map(claim=>`## ${claim.id} ${claim.kind}\n\n${claim.statement}\n\nFuentes: ${claim.sources.map(p=>'`'+p+'`').join(', ')}.\n\nLímite: ${claim.threat}\n`).join('\n');
  const files=new Map([['editorial/ep6/synthesis.tex',synthesis],['editorial/ep6/evidence-table.tex',evidenceTable],['editorial/ep6/traceability.json',JSON.stringify(matrix,null,2)+'\n'],['editorial/ep6/TRAZABILIDAD.md',traceText]]);
  for(const [file,content]of files){if(process.argv.includes('--check')){if(read(file).toString()!==content)throw Error(`Derivado divergente: ${file}`);}else fs.writeFileSync(path.join(root,file),content);}
  return matrix;
}
if(process.argv[1]===new URL(import.meta.url).pathname){const m=reconcile();console.log(`${m.claims.length} afirmaciones, ${m.observationsR7} corridas históricas verificadas; no se ejecutan motores.`);}
