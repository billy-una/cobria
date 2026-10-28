# Proteger un dato antes de organizar el sistema

Una persona escribe cero y otra envía un número decimal. Ambas entradas caben en un objeto de JavaScript, pero ninguna representa el conteo admitido. Si cada formulario decide por separado, una importación o una llamada directa podrá crear hechos inválidos.

## Antes de empezar

Distingue texto, número, función y objeto. Ya sabes leer una propiedad y ejecutar un archivo con Node.

## Vocabulario

- Invariante: Regla que todo objeto válido debe conservar.
- Constructor: Operación que crea una entidad y comprueba sus reglas.
- Contrato: Condiciones de entrada y resultado que una operación promete.

## Resolver el problema

Observacion reúne identidad, reserva, especie, cantidad, revisión y fecha. Su constructor rechaza una cantidad no entera o menor que uno. No se trata de una regla de presentación: también se aplica cuando el objeto nace desde un archivo. La validación de una pantalla sirve para orientar; no reemplaza esta frontera.

Object.freeze impide reasignar las propiedades de esta entidad plana. Eso no transforma cualquier objeto anidado en una estructura profundamente inmutable ni resuelve conflictos de dos usuarios. La revisión conserva otra responsabilidad: identificar la versión del hecho cuando un repositorio decide si acepta una escritura.

## Seguir el ejemplo

1. Construye la entidad válida y comprueba su cantidad.
2. Construye otra con cero: el constructor debe rechazarla.
3. Intenta reasignar la cantidad: este objeto congelado no admite el cambio.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs fundamentos
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function fundamentos(cantidad = 3) {
  const observacion = new Observacion(entrada(cantidad));
  assert.equal(observacion.cantidad, cantidad);
  assert.throws(() => new Observacion(entrada(0)), { codigo: 'OBS_QUANTITY_INVALID' });
  assert.throws(() => {
    observacion.cantidad = 99;
  }, TypeError);
  return {
    cantidad: observacion.cantidad,
    revision: observacion.revision,
    congelada: Object.isFrozen(observacion),
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "cantidad": 3,
  "revision": 1,
  "congelada": true
}
```

## Alternativa y costo

Para un cálculo temporal sin identidad puede bastar una función pura que reciba números. Una entidad se justifica cuando hay reglas e identidad que deben acompañar al dato.

Crear una entidad añade validación y errores que el llamador debe manejar. Evita estados inválidos de este contrato, no prueba que el avistamiento ocurrió en la naturaleza.

## Caso adverso y recuperación

Sustituir la entidad por un literal puede hacer pasar una cantidad cero a otra capa. Una pantalla que la rechaza no protege una importación que nunca pasa por esa pantalla.

Mantén la construcción del dominio en la frontera de entrada y agrega una prueba para cero. No conviertas el rechazo en un valor silencioso ni sustituyas cero por uno.

## Tu ejercicio

Ejecuta el caso con cantidad cuatro y luego con cero. Escribe una prueba que espere OBS_QUANTITY_INVALID para cero y conserva el caso válido.

## Solución explicada

Con cuatro se conserva cantidad cuatro y revisión uno. Con cero falla antes de producir un resultado válido. La prueba usa assert.throws al construir Observacion; no comprueba solamente un mensaje de consola. La revisión no debe aumentar por crear otra variable local con la misma entrada.

## Revisar la entrega

- El caso positivo conserva su cantidad.
- Cero produce el código del dominio.
- Se distinguen congelación local y control de concurrencia.

## Continuar

La regla ya tiene un lugar; ahora decide quién coordina guardarla sin conocer el motor.

Fuentes del proyecto:

- [observacion.mjs](../../replication/examples/ecosistema-app/src/domain/observacion.mjs)
- [10-prueba.test.mjs](../../replication/examples/ecosistema-app/taller-inicial/10-prueba.test.mjs)

