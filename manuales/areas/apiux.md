# Conectar una respuesta verificable con el formulario

El formulario borra los datos cuando el servidor devuelve cantidad inválida. La persona debe escribir todo de nuevo y no sabe qué campo corregir. Si se muestra éxito ante cualquier respuesta recibida, un rechazo de permisos parece un registro válido.

## Antes de empezar

Entiende el controlador y los estados 201, 400 y 403. Una API es una interfaz entre programas; HTTP es uno de sus protocolos.

## Vocabulario

- Estado de interfaz: Situación visible como carga, éxito, vacío o error.
- Problema de API: Respuesta estructurada con código y explicación.
- Internacionalización: Separación del significado y su presentación según idioma.

## Resolver el problema

Recibir una respuesta de red no equivale a éxito del negocio. El controlador distingue registro creado, entrada inválida y acceso denegado. La interfaz del taller C5 conserva formulario, estado y mensajes. Lee public/app.js junto al servidor: una validación local ayuda a corregir, pero el backend sigue siendo autoritativo.

Especifica qué pasa durante carga, envío repetido, error recuperable y nueva intención. Los errores se anuncian mediante texto y no solo color; el foco debe permitir volver al campo o al mensaje. Mantén los códigos estables y traduce la explicación. El ejemplo de controlador es comprobable sin red; el formulario HTTP completo se ejecuta desde el taller existente, no aparece mágicamente al llamar esta función.

## Seguir el ejemplo

1. Observa el caso positivo y dos rechazos del controlador.
2. Abre el taller api-ux-c5 y sigue el envío hasta el mismo caso de uso.
3. Prueba teclado, error de cantidad y rol sin permiso sin borrar protecciones.

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

Una página de lectura puede bastar si la persona no necesita escribir datos. Añadir un formulario implica estado, accesibilidad, autorización y recuperación.

Conservar estado y foco exige pruebas de interacción. Ocultar un botón reduce confusión, pero no autoriza ni protege por sí mismo una operación.

## Caso adverso y recuperación

Un 403 presentado como completado induce al usuario a confiar en un registro inexistente. Dos clics no deberían convertirse sin explicación en dos intenciones distintas.

Conserva entrada y error específico; no repitas automáticamente un rechazo de permiso. Permite reintentar fallos recuperables con la clave de la misma intención.

## Tu ejercicio

Dibuja los estados del formulario y redacta mensajes para cantidad cero, sesión no autorizada y error temporal. Define qué dato conserva y dónde queda el foco.

## Solución explicada

Desde edición se pasa a carga y luego a éxito o error. En cantidad cero se conserva el formulario, se explica el límite y se dirige la atención al campo. En 403 se informa la falta de permiso sin sugerir que cambie la reserva a ciegas. En error temporal se ofrece reintento controlado. El mensaje y el foco tienen una comprobación, no solo un color.

## Revisar la entrega

- El flujo distingue rechazo y fallo temporal.
- La validación del servidor permanece.
- Los mensajes y el foco son utilizables sin color ni ratón.

## Continuar

Documenta el recorrido que una persona necesita, sin confundirlo con la referencia de cada parámetro.

Fuentes del proyecto:

- [app.js](../../replication/examples/api-ux-c5/public/app.js)
- [30-api-ux-seguridad-y-privacidad.md](../../manuales/30-api-ux-seguridad-y-privacidad.md)

