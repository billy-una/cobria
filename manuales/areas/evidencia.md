# Conservar resultados sin exagerar su alcance

Una captura muestra todas las pruebas aprobadas, pero no dice con qué código ni configuración se obtuvieron. Otra persona cambia la cantidad y conserva la misma imagen. El resultado ya no representa los bytes que se distribuyen.

## Antes de empezar

Distingue documento, revisión, resultado de prueba y huella. El libro enseña; el artículo debe sostener afirmaciones con evidencia.

## Vocabulario

- Trazabilidad: Relación verificable entre afirmación, fuente, prueba y resultado.
- Reproducibilidad: Capacidad de repetir un procedimiento bajo condiciones declaradas.
- Amenaza a la validez: Razón por la que una conclusión puede no sostenerse en otro contexto.

## Resolver el problema

Una huella vincula un contenido con una identificación calculada. El caso conserva identidad y revisión de una entidad válida y muestra que un cambio de contenido altera su huella. Eso detecta diferencias si la referencia es confiable; no demuestra autoría, consentimiento, corrección del contenido ni independencia de quien revisó.

Separa estados: documentado, implementado, ejecutado localmente, repetido externamente y validado con personas. El artículo no puede convertir un microensayo en superioridad distribuida ni el libro convertir una rúbrica preparada en aprendizaje observado. Conserva resultados negativos, configuración, versión y límites. Si cambia un artefacto aprobado, identifica otra candidata y repite los controles afectados.

## Seguir el ejemplo

1. Calcula la huella del documento válido.
2. Comprueba que una copia equivalente conserva esa huella.
3. Cambia la cantidad y comprueba que ya no coincide con la referencia.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs evidencia
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function evidencia(cantidad = 3) {
  const fuente = new Observacion(entrada(cantidad));
  const huella = calcularHuellaSha256(fuente);
  assert.equal(calcularHuellaSha256({ ...fuente }), huella);
  assert.notEqual(calcularHuellaSha256({ ...fuente, cantidad: cantidad + 1 }), huella);
  return {
    id: fuente.id,
    revision: fuente.revision,
    huella,
    integridadNoEsAutoria: true,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "id": "obs-area-001",
  "revision": 1,
  "integridadNoEsAutoria": true
}
```

## Alternativa y costo

Para una nota personal puede bastar una versión y un archivo; para una afirmación pública necesitas poder relacionarla con las fuentes y resultados que la sostienen.

Guardar procedencia requiere espacio y disciplina. Un inventario enorme sin relación con las afirmaciones dificulta revisar tanto como una ausencia de evidencia.

## Caso adverso y recuperación

Un archivo modificado puede tener una huella correctamente calculada y seguir conteniendo un resultado inventado. La integridad no vuelve verdadera la afirmación.

Revisa de dónde proviene la referencia, repite el procedimiento y conserva su salida. Si no existe evidencia humana, marca pendiente en lugar de completar un registro ficticio.

## Tu ejercicio

Escribe una afirmación acotada de este taller y su fila de trazabilidad: fuente, prueba, salida, configuración, amenaza y documento que la publica.

## Solución explicada

Una afirmación defendible es que el caso secuencial de memoria conserva una observación al repetir la misma intención bajo la configuración declarada. La fila enlaza código, prueba y recibo, y advierte que no demuestra concurrencia ni motor remoto. Una revisión humana o eficacia pedagógica permanece pendiente hasta observarla realmente.

## Revisar la entrega

- La afirmación no supera la evidencia.
- Se distinguen integridad, autoría y verdad.
- Los cambios posteriores invalidan la aprobación afectada.

## Continuar

Vuelve al requisito inicial y conserva solo las decisiones cuyo beneficio puedes explicar y comprobar.

Fuentes del proyecto:

- [MATRIZ-TRAZABILIDAD-RELEASE.md](../../MATRIZ-TRAZABILIDAD-RELEASE.md)
- [LECTURA-PILOTO.md](../../editorial/ep2/LECTURA-PILOTO.md)
