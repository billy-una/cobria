# Reconstruir un resumen sin cambiar los hechos

El resumen muestra noventa y nueve colibríes, pero la observación original registra tres. Corregir el documento original para que coincida con el resumen convertiría una copia averiada en autoridad. La reparación debe partir del hecho y conservar su reserva.

## Antes de empezar

Distingue documento lógico, representación física, revisión y ámbito. Lee el Core para las obligaciones normativas, no la analogía del libro.

## Vocabulario

- Canónico: Representación con autoridad para el hecho.
- Proyección: Representación derivada para una pregunta concreta.
- Equivalencia: Criterio declarado para comparar dos resultados.

## Resolver el problema

La aplicación registra mediante su caso de uso y construye un resumen por especie desde los documentos canónicos. El ensayo altera deliberadamente solo la copia derivada y vuelve a reconstruir. La comparación comprueba igualdad del resultado anterior y posterior para este conjunto pequeño. No demuestra equivalencia universal ni todos los requisitos de conformidad.

En un despliegue real se necesita además declarar fuentes, transformación, corte, revisión y regla de publicación. Un resumen igual en memoria no demuestra que lectores distribuidos vean una versión indivisible. Core 1.0 conserva su autoridad: este ejemplo ilustra una responsabilidad, no amplía la norma con cada recomendación del manual.

## Seguir el ejemplo

1. Guarda el hecho autorizado y construye el resumen.
2. Altera la copia derivada en el ensayo aislado, no el documento.
3. Reconstruye y compara; intenta otra reserva y espera rechazo.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs core
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function core(cantidad = 3) {
  const app = crearAplicacion(),
    actor = contexto();
  await app.registrar.ejecutar(entrada(cantidad), actor);
  const antes = await app.reconstruir.ejecutar('reserva-sur', actor);
  // Corrupción deliberada de la copia derivada, solo dentro de este ensayo.
  await app.proyecciones.publicar('reserva-sur', { conteos: { colibri: 99 } });
  const reparada = await app.reconstruir.ejecutar('reserva-sur', actor);
  assert.deepEqual(reparada, antes);
  assert.equal(
    (await app.listar.ejecutar({ ambito: 'reserva-sur' }, actor)).items[0].cantidad,
    cantidad,
  );
  await assert.rejects(() => app.reconstruir.ejecutar('reserva-norte', actor), {
    codigo: 'ACCESS_DENIED',
  });
  return {
    canonico: cantidad,
    reconstruida: reparada.conteos.colibri,
    equivalenciaDelCaso: true,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "canonico": 3,
  "reconstruida": 3,
  "equivalenciaDelCaso": true
}
```

## Alternativa y costo

Lee el documento directamente si la consulta es sencilla y su costo cumple el requisito. Una proyección introduce otra pieza que verificar y retirar.

Reconstruir todo lee las fuentes y consume tiempo. Con varias especies, el ejemplo vuelve a filtrar por cada especie: no debe venderse como implementación óptima universal.

## Caso adverso y recuperación

Publicar una copia con conteo correcto en una reserva equivocada sigue siendo incorrecto. La igualdad de un número no reemplaza ámbito, procedencia y autorización.

Conserva la evidencia de la copia incorrecta, vuelve a las fuentes autorizadas y publica solo tras comprobar el contrato. No edites la fuente para ocultar la divergencia.

## Tu ejercicio

Escribe un criterio de equivalencia para un resumen con colibríes y ranas. Distingue campos que deben coincidir de metadatos que pueden cambiar al reconstruir.

## Solución explicada

Deben coincidir ámbito, especies y totales para el mismo corte de fuentes. Un instante de construcción puede variar si el contrato lo permite; la transformación y su versión deben quedar identificadas. El criterio debe rechazar una especie omitida aunque coincida el total general. Para conformidad completa usa la especificación y sus pruebas, no solo este caso.

## Revisar la entrega

- Se conserva autoridad canónica.
- La equivalencia incluye ámbito y contenido.
- No se declara conformidad completa por una igualdad local.

## Continuar

Elige un mecanismo por su problema y garantías, no por el prestigio de su nombre.

Fuentes del proyecto:

- [COBRIA-CORE-1.0.md](../../specification/COBRIA-CORE-1.0.md)
- [reconstruir-resumen.mjs](../../replication/examples/ecosistema-app/src/application/reconstruir-resumen.mjs)

