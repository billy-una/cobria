import workshop from '../../editorial/c7/workshop.json';
import { CopyCode } from './copy-code';

export function AnalyticsWorkshop(){
  return <section className="manual-lesson" id="taller-analitica-c7"><p className="lesson-label">Analítica e IA · Taller local C7</p><h2>{workshop.title}</h2><p>{workshop.intro}</p><p>Node.js 22.13 o superior. Desde la raíz del repositorio, sin instalar paquetes ni compartir datos con proveedores:</p><CopyCode code={workshop.command}/><ol>{workshop.steps.map(step=><li key={step}>{step}</li>)}</ol><h3>Comprobar las fronteras</h3><CopyCode code={workshop.testCommand}/><p>{workshop.checks}</p><h3>Evaluar también los desaciertos</h3><CopyCode code={workshop.evaluateCommand}/><p>El informe distingue métricas por consulta y por cita. Conserva los resultados de «colibri enfermo» y «ave pequeña que poliniza» como falso positivo y falso negativo; no son una prueba de calidad de un modelo real.</p><h3>Alcance y procedencia</h3><p>{workshop.limits}</p><p>Guía y fuentes: <code>{workshop.guide}</code> y <code>replication/examples/analitica-c7</code>. Esta página no envía documentos a un proveedor de IA.</p></section>;
}
