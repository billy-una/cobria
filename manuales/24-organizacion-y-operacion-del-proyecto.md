# Organización y operación de un proyecto COBRIA

**Estado:** guía pedagógica de una propuesta independiente.  
**Fuente de las fichas del libro y la web:** `editorial/engineering-practices.json`.  
**Ejemplo neutral:** `replication/examples/operacion-documental/`.  
**Procedencia estructural:** auditoría local de POS Guápiles del 8 de octubre de 2026;
véase `editorial/sources/posguapiles-2026-10-08.json` y la auditoría correspondiente.

Esta guía aplica las doce prácticas OP01-OP12 a una reserva natural digital. Las prácticas
son recomendaciones del ecosistema, no requisitos nuevos de conformidad COBRIA Core.
Los mecanismos de ejemplo fueron escritos para COBRIA y se prueban sin proveedor remoto.

## 1. Ordenar el repositorio para que otra persona pueda continuar

La raíz contiene un README de entrada, manifiesto de dependencias, licencia, instrucciones
de contribución y política de seguridad. Las carpetas no se eligen solo por extensión:
separan responsabilidades y modos de lectura.

```text
proyecto/
  README.md              propósito, inicio rápido y ruta de lectura
  AGENTS.md              alcance, autoridad, invariantes y pruebas para IA
  src/
    domain/              identidad, valores, reglas y estados del negocio
    application/         casos de uso y puertos
    data/                Daters, adaptadores, consultas y cachés
    presentation/        vistas, controles y estado de interfaz
    composition/         configuración y conexión de implementaciones
  functions/
    handlers/            entrada, autorización y coordinación del servidor
    lib/                 políticas puras del servidor
    test/                contrato, roles, límites y recuperación
  test/                  unidades, contratos y recorridos de aplicación
  tools/                 verificación, migración y entrega
  docs/
    inicio/              tutorial e instalación
    arquitectura/        contexto, fronteras y mapa real
    decisiones/          ADR y consecuencias
    referencia/          datos, catálogos, API, roles y errores
    operacion/           staging, respaldo, incidentes y recuperación
    evidencia/           registros con ambiente y versión
    historico/           documentos superados, con reemplazo explícito
```

Los nombres pueden cambiar según lenguaje y tamaño. Un Dater es el adaptador de una
entidad; un Service encapsula una responsabilidad de negocio; el caso de uso coordina
una intención; la composición selecciona implementaciones. No cree una tríada vacía
para cada catálogo estático. La correspondencia entre entidades y adaptadores puede
validarse automáticamente, pero no obliga a duplicar clases sin comportamiento.

Una ficha por módulo explica responsabilidad, entradas, salidas, dependencias permitidas,
autoridad de escritura, pruebas, documento vigente y responsable. Si un mismo archivo
autentica, valida negocio, pinta un modal y compone SDK, la frontera merece revisión.

## 2. Mantener el mapa actualizado con el código

La documentación observada organiza instalación, arquitectura, funcionalidad, referencias,
seguridad, operación y desarrollo. Este orden ayuda a incorporarse, pero un índice largo
de incidentes no sustituye la ruta de aprendizaje. Publique dos entradas: una breve para
comenzar y otra para consultar todos los materiales.

Cada documento declara estado, fecha de revisión, responsable, alcance y reemplazo
cuando corresponda. Un roadmap histórico conserva la decisión de su momento, pero no
gobierna una operación actual. El mapa de carpetas debe verificarse contra rutas reales;
los ejemplos deliberadamente simplificados se identifican como tales.

La construcción de un producto escribe solo dentro de su repositorio o directorio de
salida declarado. Generar el libro no debe actualizar silenciosamente una copia vecina
del sitio: una sola fuente y un comando de sincronización explícito reducen divergencias.

No basta con detectar una palabra en un script para validar arquitectura. Compruebe
imports relativos, absolutos, dinámicos y reexports cuando el lenguaje lo permita.
Distinga ejemplos inválidos de producción y pruebe el auditor con ambos. Una excepción
histórica necesita alcance preciso, motivo y condición de retiro; no puede autorizar
cualquier dependencia hacia una capa superior.

## 3. Construir el diccionario de datos y sus fronteras

Comience por necesidades y consultas. Para cada entidad registre identidad, ámbito,
revisión, ciclo de vida, atributos y relaciones. Para cada atributo registre tipo, unidad,
obligatoriedad, valor ausente, restricciones, sensibilidad, autoridad de cambio y versión.
Después añada nodo o colección, clave física, índices y adaptación.

| Pregunta | Ejemplo neutral |
|---|---|
| ¿Quién cambia el hecho? | La operación de registrar observación en el servidor. |
| ¿Dónde vive su autoridad? | `observaciones/{ambito}/{id}`. |
| ¿Qué es una copia? | Resumen por especie, mapa y búsqueda. |
| ¿Qué significa cada campo? | `cantidad`: entero no negativo; `fecha`: instante UTC. |
| ¿Cómo se traduce? | Dater versionado; las letras físicas no llegan al dominio. |
| ¿Cómo se valida? | Esquema de entrada, regla de negocio, permiso y contrato de persistencia. |
| ¿Cómo se recupera? | Fuentes, corte, transformación y comparación del derivado. |

En el caso observado algunos modelos históricos conservan `fieldMap`, `toRaw` y
`fromRaw`. COBRIA mantiene su recomendación de traducción en Dater/adaptador para que
el dominio sea independiente. Reconocer un mecanismo existente no obliga a copiar
todas sus decisiones. Pruebe ida y vuelta y también pérdida de campo, tipo inválido,
versión no admitida y atributos desconocidos. Esquema válido y acceso permitido son
comprobaciones distintas: un documento correcto puede estar fuera del ámbito autorizado.

La auditoría puede vivir separada del documento de negocio, siempre que los enlaces a
identidad, revisión, actor, política y resultado sigan siendo recuperables. Quitar campos
temporales del documento no es una regla universal de COBRIA.

## 4. Catálogos y gestor de idioma

Use códigos estables en reglas y datos. La etiqueta depende del idioma y puede corregirse
sin migrar el negocio. Una opción de catálogo declara versión, vigencia y compatibilidad.
El gestor de idioma resuelve etiqueta, plural, fecha y unidad sin cambiar identidad.
Un idioma faltante tiene fallback explícito y diagnóstico; no convierte un error en una
traducción aparentemente correcta.

## 5. Consultas, cachés y ciclo de vida

Antes de introducir una proyección, compare lectura puntual, índice con límite/cursor,
deduplicación y carga de detalle. Un cursor declara orden estable y desempate por identidad.
Acote tamaño de página, IDs y concurrencia; un servicio no crea una segunda caché para
ocultar una consulta costosa. Si se conserva otra caché, documente la frontera e invalidación.

Una consulta puntual puede evitar un recorrido lineal en la aplicación; eso no demuestra
O(1) de red, motor o facturación. Una consulta paginada sigue pagando índice, transferencia
y deserialización. Mida bytes, solicitudes, p50/p95, escrituras y costo de recuperación.
Los valores 500 IDs u ocho cargas paralelas del caso de origen son políticas locales,
no constantes universales.

La caché incluye ámbito y versión de permisos, TTL, capacidad y política de invalidación.
Una escritura o cambio de sesión invalida lo afectado. El ejemplo de COBRIA deduplica
solicitudes y evita que una lectura antigua invalidada repueble la entrada nueva. La
vista todavía debe descartar respuestas ajenas a su sesión actual. Un error de permiso,
una ausencia y un fallo de red no se convierten todos en `null`.

Quien inicia un listener conserva el cierre. Salir de una vista o cambiar sesión libera
listeners, servicios y cachés propios. Una suscripción compartida puede usar referencias
de propietarios; no debe cancelarse para todos cuando solo uno termina.

## 6. Offline sin trasladar autoridad al navegador

Distinga borrador, caché de lectura y escritura autoritativa. Dinero, stock, reservas o
recursos escasos requieren un protocolo de autoridad y concurrencia propio; no entran
automáticamente en una cola genérica. Por defecto, una ruta nueva necesita revisión.

Antes de encolar, inspeccione todas las rutas de un lote. Si una no está aprobada,
rechace el lote entero. La cola necesita capacidad, TTL, intentos, backoff, errores
definitivos y diagnóstico acotado. Los vencidos no se reenvían silenciosamente. Al
sincronizar, revalide identidad, capacidad, ámbito, revisión e identidad de operación.

El ejemplo solo almacena borradores locales y clasifica vencidos. No implementa una
cola persistente, transporte ni sincronización. Es una pieza pequeña que permite
entender el preflight antes de incorporar un proveedor y datos de negocio.

## 7. UX operativa como contrato

Toda acción importante define carga, éxito, vacío, error, desconexión y reintento. Una
lista vacía comunica ausencia real, no un permiso denegado. Un controller puede
deduplicar el doble clic local; la Function sigue necesitando idempotencia para
reintentos de red y dispositivos distintos.

Declare foco, accesibilidad de busy/disabled, Escape, restauración de foco y limpieza
de respuestas antiguas. Mantenga un sistema de tokens y componentes, con migración
por pantalla y pruebas de comportamiento. No duplique el design system al corregir
un modal. Cargue herramientas pesadas solo donde aportan valor al recorrido.

## 8. Functions, permisos y retirada de legado

El handler obtiene identidad confiable, resuelve capacidades y ámbito, valida entrada,
invoca el caso de uso y registra el resultado. Las políticas puras no requieren un SDK;
el adaptador concentra persistencia. La composición exporta una autoridad por operación.

La ruta directa del cliente está gobernada por Rules; el SDK Admin puede eludirlas.
El handler con identidad de servicio necesita autorización explícita y permisos de
infraestructura adecuados. App Check y autenticación contribuyen a controles distintos;
ninguno sustituye la autorización de negocio ni el aislamiento multiinquilino.

Extraiga una operación completa, preserve contrato, compruebe las dos rutas durante
transición y retire el export antiguo. Un presupuesto de legado disminuye conforme
se retira código; subirlo para pasar una prueba oculta la regresión. Si ya solo queda
un shim de inicialización, documente ese estado actual en lugar de seguir describiendo
un monolito que no existe.

## 9. Proyecciones, cobertura y reconciliación

Un resumen declara fuentes, corte, revisión y versión de transformación. La cobertura
histórica también importa: un índice recién creado puede omitir relaciones anteriores.
Distinga vacío real, fuera de cobertura, permiso denegado y error de carga.

Una reparación tiene diagnóstico sin escritura, tamaño acotado, checkpoint, ejecución
repetible, comparación y publicación segura. El lector puede reconocer una cobertura
parcial; no debe presentarla como completa. Antes de borrar fuentes históricas, pruebe
la recuperación y confirme consumidores y retención.

## 10. Optimización continua con observabilidad privada

Revise siete líneas: carga inicial, consultas NoSQL, interfaz heredada, UX asíncrona,
Functions, resiliencia/offline y observabilidad. Cada mejora declara pregunta, baseline,
causa, cambio mínimo, efecto medido, costo adicional y reversión.

La telemetría admite nombres y campos permitidos. No envíe URL, path con identificadores,
email, UID ni datos de negocio para medir latencia. Acote cola, muestreo, retención,
cardinalidad y reintento. Reportar métricas no bloquea una operación de negocio.
Un histograma produce percentiles aproximados; un score heurístico ayuda a priorizar,
pero no reemplaza un SLO. Sin baseline, declare mejora estructural comprobada y deje
el ahorro cuantitativo pendiente de medición.

## 11. Entrega y evidencias ligadas al artefacto

Fije SHA real, checkout limpio, dependencias y configuración explícita. Produzca un
artefacto reproducible con digest; registre proyecto y ambiente. Si la configuración
cambia por ambiente, identifique sus digests y pruebe esa variación: el mismo SHA no
significa necesariamente el mismo binario ni la misma configuración.

La decisión de entregar enlaza pruebas locales, staging, roles, recursos, respaldo
fresco, restauración ensayada y aprobación correspondiente. Un resultado histórico
no autoriza otro candidato. Elija CI o verificación local según contexto y conserve
evidencia verificable en ambos; la ausencia de GitHub Actions no implica ausencia de
control, y su presencia tampoco acredita por sí sola una entrega.

Compruebe identidad y configuración de los recursos tras desplegar. Preserve reversión,
compatibilidad entre Rules/Functions/cliente, responsable y cierre. Una huella comprueba
concordancia; la autenticidad de evidencias requiere un procedimiento adicional.
El verificador del ejemplo comprueba registros sintéticos y nunca emite una aprobación
humana o despliega.

## 12. Practicar y transferir

```sh
npm test --prefix replication/examples/operacion-documental
npm start --prefix replication/examples/operacion-documental
```

Modifique una condición de cada mecanismo y observe qué prueba falla: quite el ámbito
de la caché; acepte un nodo desconocido; conserve una etiqueta arbitraria de telemetría;
mezcle el SHA de staging. Restaure la condición y registre la explicación.

Para una IA, entregue objetivo, autoridad de fuentes, rutas editables, invariantes,
comandos existentes y resultado esperado. Para otra persona, ofrezca inicio rápido,
mapa, ejemplos y pruebas. En ambos casos, el cierre requiere declarar qué se ejecutó,
qué quedó pendiente y qué evidencia permite repetir la comprobación.
