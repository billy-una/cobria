import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p));
const sha=p=>createHash('sha256').update(read(p)).digest('hex');
export function validateDecision(d,basis){
  if(basis.deliveryTarget!=='candidata-educativa-y-preprint'||d.deliveryTarget!==basis.deliveryTarget)throw Error('Decisión fuera del alcance EP0');
  if(d.disposition!=='excluida-justificadamente-para-preprint-acotado')throw Error('La ejecución nueva exige otro registro, no esta exclusión');
  if(d.newConfirmatoryObservations!==0||d.pc3Closed||d.stableGatesClosed||d.externalReplicationDone)throw Error('Exclusión no equivale a experimento ni a puerta estable cerrada');
  if(!d.reason||d.families.join(',')!=='P1,P2,R1,S1,A1'||d.reentry.length<8)throw Error('Decisión sin alcance o condiciones de reentrada');
}
export function buildEp8({check=false}={}){
  const d=JSON.parse(read('editorial/ep8/decision.json'));const basis=JSON.parse(read(d.basis));validateDecision(d,basis);
  const freezes=['replication/protocol/pc2-freeze-v1.json','replication/protocol/pc2-analysis-freeze-01.json'];
  const protectedSources={};
  for(const p of freezes){protectedSources[p]=sha(p);for(const [file,expected]of Object.entries(JSON.parse(read(p)).files)){if(sha(file)!==expected)throw Error('Congelamiento alterado: '+file);protectedSources[file]=expected;}}
  const inventory=JSON.parse(read('editorial/ep6/traceability.json'));
  for(const file of Object.keys(inventory.sourceSha256).filter(x=>x.startsWith('replication/results/')||x==='replication/protocol/r7-confirmatory.json')){if(sha(file)!==inventory.sourceSha256[file])throw Error('Histórico R7 divergente: '+file);protectedSources[file]=sha(file);}
  const preflight=JSON.parse(read(d.preflight));
  if(preflight.kind!=='preflight-no-es-corrida'||preflight.confirmatoryObservations!==0)throw Error('Diagnóstico no es evidencia elegible');
  const report={...d,status:'decision-de-alcance-completada; investigacion-nueva-no-ejecutada',sourceSha256:{[d.basis]:sha(d.basis),'editorial/ep8/decision.json':sha('editorial/ep8/decision.json'),[d.preflight]:sha(d.preflight)},protectedSources,preflight:{generatedAt:preflight.generatedAt,ready:preflight.ready,checks:preflight.checks},limits:['No iniciar, instalar ni modificar motores; diagnóstico de lectura únicamente.', 'La exclusión es válida para esta entrega acotada, no para una versión estable ni para futuras afirmaciones ampliadas.', 'No se añaden filas, estadísticas o gráficos PC3; las pruebas sintéticas no son corridas de motores.']};
  const tex=String.raw`% Generado desde la decisión de alcance EP8.
\newcommand{\COBRIAAlcanceEPocho}{Para esta entrega se excluye justificadamente la investigación nueva de EP8: el preprint conserva el alcance acotado elegido, sin afirmar validación confirmatoria de los contratos posteriores. PC3 y la réplica externa continúan pendientes. La exclusión no declara ejecutadas corridas P1--A1 ni satisface las puertas de una versión estable.}
`;
  for(const [p,value]of [['editorial/ep8/estado.json',JSON.stringify(report,null,2)+'\n'],['editorial/ep8/scope.tex',tex]]){if(check){if(read(p).toString()!==value)throw Error('Derivado divergente: '+p);}else fs.writeFileSync(path.join(root,p),value);}
  return report;
}
if(process.argv[1]===new URL(import.meta.url).pathname){const r=buildEp8({check:process.argv.includes('--check')});console.log(`EP8: ${r.disposition}; PC3 pendiente; 0 observaciones nuevas.`);}
