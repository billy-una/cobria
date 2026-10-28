import data from '../../editorial/ep3/areas.json';
import {CopyCode} from './copy-code';

export function AreaWorkshop({kind}:{kind:string}){
  const area=data.areas.find(item=>item.key===kind);
  if(!area)return null;
  return <section className="area-workshop" id="caso-desarrollado" aria-label="Caso desarrollado del área">
    <p className="eyebrow">Un problema trabajado de principio a fin</p><h2>{area.title}</h2><p>{area.problem}</p>
    <h3>Antes de empezar</h3><p>{area.prerequisites}</p>
    <dl>{area.vocabulary.map(([term,meaning])=><div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>
    <h3>Resolver el problema</h3>{area.reasoning.map(text=><p key={text}>{text}</p>)}
    <h3>Seguir el ejemplo</h3><ol>{area.trace.map(text=><li key={text}>{text}</li>)}</ol>
    {area.command?<><p>Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:</p><CopyCode code={area.command}/><p>Función real de <code>{area.codeSource}</code>. Usa los imports y datos del archivo completo; el fragmento no es un programa autónomo.</p><CopyCode code={area.code}/><h3>Campos esperados del resultado</h3><CopyCode code={JSON.stringify(area.expected,null,2)}/></>:<><p>Artefacto de diseño trabajado, no programa para ejecutar:</p><CopyCode code={area.code}/></>}
    {area.command&&<p>{data.executionNote}</p>}
    <h3>Alternativa y costo</h3><p>{area.alternative}</p><p>{area.cost}</p>
    <div className="warning-box"><h3>Caso adverso y recuperación</h3><p>{area.adverse}</p><p>{area.recovery}</p></div>
    <h3>Tu ejercicio</h3><p>{area.exercise}</p>
    <details><summary>Consultar la solución del caso</summary><p>{area.solution}</p><ul>{area.rubric.map(text=><li key={text}>{text}</li>)}</ul></details>
    <p><strong>Continúa:</strong> {area.next}</p>
    <p className="source-note">Fuentes: {area.sources.join(' · ')}</p>
    {kind==='patrones'&&<section aria-label="Clasificación de patrones"><h3>No todo es un patrón nuevo</h3><p>Clasificación editorial local, no revisión independiente. Se conserva el tipo original y se distingue la garantía realmente demostrada.</p>
      {data.entryPatterns.map(item=><div key={item.name}><h4>{item.name} · {item.category}</h4><p>{item.reason}</p>{item.url&&<a href={item.url}>Antecedente primario</a>}</div>)}
      <details><summary>Revisión de las treinta fichas especializadas</summary>{data.patternReview.map(item=><section key={item.id}><h4>{item.id} · {item.name}: {item.category}</h4><p>{item.reason}</p><p>Tipo previo: {item.originalType}. Alternativa: {item.alternative}</p><p>Límite: {item.limit}</p>{item.antecedent&&<a href={item.antecedent}>Antecedente primario</a>}</section>)}</details>
    </section>}
  </section>;
}
