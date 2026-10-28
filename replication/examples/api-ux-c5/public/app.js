const form = document.querySelector('#registro');
const estado = document.querySelector('#estado');
const resultado = document.querySelector('#resultado');
const campo = id => document.getElementById(id).value;
const botones = [...document.querySelectorAll('button')];
let operacion; // Conserva clave al reintentar la misma entrada; cambia al editarla.
async function ejecutar(escritura) {
  botones.forEach(b => { b.disabled = true; });
  form.setAttribute('aria-busy','true');
  estado.textContent = escritura ? 'Guardando observación…' : 'Consultando observaciones…';
  resultado.textContent = '';
  const headers = {authorization:`Bearer ${campo('sesion')}`};
  try {
    const cuerpo = {id:campo('id'),ambito:campo('ambito'),especie:campo('especie'),cantidad:Number(campo('cantidad')),revision:1,observadaEn:campo('fecha')};
    const firma = JSON.stringify(cuerpo);
    if (!operacion || operacion.firma !== firma) operacion = {firma,clave:crypto.randomUUID()};
    const response = await fetch(escritura ? '/api/observaciones' : `/api/observaciones?${new URLSearchParams({ambito:campo('ambito'),limite:'20'})}`, {method:escritura?'POST':'GET',headers:escritura?{...headers,'content-type':'application/json','idempotency-key':operacion.clave}:headers,body:escritura?firma:undefined,signal:AbortSignal.timeout(6000)});
    const data = await response.json();
    if (!response.ok) { estado.textContent = data.detail ?? 'No se pudo completar la operación.'; estado.focus(); return; }
    estado.textContent = escritura ? 'Observación guardada.' : data.datos.length ? 'Consulta completada.' : 'No hay observaciones en este ámbito.';
    resultado.textContent = JSON.stringify(data,null,2); // Nunca interpreta datos como HTML.
  } catch { estado.textContent = 'No se pudo conectar. Revise que el taller siga abierto y reintente.'; estado.focus(); }
  finally { botones.forEach(b => { b.disabled = false; }); form.removeAttribute('aria-busy'); }
}
form.addEventListener('submit', event => { event.preventDefault(); void ejecutar(true); });
document.querySelector('#listar').addEventListener('click', () => { void ejecutar(false); });
