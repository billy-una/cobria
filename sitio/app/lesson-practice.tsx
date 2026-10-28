type Practice = {
  kind:string; prerequisites:string[]; vocabulary:{term:string;meaning:string}[];
  files:{path:string;responsibility:string}[]; exercise:string; recovery:string;
  solution:string; rubric:string[]; assessment:string;
};
export function LessonPractice({practice}:{practice:Practice}){
  return <section className="lesson-practice">
    <h2>Ahora inténtelo</h2>
    <p>{practice.kind==='artefacto-con-rubrica'?'Ejercicio de diseño: entregue una nota o un esquema. No hay un comando que certifique esta decisión.':'Después de ejecutar, explique la decisión con sus propias palabras.'}</p>
    <h3>Antes de empezar</h3><ul>{practice.prerequisites.map(x=><li key={x}>{x}</li>)}</ul>
    <h3>Palabras para orientarse</h3><dl>{practice.vocabulary.map(x=><div key={x.term}><dt>{x.term}</dt><dd>{x.meaning}</dd></div>)}</dl>
    <h3>Su tarea</h3><p>{practice.exercise}</p>
    <h3>Fuentes y responsabilidades</h3><ul>{practice.files.map(x=><li key={x.path}><code>{x.path}</code>: {x.responsibility}</li>)}</ul>
    <h3>Si se pierde</h3><p>{practice.recovery}</p>
    <details><summary>Ver solución explicada</summary><p>{practice.solution}</p></details>
    <h3>Revise su entrega</h3><ul>{practice.rubric.map(x=><li key={x}>{x}</li>)}</ul>
    <p>Esta rúbrica orienta su autoevaluación; no acredita comprensión validada con participantes.</p>
  </section>;
}
