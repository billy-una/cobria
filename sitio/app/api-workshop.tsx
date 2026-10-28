import workshop from '../../editorial/c5/workshop.json';
import { CopyCode } from './copy-code';

export function ApiWorkshop() {
  return <section className="manual-lesson" id="taller-api-c5"><p className="lesson-label">Taller local ejecutable · C5</p><h2>{workshop.title}</h2><p>{workshop.intro}</p><p>Requiere Node.js 22.13 o superior. Ejecute desde la raíz del repositorio; no instala paquetes ni conecta servicios externos.</p><CopyCode code={workshop.command}/><ol>{workshop.steps.map(step=><li key={step}>{step}</li>)}</ol><h3>Controles del recorrido</h3><ul>{workshop.controls.map(control=><li key={control}>{control}</li>)}</ul><h3>Comprobar aceptación y rechazo</h3><CopyCode code={workshop.testCommand}/><p>Doce pruebas HTTP locales. La revisión de navegador es un paso separado que requiere Playwright.</p><h3>Alcance y privacidad</h3><p>{workshop.limits}</p><p>Guía y fuentes en el repositorio: <code>{workshop.guide}</code> y <code>replication/examples/api-ux-c5</code>. La web enseña a ejecutar el taller; no abre una API de datos públicos.</p></section>;
}
