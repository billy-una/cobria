let catalogo = [],
  practical = {};
void fetch("practical-examples.json")
  .then((r) => r.json())
  .then((list) => {
    practical = Object.fromEntries(list.map((x) => [x.id, x]));
  })
  .catch(() => {});
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const familyImage = (f) =>
  f.includes("Modelado")
    ? "modelado.png"
    : f.includes("Seguridad")
      ? "seguridad.png"
      : f.includes("Proyecciones")
        ? "ecosistema-panoramico.png"
        : f.includes("Reconstrucción")
          ? "reconstruccion.png"
          : f.includes("Analítica") || f.includes("IA")
            ? "analitica-ia.png"
            : f.includes("Gobernanza")
              ? "gobernanza.png"
              : "eventos.png";
function genericCodeSamples(p) {
  const n = p.nombre.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]/g, "");
  return {
    TypeScript: `interface Documento { id: string; ambito: string; revision: number }\n\nclass ${n} {\n  ejecutar(doc: Documento) {\n    if (!doc.ambito) throw new Error('Ámbito requerido');\n    // ${p.contrato}\n    return { ...doc, patron: '${p.slug}' };\n  }\n}`,
    Python: `from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Documento:\n    id: str\n    ambito: str\n    revision: int\n\ndef aplicar(documento: Documento):\n    assert documento.ambito, "Ámbito requerido"\n    # ${p.contrato}\n    return documento`,
    Java: `record Documento(String id, String ambito, long revision) {}\n\nfinal class ${n} {\n  Documento ejecutar(Documento doc) {\n    if (doc.ambito().isBlank())\n      throw new IllegalArgumentException("Ámbito requerido");\n    // ${p.contrato}\n    return doc;\n  }\n}`,
    Go: `type Documento struct {\n  ID string\n  Ambito string\n  Revision int64\n}\n\nfunc Aplicar(doc Documento) (Documento, error) {\n  if doc.Ambito == "" { return doc, errors.New("ámbito requerido") }\n  // ${p.contrato}\n  return doc, nil\n}`,
  };
}
const codeSamples = function (p) {
  return practical[p.id]?.code || genericCodeSamples(p);
};
const card = (p) =>
  `<article data-id="${p.id}"><div class="card-top"><b>${String(p.id).padStart(2, "0")}</b><span>${esc(p.familia)}</span></div><h3>${esc(p.nombre)}</h3><p>${esc(p.proposito)}</p><button class="open-pattern" data-id="${p.id}" type="button">Abrir ficha <span>→</span></button></article>`;
function render() {
  const q = $("#search").value.trim().toLowerCase(),
    f = $("#family-filter").value;
  const list = catalogo.filter(
    (p) =>
      (!f || p.familia === f) &&
      (!q || Object.values(p).join(" ").toLowerCase().includes(q)),
  );
  const groups = [...new Set(list.map((p) => p.familia))];
  $("#pattern-grid").innerHTML =
    groups
      .map(
        (family, i) =>
          `<section class="family-group"><header><span>${String(i + 1).padStart(2, "0")}</span><div><p>Familia arquitectónica</p><h3>${esc(family)}</h3></div><b>${list.filter((p) => p.familia === family).length} patrones</b></header><div class="cards">${list
            .filter((p) => p.familia === family)
            .map(card)
            .join("")}</div></section>`,
      )
      .join("") || '<p class="empty">No hay patrones con esos criterios.</p>';
  $("#catalog-count").textContent =
    `${list.length} de ${catalogo.length} patrones`;
}
function renderPattern(id) {
  const p = catalogo.find((x) => x.id === Number(id));
  if (!p) return;
  const codes = codeSamples(p);
  $("#dialog-content").innerHTML =
    `<div class="pattern-layout"><aside class="pattern-toc"><b>En esta ficha</b><a href="#intent">Propósito</a><a href="#problem">Problema</a><a href="#solution">Solución</a><a href="#structure">Estructura</a><a href="#code">Código</a><a href="#practice">Práctica</a></aside><div class="pattern-article"><p class="eyebrow">${esc(p.familia)} · ${esc(p.tipo)}</p><h2>${esc(p.nombre)}</h2><p class="dialog-lead" id="intent">${esc(p.proposito)}</p><figure class="pattern-scene"><img src="images/${familyImage(p.familia)}" alt="Ilustración pedagógica de ${esc(p.nombre)}"><figcaption>Una representación visual del problema y su transformación dentro de COBRIA.</figcaption></figure><section id="problem"><h3>Problema</h3><p>${esc(p.problema)}</p></section><section><h3>Analogía del mundo real</h3><p>${esc(p.analogia)}</p></section><section id="solution"><h3>Solución</h3><p>${esc(p.solucion)}</p></section><section id="structure"><h3>Estructura y participantes</h3><div class="structure-flow"><span>Consumidor</span><i>→</i><span>Contrato</span><i>→</i><span>Repositorio</span><i>→</i><span>Documento</span><i>→</i><span>Derivado</span></div><ol><li>El consumidor declara identidad, ámbito y necesidad.</li><li>El contrato valida antes de leer o escribir.</li><li>El repositorio conserva la frontera documental.</li><li>El derivado permanece reconstruible y verificable.</li></ol></section><section><h3>Aplicabilidad</h3><p>${esc(p.aplicacion)}</p></section><section class="pros-cons"><div><h3>Ventajas</h3><ul><li>Responsabilidad explícita.</li><li>Evidencia verificable.</li><li>Evolución controlada.</li></ul></div><div><h3>Costos y límites</h3><ul><li>Más contratos que mantener.</li><li>Instrumentación obligatoria.</li><li>No sustituye mediciones reales.</li></ul></div></section><section id="code"><h3>Ejemplos de código</h3><div class="code-tabs" role="tablist">${Object.keys(
      codes,
    )
      .map(
        (l, i) =>
          `<button role="tab" aria-selected="${i === 0}" data-lang="${l}">${l}</button>`,
      )
      .join(
        "",
      )}</div><div class="code-shell"><button class="copy-code" type="button" aria-label="Copiar ejemplo de código"><span aria-hidden="true"></span><b>Copiar código</b></button><pre class="code-view"><code>${esc(codes.TypeScript)}</code></pre></div></section><section><h3>Contrato mínimo</h3><div class="code-shell contract-shell"><button class="copy-code" type="button" aria-label="Copiar contrato mínimo"><span aria-hidden="true"></span><b>Copiar contrato</b></button><pre><code>${esc(p.contrato)}</code></pre></div></section><section id="practice" class="exercise"><div class="exercise-label">Práctica guiada</div><div><h3>Laboratorio</h3><p>${esc(p.ejercicio)}</p></div><ol><li>Prepare un caso válido.</li><li>Provoque un fallo controlado.</li><li>Conserve la evidencia.</li></ol></section><section><h3>Métricas y relaciones</h3><p>${esc(p.metricas)}</p><p><strong>Patrones relacionados:</strong> ${p.relaciones.map(esc).join(" · ")}</p></section></div></div>`;
  $("#pattern-dialog").showModal();
  $("#pattern-dialog").dataset.pattern = p.id;
}

function openPattern(id) {
  renderPattern(id);
  const example = practical[Number(id)];
  if (!example) return;
  $("#code").insertAdjacentHTML(
    "afterbegin",
    `<div class="practical-story"><p class="eyebrow">Ejemplo práctico en la naturaleza</p><h3>${esc(example.escena)}</h3><div class="story-problem"><b>La situación</b><p>${esc(example.problema)}</p></div><div class="story-participants">${example.participantes.map((x, i) => `<span><b>${i + 1}</b>${esc(x)}</span>`).join("<i>→</i>")}</div><div class="story-result"><b>Resultado observable</b><p>${esc(example.resultado)}</p></div></div>`,
  );
}

let toastTimer;
function showToast(message) {
  const toast = $("#copy-toast");
  toast.querySelector("strong").textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
async function copyCode(button) {
  const text = button.closest(".code-shell").querySelector("code").textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  const previous = button.innerHTML;
  button.innerHTML = '<span aria-hidden="true"></span><b>Listo</b>';
  button.classList.add("copied");
  showToast("Contenido copiado y listo para usar");
  setTimeout(() => {
    button.innerHTML = previous;
    button.classList.remove("copied");
  }, 1800);
}
function compare() {
  const a = catalogo.find((p) => p.id === Number($("#compare-a").value)),
    b = catalogo.find((p) => p.id === Number($("#compare-b").value));
  if (!a || !b) return;
  $("#compare-result").innerHTML =
    `<div></div><h3>${esc(a.nombre)}</h3><h3>${esc(b.nombre)}</h3><b>Familia</b><p>${esc(a.familia)}</p><p>${esc(b.familia)}</p><b>Propósito</b><p>${esc(a.proposito)}</p><p>${esc(b.proposito)}</p><b>Contrato</b><code>${esc(a.contrato)}</code><code>${esc(b.contrato)}</code><b>Señal</b><p>${esc(a.metricas)}</p><p>${esc(b.metricas)}</p>`;
}
function simulate() {
  const r = Number($("#read-ratio").value),
    f = Number($("#freshness").value),
    c = Number($("#complexity").value),
    ok = $("#rebuildable").checked;
  $("#read-output").value = r;
  $("#fresh-output").value = f === 0 ? "inmediata" : `${f} min`;
  $("#complex-output").value = `${c}/10`;
  let title, why, patterns;
  if (c <= 4 && f <= 5) {
    title = "Comience por un índice documental";
    why =
      "La consulta aún es moderada y exige frescura alta. Mida el índice equivalente antes de crear otra copia.";
    patterns = "Índice antes que proyección · Frontera lectura—escritura";
  } else if (r >= 8 && c >= 5 && ok) {
    title = "Considere una proyección de lectura";
    why =
      "La asimetría favorece lecturas y la forma es compleja. El requisito es que la proyección pueda reconstruirse y observar su frescura.";
    patterns =
      "Proyección de lectura · Reconstrucción total · Manifiesto de proyección";
  } else if (!ok) {
    title = "Mantenga la lectura canónica por ahora";
    why =
      "Sin reconstrucción verificable, una nueva copia puede convertirse en otra autoridad accidental.";
    patterns = "Objeto canónico · Presupuesto de derivados";
  } else {
    title = "Optimice primero la lectura canónica";
    why =
      "La ventaja esperada no supera todavía el costo de escritura, almacenamiento y operación.";
    patterns = "Frontera lectura—escritura · Presupuesto de derivados";
  }
  $("#recommendation").innerHTML =
    `<span>Recomendación</span><h3>${title}</h3><p>${why}</p><small>Revise: ${patterns}</small>`;
}
function personalizeSelect(select) {
  if (select.dataset.personalized) return;
  select.dataset.personalized = "true";
  const box = document.createElement("div");
  box.className = "custom-select";
  select.parentNode.insertBefore(box, select);
  box.appendChild(select);
  select.classList.add("native-hidden");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "custom-select-button";
  button.setAttribute("aria-haspopup", "listbox");
  const menu = document.createElement("div");
  menu.className = "custom-select-menu";
  menu.setAttribute("role", "listbox");
  box.append(button, menu);
  const sync = () => {
    const chosen = select.options[select.selectedIndex];
    button.innerHTML = `<span>${esc(chosen?.text || "Seleccionar")}</span><small>Cambiar</small>`;
    menu.innerHTML = [...select.options]
      .map(
        (o, i) =>
          `<button type="button" role="option" aria-selected="${i === select.selectedIndex}" data-value="${esc(o.value)}"><span>${esc(o.text)}</span>${i === select.selectedIndex ? '<b aria-hidden="true"></b>' : ""}</button>`,
      )
      .join("");
  };
  sync();
  button.addEventListener("click", () => {
    const open = box.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    if (open) menu.querySelector('[aria-selected="true"]')?.focus();
  });
  menu.addEventListener("click", (e) => {
    const item = e.target.closest("[role=option]");
    if (!item) return;
    select.value = item.dataset.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    sync();
    box.classList.remove("open");
    button.focus();
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      box.classList.remove("open");
      button.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!box.contains(e.target)) box.classList.remove("open");
  });
  select.addEventListener("change", sync);
}
async function init() {
  catalogo = await fetch("catalogo.json")
    .then((r) => r.json())
    .then((data) => data.items);
  const families = [...new Set(catalogo.map((p) => p.familia))];
  $("#family-filter").insertAdjacentHTML(
    "beforeend",
    families.map((f) => `<option>${esc(f)}</option>`).join(""),
  );
  const options = catalogo
    .map(
      (p) =>
        `<option value="${p.id}">${String(p.id).padStart(2, "0")} · ${esc(p.nombre)}</option>`,
    )
    .join("");
  $("#compare-a").innerHTML = options;
  $("#compare-b").innerHTML = options;
  $("#compare-b").value = "7";
  document.querySelectorAll("select").forEach(personalizeSelect);
  render();
  compare();
  simulate();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".open-pattern");
  if (b) openPattern(b.dataset.id);
  if (e.target.matches(".dialog-close")) $("#pattern-dialog").close();
  const copy = e.target.closest(".copy-code");
  if (copy) copyCode(copy);
  const tab = e.target.closest(".code-tabs button");
  if (tab) {
    const p = catalogo.find(
      (x) => x.id === Number($("#pattern-dialog").dataset.pattern),
    );
    const codes = codeSamples(p);
    tab.parentNode
      .querySelectorAll("button")
      .forEach((x) => x.setAttribute("aria-selected", String(x === tab)));
    tab.closest("section").querySelector(".code-view code").textContent =
      codes[tab.dataset.lang];
  }
});
["search", "family-filter"].forEach((id) =>
  $(`#${id}`).addEventListener("input", render),
);
$("#clear-filter").addEventListener("click", () => {
  $("#search").value = "";
  $("#family-filter").value = "";
  render();
});
["compare-a", "compare-b"].forEach((id) =>
  $(`#${id}`).addEventListener("change", compare),
);
["read-ratio", "freshness", "complexity", "rebuildable"].forEach((id) =>
  $(`#${id}`).addEventListener("input", simulate),
);
init();
const backTop = $("#back-top");
window.addEventListener(
  "scroll",
  () => backTop.classList.toggle("visible", scrollY > 700),
  { passive: true },
);
backTop.addEventListener("click", () =>
  scrollTo({ top: 0, behavior: "smooth" }),
);
