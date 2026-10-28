import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { ErrorPatron, ejecutarPatron, implementaciones, type Entrada } from "../src/patrones.js";

type Caso = {
  id: number;
  valid: Entrada;
  expected: Entrada;
  invalid: Entrada;
  errorCode?: string;
  negativeExpected?: Entrada;
};

const casos = JSON.parse(readFileSync(new URL("../../cases.json", import.meta.url), "utf8")) as Caso[];

function verificarParcial(actual: unknown, esperado: unknown): void {
  if (Array.isArray(esperado)) {
    assert.ok(Array.isArray(actual));
    assert.equal(actual.length, esperado.length);
    esperado.forEach((valor, indice) => verificarParcial(actual[indice], valor));
    return;
  }
  if (esperado !== null && typeof esperado === "object") {
    assert.ok(actual !== null && typeof actual === "object");
    for (const [clave, valor] of Object.entries(esperado)) {
      verificarParcial((actual as Entrada)[clave], valor);
    }
    return;
  }
  assert.deepEqual(actual, esperado);
}

test("la referencia publica exactamente treinta implementaciones", () => {
  assert.equal(casos.length, 30);
  assert.deepEqual(Object.keys(implementaciones).map(Number), Array.from({ length: 30 }, (_, i) => i + 1));
});

for (const caso of casos) {
  test(`patrón ${caso.id}: acepta el caso conforme`, () => {
    verificarParcial(ejecutarPatron(caso.id, structuredClone(caso.valid)), caso.expected);
  });

  test(`patrón ${caso.id}: rechaza o contiene el caso adverso`, () => {
    if (caso.errorCode) {
      assert.throws(
        () => ejecutarPatron(caso.id, structuredClone(caso.invalid)),
        (error: unknown) => error instanceof ErrorPatron && error.codigo === caso.errorCode,
      );
      return;
    }
    assert.ok(caso.negativeExpected);
    verificarParcial(ejecutarPatron(caso.id, structuredClone(caso.invalid)), caso.negativeExpected);
  });
}
