import { CanonicalEntity, sha256 } from "./cobria.mjs";

export function rng(seed){ let x=seed>>>0; return ()=>{ x=(1664525*x+1013904223)>>>0; return x/2**32; }; }
export function generate({seed=42001,N=10000,tenants=5,profile="R"}={}){
  const random=rng(seed), out=[]; const statuses=["active","inactive","archived"];
  for(let i=0;i<N;i++){
    const scope=`t-${String(i%tenants).padStart(2,"0")}`;
    const status=statuses[Math.floor(random()*statuses.length)];
    const category=profile==="A"?`event-${i%12}`:profile==="B"?`catalog-${i%40}`:`category-${i%8}`;
    out.push(new CanonicalEntity({id:`e-${String(i).padStart(8,"0")}`,scope,status,category,value:Math.floor(random()*10000),eventTime:1700000000000+i*1000}));
  }
  return {entities:out,manifest:{seed,N,tenants,profile,hash:sha256(out.map(e=>({...e})))}};
}
