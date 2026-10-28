# Probar permisos antes y después del caso permitido

Un guardaparques de la reserva sur cambia la reserva del formulario e intenta escribir en la norte. Si el sistema solo ocultó la opción visual, una petición directa podría cruzar el límite. La privacidad depende del flujo completo, no del diseño del botón.

## Antes de empezar

Distingue actor, capacidad, ámbito y contexto. Reconoce que un objeto de permisos editable no autentica a una persona.

## Vocabulario

- Amenaza: Acción o condición que puede dañar un activo.
- Autorización: Comprobación de una capacidad sobre un recurso y ámbito.
- Mínimo privilegio: Conceder solo lo necesario para una finalidad.

## Resolver el problema

El caso de uso comprueba la capacidad de escritura y pertenencia al ámbito antes de guardar. El ejemplo intenta primero una capacidad ausente y luego una reserva ajena. Consulta después los documentos autorizados para comprobar que ninguno de los rechazos dejó una escritura parcial. Finalmente ejecuta un registro permitido: seguridad también significa no bloquear a quien sí debe actuar.

En la demostración el contexto es sintético y confiado por el ensayo. En un servidor se obtiene de una sesión verificada, con revocación y caducidad. Las reglas del motor y las Functions deben conservar la misma política. Nunca aceptes una lista de permisos del formulario como si la hubiera emitido el servidor.

## Seguir el ejemplo

1. Intenta escribir sin capacidad y espera ACCESS_DENIED.
2. Intenta otra reserva con la misma identidad de demostración.
3. Comprueba cero efectos tras los rechazos y un efecto tras la solicitud válida.

Desde la raíz de COBRIA, con Node.js 22.13 o superior y sin paquetes nuevos:

```sh
node replication/examples/ecosistema-app/taller-areas/ejecutar.mjs seguridad
```

Código real de replication/examples/ecosistema-app/taller-areas/casos.mjs; la función utiliza imports y datos de ese archivo, no es un programa autónomo:

```js
export async function seguridad(cantidad = 3) {
  const app = crearAplicacion();
  await assert.rejects(
    () => app.registrar.ejecutar(entrada(cantidad), { ...contexto(), permisos: [] }),
    { codigo: 'ACCESS_DENIED' },
  );
  await assert.rejects(
    () =>
      app.registrar.ejecutar(
        { ...entrada(cantidad), ambito: 'reserva-norte' },
        contexto(),
      ),
    { codigo: 'ACCESS_DENIED' },
  );
  assert.equal(
    (await app.listar.ejecutar({ ambito: 'reserva-sur' }, contexto())).items.length,
    0,
  );
  await app.registrar.ejecutar(entrada(cantidad), contexto());
  return {
    rechazos: 2,
    escriturasTrasRechazos: 0,
    documentosAutorizados: 1,
    autenticacionReal: false,
  };
}
```

Puedes añadir 4 al final del comando para cambiar la cantidad, o 0 para provocar el rechazo. Calidad no utiliza ese argumento: comprueba cargas y permisos con un reloj controlado.

Campos esperados del resultado (puede incluir otros, como una huella):

```json
{
  "rechazos": 2,
  "escriturasTrasRechazos": 0,
  "documentosAutorizados": 1,
  "autenticacionReal": false
}
```

## Alternativa y costo

Un flujo solo de lectura elimina algunas capacidades de escritura, pero sigue necesitando aislamiento y protección de campos privados.

Una política por rol, recurso y ámbito requiere una matriz y pruebas negativas. Registrar tokens completos como ayuda de diagnóstico crearía otro riesgo.

## Caso adverso y recuperación

Una llamada que devuelve 403 después de haber guardado ya filtró autoridad. Comprobar únicamente el estado HTTP no detecta ese efecto.

Autoriza antes del efecto, revisa datos y auditoría saneada, y añade el caso sin efectos a la regresión. No amplíes permisos globalmente para corregir un único rol.

## Tu ejercicio

Construye una matriz para guardaparques, persona lectora y administradora de una reserva. Incluye lectura, escritura y reserva ajena; define dos rechazos obligatorios.

## Solución explicada

La persona lectora consulta su reserva pero no registra; guardaparques registra solo en su ámbito; administración no obtiene automáticamente todas las reservas sin una política explícita. Los dos rechazos son capacidad ausente y ámbito ajeno, ambos sin escritura. La matriz debe ligarse al servidor y al motor, no quedar como lista de botones.

## Revisar la entrega

- Los rechazos ocurren antes del efecto.
- Existe caso positivo y negativo por frontera.
- Se reconoce el límite de la identidad sintética.

## Continuar

Reproduce un defecto real y compara su corrección sin quitar las protecciones para ganar velocidad.

Fuentes del proyecto:

- [autorizar-capacidad.mjs](../../replication/examples/ecosistema-app/src/application/security/autorizar-capacidad.mjs)
- [security.json](../../specification/phase-7/security.json)

