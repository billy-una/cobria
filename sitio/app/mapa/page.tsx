import { SiteFrame } from "../site-frame";
import { SharedGlossary } from '../shared-glossary';
import {BookConnections} from '../book-connections';
export const metadata={title:"Mapa del ecosistema · COBRIA",description:"Relaciones entre fundamentos, capas, patrones, datos, calidad, operaciones, inteligencia artificial y evidencia.",alternates:{canonical:"/mapa"}};
const nodes=[
  ["Fundamentos","Nombra identidad, valor, regla, contrato y evidencia.","/fundamentos"],
  ["Capas","Separa presentación, aplicación, dominio, puertos e infraestructura.","/capas"],
  ["Patrones de diseño","Convierte tensiones recurrentes en decisiones comparables.","/patrones-diseno"],
  ["Datos y Core","Modela documentos; Core gobierna autoridad y reconstrucción.","/datos"],
  ["Calidad y seguridad","Prueba contratos, rechazos, límites y recuperación.","/calidad"],
  ["Nube y operaciones","Promueve artefactos, observa, revierte y retira.","/operaciones"],
  ["Analítica e IA","Conserva cortes, procedencia, ámbito y abstención.","/ia"],
  ["Evidencia","Separa propuestas, ejecuciones, historia y réplica externa.","/evidencia"],
];
export default function Page(){return <SiteFrame><div className="page-shell"><header><p className="eyebrow">Mapa de relaciones</p><h1>Del lenguaje a la evidencia.</h1><p className="lead">COBRIA no es una pila rígida. Es una red de decisiones: comienza por el problema, cruza las capas necesarias y termina con una prueba observable.</p></header><section className="relation-grid">{nodes.map(([t,d,h],i)=><article className="relation-card" key={t}><p className="eyebrow">Paso {i+1}</p><h2>{t}</h2><p>{d}</p><a href={h}><b>Abrir manual →</b></a></article>)}</section><BookConnections/><SharedGlossary/></div></SiteFrame>}
