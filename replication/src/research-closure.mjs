import crypto from 'node:crypto';

export function blankExternalReplication(plan) {
  if (plan?.tasks?.length !== 5) throw new Error('la réplica externa requiere cinco tareas');
  return {schemaVersion:'1.0.0',phase:32,status:'prepared-not-externally-repeated',proposalIndependent:true,officialCertification:false,
    replicator:{type:null,independentWork:null,conflictOfInterest:null,environment:null},
    tasks:plan.tasks.map(task=>({id:task.id,result:null,durationSeconds:null,evidence:[],notes:''})),
    summary:{executed:0,passed:0,failed:0},attestation:null,
    interpretation:'Paquete de una propuesta independiente; una plantilla no demuestra repetición externa.'};
}

export function validateExternalReplication(run) {
  const errors=[];
  if(run?.replicator?.type!=='human'||run?.replicator?.independentWork!==true||run?.replicator?.conflictOfInterest!==false) errors.push('replicador externo inválido');
  if(!run?.attestation||run.attestation.length<20) errors.push('atestación insuficiente');
  if((run?.tasks??[]).length!==5) errors.push('tareas incompletas');
  for(const task of run?.tasks??[]){if(!['pass','fail'].includes(task.result)) errors.push(`${task.id}: resultado inválido`);if(!Number.isFinite(task.durationSeconds)||task.durationSeconds<0) errors.push(`${task.id}: duración inválida`);if(!(task.evidence??[]).length) errors.push(`${task.id}: evidencia ausente`);}
  return {valid:errors.length===0,errors};
}

export function synthesizeScientificState(statuses) {
  const humanResponses=statuses.phase29?.responseFilesReceived??0;
  const operational=statuses.phase31?.executed??0;
  const external=statuses.phase32?.externalRunsReceived??0;
  return {schemaVersion:'1.0.0',phase:33,status:'synthesis-with-pending-external-evidence',proposalIndependent:true,officialCertification:false,
    evidenceLevels:{localAutomated:'available',humanIndependent:humanResponses===2?'available':'pending',operational:operational===5?'available':'pending',externalReplication:external>0?'available':'pending'},
    publishableClaims:['COBRIA define contratos y herramientas verificables localmente.','La propuesta conserva límites entre evidencia estructural, humana y operacional.'],
    prohibitedClaims:['COBRIA está certificada.','COBRIA fue validada universalmente.','COBRIA supera alternativas en producción.'],
    effectSizes:null,confidenceIntervals:null,interpretation:'Síntesis provisional de una propuesta independiente; no rellena evidencia externa ausente.'};
}

export function validateEditorialSnapshot(snapshot) {
  const errors=[];
  if(snapshot?.phase!==34||snapshot?.proposalIndependent!==true||snapshot?.officialCertification!==false) errors.push('identidad editorial inválida');
  if(snapshot?.products?.length!==4) errors.push('se requieren cuatro productos editoriales');
  if(snapshot?.claims?.some(claim=>claim.status==='validated-external')) errors.push('afirmación externa no sustentada');
  if(snapshot?.humanResponses!==0||snapshot?.operationalRuns!==0||snapshot?.externalReplications!==0) errors.push('conteos externos inventados');
  return {valid:errors.length===0,errors};
}

export function hashEntries(entries){return entries.map(entry=>({...entry,sha256:crypto.createHash('sha256').update(entry.content).digest('hex'),bytes:Buffer.byteLength(entry.content)}));}

export function assessPublicationReadiness(input){
  const blockers=input.blockers.filter(item=>item.status!=='complete');
  return {schemaVersion:'1.0.0',phase:36,status:blockers.length?'prepared-not-published':'ready-for-authorized-publication',proposalIndependent:true,officialCertification:false,published:false,doi:null,releaseSignature:null,blockers,
    interpretation:'Paquete local de una propuesta independiente. Publicar, firmar o solicitar DOI requiere una acción humana o servicio externo autorizado.'};
}
