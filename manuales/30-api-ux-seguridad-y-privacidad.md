# Del formulario al permiso comprobado

Construya una entrada que ayude a la persona sin confiarle la seguridad. En este taller
una brigada registra colibríes en `reserva-sur`: formulario → HTTP → controlador →
caso de uso → autorización → repositorio → respuesta. La interfaz usa el mismo
caso de uso de C3; no reimplementa sus reglas ni accede directamente al almacén.

## Abrir y probar

Requiere Node.js 22.13 o superior; no necesita instalar paquetes para la API:

```sh
npm start --prefix replication/examples/api-ux-c5
```

Abra la dirección `http://127.0.0.1:PUERTO` que aparece. Copie la sesión **DEMO**
temporal de la terminal al campo de sesión, nunca una credencial real. No comparta
esa clave ni la incluya en capturas. Caduca a los 30 minutos; reinicie para otra sesión.
El proceso solo escucha en loopback y se cierra con Ctrl+C. Al cerrar pierde todos
los documentos y sesiones; no hay nube, despliegue ni datos reales.

1. Consulte: aparece el estado vacío.
2. Registre `obs-c5-01`, `reserva-sur`, `colibri`, cantidad 3 y una fecha UTC.
3. Consulte de nuevo: aparece un documento. El cliente conserva la clave al
   reintentar exactamente el mismo cuerpo; la cambia si el cuerpo cambia.
4. Cambie el ámbito a `reserva-norte`: el servidor rechaza con 403.
5. Cantidad cero se detiene en el formulario. También se rechaza al omitir la
   interfaz y enviar directamente la petición HTTP; ambas defensas se prueban.

```sh
npm test --prefix replication/examples/api-ux-c5
make verificar-c5
```

La primera orden ejecuta doce pruebas HTTP, con servidor efímero y cierre por prueba.
La segunda añade coherencia editorial. Los tests usan claves ficticias y datos
predefinidos; no son una prueba de penetración ni una revisión externa.

## El contrato de entrada

Las rutas siguientes pertenecen al taller local: no sustituyen ni declaran conformidad
con la referencia `specification/phase-10/openapi.json`. C8 debe integrar y comprobar
explícitamente el contrato de la aplicación completa.

`POST /api/observaciones` requiere `Authorization: Bearer <sesión DEMO>`,
`Content-Type: application/json` e `Idempotency-Key` de hasta 100 caracteres
alfanuméricos, guion o guion bajo. El cuerpo tiene exactamente estos campos:

```json
{"id":"obs-c5-01","ambito":"reserva-sur","especie":"colibri","cantidad":3,"revision":1,"observadaEn":"2026-10-18T12:00:00Z"}
```

El token identifica una sesión conservada en el servidor con actor, capacidades,
ámbitos y vencimiento. La finalidad la fija el taller en `aprendizaje-c5`.
El cliente pide un ámbito, pero no se lo concede. Añadir `actorId`, `permisos` o
`finalidad` al JSON produce 400; añadir campos escondidos en HTML no cambia esto.

`GET /api/observaciones?ambito=reserva-sur&limite=20` requiere sesión y capacidad
de lectura. El límite va de 1 a 100 y admite el cursor opaco devuelto por la consulta.
Se rechazan parámetros duplicados y desconocidos. El repositorio de memoria aún
recupera y ordena el ámbito completo: el límite de respuesta no es un índice eficiente.

## Rechazos observables

| Estado | Causa | Acción de la persona |
|---|---|---|
| 400 | JSON, campo, tipo, regla, consulta o clave inválidos | Corregir la entrada |
| 401 | Sesión ausente, desconocida o vencida | Obtener otra sesión DEMO del proceso |
| 403 | Capacidad, ámbito, host u origen no autorizados | No ampliar permisos desde el cliente |
| 409 | Misma clave de operación con contenido distinto | Revisar la intención, no repetir a ciegas |
| 413 | Más de 4096 bytes | Reducir el cuerpo |
| 415 | Tipo de contenido no admitido | Enviar JSON |
| 500 | Fallo interno inesperado | Conservar la traza; no mostrar el error interno |

Los errores usan `application/problem+json`, estado, detalle y traza generada en el
servidor. Un error interno no expone pila ni credenciales. El ejemplo no publica un
servicio de resolución para las URI ilustrativas de los errores de dominio.

## Privacidad y experiencia de usuario

No solicite nombres personales ni coordenadas de especies protegidas para practicar.
La auditoría existente conserva actor, capacidad, ámbito, finalidad y resultado de
autorización; no copia documento, token ni clave de idempotencia. Sigue siendo
memoria sin retención programada: un sistema real necesita propósito, minimización,
control de acceso y plazos de eliminación de sus propios registros.

El formulario etiqueta cada campo, explica UTC, anuncia guardado/consulta/error y
lleva el foco al error. Mientras espera deshabilita botones; si falla la red permite
reintentar. Los resultados se insertan con `textContent`, nunca como HTML. El token
no se guarda en cookies, localStorage ni sessionStorage. Las respuestas llevan
`no-store`; esto no sustituye la seguridad del dispositivo de la persona.

La revisión automatizada de navegador se ejecuta por separado:

```sh
node replication/examples/api-ux-c5/verificar-interfaz.mjs
```

Necesita Playwright y su navegador; no se instalan con el taller básico. El script
admite el entorno integrado usado por el exportador del libro. Comprueba recorrido,
estado vacío, envío, denegación, foco, teclado, almacenamiento y ancho móvil.
Una persona debe revisar lector de pantalla, zoom, comprensión de errores y uso real.

## Qué falta antes de producción

Las sesiones aleatorias DEMO no autentican personas frente a un proveedor externo.
No despliegue este servidor: no implementa OIDC, MFA, revocación individual, TLS,
rotación de secretos, control de frecuencia ni presupuesto de memoria. Las cabeceras
locales restringen host/origen y no habilitan CORS; no son defensa completa contra
atacantes del mismo dispositivo. El puerto no puede usarse como API pública.

Guardar el documento y registrar idempotencia siguen siendo efectos separados; ni
deshabilitar un botón ni una prueba secuencial garantizan exactamente un efecto ante
concurrencia o caída. C6 y C8 deben cerrar persistencia, operación y atomicidad con
adaptadores reales. C13 conserva la evaluación de accesibilidad y comprensión humanas.
Este taller no modifica Core 1.0 ni otorga una certificación de seguridad.
