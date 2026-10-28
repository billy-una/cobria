import entries from '../../editorial/ecosistema-15-16/entry-points.json';

export function EntryPoints(){
  return <section className="entry-points" aria-labelledby="entradas-por-necesidad">
    <p className="eyebrow">Elige tu entrada</p><h2 id="entradas-por-necesidad">No hace falta leerlo todo para resolver tu siguiente problema.</h2>
    <h3>Según tu punto de partida</h3><div className="entry-grid">{entries.levels.map(item=><a href={item.href} key={item.href}><strong>{item.title}</strong><span>{item.description}</span></a>)}</div>
    <h3>Según lo que necesitas resolver</h3><div className="entry-grid">{entries.problems.map(item=><a href={item.href} key={item.href}><strong>{item.title}</strong><span>{item.description}</span></a>)}</div>
    <p>¿Buscas un término concreto? <a href="/explorar">Buscar en lecciones, patrones y talleres</a>.</p>
  </section>;
}
