import workshop from '../../editorial/c8/workshop.json';
import { CopyCode } from './copy-code';

export function IntegralWorkshop(){
  return <section className="manual-lesson" id="taller-integral-c8"><p className="lesson-label">Aplicación integral · Motor documental real local</p><h2>{workshop.title}</h2><p>{workshop.intro}</p><p>Node.js 22.13 o superior. Desde la raíz, instale las dependencias bloqueadas y abra el taller:</p><CopyCode code={workshop.installCommand}/><CopyCode code={workshop.command}/><ol>{workshop.steps.map(step=><li key={step}>{step}</li>)}</ol><h3>Comprobar el recorrido</h3><CopyCode code={workshop.testCommand}/><CopyCode code={workshop.verifyCommand}/><p>{workshop.checks}</p><h3>Límites que importan</h3><p>{workshop.limits}</p><p>Guía: <code>{workshop.guide}</code>. Esta página explica la aplicación; no abre el motor ni guarda observaciones en el sitio público.</p></section>;
}
