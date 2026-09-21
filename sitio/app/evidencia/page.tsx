import Link from "next/link";

export const metadata = {
  title: "Evidencia y reproducibilidad · COBRIA",
  description:
    "Pruebas, experimentos, trazabilidad, límites y recursos reproducibles de COBRIA.",
};
export default function Evidencia() {
  return (
    <main className="manual-page">
      <header className="nav">
        <Link className="brand" href="/">
          COBRIA <span>guía de software</span>
        </Link>
        <nav>
          <Link href="/">Inicio</Link>
          <a href="/recursos">Recursos</a>
        </nav>
      </header>
      <div className="manual-shell">
        <aside>
          <b>13</b>
          <p>Evidencia</p>
          <nav>
            <a href="#estado">Estado</a>
            <a href="#experimentos">Experimentos</a>
            <a href="#trazabilidad">Trazabilidad</a>
            <a href="#limites">Límites</a>
          </nav>
        </aside>
        <article>
          <p className="eyebrow">Investigación reproducible</p>
          <h1>Evidencia, no promesas</h1>
          <p className="manual-intro">
            Esta página separa lo ejecutado, lo histórico y lo pendiente. Un
            resultado local no se convierte en una afirmación universal.
          </p>
          <div className="outcomes">
            <span>Core verificable</span>
            <span>Resultados descargables</span>
            <span>Amenazas visibles</span>
          </div>
          <section id="estado">
            <h2>Estado de la evidencia</h2>
            <p>
              El arnés comprueba autoridad, ámbito, revisión, idempotencia,
              reconstrucción, publicación, procedencia y abstención. La
              repetición Core 1.3 usa MongoDB y CouchDB; OpenSearch se informa
              aparte cuando la plataforma no permite una ejecución comparable.
              El inventario actual conserva cinco escenarios operacionales locales,
              pero registra cero réplicas externas recibidas.
            </p>
          </section>
          <section id="experimentos">
            <h2>P1, P2, R1, S1 y A1</h2>
            <p>
              P1 compara lectura; P2 mide amplificación; R1 destruye y
              reconstruye; S1 intenta cruzar ámbitos; A1 verifica productos
              analíticos y recuperación con evidencia.
            </p>
            <div className="manual-code">
              <div>
                <span>Repetición local</span>
              </div>
              <pre>
                <code>
                  npm test{`\n`}npm run alternatives:core13{`\n`}npm run
                  statistics:core13{`\n`}npm run traceability
                </code>
              </pre>
            </div>
          </section>
          <section id="trazabilidad">
            <h2>Matriz integral</h2>
            <p>
              Cada requisito enlaza patrón, implementación, prueba, resultado,
              amenaza y documento. El archivo JSON puede ser consumido por
              personas, navegadores y herramientas automáticas.
            </p>
            <p>
              <a className="primary" href="/trazabilidad.json">
                Abrir trazabilidad JSON
              </a>
            </p>
          </section>
          <section id="limites">
            <h2>Qué todavía no demuestra</h2>
            <p>
              Las pruebas locales no certifican seguridad exhaustiva,
              productividad humana, rendimiento universal ni comportamiento de
              servicios administrados. La repetición confirmatoria distribuida
              todavía tiene celdas incompletas. La revisión independiente y el estudio
              con participantes requieren otras personas y consentimiento.
            </p>
          </section>
        </article>
      </div>
      <footer>
        <b>COBRIA</b>
        <span>Resultados con alcance y versión</span>
        <a href="/recursos">Descargas</a>
      </footer>
    </main>
  );
}
