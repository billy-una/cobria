import map from '../../replication/examples/ecosistema-app/data/arquitectura.json';

export function ArchitectureMap(){
  return <section className="manual-lesson architecture-map" aria-labelledby="mapa-capas">
    <h2 id="mapa-capas">El recorrido y sus responsabilidades</h2>
    <p>Las llamadas de ejecución y las dependencias del código son relaciones distintas. El caso de uso llama al repositorio que recibe, sin importar su clase concreta.</p>
    <table className="architecture-map-table"><caption>Cinco responsabilidades, no cinco servidores</caption>
      <thead><tr><th scope="col">Capa</th><th scope="col">Para qué existe</th></tr></thead>
      <tbody>{map.layers.map(layer=><tr key={layer.id}><th scope="row">{layer.name}</th><td>{layer.purpose}</td></tr>)}</tbody>
    </table>
    <h3>Seguir el registro</h3><ol>{map.flow.map(step=><li key={step.step}>{step.action}</li>)}</ol>
    <p>Importaciones: presentación hacia aplicación y dominio; aplicación hacia dominio; infraestructura hacia puertos y dominio; composición conecta implementaciones. El puerto es un contrato, no otra llamada de red.</p>
    <details><summary>Responsabilidad de los {map.files.length} archivos</summary><ul>{map.files.map(file=><li key={file.path}>
      <p><code>{file.path}</code></p><p>{file.responsibility}. No le corresponde: {file.notResponsibleFor}.</p>
      <p>Prueba relacionada: {file.proof.file} · {file.proof.name}.</p>
    </li>)}</ul></details>
    <h3>Límites de esta práctica</h3><ul>{map.limits.map(limit=><li key={limit}>{limit}</li>)}</ul>
    <p>El control estático reconoce importaciones, reexportaciones y ciclos; no demuestra semántica de negocio ni seguridad completa. Las fuentes virtuales inválidas solo se analizan, no se ejecutan.</p>
  </section>;
}
