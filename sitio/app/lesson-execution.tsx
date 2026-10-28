import { CopyCode } from './copy-code';

export type LessonExecutionData = {
  cwd: string; command: string; expected: string;
  prerequisites: string[]; tests: string[]; troubleshooting: string[];
};

export function LessonExecution({execution}: {execution?: LessonExecutionData | null}) {
  if (!execution) return null;
  return <section className="lesson-execution">
    <h2>Práctica verificable</h2>
    <p>El fragmento anterior sirve para leer la idea. Este comando ejecuta su comprobación en la aplicación de referencia.</p>
    <p><strong>Directorio:</strong> {execution.cwd === '.' ? 'raíz de COBRIA' : execution.cwd}</p>
    <h3>Antes de ejecutar</h3><ul>{execution.prerequisites.map(value=><li key={value}>{value}</li>)}</ul>
    <CopyCode code={execution.command}/>
    <h3>Resultado esperado</h3><p className="execution-expected" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{execution.expected}</p>
    <h3>Si no coincide</h3><ul>{execution.troubleshooting.map(value=><li key={value}>{value}</li>)}</ul>
    <p><strong>Pruebas relacionadas:</strong> {execution.tests.join(' · ')}</p>
  </section>;
}
