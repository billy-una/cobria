import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import curriculum from "../../../../../editorial/curriculum.json";
import { CopyCode } from "../../../copy-code";
import { LessonExecution } from "../../../lesson-execution";
import { LessonPractice } from "../../../lesson-practice";
import { DataDictionary } from "../../../data-dictionary";
import { ArchitectureMap } from "../../../architecture-map";
import { SiteFrame } from "../../../site-frame";
import reading from "../../../../../editorial/c10/reader-guide.json";
import { LearningProgress } from "../../../learning-progress";

type Props = { params: Promise<{ modulo: string; leccion: string }> };

function locate(modulo: string, leccion: string) {
  const moduleIndex = curriculum.modules.findIndex(
    (item) => item.key === modulo,
  );
  const lessonIndex = Number(leccion) - 1;
  if (moduleIndex < 0 || !Number.isInteger(lessonIndex) || lessonIndex < 0)
    return null;
  const courseModule = curriculum.modules[moduleIndex];
  const lesson = courseModule.lessons[lessonIndex];
  if (!lesson) return null;
  const linear = curriculum.modules.flatMap((item, mi) =>
    item.lessons.map((entry, li) => ({
      module: item,
      lesson: entry,
      moduleIndex: mi,
      lessonIndex: li,
    })),
  );
  const position = linear.findIndex(
    (item) =>
      item.moduleIndex === moduleIndex && item.lessonIndex === lessonIndex,
  );
  return {
    module: courseModule,
    lesson,
    previous: linear[position - 1],
    next: linear[position + 1],
  };
}

export function generateStaticParams() {
  return curriculum.modules.flatMap((module) =>
    module.lessons.map((_, index) => ({
      modulo: module.key,
      leccion: String(index + 1),
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = locate((await params).modulo, (await params).leccion);
  if (!found) return { title: "Lección no encontrada · COBRIA" };
  return {
    title: `${found.lesson.title} · COBRIA`,
    description: found.lesson.simple,
    alternates: {
      canonical: `/aprender/${found.module.key}/${Number((await params).leccion)}`,
    },
  };
}

export default async function LessonPage({ params }: Props) {
  const value = await params;
  const found = locate(value.modulo, value.leccion);
  if (!found) notFound();
  const { module, lesson, previous, next } = found;
  const labs = curriculum.labs.filter((lab) => lab.module === module.key);
  return (
    <SiteFrame>
      <div className="page-shell lesson-page">
        <nav className="breadcrumbs" aria-label="Ruta">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href={module.route}>{module.title}</Link>
          <span>/</span>
          <strong>{lesson.title}</strong>
        </nav>
        <article>
          <header>
            <p className="eyebrow">
              Lección {module.number}.{Number(value.leccion)} · Hito{" "}
              {module.checkpoint}
            </p>
            <h1>{lesson.title}</h1>
            <p className="lead">{lesson.simple}</p>
          </header>
          <section>
            <h2>La situación</h2>
            <p>{lesson.situation}</p>
          </section>
          <section>
            <h2>Hágalo paso a paso</h2>
            <ol>
              {lesson.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          <section className="pattern-analogy">
            <h2>Ejemplo realista</h2>
            <p>{lesson.example}</p>
          </section>
          <section>
            <h2>Contrato o código mínimo</h2>
            <p className="code-kind">
              {
                reading.codeLabels[
                  lesson.codeKind as keyof typeof reading.codeLabels
                ]
              }
            </p>
            <p>{reading.codeNote}</p>
            <CopyCode code={lesson.code} />
          </section>
          <LessonExecution execution={lesson.execution} />
          <LessonPractice practice={lesson.practice} />
          {module.key === "datos" && value.leccion === "1" && (
            <DataDictionary />
          )}
          {["arquitectura", "capas"].includes(module.key) &&
            value.leccion === "1" && <ArchitectureMap />}
          <section className="warning-box">
            <h2>Error frecuente</h2>
            <p>{lesson.mistake}</p>
          </section>
          <section>
            <h2>Cómo comprobarlo</h2>
            <p>{lesson.evidence}</p>
            <p>
              <strong>Fuentes del módulo:</strong> {module.sources.join(" · ")}
            </p>
            <Link href={`${module.route}#repaso`}>Repasar esta parte</Link>
          </section>
          {labs.length > 0 && (
            <section>
              <h2>Laboratorios relacionados</h2>
              <ul>
                {labs.map((lab) => (
                  <li key={lab.id}>
                    <Link href={`/laboratorio#${lab.id.toLowerCase()}`}>
                      {lab.id} · {lab.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <nav className="lesson-pagination" aria-label="Lecciones">
            <span>
              {previous && (
                <Link
                  href={`/aprender/${previous.module.key}/${previous.lessonIndex + 1}`}
                >
                  ← {previous.lesson.title}
                </Link>
              )}
            </span>
            <span>
              {next && (
                <Link
                  href={`/aprender/${next.module.key}/${next.lessonIndex + 1}`}
                >
                  {next.lesson.title} →
                </Link>
              )}
            </span>
          </nav>
          <section>
            <h2>Conectar con el libro y el proyecto</h2>
            <p>
              Esta lección y el libro consumen el mismo currículo: parte{" "}
              {module.number}, {module.title}. El caso desarrollado amplía la
              explicación con alternativas, errores y solución.
            </p>
            <Link href={`${module.route}#caso-desarrollado`}>
              Trabajar el caso completo del área
            </Link>{" "}
            ·{" "}
            <Link href="/comenzar/proyecto-integral">
              Seguir la observación de principio a fin
            </Link>{" "}
            · <Link href="/recursos">Abrir el libro y sus versiones</Link>
          </section>
          <LearningProgress
            lessonId={`${module.key}:${Number(value.leccion)}:${lesson.title}`}
          />
        </article>
      </div>
    </SiteFrame>
  );
}
