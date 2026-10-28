import Link from "next/link";
import parity from "../../editorial/ep5/parity.json";
export function BookConnections() {
  return (
    <section className="book-connections" aria-labelledby="libro-web-proyecto">
      <h2 id="libro-web-proyecto">El libro, la web y el mismo proyecto</h2>
      <p>
        No son tres programas distintos. Cada parte comparte sus lecciones y
        enlaza el caso desarrollado con su hito. Los artefactos de diseño se
        revisan con una rúbrica; no todos son comandos ejecutables.
      </p>
      <div className="connection-grid">
        {parity.modules.map((m) => (
          <article key={m.key}>
            <p className="eyebrow">
              Parte {m.bookPart} ·{" "}
              {m.exampleKind === "ejecutable-local"
                ? "Ejemplo ejecutable"
                : "Ejercicio de diseño"}
            </p>
            <h3>{m.title}</h3>
            <p>{m.caseTitle}</p>
            <p>
              <Link href={m.route}>Leer esta parte</Link> ·{" "}
              <Link href={m.caseRoute}>Resolver su caso</Link>
            </p>
            <p className="source-note">Hito: {m.checkpoint}</p>
          </article>
        ))}
      </div>
      <p>
        <Link href="/comenzar/proyecto-integral">
          Ejecutar la integración completa
        </Link>{" "}
        · <Link href="/recursos">Consultar versión y descarga del libro</Link>
      </p>
    </section>
  );
}
