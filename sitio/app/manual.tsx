import Link from "next/link";
import {LessonExecution, type LessonExecutionData} from "./lesson-execution";
import pedagogy from "../../editorial/curriculum.json";
import { CopyCode } from "./copy-code";
import { DataDictionary } from "./data-dictionary";
import { ArchitectureMap } from "./architecture-map";
import { ApiWorkshop } from "./api-workshop";
import { OperationWorkshop } from "./operation-workshop";
import { AnalyticsWorkshop } from "./analytics-workshop";
import { IntegralWorkshop } from "./integral-workshop";
import { DocumentationWorkshop } from "./documentation-workshop";
import {ReaderGuide,ModuleReview} from './reader-guide';
import reading from '../../editorial/c10/reader-guide.json';
import { OperationPractices } from "./operation-practices";
import standards from "../../editorial/standards-map.json";
import {AreaWorkshop} from './area-workshop';
import {TopicReferences} from './topic-references';

type Lesson = { title: string; situation: string; simple: string; steps: string[]; example: string; mistake: string; evidence: string; code: string; codeKind: keyof typeof reading.codeLabels; execution?: LessonExecutionData | null };
type Module = { number: string; key: string; route: string; title: string; part: string; intro: string; outcomes: string[]; project: string; deliverable: string; checkpoint: string; sources: string[]; estimatedMinutes: number; lessons: Lesson[] };
const modules = pedagogy.modules as Module[];

export function ManualPage({ kind }: { kind: string }) {
  const page = modules.find((item) => item.key === kind);
  if (!page) throw new Error(`Módulo pedagógico desconocido: ${kind}`);
  const position = modules.indexOf(page);
  const next = modules[position + 1];
  const previous = modules[position - 1];
  return <main className="manual-page" id="contenido">
    <header className="nav"><Link className="brand" href="/">COBRIA <span>guía de software</span></Link><nav aria-label="Navegación principal"><Link href="/">Inicio</Link><Link href="/comenzar">Guía</Link><Link href="/explorar">Patrones</Link><Link href="/mapa">Mapa</Link><Link href="/laboratorio">Laboratorio</Link><Link href="/recursos">Recursos</Link></nav></header>
    <div className="manual-shell">
      <aside aria-label="Índice del manual"><b>{page.number}</b><p>{page.part}</p><nav aria-label="Módulos COBRIA">{modules.map((item) => <a href={item.route} aria-current={item.key === page.key ? "page" : undefined} key={item.number}>{item.number} · {item.title}</a>)}</nav></aside>
      <article>
        <p className="eyebrow">Ruta práctica · Parte {page.number} de {modules.length}</p><h1>{page.title}</h1><p className="manual-intro">{page.intro}</p>
        <div className="outcomes" aria-label="Resultados de aprendizaje">{page.outcomes.map((item) => <span key={item}>{item}</span>)}</div>
        {kind==='inicio'&&<ReaderGuide/>}
        {kind==='inicio'&&<section className="module-project"><h2>El proyecto completo, de memoria a disco</h2><p>Comprueba permisos, catálogo, proyección, analítica y recuperación sobre la misma observación.</p><Link href="/comenzar/proyecto-integral">Abrir el proyecto integral recuperable</Link></section>}
        {kind==='inicio'&&<section className="module-project"><h2>¿Nunca has programado?</h2><p>Empieza por dato, variable, condición, función y objeto. Cambia archivos reales, provoca errores y escribe tu primera prueba antes de recorrer las capas.</p><Link href="/comenzar/desde-cero">Abrir el taller desde cero: diez unidades</Link></section>}
        <nav className="lesson-index" aria-label="En esta parte"><h2>En esta parte</h2><ol>{page.lessons.map((lesson,index)=><li key={lesson.title}><a href={`#leccion-${index+1}`}>{lesson.title}</a></li>)}</ol><a href="#caso-desarrollado">Abrir el caso desarrollado de esta área</a><a href="#repaso">Repasar antes de continuar</a></nav>
        <section className="module-project" aria-labelledby={`proyecto-${page.key}`}><p className="lesson-label">Proyecto conductor · {page.lessons.length} lecciones · {page.estimatedMinutes} min</p><h2 id={`proyecto-${page.key}`}>{page.project}</h2><p><strong>Entrega comprobable:</strong> {page.deliverable}</p><p><strong>Hito ejecutable:</strong> {page.checkpoint}</p><p className="source-note"><strong>Fuentes:</strong> {page.sources.join(" · ")}</p></section>
        {kind === 'datos' && <DataDictionary/>}
        <AreaWorkshop kind={kind}/>
        {['arquitectura','capas'].includes(kind) && <ArchitectureMap/>}
        {['apiux','seguridad'].includes(kind) && <ApiWorkshop/>}
        {['calidad','operaciones'].includes(kind) && <OperationWorkshop/>}
        {kind === 'ia' && <AnalyticsWorkshop/>}
        {kind === 'construir' && <IntegralWorkshop/>}
        {['documentacion','toolkit'].includes(kind) && <DocumentationWorkshop/>}
        {page.lessons.map((lesson, index) => <section className="manual-lesson" id={`leccion-${index+1}`} key={lesson.title}>
          <p className="lesson-label">Lección {page.number}.{index + 1}</p><h2>{lesson.title}</h2><p><Link href={`/aprender/${page.key}/${index+1}`}>Abrir como lección individual</Link></p>
          <div className="lesson-situation"><strong>Situación.</strong> {lesson.situation}</div><p className="lesson-simple"><strong>En palabras sencillas:</strong> {lesson.simple}</p>
          <div className="lesson-grid"><div><h3>Hazlo paso a paso</h3><ol>{lesson.steps.map((step) => <li key={step}>{step}</li>)}</ol></div><div><h3>Ejemplo realista</h3><p>{lesson.example}</p><h3>Error frecuente</h3><p>{lesson.mistake}</p></div></div>
          <p className="code-kind">{reading.codeLabels[lesson.codeKind]}</p><p className="source-note">{reading.codeNote}</p><CopyCode code={lesson.code} /><LessonExecution execution={lesson.execution}/><div className="lesson-proof"><strong>¿Cómo sé que funciona?</strong><span>{lesson.evidence}</span></div>
        </section>)}
        <OperationPractices kind={kind}/>
        <ModuleReview courseKey={kind}/>
        <TopicReferences kind={kind}/>
        {previous&&<p><Link href={previous.route}>Volver a {previous.title}</Link></p>}
        {standards.references.some(row => row.modules.includes(kind)) && <section className="manual-lesson" id="referencias-calidad"><h2>Normas y guías para esta área</h2><p>Correspondencia temática, no certificación ni evaluación de cláusulas. Core 1.0 no cambia. Consulta: {standards.checkedAt}.</p>{standards.references.filter(row => row.modules.includes(kind)).map(row => <section key={row.id}><h3><a href={row.url}>{row.reference}</a></h3><p>{row.practice}</p><p><strong>Evidencia esperada:</strong> {row.evidence}</p><p><strong>Límite:</strong> {row.limit}</p></section>)}</section>}
        <div className="manual-next"><b>{next ? `Siguiente: ${next.title}` : "Ruta completa"}</b><p>{next ? next.intro : "Ya puede recorrer el catálogo de patrones, ejecutar el laboratorio y descargar los documentos verificables."}</p><a href={next?.route ?? "/recursos"}>{next ? "Continuar la ruta" : "Abrir recursos"} <span aria-hidden="true">→</span></a></div>
      </article>
    </div>
    <footer><b>COBRIA</b><span>Billy Jak Cordero Porras · Coto Brus, Costa Rica</span><nav aria-label="Enlaces editoriales"><a href="/historia">Historia</a><a href="/privacidad">Privacidad y uso</a></nav></footer>
  </main>;
}
