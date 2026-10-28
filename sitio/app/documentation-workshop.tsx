import workshop from '../../editorial/c9/workshop.json';
import {CopyCode} from './copy-code';

export function DocumentationWorkshop(){
  return <section className="manual-lesson" id="taller-documentacion-c9"><p className="lesson-label">Documentación y herramientas · Recorrido local</p><h2>{workshop.title}</h2><p>{workshop.intro}</p><p>Desde la raíz, con Node.js 22.13 o superior:</p><CopyCode code={workshop.installCommand}/><CopyCode code={workshop.command}/><ol>{workshop.steps.map(step=><li key={step}>{step}</li>)}</ol><h3>Comprobar antes de confiar</h3><CopyCode code={workshop.testCommand}/><p>{workshop.checks}</p><h3>Qué debe completar una persona</h3><p>{workshop.limits}</p><p>Guía: <code>{workshop.guide}</code>. Decisión: <code>{workshop.decision}</code>. Recuperación: <code>{workshop.runbook}</code>.</p></section>;
}
