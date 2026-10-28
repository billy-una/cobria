import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export function parseBib(text){
  const entries=[];let cursor=0;
  function braced(start){let depth=1,i=start+1;for(;i<text.length;i++){if(text[i]==='\\'){i++;continue;}if(text[i]==='{')depth++;if(text[i]==='}'&&!--depth)return [text.slice(start+1,i),i+1];}throw Error('BibTeX sin cierre');}
  while(cursor<text.length){const hit=/@(\w+)\s*\{\s*([^,]+),/g;hit.lastIndex=cursor;const m=hit.exec(text);if(!m)break;let at=hit.lastIndex;const row={id:m[2].trim(),type:m[1].toLowerCase()};
    while(at<text.length){while(/[\s,]/.test(text[at]))at++;if(text[at]==='}'){at++;break;}const f=/^([\w-]+)\s*=\s*/.exec(text.slice(at));if(!f)throw Error(`Campo BibTeX inválido: ${row.id}`);at+=f[0].length;let value;if(text[at]==='{')[value,at]=braced(at);else{const raw=/^[^,}]+/.exec(text.slice(at));if(!raw)throw Error('Valor vacío');value=raw[0];at+=value.length;}row[f[1].toLowerCase()]=value.trim();}
    entries.push(row);cursor=at;
  }return entries;
}
export const plain=value=>(value??'').replace(/\\(["'`^~])\{?([a-zA-Z])\}?/g,(_,accent,c)=>(c+({'"':'\u0308',"'":'\u0301','`':'\u0300','^':'\u0302','~':'\u0303'}[accent])).normalize('NFC')).replace(/\\c\{c\}/g,'ç').replace(/\\L\{\}/g,'Ł').replace(/[{}]/g,'').replace(/--/g,'–').replace(/\s+/g,' ').trim();
export const readBib=()=>parseBib(fs.readFileSync(path.join(root,'referencias.bib'),'utf8'));
export function reference(row){
  const names=plain(row.author).split(' and ');const year=row.year??row.date?.slice(0,4)??'s. f.';
  return {id:row.id,title:plain(row.title),authors:names.join('; '),year,venue:plain(row.journaltitle??row.journal??row.booktitle??row.publisher??row.institution),doi:row.doi??null,url:row.url??(row.doi?'https://doi.org/'+row.doi:null),edition:row.edition??null,volume:row.volume??null,issue:row.number??null,pages:plain(row.pages??row.eid),note:plain(row.note)};
}
