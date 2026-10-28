# Responder con evidencia y abstenerse cuando falta

Una consulta pregunta por tucanes cuando solo hay colibríes. Inventar un resultado sería más vistoso que reconocer la ausencia de datos, pero no ayudaría a la brigada. Una respuesta también puede ser peligrosa si usa evidencia de otra reserva o de un momento posterior al corte evaluado.

## Antes de empezar

Comprende consulta autorizada, revisión, huella y diferencia entre fuente y representación derivada.

## Vocabulario

- Procedencia: Hilo que relaciona un resultado con sus fuentes y transformación.
- Fuga: Información indebida que llega a entrenamiento, evaluación o recuperación.
- Abstención: Decisión de no responder sin evidencia suficiente.

## Resolver el problema

El asistente del taller primero autoriza el ámbito, valida el corpus y recupera coincidencias léxicas. Devuelve citas con identidad, revisión y huella. Si no hay coincidencias suficientes, se abstiene. No llama a un modelo generativo, no aprende de los ejemplos y no convierte una coincidencia de palabras en una afirmación biológica validada.

Para minería de datos declara entidad, tiempo observado y tiempo conocido. El taller C7 crea conjuntos con cortes y rechaza entidades compartidas entre entrenamiento y evaluación. Versiona características y conserva exclusiones. Una división aleatoria de filas puede filtrar la misma entidad a ambos lados; más filas no corrigen esa dependencia.

Una herramienta de agente necesita una capacidad permitida y argumentos validados por el servidor. El texto recuperado sigue siendo evidencia, no instrucciones para ampliar permisos. La salida analítica y la respuesta del asistente no ganan autoridad de escritura sobre el hecho original.

## Seguir el ejemplo

1. Registra una observación y consulta colibri dentro del ámbito.
2. Comprueba identidad y revisión de la cita.
3. Consulta tucan y observa abstención sin conceder escritura.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs ia
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function ia(cantidad = 3) {
  const app = crearAplicacion();
  await app.registrar.ejecutar(entrada(cantidad), contexto());
  const consultar = crearAsistente({ repositorio: app.repositorio });
  const evidencia = await consultar(
    { consulta: 'colibri', ambito: 'reserva-sur' },
    contexto(),
  );
  const ausente = await consultar(
    { consulta: 'tucan', ambito: 'reserva-sur' },
    contexto(),
  );
  assert.equal(evidencia.citas[0].id, 'obs-area-001');
  assert.equal(ausente.estado, 'abstencion');
  assert.equal(evidencia.autoridadEscritura, false);
  return {
    citas: evidencia.citas.length,
    revision: evidencia.citas[0].revision,
    sinEvidencia: ausente.estado,
    tipo: evidencia.tipo,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "citas": 1,
  "revision": 1,
  "sinEvidencia": "abstencion",
  "tipo": "recuperacion-lexica-sin-generacion"
}
```

## Alternativa y costo

Una lista autorizada de documentos puede ser más útil que un resumen generado cuando la evidencia es escasa. No necesitas un LLM para mostrar fuentes.

Vectores, modelos y características añaden versiones, almacenamiento y evaluación. Un umbral léxico no equivale a confianza calibrada de una predicción.

## Caso adverso y recuperación

La coincidencia colibri enfermo puede citar colibri aunque la fuente no sostenga enfermo. El taller conserva ese desacierto: una cita existente no prueba que respalde toda la frase.

Abstente o muestra la evidencia sin añadir el atributo no sustentado. Revisa por separado recuperación, soporte de citas y generación; no ocultes el fallo cambiando solamente el texto de presentación.

## Tu ejercicio

Diseña dos filas de entrenamiento y dos de evaluación sin compartir entidad. Añade un dato conocido después del corte y explica su exclusión; plantea una consulta que deba abstenerse.

## Solución explicada

Cada partición usa entidades distintas y tiempos válidos explícitos. El dato tardío no entra retrospectivamente al entrenamiento aunque su observación sea anterior. La consulta de una especie ausente debe abstenerse y devolver cero citas, no una predicción improvisada. Conserva versión de característica, cortes y fuentes para reproducir el conjunto.

## Revisar la entrega

- Se distingue recuperación de generación.
- Las citas conservan ámbito, identidad y revisión.
- La partición y el dato tardío no introducen fuga.

## Continuar

Integra lo aprendido en entregas incrementales del mismo proyecto, no en prototipos inconexos.

Fuentes del proyecto:

- [taller.mjs](../../replication/examples/analitica-c7/taller.mjs)
- [fixtures.json](../../replication/examples/analitica-c7/fixtures.json)
- [32-analitica-e-ia-con-procedencia.md](../../manuales/32-analitica-e-ia-con-procedencia.md)

