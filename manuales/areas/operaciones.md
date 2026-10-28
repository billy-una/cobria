# Recuperar datos y promover el mismo artefacto

Un despliegue funciona en staging pero producción recibe una compilación distinta. A la vez existe un respaldo que nunca se restauró. Cuando llega un incidente, ni el binario anterior ni la copia de datos tienen una comprobación que permita confiar en ellos.

## Antes de empezar

Comprende archivo, ámbito y huella. No uses una base activa ni credenciales reales para este caso.

## Vocabulario

- Staging: Ambiente de ensayo separado de producción.
- Artefacto: Bytes construidos que se prueban y promueven.
- Reversión: Procedimiento para volver a una versión conocida y verificable.

## Resolver el problema

El ejemplo crea bytes de documentos autorizados, calcula su huella y restaura en un repositorio nuevo. La copia alterada se rechaza antes de restaurar. Es un ensayo de documentos: no incluye sesiones, auditoría, índices ni registro de idempotencia. Recuperar solo esos bytes no significa haber recuperado todo el servicio.

En nube distingue ambiente, identidad de ejecución y configuración. Una Function autoritativa valida actor y ámbito y usa permisos mínimos del motor; define tiempo máximo, memoria, reintentos y clave de intención. Versiona Rules e índices junto a la función. La promoción debe identificar el mismo artefacto probado, con aprobación y plan de humo; una bandera approval en una demostración no constituye autorización humana real.

## Seguir el ejemplo

1. Crea el respaldo desde documentos del ámbito autorizado.
2. Restaura en memoria nueva y compara su contenido.
3. Altera un byte y verifica el rechazo por huella incompatible.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs operaciones
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function operaciones(cantidad = 3) {
  const documentos = [new Observacion(entrada(cantidad))];
  const respaldo = crearRespaldo(documentos, 'reserva-sur', contexto());
  const restaurado = await restaurarRespaldo(
    respaldo.bytes,
    respaldo.sha256,
    'reserva-sur',
    contexto(),
  );
  assert.equal((await restaurado.listar('reserva-sur'))[0].cantidad, cantidad);
  const alterado = Buffer.from(respaldo.bytes);
  alterado[0] ^= 1;
  await assert.rejects(
    () => restaurarRespaldo(alterado, respaldo.sha256, 'reserva-sur', contexto()),
    /HUELLA_INCOMPATIBLE/,
  );
  return {
    documentosRestaurados: 1,
    huella: respaldo.sha256,
    copiaAlterada: 'rechazada',
    despliegueReal: false,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "documentosRestaurados": 1,
  "copiaAlterada": "rechazada",
  "despliegueReal": false
}
```

## Alternativa y costo

Un proceso local puede ser suficiente mientras no haya disponibilidad remota que mantener. Usar Functions no elimina operación, observabilidad ni seguridad.

Ambientes separados y respaldos consumen recursos. Definir límites reduce exposición a errores o gasto, pero no garantiza ausencia de fallos.

## Caso adverso y recuperación

Un respaldo correcto de documentos no contiene las claves idempotentes. Después de restaurar, un reintento antiguo puede necesitar otra estrategia antes de habilitar escritura.

Comprueba el inventario completo de recuperación. Conserva el sistema activo, restaura en otro destino, valida permisos y equivalencia y solo entonces decide el cambio con autoridad apropiada.

## Tu ejercicio

Escribe un procedimiento de promoción con SHA, huella, configuración, Rules, índices, pruebas, humo y reversión. Añade qué información no cubre este respaldo.

## Solución explicada

Staging prueba un artefacto identificado; la aprobación referencia esa huella y producción recibe los mismos bytes. El humo comprueba URL, ambiente, permisos y versión. La reversión apunta a un artefacto anterior conservado. Para recuperación enumera documentos, sesiones, auditoría, operaciones e índices y decide cuáles se restauran o reconstruyen. Este ejercicio no autoriza desplegar.

## Revisar la entrega

- La promoción no recompila silenciosamente.
- La recuperación usa un destino nuevo.
- Se declaran límites del respaldo y de la Function.

## Continuar

Usa fuentes recuperables también cuando una respuesta se construya mediante analítica o IA.

Fuentes del proyecto:

- [environments.json](../../specification/phase-8/environments.json)
- [operacion.mjs](../../replication/examples/operacion-c6/operacion.mjs)
- [RECUPERACION-C8.md](../../manuales/operacion/RECUPERACION-C8.md)

