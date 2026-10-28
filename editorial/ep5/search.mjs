import {buscar,crearIndice} from '../c10/search.mjs';
export {buscar};
export function learningIndex(curriculum,catalog,guide,areas,initial,project){
  return [...crearIndice(curriculum,catalog,guide),
    ...areas.areas.map(area=>({kind:'Caso desarrollado',title:area.title,description:area.problem,detail:curriculum.modules.find(m=>m.key===area.key).title,keywords:[area.prerequisites,...area.reasoning,area.exercise,area.solution,...area.vocabulary.flat()].join(' '),href:`${curriculum.modules.find(m=>m.key===area.key).route}#caso-desarrollado`})),
    ...initial.units.map(unit=>({kind:'Unidad inicial',title:unit.title,description:unit.paragraphs.join(' '),detail:'Desde cero',keywords:unit.exercise+' '+unit.solution,href:`/comenzar/desde-cero#unidad-${unit.id}`})),
    {kind:'Proyecto',title:project.title,description:'Memoria, API, catálogo, permisos, PouchDB, analítica y reconstrucción de la misma observación.',detail:'Programa JavaScript completo',keywords:project.sections.flatMap(s=>s.blocks.map(b=>b.text)).join(' '),href:'/comenzar/proyecto-integral'}
  ];
}
