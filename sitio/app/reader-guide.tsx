import Link from "next/link";
import guide from "../../editorial/c10/reader-guide.json";
import curriculum from "../../editorial/curriculum.json";
import { LearningProgress } from "./learning-progress";

export function ReaderGuide() {
  return (
    <section className="reader-guide" aria-labelledby="guia-lectura">
      <h2 id="guia-lectura">{guide.title}</h2>
      <p>{guide.intro}</p>
      <LearningProgress />
      <div className="reader-tracks">
        {guide.tracks.map((track) => (
          <section key={track.title}>
            <h3>{track.title}</h3>
            <ol>
              {track.keys.map((key) => {
                const course = curriculum.modules.find(
                  (item) => item.key === key,
                )!;
                return (
                  <li key={key}>
                    <Link href={course.route}>{course.title}</Link>
                  </li>
                );
              })}
            </ol>
            <p>{track.result}</p>
            <Link href="/comenzar/proyecto-integral">
              Comprobar la integración en el proyecto conductor
            </Link>
          </section>
        ))}
      </div>
      <p>
        <Link href="/explorar">Buscar una lección o un taller</Link> ·{" "}
        <Link href="/laboratorio">Practicar con los laboratorios</Link>
      </p>
    </section>
  );
}

export function ModuleReview({ courseKey }: { courseKey: string }) {
  const review = guide.reviews.find((item) => item.key === courseKey);
  if (!review) return null;
  return (
    <section className="module-review" id="repaso">
      <h2>Antes de continuar</h2>
      <p>{review.question}</p>
      <p>
        Intente responder antes de abrir la orientación. Explique también qué
        prueba añadiría.
      </p>
      <details>
        <summary>Comparar con una respuesta orientativa</summary>
        <p>{review.answer}</p>
      </details>
      <p>
        Este repaso no se califica automáticamente ni acredita comprensión por
        otra persona.
      </p>
    </section>
  );
}
