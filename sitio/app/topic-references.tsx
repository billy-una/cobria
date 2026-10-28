import literature from '../../editorial/ep7/references.json';

export function TopicReferences({kind}:{kind:string}){
  const keys=literature.moduleSources as Record<string,string[]>;
  const ids=keys[kind]??[];
  return <section className="manual-lesson" id="fuentes-externas"><h2>Fuentes para entender y contrastar</h2><p>Estas lecturas sitúan los mecanismos de esta parte; no certifican los ejemplos COBRIA. La selección es exploratoria y asistida, sin doble cribado independiente.</p>{ids.map(id=>{
    const row=literature.references.find(r=>r.id===id);
    if(!row)throw new Error(`Falta referencia ${id}`);
    return <section key={id}><h3><a href={row.url}>{row.title}</a></h3><p>{row.authors} ({row.year}). {row.venue}{row.volume ? ` · ${row.volume}` : ''}{row.issue ? `(${row.issue})` : ''}{row.pages ? `, ${row.pages}` : ''}{row.edition ? ` · edición ${row.edition}` : ''}.</p>{row.doi&&<p>DOI: <a href={`https://doi.org/${row.doi}`}>{row.doi}</a></p>}<p><strong>Tipo:</strong> {row.kind}. <strong>Alcance:</strong> {row.access}. {row.note}</p></section>;
  })}<p>La misma bibliografía alimenta artículo, maestro y libro. Fecha del registro: {literature.date}. Los títulos originales facilitan localizar las obras.</p></section>;
}
