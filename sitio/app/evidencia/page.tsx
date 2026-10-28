import Link from "next/link";
import { evidenceR7 } from "../evidence-r7";
import pedagogy from "../../../editorial/curriculum.json";
import { CopyCode } from "../copy-code";
import {ModuleReview} from '../reader-guide';
import reading from '../../../editorial/c10/reader-guide.json';
import {AreaWorkshop} from '../area-workshop';

const learningModule = pedagogy.modules.find((item) => item.key === "evidencia")!;
const motorNombre = { mongodb: "MongoDB", couchdb: "CouchDB", opensearch: "OpenSearch" } as const;
const numero = (valor: number, decimales = 3) => new Intl.NumberFormat("es-CR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(valor);

export const metadata = { title: "Evidencia y reproducibilidad · COBRIA", description: "Pruebas, experimentos, trazabilidad, límites y recursos reproducibles de COBRIA." };

export default function Evidencia() {
  return <main className="manual-page" id="contenido">
    <header className="nav"><Link className="brand" href="/">COBRIA <span>guía de software</span></Link><nav aria-label="Navegación principal"><Link href="/">Inicio</Link><Link href="/comenzar">Guía</Link><Link href="/explorar">Patrones</Link><Link href="/mapa">Mapa</Link><Link href="/laboratorio">Laboratorio</Link><Link href="/recursos">Recursos</Link></nav></header>
    <div className="manual-shell">
      <aside><b>17</b><p>Evidencia</p><nav><a href="#aprender">Aprender</a><a href="#estado">Estado</a><a href="#experimentos">Experimentos</a><a href="#trazabilidad">Trazabilidad</a><a href="#limites">Límites</a></nav></aside>
      <article>
        <p className="eyebrow">Parte 17 de 17 · investigación reproducible</p><h1>{learningModule.title}</h1><p className="manual-intro">{learningModule.intro}</p>
        <div className="outcomes">{learningModule.outcomes.map((item)=><span key={item}>{item}</span>)}</div>
        <nav className="lesson-index" aria-label="En esta parte"><h2>En esta parte</h2><ol>{learningModule.lessons.map((lesson,index)=><li key={lesson.title}><a href={`#leccion-${index+1}`}>{lesson.title}</a></li>)}</ol><a href="#repaso">Repasar antes de continuar</a></nav>
        <section id="aprender" className="module-project"><p className="lesson-label">Proyecto conductor</p><h2>{learningModule.project}</h2><p><strong>Entrega comprobable:</strong> {learningModule.deliverable}</p></section>
        <p><a href="#caso-desarrollado">Abrir el caso desarrollado de esta área</a></p>
        <AreaWorkshop kind="evidencia"/>
        {learningModule.lessons.map((lesson,index)=><section className="manual-lesson" id={`leccion-${index+1}`} key={lesson.title}><p className="lesson-label">Lección 17.{index+1}</p><h2>{lesson.title}</h2><p><Link href={`/aprender/evidencia/${index+1}`}>Abrir como lección individual</Link></p><div className="lesson-situation"><strong>Situación.</strong> {lesson.situation}</div><p className="lesson-simple"><strong>En palabras sencillas:</strong> {lesson.simple}</p><div className="lesson-grid"><div><h3>Hazlo paso a paso</h3><ol>{lesson.steps.map(step=><li key={step}>{step}</li>)}</ol></div><div><h3>Ejemplo realista</h3><p>{lesson.example}</p><h3>Error frecuente</h3><p>{lesson.mistake}</p></div></div><p className="code-kind">{reading.codeLabels[lesson.codeKind as keyof typeof reading.codeLabels]}</p><p>{reading.codeNote}</p><CopyCode code={lesson.code}/><div className="lesson-proof"><strong>¿Cómo sé que funciona?</strong><span>{lesson.evidence}</span></div></section>)}
        <ModuleReview courseKey="evidencia"/>
        <p><Link href="/herramientas">Volver a Herramientas</Link></p>
        <section id="estado"><h2>Estado de la evidencia científica</h2><p>R7 reúne <strong>{evidenceR7.observations} observaciones confirmatorias internas</strong> en tres motores y tres escalas. Las 90 observaciones de cada motor cumplieron P1, P2, R1, S1 y A1. Es evidencia de un nodo por motor, no una certificación ni una afirmación universal.</p><div className="concept-grid">{evidenceR7.engines.map((motor)=><article key={motor.id}><h3>{motorNombre[motor.id]}</h3><p>Versión {motor.version} · {motor.architecture} · {motor.observations} observaciones.</p></article>)}</div></section>
        <section id="experimentos"><h2>P1, P2, R1, S1 y A1</h2><p>P1 compara lectura; P2 mide amplificación; R1 destruye y reconstruye; S1 intenta cruzar ámbitos; A1 verifica productos analíticos y recuperación con evidencia.</p><CopyCode code={'make verificar-r7\nnpm run statistics:r7\nnpm run traceability'}/><h3>Comparación pareada de lectura</h3><div className="table-scroll" role="region" aria-label="Resultados pareados R7"><table><thead><tr><th>Motor</th><th>N</th><th>Razón mediana</th><th>Diferencia media</th><th>d<sub>z</sub></th><th>p de Holm</th></tr></thead><tbody>{evidenceR7.comparisons.map((fila)=><tr key={`${fila.motor}-${fila.n}`}><td>{motorNombre[fila.motor]}</td><td>{fila.n}</td><td>{numero(fila["razón_pareada_mediana"])}</td><td>{numero(fila["diferencia_pareada_media_ms"])}</td><td>{numero(fila["tamaño_efecto_dz"])}</td><td>{numero(fila.p_holm,4)}</td></tr>)}</tbody></table></div><p className="callout"><strong>Resultado no concluyente:</strong> OpenSearch con N=100 obtuvo una diferencia media cercana a cero y p de Holm 0,993. Se publica como resultado negativo.</p></section>
        <section id="trazabilidad"><h2>Matriz integral</h2><p>Cada requisito enlaza patrón, implementación, prueba, resultado, amenaza y documento.</p><p><a className="primary" href="/trazabilidad.json">Abrir trazabilidad JSON</a></p></section>
        <section id="limites"><h2>Qué todavía no demuestra</h2><p>Las pruebas internas no certifican seguridad exhaustiva, productividad humana, rendimiento universal, topologías multinodo ni servicios administrados. Continúan pendientes: {evidenceR7.humanPending.join(", ")}. La microcomparación de {evidenceR7.alternatives.observations} observaciones ocurre en un único proceso y no demuestra superioridad distribuida.</p></section>
      </article>
    </div>
    <footer><b>COBRIA</b><span>Resultados con alcance y versión</span><nav aria-label="Enlaces editoriales"><Link href="/historia">Historia</Link><Link href="/privacidad">Privacidad y uso</Link><Link href="/recursos">Recursos</Link></nav></footer>
  </main>;
}
