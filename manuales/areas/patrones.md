# Elegir y reconocer una solución recurrente

La conexión se interrumpe después de guardar una visita. La interfaz reintenta y no sabe si hubo efecto. Contar dos visitas daría un resumen incorrecto; rechazar todos los reintentos impediría recuperarse de un fallo de red.

## Antes de empezar

Comprende el registro autorizado, la misma intención repetida y la diferencia entre un hecho y una copia.

## Vocabulario

- Patrón: Solución recurrente con contexto, tensiones y consecuencias.
- Adaptación: Aplicación de una idea conocida con condiciones del proyecto.
- Convención: Acuerdo local de nombres u organización, no garantía técnica.

## Resolver el problema

El caso de uso consulta la clave de idempotencia dentro del ámbito. Si ya existe con el mismo contenido, devuelve el resultado anterior; si cambia el contenido, rechaza el conflicto. En la demostración secuencial queda un documento. Concurrencia y caída entre guardar y registrarOperacion requieren garantías adicionales del adaptador: dos llamadas separadas no son una transacción.

Empieza también por patrones de entrada: un repositorio concentra acceso; un mapeador separa formatos; la composición inyecta dependencias. Son ideas reconocidas, no novedades COBRIA. El Dater adapta un papel de mapeo al contrato documental. Las treinta fichas incluyen además controles, contratos, heurísticas y propuestas experimentales; la revisión de clasificación explica cada distinción.

## Seguir el ejemplo

1. Registra y repite la misma entrada bajo la misma clave.
2. Comprueba un solo documento y el mismo resultado.
3. Cambia la cantidad manteniendo la clave: debe aparecer IDEMPOTENCY_CONFLICT.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs patrones
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function patrones(cantidad = 3) {
  const app = crearAplicacion(),
    actor = contexto();
  const primera = await app.registrar.ejecutar(entrada(cantidad), actor);
  const repetida = await app.registrar.ejecutar(entrada(cantidad), actor);
  assert.deepEqual(repetida, primera);
  await assert.rejects(() => app.registrar.ejecutar(entrada(cantidad + 1), actor), {
    codigo: 'IDEMPOTENCY_CONFLICT',
  });
  const lista = await app.listar.ejecutar({ ambito: 'reserva-sur' }, actor);
  assert.equal(lista.items.length, 1);
  return {
    documentos: lista.items.length,
    conflicto: 'IDEMPOTENCY_CONFLICT',
    garantiaConcurrente: false,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "documentos": 1,
  "conflicto": "IDEMPOTENCY_CONFLICT",
  "garantiaConcurrente": false
}
```

## Alternativa y costo

Una restricción o transacción nativa puede dar la garantía requerida con menos código. No introduzcas una bandeja de salida si no hay un evento que deba confirmarse junto al hecho.

El registro de intenciones ocupa almacenamiento y necesita retención. Si se elimina demasiado pronto puede perderse la protección para reintentos tardíos.

## Caso adverso y recuperación

Generar una clave nueva en cada reintento impide reconocer la misma intención. Reusar una clave para contenido nuevo no es recuperación: es un conflicto.

Conserva la clave durante los reintentos de una intención. Genera otra solo para una intención nueva y usa la garantía atómica del motor cuando el riesgo concurrente lo exija.

## Tu ejercicio

Completa una ficha propia para la visita repetida: contexto, fuerzas, alternativa, garantía, prueba adversa y condición de retiro. Clasifícala sin afirmar que inventaste la idempotencia.

## Solución explicada

Clasifica el mecanismo como adaptación de procesamiento idempotente. Sus fuerzas son evitar duplicados y permitir reintentos sin esconder contenido distinto. La prueba adversa cambia cantidad con la misma clave. Declara que el ejemplo local no garantiza exactamente un efecto concurrente; esa obligación exige otra implementación y pruebas del adaptador.

## Revisar la entrega

- La ficha declara antecedentes y límites.
- El conflicto no se interpreta como éxito.
- Se compara una alternativa más simple.

## Continuar

Expresa esos resultados en una interfaz que muestre éxito, rechazo y reintento sin duplicar efectos.

Fuentes del proyecto:

- [03-pattern-design.md](../../manuales/03-pattern-design.md)
- [AUDITORIA-PC1.md](../../editorial/pc1/AUDITORIA-PC1.md)

