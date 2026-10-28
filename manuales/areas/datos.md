# Diseñar el diccionario y evolucionar un documento

La reserva añade una edición del catálogo y los documentos antiguos siguen existiendo. Si se reemplaza la etiqueta sin conservar la edición, una consulta histórica podría interpretar la observación con un significado posterior. Añadir una letra física no debería cambiar silenciosamente la cantidad observada.

## Antes de empezar

Comprende identidad, ámbito, revisión y objeto. Las letras físicas no deben convertirse en nombres del dominio.

## Vocabulario

- Diccionario: Definición de campos, tipos, reglas, propietario y versiones.
- Catálogo: Conjunto versionado de códigos y significados permitidos.
- Migración: Transformación explícita entre formatos compatibles con un propósito.

## Resolver el problema

Empieza por el significado: identifica la observación, su reserva, revisión, instante, especie y cantidad. Después declara tipos, nulabilidad, límites y quién puede escribirlos. El diccionario local asigna a a identidad, b a ámbito, c a revisión, d a formato, e a instante, f a especie y g a cantidad. Es una convención de esta aplicación, no un alfabeto universal.

El Dater traduce; el dominio sigue leyendo cantidad. El formato dos añade h para la edición del catálogo en la frontera de datos. La migración requiere que se declare esa edición: no la adivina. Repetir la migración conserva el resultado, mientras revisión uno sigue siendo la versión del hecho y no la del formato.

Separa nodos por propiedad y patrón de acceso. Un catálogo compartido y versionado no debe duplicarse editable en cada observación; una proyección puede incluir su etiqueta con procedencia. La consulta del taller filtra y ordena en memoria: recorre N documentos y puede ordenar M candidatos. No crea un índice real ni prueba el rendimiento de un motor.

## Seguir el ejemplo

1. Traduce la entidad con el Dater, sin cambiar nombres del dominio.
2. Migra declarando 2026.1 y lee el documento con su edición.
3. Repite la migración y prueba el rechazo cuando falta la edición.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs datos
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function datos(cantidad = 3) {
  const dater = new ObservacionDater();
  const documento = dater.haciaFisico(new Observacion(entrada(cantidad)));
  const migrado = migrarObservacion(documento, '2026.1');
  const leido = leerObservacionVersionada(migrado);
  assert.equal(leido.observacion.cantidad, cantidad);
  assert.equal(leido.observacion.revision, 1);
  assert.throws(() => migrarObservacion(documento), { codigo: 'CAT_VERSION_REQUIRED' });
  assert.deepEqual(migrarObservacion(migrado, '2026.1'), migrado);
  return {
    cantidad: leido.observacion.cantidad,
    revision: leido.observacion.revision,
    catalogo: leido.catalogoVersion,
    etiqueta: leido.clasificacion.etiqueta,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "cantidad": 3,
  "revision": 1,
  "catalogo": "2026.1",
  "etiqueta": "Colibrí"
}
```

## Alternativa y costo

Usa nombres físicos largos si facilitan operar el almacén y el ahorro no se ha medido. Un código compacto no es automáticamente más rápido ni más fácil de mantener.

Conservar ediciones exige almacenamiento y políticas de retención. Un índice por ámbito y fecha añade mantenimiento; solo se justifica por la consulta y su costo medido.

## Caso adverso y recuperación

Omitir la edición produce CAT_VERSION_REQUIRED. Usar el formato como si fuera revisión confundiría una transformación técnica con un cambio del hecho.

Obtén la edición histórica de una fuente autorizada antes de migrar. Si no se conoce, conserva el documento para revisión; no le asignes la edición más reciente para lograr éxito.

## Tu ejercicio

Diseña un campo opcional observadorAnonimo sin datos personales. Entrega diccionario, dueño, nulabilidad, nodo, consulta afectada y propuesta de compatibilidad; no añadas una letra arbitraria al dominio.

## Solución explicada

El diccionario debe explicar un identificador sintético, finalidad y retención. Propón un formato nuevo si cambia el sobre físico y conserva lectura de formatos anteriores. El campo no sustituye actorId ni concede permisos. Antes de escribir código, identifica dónde se traduce y qué pasa con documentos que no lo tienen.

## Revisar la entrega

- Revisión y formato tienen significados separados.
- Se declara catálogo histórico y responsable.
- La propuesta no confunde consulta local con índice del motor.

## Continuar

Define qué documento manda y cómo comprobar la copia que resume esos hechos.

Fuentes del proyecto:

- [diccionario-observaciones.json](../../replication/examples/ecosistema-app/data/diccionario-observaciones.json)
- [taller-datos.mjs](../../replication/examples/ecosistema-app/src/infrastructure/data/taller-datos.mjs)

