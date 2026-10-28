# Elegir fronteras antes de repartir servidores

Hoy la reserva usa memoria y mañana necesitará un motor documental. Si RegistrarObservacion crea su propio cliente de base de datos, cambiar el motor obliga a tocar también el caso de uso. El problema no se resuelve creando cinco carpetas vacías o cinco servicios remotos.

## Antes de empezar

Comprende una entidad válida, una función y un objeto recibido como parámetro.

## Vocabulario

- Arquitectura: Decisiones de responsabilidad y dependencia que condicionan el cambio.
- Puerto: Capacidad que una pieza necesita de otra.
- Inyección: Entregar una implementación a quien la utiliza.

## Resolver el problema

crearAplicacion recibe un repositorio y lo entrega al caso de uso. RegistrarObservacion conoce operaciones como guardar y buscarOperacion, no direcciones de red. La composición concentra la elección concreta. El ejemplo inyecta el mismo RepositorioMemoria y verifica que el objeto entregado es el que realmente recibe las escrituras.

La comprobación de métodos solo valida la forma del puerto. Un objeto puede tener guardar y aun así perder datos o mezclar reservas. Por eso una implementación nueva necesita pruebas de contrato y de fallos, no solo satisfacer una lista de nombres. Un monolito modular conserva estas fronteras dentro de un proceso.

## Seguir el ejemplo

1. Crea el repositorio fuera del caso de uso.
2. Inyéctalo mediante crearAplicacion y registra una observación.
3. Consulta ese mismo objeto y prueba el rechazo de un puerto incompleto.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs arquitectura
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function arquitectura(cantidad = 3) {
  const repositorio = new RepositorioMemoria();
  const app = crearAplicacion({ repositorio });
  await app.registrar.ejecutar(entrada(cantidad), contexto());
  const documentos = await repositorio.listar('reserva-sur');
  assert.equal(app.repositorio, repositorio);
  assert.equal(documentos.length, 1);
  assert.throws(() => crearAplicacion({ repositorio: {} }), /Repositorio sin método/);
  return {
    documentos: documentos.length,
    cantidad: documentos[0].cantidad,
    puertoIncompleto: 'rechazado',
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "documentos": 1,
  "cantidad": 3,
  "puertoIncompleto": "rechazado"
}
```

## Alternativa y costo

Un programa pequeño y sin reglas puede usar una función directa. Introduce el puerto cuando exista una dependencia que aislar o una sustitución concreta que probar, no por una cuota de clases.

La separación exige conectar piezas y mantener contratos. No elimina la latencia ni las diferencias de consistencia entre motores; hace visible dónde resolverlas.

## Caso adverso y recuperación

Un repositorio con guardar pero sin listar falla al componer. Otro con todos los métodos pero semántica incorrecta podría pasar esa comprobación inicial.

Completa el puerto y ejecuta casos positivos y negativos sobre la misma implementación. No añadas métodos vacíos para satisfacer la comprobación.

## Tu ejercicio

Dibuja dos opciones: acceso directo y repositorio inyectado. Justifica cuál usarías para una reserva que importará documentos de dos fuentes y escribe qué cambio esperas aislar.

## Solución explicada

La opción inyectada permite sustituir la persistencia en la composición y conservar el caso de uso. El dibujo debe mostrar dominio independiente, aplicación que depende del puerto e infraestructura que lo implementa. No dibujes una llamada de red por cada carpeta: las responsabilidades no obligan a distribuir el despliegue.

## Revisar la entrega

- La elección responde a un cambio concreto.
- El dominio no importa el motor.
- La decisión reconoce el costo del contrato.

## Continuar

Sigue una solicitud por archivos reales para distinguir dependencia y secuencia de ejecución.

Fuentes del proyecto:

- [composition.mjs](../../replication/examples/ecosistema-app/src/composition.mjs)
- [repositorio-observaciones.mjs](../../replication/examples/ecosistema-app/src/application/ports/repositorio-observaciones.mjs)

