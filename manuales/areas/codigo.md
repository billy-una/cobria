# Nombrar valores y conservar su significado

El número de una fecha viaja entre dos funciones y alguien lo divide por mil. El programa no se cae: muestra una fecha de 1970. Un comentario que diga convertir fecha no evita el fallo porque nunca explicó la unidad que debía conservarse.

## Antes de empezar

Sabes leer una función y distinguir texto y número. La entidad ya valida la fecha antes de llegar al ejemplo.

## Vocabulario

- Unidad: Escala que da significado a una magnitud, como milisegundos.
- Código de error: Identificador estable que una interfaz puede traducir.
- Comentario de intención: Explicación del motivo de una decisión, no repetición de la instrucción.

## Resolver el problema

Compara const x = Date.parse(fecha) con const instanteMs = Date.parse(observacion.observadaEn). La segunda forma hace visible la unidad. Date recibe milisegundos; volver a crear la fecha con instanteMs conserva el instante. El comentario explica por qué dividir por mil sería incorrecto en esta frontera.

Mantén códigos como OBS_QUANTITY_INVALID separados del texto que lee la persona. Puedes mejorar la redacción sin romper una prueba que compara el código. En este proyecto los nombres del dominio están en español; las palabras reservadas de JavaScript y nombres de bibliotecas conservan su forma. No traduzcas contratos externos improvisando otro protocolo.

## Seguir el ejemplo

1. Construye una observación válida y convierte su fecha a milisegundos.
2. Reconstruye el mismo instante UTC y compáralo con el original.
3. Provoca el cambio de unidad y verifica que ya no representa la misma fecha.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs codigo
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function codigo(cantidad = 3) {
  const observacion = new Observacion(entrada(cantidad));
  const instanteMs = Date.parse(observacion.observadaEn);
  // Date recibe milisegundos. Dividir por 1000 aquí cambiaría la unidad.
  const fechaUtc = new Date(instanteMs).toISOString();
  const descripcion = `${observacion.especie}: ${observacion.cantidad} (${fechaUtc})`;
  assert.equal(fechaUtc, observacion.observadaEn);
  assert.notEqual(new Date(instanteMs / 1000).toISOString(), fechaUtc);
  return { descripcion, errorCantidad: traducirErrorEs('OBS_QUANTITY_INVALID') };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "errorCantidad": "La cantidad debe ser positiva."
}
```

## Alternativa y costo

Un valor fecha ISO puede circular sin conversión numérica cuando no hay cálculo temporal. Evita transformar y volver a transformar solo para añadir una utilidad.

Nombres más explícitos ocupan espacio, pero reducen supuestos. Un comentario desactualizado puede ser peor que ninguno; la prueba debe conservar la relación temporal.

## Caso adverso y recuperación

instanteMs / 1000 es válido como aritmética, pero incorrecto como entrada de este constructor de Date. No basta con comprobar que el resultado sea una cadena.

Devuelve milisegundos a la frontera y compara el instante esperado. Anota la unidad donde entra y sale; no ajustes la expectativa a una fecha equivocada.

## Tu ejercicio

Refactoriza en una copia un nombre ambiguo como x a instanteMs. Escribe el comentario de intención y una prueba que falle si se introduce la división por mil.

## Solución explicada

El antes oculta la unidad; el después la conserva en el nombre y en la llamada new Date(instanteMs). La prueba compara ISO con el instante validado y añade una desigualdad para la división incorrecta. No hace falta un comentario por cada asignación ni una clase de fechas para esta única conversión.

## Revisar la entrega

- El cambio no altera la salida correcta.
- La prueba detecta el error de unidad.
- El comentario explica el porqué y conserva el código del error.

## Continuar

Conserva también el significado cuando el documento se traduzca a atributos físicos.

Fuentes del proyecto:

- [COMENTARIOS-Y-DOCSTRINGS.md](../../specification/phase-6/COMENTARIOS-Y-DOCSTRINGS.md)
- [mensajes-es.mjs](../../replication/examples/ecosistema-app/src/presentation/i18n/mensajes-es.mjs)

