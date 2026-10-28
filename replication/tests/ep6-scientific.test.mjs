import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const root=new URL('../../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
test('EP6 deriva afirmaciones de crudos sin reinterpretar PC3',()=>{
  const result=spawnSync(process.execPath,['editorial/ep6/build.mjs','--check'],{cwd:root,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  const matrix=JSON.parse(read('editorial/ep6/traceability.json'));
  assert.equal(matrix.observationsR7,270);assert.equal(matrix.claims.length,9);
  for(const claim of matrix.claims){assert.ok(claim.kind);assert.ok(claim.threat);for(const source of claim.sources)assert.ok(matrix.sourceSha256[source]);}
});
test('EP6 artículo y maestro comparten resumen y conclusión',()=>{
  for(const file of ['main.tex','articulo-cobria.tex']){assert.match(read(file),/\\input\{editorial\/ep6\/synthesis.tex\}/);assert.match(read(file),/\\COBRIAResumenCientifico/);}
  assert.match(read('articulo-cobria.tex'),/\\COBRIAConclusionCientifica/);
  assert.match(read('partes/parte-vii-sintesis-nosql.tex'),/\\COBRIAConclusionCientifica/);
});
test('EP6 el artículo conserva los diez invariantes de Core sin reformar la norma',()=>{
  const section=read('articulo-cobria.tex').split('Core 1.0 declara diez invariantes')[1].split('\\end{enumerate}')[0];
  assert.equal((section.match(/\\item/g)||[]).length,10);
  assert.match(section,/idempotencia/);assert.match(section,/fallo cerrado/);
});
test('EP6 antecedentes embebidos quedan fuera de la narrativa de resultados vigentes',()=>{
  const main=read('main.tex');assert.ok(main.indexOf('\\input{partes/antecedente-evaluacion-embebida}')>main.indexOf('\\input{partes/parte-viii-manual-replica-nosql}'));
  assert.match(read('partes/antecedente-evaluacion-embebida.tex'),/No son resultados PC3/);
  assert.doesNotMatch(read('partes/parte-vi-evaluacion-nosql.tex'),/HN1--HN4 quedan apoyadas/);
});
test('EP6 límites compartidos cubren lectura nativa, CAS, IA y análisis distintos',()=>{
  const synthesis=read('editorial/ep6/synthesis.tex');
  for(const marker of ['filtra en el cliente','alias persistido mediante CAS','no la respuesta de un LLM','prueba exacta bilateral de signos','PC3 carece de observaciones confirmatorias nuevas'])assert.ok(synthesis.includes(marker),marker);
  assert.doesNotMatch(read('articulo-cobria.tex'),/R7 evalúa estas hipótesis|Todos los registros superaron los contratos/);
});
test('EP6 el manuscrito no expone nombres de los proyectos observados',()=>{
  for(const file of ['main.tex','articulo-cobria.tex','editorial/ep6/synthesis.tex','editorial/ep6/evidence-table.tex'])assert.doesNotMatch(read(file),/bshandball|crmhotel|posguapiles|\/Users\//i);
  assert.match(read('review/blind-article.tex'),/\\def\{?\\blindreview\}?\{1\}/);
});
