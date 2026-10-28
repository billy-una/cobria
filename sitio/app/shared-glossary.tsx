import Link from 'next/link';
import glossary from '../../editorial/glossary.json';
export function SharedGlossary(){
  return <section id="glosario" className="shared-glossary">
    <h2>Glosario del libro</h2><p>Las mismas dieciocho definiciones breves para volver a orientarse. Son ayudas de lectura, no requisitos nuevos de Core.</p>
    <dl>{glossary.map(([term,definition])=><div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl>
    <p><Link href="/core">Consultar Core y sus límites</Link> · <Link href="/recursos">Abrir el libro y los recursos</Link></p>
  </section>;
}
