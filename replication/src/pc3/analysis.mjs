import { signTest } from '../pc2/sign-test.mjs';

const mean = xs => xs.reduce((a,b)=>a+b,0)/xs.length;
const quantile = (xs,p) => {const a=[...xs].sort((x,y)=>x-y),i=(a.length-1)*p,j=Math.floor(i);return a[j]+(a[Math.ceil(i)]-a[j])*(i-j);};
const rng = seed => () => ((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
export function describe(xs) {
  if(!xs.length || xs.some(x=>!Number.isFinite(x)))throw Error('SAMPLE_INVALID');
  const median=quantile(xs,.5);
  return {n:xs.length,p50:median,p95:quantile(xs,.95),p99:quantile(xs,.99),
    mad:quantile(xs.map(x=>Math.abs(x-median)),.5),iqr:quantile(xs,.75)-quantile(xs,.25)};
}
export function holm(values) {
  if(values.length!==9 || values.some(x=>!Number.isFinite(x)||x<0||x>1))throw Error('NINE_COMPLETE_CELLS_REQUIRED');
  const ranked=values.map((p,i)=>({p,i})).sort((a,b)=>a.p-b.p),out=[];let previous=0;
  for(let k=0;k<ranked.length;k++){previous=Math.max(previous,Math.min(1,ranked[k].p*(9-k)));out[ranked[k].i]=previous;}
  return out;
}
// Solo acepta una celda completa. Los diez tiempos internos NO son diez réplicas.
export function analyzeCell(trials,{seed=20261018,bootstrapSamples=10000,permutationSamples=20000}={}) {
  if(trials.length!==30 || new Set(trials.map(x=>x.run)).size!==30)throw Error('THIRTY_UNIQUE_TRIALS_REQUIRED');
  const pairs=trials.map(t=>{
    for(const route of ['canonicalMs','projectionMs'])if(t[route]?.length!==10 || t[route].some(x=>!Number.isFinite(x)||x<=0))throw Error('LATENCIES_INVALID');
    return [mean(t.canonicalMs),mean(t.projectionMs)];
  });
  const differences=pairs.map(([c,p])=>p-c),ratios=pairs.map(([c,p])=>p/c),average=mean(differences);
  const sd=Math.sqrt(differences.reduce((s,d)=>s+(d-average)**2,0)/29);
  const random=rng(seed),bootDifference=[],bootRatio=[];
  for(let b=0;b<bootstrapSamples;b++){
    const selected=Array.from({length:30},()=>Math.floor(random()*30));
    bootDifference.push(mean(selected.map(i=>differences[i])));bootRatio.push(quantile(selected.map(i=>ratios[i]),.5));
  }
  let extreme=0;
  for(let b=0;b<permutationSamples;b++)if(Math.abs(mean(differences.map(d=>random()<.5?-d:d)))>=Math.abs(average))extreme++;
  return {unit:'corrida pareada',latencyUnit:'ms/consulta cliente',trials:30,
    primary:signTest(differences),meanDifferenceMs:average,medianPairedRatio:quantile(ratios,.5),
    differenceCI95:[quantile(bootDifference,.025),quantile(bootDifference,.975)],
    ratioCI95:[quantile(bootRatio,.025),quantile(bootRatio,.975)],
    dz:sd===0?null:average/sd,dzReason:sd===0?'Varianza nula de diferencias':null,
    secondarySignFlipP:(extreme+1)/(permutationSamples+1),
    canonical:describe(trials.flatMap(t=>t.canonicalMs)),projection:describe(trials.flatMap(t=>t.projectionMs)),
    tailLimit:'300 consultas correlacionadas por ruta; percentiles descriptivos, no 300 réplicas independientes ni garantía poblacional',
    bootstrapSamples,permutationSamples};
}
