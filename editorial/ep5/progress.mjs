/** Marcas voluntarias de lectura; nunca prueba de comprensión o conformidad. */
export const storageKey='cobria.aprendizaje.v1';
export function lessonsOf(curriculum){return curriculum.modules.flatMap(module=>module.lessons.map((lesson,index)=>({id:`${module.key}:${index+1}:${lesson.title}`,title:lesson.title,module:module.title,href:`/aprender/${module.key}/${index+1}`})));}
export function readProgress(raw,allowed){
  if(typeof raw!=='string'||raw.length>64000)return [];
  try{const value=JSON.parse(raw);if(value.version!==1||!Array.isArray(value.completed))return [];
    const valid=new Set(allowed);return [...new Set(value.completed.filter(id=>typeof id==='string'&&valid.has(id)))];
  }catch{return [];}
}
export function toggleProgress(raw,id,allowed){
  if(!allowed.includes(id))throw Error('Lección desconocida');
  const completed=new Set(readProgress(raw,allowed));
  if(completed.has(id))completed.delete(id);else completed.add(id);
  return JSON.stringify({version:1,completed:[...completed]});
}
