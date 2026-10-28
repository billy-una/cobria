const form=document.querySelector('#registro'),estado=document.querySelector('#estado'),resultado=document.querySelector('#resultado');
const valor=id=>document.getElementById(id).value;
const botones=[...document.querySelectorAll('button')];
let operacion;
async function ejecutar(accion){
  botones.forEach(b=>{b.disabled=true;});form.setAttribute('aria-busy','true');estado.textContent='Procesando…';resultado.textContent='';
  try{
    const cuerpo={id:valor('id'),ambito:valor('ambito'),especie:valor('especie'),cantidad:Number(valor('cantidad')),revision:Number(valor('revision')),observadaEn:valor('fecha')};
    const firma=JSON.stringify(cuerpo);if(!operacion || operacion.firma!==firma)operacion={firma,clave:crypto.randomUUID()};
    const headers={authorization:`Bearer ${valor('sesion')}`};let url,options={headers,signal:AbortSignal.timeout(10000)};
    if(accion==='guardar'){url='/api/observaciones';options={...options,method:'POST',headers:{...headers,'content-type':'application/json','idempotency-key':operacion.clave},body:firma};}
    else {const endpoint={listar:'observaciones',resumen:'resumen',evidencia:'evidencia',respaldo:'respaldo'}[accion];const query=new URLSearchParams({ambito:valor('ambito')});if(accion==='evidencia')query.set('consulta',valor('consulta'));url=`/api/${endpoint}?${query}`;}
    const r=await fetch(url,options),data=await r.json();
    if(!r.ok){estado.textContent=data.detail ?? 'No se completó la operación.';estado.focus();return;}
    estado.textContent=accion==='guardar'?'Observación confirmada en disco.':accion==='evidencia' && data.estado==='abstencion'?'No hay evidencia suficiente.':'Operación completada.';
    resultado.textContent=JSON.stringify(data,null,2);
  }catch{estado.textContent='No se pudo conectar. Conserve la misma entrada y reintente.';estado.focus();}
  finally{botones.forEach(b=>{b.disabled=false;});form.removeAttribute('aria-busy');}
}
form.addEventListener('submit',e=>{e.preventDefault();void ejecutar('guardar');});
for(const accion of ['listar','resumen','evidencia','respaldo'])document.getElementById(accion).addEventListener('click',()=>{void ejecutar(accion);});
