import dictionary from '../../replication/examples/ecosistema-app/data/diccionario-observaciones.json';
import catalogs from '../../replication/examples/ecosistema-app/data/catalogos-especies.json';

export function DataDictionary() {
  return <section className="manual-lesson data-dictionary" aria-labelledby="diccionario-local">
    <h2 id="diccionario-local">Diccionario del caso de la reserva</h2>
    <p>Este contrato local coincide con el Dater inicial. No es el esquema 3 de la referencia de gobernanza: las letras no tienen significado universal.</p>
    <div className="data-dictionary-table">
      <table><caption>Contrato {dictionary.id}, edición {dictionary.version}. Formatos físicos 1 y 2.</caption>
        <thead><tr><th scope="col">Nombre lógico</th><th scope="col">Clave</th><th scope="col">Desde formato</th><th scope="col">Regla</th></tr></thead>
        <tbody>{dictionary.fields.map(field=><tr key={field.logical}><th scope="row">{field.logical}</th><td><code>{field.physical}</code></td><td>{field.since}</td><td>{field.rule}</td></tr>)}</tbody>
      </table>
    </div>
    <h3>Un código y dos ediciones</h3>
    <ul>{catalogs.editions.map(edition=><li key={edition.version}>{edition.version}: {edition.values.map(value=>`${value.code} = ${value.label}`).join('; ')}.</li>)}</ul>
    <p>El formato 2 añade la edición del catálogo. El Dater original sigue escribiendo formato 1; la migración del taller no cambia automáticamente la aplicación.</p>
    <p>El taller usa memoria y archivos JSON: no crea nodos remotos ni índices. El filtro de ámbito no reemplaza la autorización del actor.</p>
  </section>;
}
