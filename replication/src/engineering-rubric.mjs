const contractIds=new Set(Array.from({length:8},(_,i)=>`ENG-${String(i+1).padStart(3,'0')}`));
export function validateEngineeringRubric(rubric) {
  const errors=[]; const contracts=rubric?.contracts??[];
  if (rubric?.schemaVersion!=='1.0.0') errors.push('schemaVersion debe ser 1.0.0');
  if (rubric?.status!=='proposal'||rubric?.officialCertification!==false) errors.push('la rúbrica debe declararse propuesta no oficial');
  if (contracts.length!==8||new Set(contracts.map(item=>item.id)).size!==8||contracts.some(item=>!contractIds.has(item.id))) errors.push('se requieren ENG-001..ENG-008 únicos');
  for (const contract of contracts) {
    if (!contract.name) errors.push(`${contract.id}: nombre requerido`);
    if (!Array.isArray(contract.dimensions)||contract.dimensions.length!==3||new Set(contract.dimensions.map(item=>item.id)).size!==3) errors.push(`${contract.id}: se requieren tres dimensiones únicas`);
    for (const dimension of contract.dimensions??[]) {
      if (!dimension.id||!dimension.criterion||dimension.criterion.length<30) errors.push(`${contract.id}: criterio insuficiente`);
      if (!dimension.insufficient||dimension.insufficient.length<20) errors.push(`${contract.id}: contraejemplo insuficiente`);
    }
  }
  if (!/no certifica/i.test(rubric?.interpretation??'')) errors.push('falta límite contra certificación');
  return {valid:errors.length===0,errors,summary:{contracts:contracts.length,dimensions:contracts.reduce((sum,item)=>sum+(item.dimensions?.length??0),0)}};
}

export function blankAssessment(rubric,subject='muestra') {
  const validation=validateEngineeringRubric(rubric); if (!validation.valid) throw new Error(validation.errors.join('; '));
  return {schemaVersion:'1.0.0',subject,status:'unassessed',officialCertification:false,contracts:rubric.contracts.map(contract=>({id:contract.id,dimensions:contract.dimensions.map(dimension=>({id:dimension.id,decision:null,evidence:[],rationale:''}))})),interpretation:'Plantilla sin evaluar; null no significa incumplimiento.'};
}
