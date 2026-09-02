import test from "node:test";import assert from "node:assert/strict";import {recommend} from "../src/decision-matrix.mjs";
test("recomienda índice cuando una copia no se justifica",()=>assert.match(recommend({readsPerWrite:2}).alternative,/Índice/));
test("recomienda C3 ante ámbitos y auditoría",()=>{const x=recommend({readsPerWrite:30,freshnessMinutes:5,scopes:8,audit:true});assert.equal(x.level,"C3");assert.ok(x.patterns.includes("Manifiesto de proyección"));});

