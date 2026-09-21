import { SiteFrame } from "../site-frame";

export const metadata = {
  title: "COBRIA Core 1.0",
  description: "Núcleo normativo de COBRIA para autoridad, ámbito, revisión, derivación y reconstrucción verificable.",
  alternates: { canonical: "/core" },
};

const invariantes = [
  ["Autoridad explícita", "Cada hecho reconoce una fuente autorizada de cambio."],
  ["Ámbito obligatorio", "Lecturas, escrituras, claves y pruebas conservan el mismo límite."],
  ["Derivación declarada", "Toda copia explica de qué origen y revisión fue construida."],
  ["Reconstrucción verificable", "Una proyección puede regenerarse y compararse con un resultado esperado."],
];

export default function Page() {
  return <SiteFrame><div className="page-shell"><header><p className="eyebrow">Núcleo normativo congelado</p><h1>COBRIA Core 1.0</h1><p className="lead">El Core es la parte mínima y estable del ecosistema. No prescribe un lenguaje, proveedor ni motor de base de datos; define contratos observables para sistemas documentales.</p></header><section className="relation-grid">{invariantes.map(([titulo,descripcion])=><article className="relation-card" key={titulo}><h2>{titulo}</h2><p>{descripcion}</p></article>)}</section><section className="prose"><h2>Qué significa conformidad</h2><p>Una implementación solo puede declarar el nivel que demuestre mediante el conjunto de pruebas correspondiente. COBRIA es una propuesta independiente: no sustituye auditorías, certificaciones ni garantías de terceros.</p><p><a href="/recursos"><b>Descargar la especificación del ecosistema →</b></a></p></section></div></SiteFrame>;
}
