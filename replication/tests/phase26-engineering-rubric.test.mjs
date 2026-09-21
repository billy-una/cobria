import test from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs'; import {validateEngineeringRubric,blankAssessment} from '../src/engineering-rubric.mjs';
const rubric=JSON.parse(fs.readFileSync('../specification/phase-26/engineering-dimensional-rubric.json','utf8'));
test('la rúbrica contiene ocho contratos y veinticuatro dimensiones',()=>{const result=validateEngineeringRubric(rubric); assert.equal(result.valid,true); assert.deepEqual(result.summary,{contracts:8,dimensions:24});});
test('la plantilla no inventa decisiones ni certificación',()=>{const result=blankAssessment(rubric); assert.equal(result.officialCertification,false); assert.equal(result.contracts.flatMap(item=>item.dimensions).every(item=>item.decision===null),true);});
test('rechaza una rúbrica que se presenta como certificación',()=>{const invalid=structuredClone(rubric); invalid.officialCertification=true; assert.equal(validateEngineeringRubric(invalid).valid,false);});
