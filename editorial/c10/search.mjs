/** Búsqueda local: no envía consultas, no evalúa permisos ni mide relevancia humana. */
export const normalizar=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

export function crearIndice(curriculum,catalog,guide){
  return [
    ...catalog.items.map(item=>({kind:'Patrón',title:item.nombre,description:item.proposito,detail:item.familia,href:`/patrones/${item.slug}`})),
    ...curriculum.modules.flatMap(course=>course.lessons.map((lesson,index)=>({kind:'Lección',title:lesson.title,description:lesson.simple,detail:course.title,href:`/aprender/${course.key}/${index+1}`}))),
    ...curriculum.labs.map(lab=>({kind:'Laboratorio',title:lab.title,description:lab.objective,detail:lab.id,href:`/laboratorio#${lab.id.toLowerCase()}`})),
    ...curriculum.practices.map(practice=>({kind:'Práctica',title:practice.title,description:practice.rule,detail:practice.id,href:`/construir#practica-${practice.id.toLowerCase()}`})),
    ...guide.workshops.map(workshop=>({kind:'Taller',title:workshop.title,description:workshop.description,detail:'Recorrido ejecutable local',keywords:workshop.keywords,href:workshop.route}))
  ];
}

export function buscar(items,query='',kind='Todos'){
  const words=normalizar(query).split(/\s+/).filter(Boolean);
  return items.filter(item=>(kind==='Todos'||item.kind===kind)&&words.every(word=>normalizar(`${item.title} ${item.description} ${item.detail} ${item.keywords??''}`).includes(word)));
}
