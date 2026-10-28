"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import curriculum from "../../editorial/curriculum.json";
import {
  lessonsOf,
  readProgress,
  toggleProgress,
  storageKey,
} from "../../editorial/ep5/progress.mjs";
const lessons = lessonsOf(curriculum),
  allowed = lessons.map((item) => item.id);
let memory = "";
let memoryOnly = false;
const eventName = "cobria-progreso";
function snapshot() {
  if (memoryOnly) return memory;
  try {
    return localStorage.getItem(storageKey) ?? "";
  } catch {
    return memory;
  }
}
function subscribe(notify: () => void) {
  const external = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) notify();
  };
  window.addEventListener(eventName, notify);
  window.addEventListener("storage", external);
  return () => {
    window.removeEventListener(eventName, notify);
    window.removeEventListener("storage", external);
  };
}
function save(raw: string) {
  memory = raw;
  let persistent = true;
  try {
    if (raw) localStorage.setItem(storageKey, raw);
    else localStorage.removeItem(storageKey);
    memoryOnly = false;
  } catch {
    persistent = false;
    memoryOnly = true;
  }
  window.dispatchEvent(new Event(eventName));
  return persistent;
}
export function LearningProgress({ lessonId }: { lessonId?: string }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => ""),
    completed = readProgress(raw, allowed);
  const [notice, setNotice] = useState("");
  const done = lessonId ? completed.includes(lessonId) : false;
  const next = lessons.find((item) => !completed.includes(item.id));
  function toggle() {
    if (!lessonId) return;
    const persisted = save(toggleProgress(raw, lessonId, allowed));
    setNotice(
      persisted
        ? "Marca guardada solo en este navegador."
        : "El navegador bloqueó el guardado. La marca dura solo durante esta sesión.",
    );
  }
  return (
    <section className="learning-progress" aria-label="Tu avance de lectura">
      <p className="eyebrow">Tu cuaderno de lectura</p>
      <h2>{lessonId ? "¿Terminaste esta lección?" : "Continúa a tu ritmo"}</h2>
      <p>
        {completed.length} de {lessons.length} lecciones marcadas. Son marcas
        personales, no una evaluación ni una certificación.
      </p>
      <progress
        max={lessons.length}
        value={completed.length}
        aria-label="Lecciones marcadas"
      />
      {lessonId ? (
        <button
          className="progress-toggle"
          type="button"
          aria-pressed={done}
          onClick={toggle}
        >
          {done ? "Quitar marca de leída" : "Marcar como leída"}
        </button>
      ) : (
        <p>
          {next ? (
            <Link href={next.href}>Continuar: {next.title}</Link>
          ) : (
            "Has marcado todas las lecciones. Vuelve a los ejercicios para comprobar lo aprendido."
          )}
        </p>
      )}
      <p className="source-note">
        No se envía tu avance al servidor. Puede perderse al borrar los datos
        del navegador; no se sincroniza entre dispositivos.
      </p>
      {!lessonId && (
        <details>
          <summary>Administrar mis marcas</summary>
          <p>
            Se eliminarán únicamente las marcas de lectura COBRIA de este
            navegador.
          </p>
          <button
            type="button"
            onClick={() => {
              const saved = save("");
              setNotice(
                saved
                  ? "Marcas de lectura borradas."
                  : "Marcas de esta sesión borradas; el almacenamiento sigue bloqueado.",
              );
            }}
          >
            Borrar mis marcas
          </button>
        </details>
      )}
      <p role="status" aria-live="polite">
        {notice}
      </p>
    </section>
  );
}
