/** Prueba primaria exacta del plan; no escribe resultados experimentales. */
export function signTest(differences){
  if(!Array.isArray(differences)||differences.length>30||differences.some(x=>typeof x!=='number'||!Number.isFinite(x)))throw new Error('PAIRED_DIFFERENCES_INVALID');
  const positive=differences.filter(x=>x>0).length,negative=differences.filter(x=>x<0).length;
  const n=positive+negative,k=Math.min(positive,negative);
  let combination=1,sum=1;
  for(let i=1;i<=k;i++){combination=combination*(n-i+1)/i;sum+=combination;}
  return {positive,negative,zeros:differences.length-n,n,p:n===0?1:Math.min(1,2*sum/2**n)};
}
