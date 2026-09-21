import { SiteFrame } from "../site-frame";
export const metadata={title:"Recursos abiertos · COBRIA",description:"Libro, cuaderno, artículo, documento maestro, especificación y evidencia reproducible de COBRIA."};
const docs=[
  ["Libro pedagógico","Patrones, capas, datos y software verificable.","/downloads/COBRIA-libro-web.pdf"],
  ["Cuaderno de trabajo","Ocho estaciones y laboratorios para aplicar COBRIA.","/downloads/COBRIA-cuaderno.pdf"],
  ["Artículo científico","Contribución, método, resultados y amenazas a la validez.","/downloads/COBRIA-articulo.pdf"],
  ["Documento maestro","Desarrollo metodológico y trazabilidad completa.","/downloads/COBRIA-documento-maestro.pdf"],
  ["Especificación del ecosistema","Alcance, autoridad, invariantes y conformidad.","/downloads/COBRIA-especificacion.pdf"],
  ["Anexo técnico","Transferencia, revisión y estado de las fases de investigación.","/downloads/COBRIA-anexo-tecnico.pdf"],
];
export default function Page(){return <SiteFrame><div className="page-shell"><header><p className="eyebrow">Recursos canónicos</p><h1>Lee, practica y verifica.</h1><p className="lead">Cada documento tiene una responsabilidad distinta. COBRIA es una propuesta independiente y abierta; los materiales no constituyen certificación oficial.</p></header><section className="resource-grid" aria-label="Documentos para descargar">{docs.map(([t,d,h],i)=><article className={`resource-card ${i===0?"featured":""}`} key={t}><p className="eyebrow">PDF · edición ecosistema 1.0</p><h2>{t}</h2><p>{d}</p><a href={h} download>Descargar PDF</a></article>)}</section><section className="prose"><h2>Material reproducible</h2><p>Los resultados, protocolos y contratos legibles por máquina se mantienen separados de los productos editoriales. Consulta <a href="/evidencia"><u>la página de evidencia</u></a> para distinguir lo ejecutado, histórico y pendiente.</p></section></div></SiteFrame>}
