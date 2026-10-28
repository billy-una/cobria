# C8. El cuaderno que permanece

Esta práctica conecta el caso de la reserva con un formulario, HTTP y un motor
documental real. No es una nueva especificación ni una aplicación lista para producción.
La versión fijada en el bloqueo de dependencias es PouchDB 9.0.0; se usa su adaptador
LevelDB en disco, no SQL ni un repositorio simulado.

## Empezar desde cero

Desde la raíz del repositorio, con Node.js 22.13 o superior:

```sh
npm ci --prefix replication
npm start --prefix replication/examples/integral-c8
```

Abra la dirección local impresa. Copie al formulario la sesión DEMO temporal; no use
credenciales reales. El permiso dura treinta minutos y solo abarca `reserva-sur`.
Registre `obs-c8-01`, especie `colibri`, cantidad 3, revisión 1 y una fecha UTC.
Presione **Guardar en disco** y después **Ver proyección**: el conteo debe ser 3.
Busque `colibri` para obtener evidencia con identidad, revisión y huella. No hay LLM:
la búsqueda léxica puede abstenerse o encontrar una coincidencia insuficiente.

Al editar el hecho use revisión 2. Repetir la misma operación conserva su resultado;
reutilizar su clave con contenido distinto falla. El formulario mantiene la clave
mientras no cambie el cuerpo, incluso si una respuesta se pierde.

Ctrl+C cierra el servicio sin borrar el motor. Para volver, use la orden exacta
`--reanudar` impresa y su ruta absoluta. Se comprueba un marcador propio y se rechazan
directorios ajenos o enlaces. Recibirá otra sesión: no se guardan tokens en el navegador.
Los datos sí quedan en disco; no introduzca nombres, ubicaciones sensibles ni secretos.

## Quién hace qué

| Archivo | Responsabilidad |
| --- | --- |
| `public/` | Formulario, estados de espera, errores, consulta y foco accesible |
| `composition.mjs` | Conectar puertos, autorización, HTTP y consultas de evidencia |
| `application/registrar-durable.mjs` | Validar el cambio y solicitar una confirmación conjunta |
| `infrastructure/repositorio-pouch.mjs` | Traducir con Dater, controlar revisiones y persistir |
| `catalogo.json` | Fijar códigos y edición `aves-c8-v1` |
| `verificar.mjs` | Recorrido de reapertura, copia, restauración y reconstrucción |

Todos son relativos a `replication/examples/integral-c8/`. Se reutiliza el dominio y
Dater del caso conductor y el transporte de C5, cuyas opciones originales conservan
sus valores predeterminados. El caso C3 original conserva sus efectos separados;
C8 los sustituye por el puerto `registrarAtomico`, no afirma que antes fueran atómicos.

## Un documento como frontera de confirmación

Cada ámbito tiene un documento agregado. Incluye fuentes con claves físicas a–g,
registro de idempotencia y proyección versionada con revisión y huella de fuentes.
El Dater conserva formato 1; la edición del catálogo pertenece al agregado. No se
mezclan estos contratos con los de otros diccionarios del repositorio.

Se lee la revisión del motor y se confirma con un único `put`. Si otra escritura
ganó, se relee y reintenta hasta ocho veces. Una clave repetida recupera el resultado
original. Una revisión de negocio obsoleta no puede reemplazar una vigente.
La revisión del hecho y `_rev` de PouchDB tienen responsabilidades diferentes.

Esta decisión usa las [revisiones documentales de PouchDB](https://pouchdb.apache.org/guides/documents.html)
y sus [conflictos inmediatos](https://pouchdb.apache.org/guides/conflicts.html).
La [API oficial](https://pouchdb.apache.org/api.html) documenta el adaptador de Node.

**Costo explícito:** máximo 1000 documentos, 1000 operaciones y 2 MiB por agregado.
Cada actualización reescribe el agregado y cada lectura comprueba sus invariantes
en O(n). No es un modelo recomendado para ámbitos grandes ni una demostración de
superioridad de COBRIA. La contención, el historial y el tamaño son límites deliberados.

## API local, no contrato público certificado

Las rutas son `/api/observaciones` (GET/POST), `/api/resumen`, `/api/evidencia` y
`/api/respaldo` (GET). Las lecturas reciben `ambito`; evidencia también `consulta`.
El listado admite `limite` (1–100) y `cursor`; pagina en memoria sobre el agregado,
no mediante un índice remoto ni una instantánea estable entre cambios concurrentes.
POST requiere `Idempotency-Key`. Se usa Bearer DEMO, Host y origen local controlados;
las capacidades y el ámbito proceden de la sesión del servidor, nunca del solicitante.
Respaldo exige `observaciones:respaldar`; leer no concede exportación privilegiada.
Un fallo del proveedor devuelve 503 sin detalles internos.

Este transporte difiere en prefijos `/v1/ambitos/...`, autenticación JWT y
envolturas de `specification/phase-10/openapi.json`. No se declara conformidad con ese
contrato: la reconciliación global queda para C11. No se cambió el Core congelado.

## Copiar no es recuperar todo el servicio

El botón muestra una copia JSON con huella; no descarga un archivo automáticamente.
El verificador sí escribe un archivo exclusivo, restaura en un motor nuevo y rechaza
sobrescribir un destino existente. Incluye fuentes, operaciones y proyección;
no incluye sesiones, auditoría, configuración completa ni secretos. Una huella
detecta cambios respecto a otra huella confiable; no es una firma de autenticidad.

La reconstrucción se invoca como operador local mediante `componer().reconstruirResumen`
y exige `observaciones:reconstruir`. No es una mutación oculta en GET. Deriva de las
fuentes, valida la candidata y publica por revisión del motor, sin crear un cambio
de negocio. La prueba corrompe únicamente su base temporal para comprobar la reparación.

```sh
npm test --prefix replication/examples/integral-c8
npm run verificar --prefix replication/examples/integral-c8
node replication/examples/integral-c8/verificar-interfaz.mjs
```

El último comando requiere Playwright y Chromium disponibles. Comprueba el formulario
móvil, permisos, foco, almacenamiento del navegador y reapertura; no certifica accesibilidad.

Las diecisiete pruebas de integración usan el motor real. Incluyen cuatro perfiles,
rechazo de sesiones vencidas antes del repositorio, concurrencia y fallos
controlados antes/después del guardado; otro proceso cierra y reabre el motor.
Eso no representa caída eléctrica, disco averiado, SIGKILL, múltiples nodos ni nube.
Los puntos de fallo son solo de pruebas y no se exponen por HTTP. No se garantiza
exactamente una vez para correo, cobros u otros efectos externos.

## Qué sigue

C9 debe consolidar herramientas y documentación. C11 debe reconciliar contratos y
afirmaciones globales. Producción necesita autenticación real, operación, retención,
pruebas de fallos y revisión de seguridad. Las particiones de entrenamiento de C7
siguen siendo otro taller: no se inventa consentimiento ni fecha de conocimiento
para afirmar que esta app ya construye un conjunto de entrenamiento válido.

Libro y página `/construir` comparten `editorial/c8/workshop.json`. La integración
local no sustituye revisión externa ni estudio con personas. No se publicó ni desplegó.
