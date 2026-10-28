"use client";
import { useMemo, useRef, useState } from "react";
import catalog from "../../public/catalogo.json";
import curriculum from "../../../editorial/curriculum.json";
import { SiteFrame } from "../site-frame";
import guide from "../../../editorial/c10/reader-guide.json";
import { buscar, learningIndex } from "../../../editorial/ep5/search.mjs";
import areas from "../../../editorial/ep3/areas.json";
import initial from "../../../editorial/ep2/recorrido.json";
import project from "../../../editorial/ep4/recorrido.json";

const all = learningIndex(curriculum, catalog, guide, areas, initial, project);

export default function Page() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("Todos");
  const input = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => buscar(all, query, kind), [query, kind]);
  function reset() {
    setQuery("");
    setKind("Todos");
    input.current?.focus();
  }
  return (
    <SiteFrame>
      <div className="page-shell">
        <header>
          <p className="eyebrow">Buscador de conocimiento</p>
          <h1>Encuentra una decisión, una lección o una práctica.</h1>
          <p className="lead">
            Busque en las {curriculum.lessonCount} lecciones, treinta patrones,
            treinta laboratorios, {curriculum.practiceCount} prácticas y cinco
            talleres ejecutables. Puede escribir sin tildes y combinar palabras.
          </p>
          <p>Incluye también los {areas.areas.length} casos desarrollados del libro, las {initial.units.length} unidades iniciales y el proyecto integral con código completo.</p>
          <nav className="search-topics" aria-label="Búsquedas sugeridas">
            {[
              "datos",
              "capas",
              "seguridad",
              "reconstruccion",
              "documentacion",
              "IA",
            ].map((topic) => (
              <button
                type="button"
                key={topic}
                aria-pressed={query === topic}
                onClick={() => {
                  setQuery(topic);
                  input.current?.focus();
                }}
              >
                {topic}
              </button>
            ))}
          </nav>
        </header>
        <div className="search-controls">
          <label>
            Buscar
            <input
              ref={input}
              value={query}
              maxLength={200}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej.: ambito, persistencia, comentarios…"
            />
          </label>
          <label>
            <span id="tipo-busqueda-label">Tipo</span>
            <select
              aria-labelledby="tipo-busqueda-label"
              value={kind}
              onChange={(event) => setKind(event.target.value)}
            >
              {[
                "Todos",
                "Lección",
                "Patrón",
                "Laboratorio",
                "Práctica",
                "Taller",
                "Caso desarrollado",
                "Unidad inicial",
                "Proyecto",
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={reset}>
            Limpiar búsqueda
          </button>
        </div>
        <p className="search-count" role="status" aria-live="polite">
          {filtered.length} resultados
        </p>
        {filtered.length === 0 && (
          <section className="search-empty">
            <h2>No encontramos coincidencias</h2>
            <p>
              Pruebe una palabra más general o quite el filtro. No encontrarla
              no significa que el tema no exista.
            </p>
            <a href="/comenzar">Volver a la guía de lectura</a>
          </section>
        )}
        <section className="search-grid" aria-label="Resultados de búsqueda">
          {filtered.map((item) => (
            <article className="search-card" key={`${item.kind}-${item.href}`}>
              <p className="eyebrow">
                {item.kind} · {item.detail}
              </p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <a href={item.href}>
                <b>Abrir {item.title}</b>
              </a>
            </article>
          ))}
        </section>
      </div>
    </SiteFrame>
  );
}
