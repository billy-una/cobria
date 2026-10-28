import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import catalog from "../../../public/catalogo.json";
import enriched from "../../../public/pattern-catalog.json";
import { CopyCode } from "../../copy-code";
import { SiteFrame } from "../../site-frame";

type Props = { params: Promise<{ slug: string }> };
const findPattern = (slug: string) => catalog.items.find(item => item.slug === slug);
function RelatedPatterns({names}:{names:string[]}){return <ul>{names.map(name=>{const match=catalog.items.find(item=>item.nombre===name);return <li key={name}>{match?<Link href={`/patrones/${match.slug}`}>{name}</Link>:name}</li>;})}</ul>;}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pattern = findPattern((await params).slug);
  if (!pattern) return { title: "Patrón no encontrado · COBRIA" };
  return { title: `${pattern.nombre} · Patrón COBRIA`, description: pattern.proposito, alternates: { canonical: `/patrones/${pattern.slug}` } };
}

export default async function PatternPage({ params }: Props) {
  const pattern = findPattern((await params).slug);
  if (!pattern) notFound();
  const detail = enriched.items.find(item => item.id === pattern.id)!;
  const evidence = <section aria-label="Evidencia ejecutable del patrón"><h2>Ejemplo ejecutable</h2><p>{detail.ejemplo.escena}: {detail.ejemplo.problema}</p><p>{detail.autoridad}</p><p>Desde la raíz del repositorio, instale las dependencias con <code>npm ci --prefix replication</code>. Requiere Node.js 22.13 o superior y acceso al registro de paquetes durante la instalación.</p><CopyCode code="npm test --prefix replication/examples/patterns-r4"/><p>Resultado esperado: casos conformes y adversos de los treinta patrones aprobados, junto con las regresiones PC1. El resumen del comando indica el conteo vigente.</p>{Object.entries(detail.codigo).map(([language, code]) => <section key={language}><h3>{language}</h3><CopyCode code={code}/></section>)}<h3>Entrada conforme y resultado esperado</h3><CopyCode code={JSON.stringify(detail.ejemplo.pruebaPositiva, null, 2)}/><h3>Entrada adversa y rechazo o abstención esperados</h3><CopyCode code={JSON.stringify(detail.ejemplo.pruebaNegativa, null, 2)}/><h3>Alternativa más sencilla</h3><p>{detail.decision.alternativa}. {detail.decision.criterio}</p><h3>Cuándo no usarlo</h3><p>{detail.cuandoEvitar}</p><h3>Costo que debe medir</h3><p>{detail.ejemplo.costo}</p><h3>Límite de esta demostración</h3><p>{detail.decision.limite}</p></section>;
  return <SiteFrame><div className="page-shell pattern-detail"><nav className="breadcrumbs" aria-label="Ruta"><Link href="/">Inicio</Link><span>/</span><Link href="/explorar">Patrones</Link><span>/</span><strong>{pattern.nombre}</strong></nav><article><header><p className="eyebrow">{pattern.familia} · Patrón {String(pattern.id).padStart(2,"0")}</p><h1>{pattern.nombre}</h1><p className="lead">{pattern.proposito}</p></header><section><h2>Problema que resuelve</h2><p>{pattern.problema}</p></section><section className="pattern-analogy"><h2>Analogía</h2><p>{pattern.analogia}</p></section><section><h2>Solución y contrato</h2><p>{pattern.solucion}</p><CopyCode code={pattern.contrato}/></section><section><h2>Cuándo aplicarlo</h2><p>{pattern.aplicacion}</p></section>{evidence}<section><h2>Práctica guiada</h2><p>{pattern.ejercicio}</p><ol><li>Prepare un caso válido.</li><li>Provoque un fallo controlado.</li><li>Conserve la evidencia.</li></ol></section><section><h2>Métricas y relaciones</h2><p>{pattern.metricas}</p><h3>Patrones relacionados</h3><RelatedPatterns names={pattern.relaciones}/></section><p><Link className="primary pattern-return" href="/explorar">Volver al catálogo interactivo</Link></p></article></div></SiteFrame>;
}
