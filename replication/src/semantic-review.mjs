const ids=new Set(Array.from({length:8},(_,i)=>`ENG-${String(i+1).padStart(3,'0')}`));
const decisions=new Set(['supported','unsupported','insufficient']);

export function validateSemanticReview(record) {
  const errors=[];
  if (record?.schemaVersion!=='1.0.0') errors.push('schemaVersion inválida');
  if (!/^R-[A-Z0-9]{3,12}$/.test(record?.reviewerCode??'')) errors.push('reviewerCode inválido');
  if (!['M-01','M-02','M-03'].includes(record?.sample)) errors.push('muestra inválida');
  if ((record?.conflictStatement??'').length<20) errors.push('declaración de conflicto insuficiente');
  const rows=record?.decisions??[];
  if (rows.length!==8||new Set(rows.map(row=>row.id)).size!==8||rows.some(row=>!ids.has(row.id))) errors.push('se requieren ocho contratos únicos');
  for (const row of rows) {
    if (!decisions.has(row.decision)) errors.push(`${row.id}: decisión inválida`);
    if (!Number.isInteger(row.confidence)||row.confidence<1||row.confidence>5) errors.push(`${row.id}: confianza inválida`);
    if ((row.rationale??'').length<20) errors.push(`${row.id}: justificación insuficiente`);
  }
  if (!['accept-manifest','revise-manifest','reject-manifest'].includes(record?.recommendation)) errors.push('recomendación inválida');
  if (record?.attestation?.type!=='human'||record?.attestation?.independentWork!==true) errors.push('atestación humana independiente requerida');
  return {valid:errors.length===0,errors};
}

export function agreement(first,second) {
  for (const record of [first,second]) if (!validateSemanticReview(record).valid) throw new Error('Respuesta inválida');
  if (first.sample!==second.sample||first.reviewerCode===second.reviewerCode) throw new Error('Se requieren misma muestra y revisores distintos');
  const a=new Map(first.decisions.map(row=>[row.id,row.decision]));
  const b=new Map(second.decisions.map(row=>[row.id,row.decision]));
  const labels=[...decisions];
  const observed=[...ids].filter(id=>a.get(id)===b.get(id)).length/ids.size;
  const expected=labels.reduce((sum,label)=>sum+([...ids].filter(id=>a.get(id)===label).length/ids.size)*([...ids].filter(id=>b.get(id)===label).length/ids.size),0);
  const kappa=expected===1?1:(observed-expected)/(1-expected);
  return {sample:first.sample,decisions:ids.size,agreement:Number(observed.toFixed(3)),cohenKappa:Number(kappa.toFixed(3)),disagreements:[...ids].filter(id=>a.get(id)!==b.get(id))};
}

export function validateAdjudication(record) {
  const errors=[];
  if (record?.schemaVersion!=='1.0.0') errors.push('schemaVersion inválida');
  if (!/^A-[A-Z0-9]{3,12}$/.test(record?.adjudicatorCode??'')) errors.push('adjudicatorCode inválido');
  if (/AI|DRAFT/i.test(record?.adjudicatorCode??'')) errors.push('adjudicatorCode reservado para borradores sintéticos');
  if ((record?.conflictStatement??'').length<20) errors.push('declaración de conflicto insuficiente');
  const rows=record?.decisions??[];
  if (rows.length!==3||new Set(rows.map(row=>row.sample)).size!==3||rows.some(row=>!['M-01','M-02','M-03'].includes(row.sample)||row.contract!=='ENG-007')) errors.push('se requieren tres decisiones ENG-007 únicas');
  for (const row of rows) {
    if (!decisions.has(row.decision)) errors.push(`${row.sample}: decisión inválida`);
    if (!Number.isInteger(row.confidence)||row.confidence<1||row.confidence>5) errors.push(`${row.sample}: confianza inválida`);
    if ((row.rationale??'').length<40) errors.push(`${row.sample}: justificación insuficiente`);
    if (row.addressesBothReviews!==true) errors.push(`${row.sample}: debe abordar ambas revisiones`);
  }
  if (record?.attestation?.type!=='human'||record?.attestation?.independentWork!==true||record?.attestation?.reviewedOriginalEvidence!==true) errors.push('atestación humana independiente requerida');
  if (/generad[ao] por (un sistema de )?IA|no soy una tercera persona humana|borrador[^.]*IA/i.test(record?.conflictStatement??'')) errors.push('la declaración contradice la atestación humana');
  return {valid:errors.length===0,errors};
}
