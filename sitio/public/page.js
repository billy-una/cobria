const backTop=document.querySelector('#back-top');
window.addEventListener('scroll',()=>backTop?.classList.toggle('visible',scrollY>500),{passive:true});
backTop?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

const decisionForm=document.querySelector('#decision-form');
const decisionResult=document.querySelector('#decision-result');
function updateDecision(){
  if(!decisionForm||!decisionResult)return;
  const data=new FormData(decisionForm),reads=Number(data.get('reads')),freshness=Number(data.get('freshness')),impact=Number(data.get('impact')),scopes=Number(data.get('scopes')),audit=data.has('audit');
  decisionForm.querySelectorAll('input[type="range"]').forEach(input=>input.nextElementSibling.value=input.value);
  const projection=reads>=10&&freshness>0,governed=impact>=7||scopes>1||audit;
  const alternative=projection?'Proyección reconstruible':'Índice sobre la colección canónica';
  const level=governed?'C3 · Gobernado':'C2 · Reconstruible';
  const patterns=projection?'Proyección de lectura, Reconstrucción total y Publicación por versión':'Índice antes que proyección y Frontera lectura–escritura';
  decisionResult.innerHTML=`<p class="eyebrow">Recomendación pedagógica</p><h2>${alternative}</h2><p><strong>Nivel:</strong> ${level}. <strong>Patrones iniciales:</strong> ${patterns}.</p><p>Mida equivalencia, amplificación, p95, recuperación y cruces de ámbito antes de decidir.</p>`;
}
decisionForm?.addEventListener('input',updateDecision);updateDecision();
