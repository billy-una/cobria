import type {Metadata} from 'next';
import Link from 'next/link';
import {SiteFrame} from '../../site-frame';
import {CopyCode} from '../../copy-code';
import workshop from '../../../../editorial/ep2/recorrido.json';

export const metadata:Metadata={title:'Programar desde cero · COBRIA',description:workshop.introduction,alternates:{canonical:'/comenzar/desde-cero'}};
export default function FirstSteps(){
  return <SiteFrame><div className="page-shell lesson-page ep2-workshop"><article>
    <header><p className="eyebrow">Taller para principiantes · diez unidades</p><h1>{workshop.title}</h1><p className="lead">{workshop.introduction}</p></header>
    <section><h2>Preparar tu copia de trabajo</h2>{workshop.preparation.map(text=><p key={text}>{text}</p>)}<CopyCode code={'node --version\nnpm --version'}/></section>
    <nav aria-label="Unidades del taller"><h2>El camino</h2><ol>{workshop.units.map(unit=><li key={unit.id}><a href={`#unidad-${unit.id}`}>{unit.title}</a></li>)}</ol></nav>
    {workshop.units.map(unit=><section className="manual-lesson" id={`unidad-${unit.id}`} key={unit.id}>
      <p className="eyebrow">Unidad {unit.id}</p><h2>{unit.title}</h2>{unit.paragraphs.map(text=><p key={text}>{text}</p>)}
      <h3>Ejemplo resuelto</h3><p>Abre <code>taller-inicial/{unit.file}</code> en tu copia. Lee cada línea antes de ejecutar.</p><CopyCode code={unit.code}/>
      {unit.support.map(item=><div key={item.file}><h3>Archivo de apoyo: {item.file}</h3><CopyCode code={item.code}/></div>)}
      <p>Desde la carpeta de la aplicación:</p><CopyCode code={unit.command}/><h3>Resultado esperado</h3><CopyCode code={unit.expected}/>
      <h3>Tu cambio</h3><p>{unit.exercise}</p><p>Resultado del cambio:</p><CopyCode code={unit.changed}/>
      <div className="warning-box"><h3>Provocar y reparar un fallo</h3><p>Restaura primero el ejemplo original para no mezclar cambios.</p><p>{unit.failure.description}</p><p>Texto que debes encontrar en la salida:</p><CopyCode code={unit.failure.marker}/><p><strong>Recuperación:</strong> {unit.failure.recovery}</p></div>
      <details><summary>Ver la solución razonada</summary><p>{unit.solution}</p></details>
    </section>)}
    <section><h2>Tu tarea final</h2>{workshop.finish.map(text=><p key={text}>{text}</p>)}</section>
    <nav aria-label="Continuar el aprendizaje"><p><Link href="/comenzar">Continuar con tu primer proyecto</Link></p><p><Link href="/datos">Aprender datos desde cero</Link></p></nav>
  </article></div></SiteFrame>;
}
