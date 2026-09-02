import test from "node:test";
import assert from "node:assert/strict";
import { adversarialDataset } from "../src/adversarial-generator.mjs";
import { equivalentDocuments, oracleProjection } from "../src/oracle.mjs";

test("generador adversarial produce semillas distintas y casos difíciles", () => {
  const first = adversarialDataset({ seed: 1 });
  const second = adversarialDataset({ seed: 2 });
  assert.notDeepEqual(first, second);
  assert.ok(first.some(doc => doc.scope === "bosque-norte"));
  assert.ok(first.some(doc => typeof doc.value === "object"));
  assert.ok(first.some(doc => doc.schemaVersion === 2));
});

test("oráculo independiente rechaza una transformación alterada", () => {
  const source = [{ id: "a", scope: "sur", revision: 1, value: 4 }];
  const expected = oracleProjection(source, doc => ({ ...doc, value: doc.value * 2 }));
  const altered = oracleProjection(source, doc => ({ ...doc, value: doc.value * 3 }));
  assert.equal(equivalentDocuments(expected, expected), true);
  assert.equal(equivalentDocuments(expected, altered), false);
});
