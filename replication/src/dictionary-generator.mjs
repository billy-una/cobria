import fs from 'node:fs/promises';
import path from 'node:path';
import {EXIT,comprobarDestino} from './toolkit.mjs';

/** Diccionario inicial editable; no decide claves físicas ni crea índices de un motor. */
export async function generateDictionary({name,directory,simulate=false}){
  if(typeof name!=='string'||!/^[A-Za-z][A-Za-z0-9_-]{1,63}$/.test(name))throw Object.assign(new Error('Use un nombre latino de 2–64 caracteres, sin rutas.'),{code:'CLI_DICTIONARY_NAME_INVALID',exit:EXIT.USAGE});
  const root=path.resolve(directory),relative=`data/diccionario-${name.toLowerCase()}.json`;
  const payload={id:name,version:'0.1.0',status:'propuesto',owner:'POR-DEFINIR',authority:'contrato local por revisar; no certificación Core',identity:['ambito','id'],fields:[
    {logical:'id',physical:null,type:'string',required:true,meaning:'Identidad estable dentro del ámbito',origin:'registro',sensitivity:'interna'},
    {logical:'ambito',physical:null,type:'string',required:true,meaning:'Límite autorizado antes del acceso',origin:'contexto autorizado',sensitivity:'restringida'},
    {logical:'revision',physical:null,type:'integer',required:true,meaning:'Revisión monotónica del hecho',origin:'control de cambios',sensitivity:'interna'},
    {logical:'versionEsquema',physical:null,type:'integer',required:true,meaning:'Versión del formato, distinta de la revisión',origin:'Dater',sensitivity:'interna'}
  ],catalogs:[],queries:[],retention:null,provenance:'Definir fuentes y finalidad antes de usar datos reales',pending:['Mapear claves solo en Dater','Definir reglas y ejemplos del dominio','Declarar consultas, índices y presupuesto','Aprobar privacidad, retención y migración']};
  const file=path.join(root,relative),content=JSON.stringify(payload,null,2)+'\n';
  await comprobarDestino(root,[file]);
  const current=await fs.readFile(file,'utf8').catch(error=>{if(error.code==='ENOENT')return null;throw error;});
  if(current!==null&&current!==content)throw Object.assign(new Error('El diccionario contiene cambios; no se sobrescribió.'),{code:'CLI_GENERATOR_CONFLICT',exit:EXIT.CONFLICT});
  if(simulate)return {status:'simulated',mutations:0,planned:[relative],created:[]};
  if(current===content)return {status:'unchanged',created:[],unchanged:[relative]};
  await fs.mkdir(path.dirname(file),{recursive:true});
  await fs.writeFile(file,content,{flag:'wx'});
  return {status:'generated',created:[relative],limitations:payload.pending};
}
