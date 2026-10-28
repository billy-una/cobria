import Link from "next/link";
import curriculum from "../../editorial/curriculum.json";
import { CopyCode } from "./copy-code";

export function OperationPractices({ kind }: { kind: string }) {
  const all = kind === "construir";
  const practices = curriculum.practices.filter(practice => all || practice.modules.includes(kind));
  if (practices.length === 0) return null;
  return <section className="operation-practices" aria-labelledby={`practicas-${kind}`}>
    <p className="eyebrow">Prácticas de organización y operación</p>
    <h2 id={`practicas-${kind}`}>{all ? "Del proyecto organizado a una entrega verificable" : "Aplique esta parte al proyecto"}</h2>
    <p>{all ? "Doce prácticas conectan las partes del manual. Los fragmentos son contratos orientativos; cinco mecanismos tienen un ejemplo ejecutable con pruebas." : "Continúe con estas prácticas del mismo libro y su ejemplo de una reserva natural digital."}</p>
    {all && <><nav className="practice-index" aria-label="Índice de prácticas">{practices.map(practice => <a key={practice.id} href={`#practica-${practice.id.toLowerCase()}`}>{practice.id} · {practice.title}</a>)}</nav><CopyCode code="npm test --prefix replication/examples/operacion-documental\nnpm start --prefix replication/examples/operacion-documental"/></>}
    {practices.map(practice => all ? <article className="operation-practice" id={`practica-${practice.id.toLowerCase()}`} key={practice.id}>
      <p className="lesson-label">{practice.id}</p><h3>{practice.title}</h3>
      <div className="lesson-situation"><strong>Situación.</strong> {practice.situation}</div>
      <p><strong>Idea principal.</strong> {practice.rule}</p>
      <ol>{practice.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <CopyCode code={practice.code}/>
      <div className="lesson-proof"><strong>Compruébelo</strong><span>{practice.verification}</span></div>
      <p className="practice-limit"><strong>Límite:</strong> {practice.limit}</p>
    </article> : <article className="practice-teaser" key={practice.id}><p className="lesson-label">{practice.id}</p><h3>{practice.title}</h3><p>{practice.rule}</p><Link href={`/construir#practica-${practice.id.toLowerCase()}`}>Ver procedimiento, código y comprobación</Link></article>)}
  </section>;
}
