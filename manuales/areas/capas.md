# Seguir una solicitud y cambiar una sola responsabilidad

La pantalla muestra un error genérico al enviar una cantidad cero. La regla sí está funcionando, pero la respuesta no explica el problema. Reescribir la vista, el caso de uso y el repositorio a la vez haría difícil saber qué corrección era necesaria.

## Antes de empezar

Reconoce composición, caso de uso y repositorio. Puedes abrir varios archivos sin confundir su ubicación con su responsabilidad.

## Vocabulario

- Presentación: Traduce un protocolo a entradas y salidas de la aplicación.
- Caso de uso: Coordina una intención y sus dependencias.
- Dater: Traduce la representación lógica y física de datos.

## Resolver el problema

El controlador convierte el resultado del registro en estado 201. Cuando recibe un error conocido del dominio, lo convierte en un problema de entrada o permiso. El caso de uso autoriza y coordina; la entidad valida; el repositorio guarda. La traducción de un código a castellano pertenece a presentación, no al Dater.

El árbol real está en data/arquitectura.json. Consulta su propietario por archivo y sus pruebas relacionadas antes de editar. Una cadena de ejecución puede ir del controlador al caso de uso y de allí al repositorio; eso no autoriza que el dominio importe el controlador de vuelta. Las dependencias deben poder leerse sin recorrer ciclos.

## Seguir el ejemplo

1. Invoca el controlador con una solicitud autorizada.
2. Cambia solo la cantidad: observa el problema 400.
3. Conserva una entrada válida pero retira la capacidad: observa 403, no 201.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs capas
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function capas(cantidad = 3) {
  const app = crearAplicacion();
  const solicitud = { cuerpo: entrada(cantidad), contexto: contexto() };
  const correcta = await app.registrarController.ejecutar(solicitud);
  const invalida = await app.registrarController.ejecutar({
    cuerpo: entrada(0),
    contexto: { ...contexto(), claveIdempotencia: 'visita-cero' },
  });
  const prohibida = await app.registrarController.ejecutar({
    ...solicitud,
    contexto: { ...contexto(), permisos: [] },
  });
  assert.equal(correcta.estado, 201);
  assert.equal(invalida.estado, 400);
  assert.equal(prohibida.estado, 403);
  return {
    aceptada: correcta.estado,
    invalida: invalida.estado,
    denegada: prohibida.estado,
    mensaje: prohibida.cuerpo.mensaje,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "aceptada": 201,
  "invalida": 400,
  "denegada": 403
}
```

## Alternativa y costo

Un controlador mínimo puede bastar para una operación pequeña. No separes una clase adicional si solo cambia el nombre de una llamada y no protege una responsabilidad.

Cada frontera añade traducción y pruebas. Compensa cuando permite cambiar mensajes sin alterar reglas o adaptar datos sin contaminar el dominio.

## Caso adverso y recuperación

Cambiar la regla del dominio para que el controlador devuelva éxito con cero elimina una protección válida. Un 403 tampoco es necesariamente un defecto de la pantalla.

Reproduce entrada, contexto y respuesta por separado. Corrige el traductor si el código es correcto y el mensaje es malo; corrige la autorización solo si el requisito realmente concede esa capacidad.

## Tu ejercicio

Asigna estos cambios a archivos: traducir OBS_QUANTITY_INVALID, añadir un índice, cambiar una regla de cantidad y conectar otro repositorio. Dibuja sus imports permitidos.

## Solución explicada

El mensaje va en presentation/i18n/mensajes-es.mjs; el índice corresponde al adaptador del motor; la cantidad se protege en domain/observacion.mjs; el repositorio concreto se elige en composition.mjs. Aplicación depende del puerto; dominio no depende de ninguna de esas implementaciones.

## Revisar la entrega

- Cada cambio tiene un responsable distinto.
- El caso negativo conserva 400 y 403.
- El dibujo no introduce un ciclo.

## Continuar

Usa nombres y comentarios que permitan entender esas decisiones sin memorizar el diagrama.

Fuentes del proyecto:

- [arquitectura.json](../../replication/examples/ecosistema-app/data/arquitectura.json)
- [registrar-observacion-controller.mjs](../../replication/examples/ecosistema-app/src/presentation/registrar-observacion-controller.mjs)

