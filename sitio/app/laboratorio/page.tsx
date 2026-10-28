"use client";
import { useEffect, useState } from "react";
import curriculum from "../../../editorial/curriculum.json";
import { CopyCode } from "../copy-code";
import { SiteFrame } from "../site-frame";

const storageKey = "cobria-laboratorios-1.0";

export default function Page() {
  const [done, setDone] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("todos");
  const [storageNotice, setStorageNotice] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(storageKey) ?? "[]";
        const value = raw.length <= 64000 ? JSON.parse(raw) : [];
        setDone(
          Array.isArray(value)
            ? [
                ...new Set(
                  value.filter(
                    (id) =>
                      typeof id === "string" &&
                      curriculum.labs.some((lab) => lab.id === id),
                  ),
                ),
              ]
            : [],
        );
      } catch {
        setDone([]);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const modules = curriculum.modules.map((item) => ({
    key: item.key,
    title: item.title,
  }));
  const labs = curriculum.labs.filter(
    (lab) =>
      (selectedModule === "todos" || lab.module === selectedModule) &&
      `${lab.id} ${lab.title} ${lab.objective}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const toggle = (id: string) => {
    const next = done.includes(id)
      ? done.filter((item) => item !== id)
      : [...done, id];
    setDone(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStorageNotice(
        "Marca personal guardada en este navegador; no es evaluación automática.",
      );
    } catch {
      setStorageNotice(
        "El almacenamiento está bloqueado. La marca se conserva solo durante esta visita.",
      );
    }
  };
  return (
    <SiteFrame>
      <div className="page-shell">
        <header>
          <p className="eyebrow">Cuaderno interactivo</p>
          <h1>Treinta laboratorios para aprender haciendo.</h1>
          <p className="lead">
            Cada práctica conecta una decisión con un fallo, un resultado
            esperado, un comando y una solución orientativa. El progreso se
            conserva únicamente en este navegador.
          </p>
        </header>
        <div className="search-controls">
          <label>
            <span className="sr-only">Buscar laboratorios</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por problema o resultado…"
            />
          </label>
          <label>
            <span className="sr-only">Módulo</span>
            <select
              value={selectedModule}
              onChange={(event) => setSelectedModule(event.target.value)}
            >
              <option value="todos">Todos los módulos</option>
              {modules.map((item) => (
                <option value={item.key} key={item.key}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="search-count" aria-live="polite">
          {done.length} de {curriculum.labCount} laboratorios marcados por ti
        </p>
        <p role="status" aria-live="polite">{storageNotice}</p>
        <section className="lab-catalog">
          {labs.map((lab, index) => (
            <article
              className="lab-card"
              id={lab.id.toLowerCase()}
              key={lab.id}
            >
              <div className="lab-card-head">
                <p className="eyebrow">
                  {lab.id} ·{" "}
                  {
                    curriculum.modules.find((item) => item.key === lab.module)
                      ?.title
                  }
                </p>
                <label className="lab-check">
                  <input
                    type="checkbox"
                    checked={done.includes(lab.id)}
                    onChange={() => toggle(lab.id)}
                  />
                  <span>
                    {done.includes(lab.id)
                      ? "Completado"
                      : "Marcar cuando exista evidencia"}
                  </span>
                </label>
              </div>
              <h2>{lab.title}</h2>
              <p>{lab.objective}</p>
              <h3>Procedimiento</h3>
              <ol>
                {lab.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="lesson-proof">
                <strong>Resultado esperado</strong>
                <span>{lab.expected}</span>
              </div>
              <p>
                <strong>Directorio:</strong> raíz de COBRIA
              </p>
              <p>{lab.prerequisites.join(" ")}</p>
              <CopyCode code={lab.command} />
              <p>{lab.verificationScope}</p>
              <details>
                <summary>Mostrar solución orientativa</summary>
                <p>{lab.solution}</p>
              </details>
              <small>
                Laboratorio {index + 1} de {labs.length} en este filtro.
              </small>
            </article>
          ))}
        </section>
      </div>
    </SiteFrame>
  );
}
