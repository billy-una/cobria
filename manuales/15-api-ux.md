# COBRIA API & UX

**Versión:** 1.0  
**Estado:** estable como manual pedagógico; accesibilidad completa pendiente de revisión humana  
**Fuente verificable:** `specification/phase-10/`

## Propósito

Una API y una interfaz son dos traducciones de capacidades del sistema. Ninguna debe
inventar reglas, autoridad o datos. API & UX diseña contratos que personas, clientes y
agentes pueden comprender, reintentar, localizar y usar de forma accesible.

## Contrato de una operación

Cada operación declara:

- intención y versión;
- autenticación, capacidad, ámbito y finalidad;
- entrada, límites y validación de forma;
- resultado y códigos estables;
- idempotencia, timeout y política de reintento;
- paginación y orden cuando devuelve colecciones;
- compatibilidad y retiro;
- telemetría permitida;
- ejemplo válido y casos negativos.

El contrato OpenAPI neutral está en `specification/phase-10/openapi.json`. Su servidor
usa `example.invalid`: es documentación, no un endpoint desplegado.

## Autenticación no es autorización

Autenticar identifica al actor. Autorizar comprueba capacidad, ámbito y finalidad en el
servidor. Un encabezado de ámbito enviado por el cliente debe coincidir con ruta y
credencial; nunca concede acceso por sí mismo.

## Idempotencia y reintentos

- GET puede reintentarse con retroceso exponencial y jitter.
- POST solo se reintenta con la misma `Idempotency-Key` y el mismo contenido.
- Reutilizar la clave con otro contenido produce conflicto.
- `429` informa espera; `503` representa indisponibilidad temporal sin filtrar internos.
- Todo cliente y servidor declara timeout y cancelación.

## Errores RFC 9457

Los errores HTTP usan `application/problem+json`:

```json
{
  "type": "https://cobria.example.invalid/problemas/access-denied",
  "title": "La operación no está autorizada",
  "status": 403,
  "code": "ACCESS_DENIED",
  "detail": "No tiene permiso para realizar esta acción.",
  "traceId": "traza-42"
}
```

`code` gobierna automatización; `detail` se localiza. Nunca se publican stack, consulta,
token, secreto, ruta física ni existencia de recursos fuera del ámbito.

## Colecciones y cursores

Una colección creciente usa orden estable y cursor opaco. El cliente no interpreta ni
construye el cursor. Se limita tamaño, longitud y tiempo de consulta. OFFSET puede usarse
en conjuntos pequeños y estables, pero no se convierte en regla universal.

## Eventos

Un evento declara productor, consumidores, esquema, ámbito, revisión de fuente, tiempo,
idempotencia, orden disponible, retención y cola de fallos. No se promete orden global.
Los consumidores ignoran campos opcionales desconocidos; eliminar o cambiar significado
requiere otra versión o una transición explícita.

## Estados completos de interfaz

| Estado | Pregunta de diseño |
|---|---|
| inicial | ¿Qué puede hacer la persona antes de actuar? |
| carga | ¿Se informa progreso sin robar foco? |
| vacío | ¿Explica qué significa y qué puede hacerse? |
| éxito | ¿Confirma resultado y siguiente acción? |
| error recuperable | ¿Conserva entrada y ofrece reintento seguro? |
| error definitivo | ¿Explica límite y alternativa? |
| sin permiso | ¿Evita revelar existencia o datos? |
| desconectado | ¿Qué puede continuar y qué debe fallar cerrado? |

## Formularios

Todo campo tiene etiqueta visible, ayuda asociada, formato y mensaje programático. Los
errores aparecen junto al campo y en un resumen navegable. Un botón describe la acción,
impide doble envío mediante lógica y conserva foco. La entrada válida no se borra tras un
error recuperable.

## Modales y navegación

Un modal atrapa foco, se cierra con Escape, devuelve foco al disparador y oculta
correctamente el fondo para tecnologías de asistencia. Cada página mantiene enlace de
salto, `main`, título único, jerarquía, ubicación actual y regreso predecible. En móvil la
navegación se adapta; no desaparece.

## Internacionalización

- contratos y logs usan códigos estables;
- presentación selecciona mensajes;
- fechas conservan instante y zona IANA cuando corresponde;
- dinero usa cantidad menor y moneda ISO 4217;
- unidades son explícitas;
- no se concatenan fragmentos traducidos;
- se prueban textos largos y pluralización.

## Accesibilidad

El objetivo es WCAG 2.2 AA, pero los controles automáticos no equivalen a conformidad.
Además de idioma, semántica, foco, contraste, movimiento reducido y reflujo, se requieren
pruebas manuales con teclado, zoom 200/400 %, VoiceOver, NVDA, alto contraste, orden de
foco, anuncios dinámicos y comprensión.

## Laboratorio API & UX

1. Modele una escritura idempotente y un listado con cursor.
2. Defina cinco problemas RFC 9457 sin datos internos.
3. Diseñe los ocho estados de una pantalla.
4. Complete el formulario solo con teclado.
5. Pruebe doble envío, desconexión, permiso denegado y cursor inválido.
6. Revise reflujo a 320 CSS px y zoom 400 %.
7. Ejecute un lector de pantalla y documente lo pendiente.

**Criterio de avance:** contrato, interfaz y pruebas describen el mismo comportamiento;
los controles automáticos pasan y las verificaciones humanas pendientes están visibles.
