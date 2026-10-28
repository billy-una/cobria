# Auditoría de transferencia desde POS Guápiles hacia COBRIA

**Fecha:** 8 de octubre de 2026, Costa Rica.  
**Tipo:** revisión estructural local y adaptación pedagógica.  
**Repositorio observado:** https://github.com/billy-una/posguapiles  
**HEAD observado:** `686274b88140a5a5eef6936ea4952fa7f1d6b05f`.  
**Checkout:** `POSGUAPILES-1`, dentro de la carpeta de proyectos.  
**Modificación local preexistente:** registro de incidentes del 6 de octubre; no se usó
como evidencia de una ejecución o entrega realizada por esta auditoría.

## Alcance y método

Se inspeccionaron instrucciones del repositorio, índices y mapa de documentación,
diccionario, modelos, Daters, servicios, conectores, caché, política offline, autorización,
telemetría, handlers, bootstrap, presupuesto de legado y runbook de promoción. Se
contrastaron recomendaciones escritas con implementaciones y verificadores existentes.
El manifiesto de procedencia registra rutas y huellas de archivos públicos de ingeniería;
no incluye credenciales, configuración privada ni datos de negocio.

Se ejecutó `node tools/check-architecture-boundaries.mjs` en POS Guápiles, que pasó.
El resultado comprueba las reglas implementadas por ese auditor, no cualquier dependencia
posible: el script inspecciona imports absolutos por expresión regular y una excepción
de compatibilidad. No se ejecutaron toda la suite POS, una campaña de staging, restauración
ni un despliegue. El repositorio de origen se consultó sin modificarlo.

## Hallazgos y transferencia

| Hallazgo observado | Mejora incorporada en COBRIA | Práctica |
|---|---|---|
| Documentación por instalación, arquitectura, referencias, seguridad, operación y desarrollo | Índices por tarea, estado y documento vigente | OP01 |
| Object/Dater/Service y checker de correspondencia | Fichas de responsabilidad y excepción a clases ceremoniales | OP01-OP02 |
| Modelos contienen fieldMap y traducciones físicas históricas | Mantener la traducción en el Dater en ejemplos COBRIA y comprobar coherencia de esquemas | OP02 |
| Catálogos con códigos estables y LanguageManager | Separar dato persistido, significado y etiqueta traducida | OP03 |
| DataDB tiene cursor, límite de IDs, caché y pendingReads | Acotar consulta y detalles antes de añadir derivados | OP04 |
| Registro de servicios cambia con usuario y conserva dispose | Contexto de caché, limpieza por sesión y ciclo de listeners | OP05-OP06 |
| OfflinePolicy es opt-in y desconocido significa online-only | Preflight del lote, TTL y cola limitada; ejemplo de borradores | OP07 |
| AsyncActionController agrupa acciones en vuelo | Distinguir doble clic local e idempotencia de servidor | OP08 |
| Handlers/lib y legacy-index reducido a inicialización | Una autoridad por operación y retiro verificable de legado | OP09 |
| Proyección diaria incluye versión de cobertura de relaciones | Reconciliación y declaración de cobertura histórica | OP10 |
| Telemetría sanitizada y cola acotada | Vocabulario cerrado, privacidad y límite de memoria | OP11 |
| Promoción exige SHA, staging, respaldo/restauración y aprobación | Concordancia de evidencias por candidato y artefacto | OP12 |

## Diferencias que no deben copiarse sin análisis

1. La correspondencia uno a uno entre Object, Dater y Service es una política del caso;
   una entidad simple no requiere tres clases vacías para adoptar COBRIA.
2. El mapa de estructura describe formatos y componentes históricos. Los caminos
   reales, el bootstrap y los límites actuales necesitan prioridad al auditar.
3. La traducción física en modelos del caso se documenta como contraste; COBRIA mantiene
   dominio independiente de claves físicas.
4. Límites de páginas, bytes, TTL, roles y nodos nX son decisiones locales, no valores
   normativos universales. Tampoco se incorpora material SQL histórico al manual público.
5. Las reglas que se verifican por búsqueda textual pueden omitir imports relativos,
   dinámicos y construcciones del lenguaje. Un gate estructural no demuestra seguridad
   o corrección semántica total.
6. La caché de existencia o el manejo de errores deben distinguir ausencia y acceso
   denegado. Ocultar un rechazo como ausencia puede impedir diagnosticar un defecto.
7. SHA, digest y archivo JSON consistente no demuestran autenticidad o ejecución humana.
8. La publicación manual observada no obliga a descartar CI en otros proyectos.

## Productos modificados

- Manual profundo de organización y operación con fuentes y límites.
- Doce fichas compartidas entre libro y sitio, asociadas a módulos relevantes.
- Ejemplo neutral de caché, offline, acción única, telemetría y concordancia de entrega.
- Pruebas funcionales del ejemplo y puerta de verificación editorial.
- Libro regenerado; contenido práctico del sitio y buscador ampliados.

La referencia de origen es privada y no concede redistribución por defecto. Se extrajeron
observaciones y principios, y el código neutral se escribió para COBRIA; no se incorporó
el código o documentación del origen como una biblioteca redistribuida.

## Verificación de esta incorporación

- Ejemplo neutral: 19 de 19 pruebas aprobadas y demostración ejecutada.
- Sitio: lint aprobado y 9 de 9 pruebas aprobadas, incluida la incorporación de las doce prácticas.
- Validación editorial R5 aprobada y `git diff --check` sin errores.
- Libro regenerado: 245 páginas; cuaderno: 35 páginas. Las trece páginas nuevas del bloque de prácticas y el taller complementario se renderizaron y revisaron visualmente sin cortes.
- `make verificar` no completó: la réplica histórica importa `replication/src/cobria.mjs`, que estaba eliminado en el árbol de trabajo. No se restauró ni se reemplazó ese archivo para preservar los cambios existentes.
- No se ejecutó la suite completa de POS Guápiles, ni staging, restauración o despliegue. El sitio actualizado permanece local; no se publicó ni se hizo commit o push.

## Cierre local del import histórico

Base Git auditada: `7b5293db626aa71ed04fe552610260224a410518`. El árbol contiene
cambios sin confirmar; este SHA identifica la base, no todos los archivos generados.
La ruta eliminada `replication/src/cobria.mjs` no se restauró. Se recuperó su contenido
exacto desde ese objeto Git en `replication/historical/memory-model/cobria.mjs`, con
SHA-256 `c7941c80a50a983aa8d658aa4ef1083447a815f585c2aa1cd7ed3e4533387d7e`.
El único cambio funcional en las cinco pruebas históricas fue el import; no se
quitaron aserciones. La regresión histórica y los siete contratos de `core11.test.mjs`
superaron conjuntamente 12/12 pruebas.

Después de la corrección, `make verificar` finalizó con código 0: currículo y ejemplo
operativo (19/19), validadores de fases 2–36, R7/R8, réplica (87/87), aplicación
neutral (23/23), lint del sitio y pruebas renderizadas del sitio (9/9). No hubo
pruebas omitidas en esas tres suites principales. Los validadores comprueban sus
artefactos existentes: aprobarlos no equivale a repetir 270 corridas distribuidas,
obtener revisión humana o ejecutar una restauración real. El log local está en
`/tmp/cobria-cierre-local-verificar.log`; no es un artefacto versionado permanente.
El gate regenera derivados editoriales y descargas locales; no publica ni despliega.

La desaparición no consta como commit de traslado: es una eliminación del árbol de
trabajo mientras las referencias permanecían activas. No se infiere quién la hizo
ni su intención. `src/core/cobria.mjs` es una implementación distinta, asíncrona,
con revisión positiva y adaptadores; no exporta las clases del modelo inicial.
Cambiar el import hacia ella sin adaptar los contratos sería una falsa reparación.
El modelo histórico sigue siendo limitado: reconstruye sobre el almacén activo y
no demuestra publicación segura C2. Los manifiestos de paquetes antiguos y la
referencia SQL histórica no se reescribieron como si fueran una nueva ejecución.

## Técnica definida y aplicación responsable

La autoridad normativa es `specification/`, pero cada documento conserva su alcance:

| Naturaleza | Fuente | Técnica definida | Aplicación al proyecto |
|---|---|---|---|
| Core congelado | `COBRIA-CORE-1.0.md` | Contrato `K = <C, f, theta, s, v, phi, e, r, o>` e invariantes de autoridad, ámbito, procedencia, reconstrucción, equivalencia, idempotencia, revisión, publicación, operación y fallo cerrado | Inventariar cada proyección y comprobar las obligaciones del nivel C1/C2/C3 que se quiera declarar; una carpeta o prueba aislada no acredita conformidad |
| Separación de alcance | `ADR-0001-ALCANCE-ECOSISTEMA.md` | Core es estrecho; recomendaciones del libro no amplían conformidad | No convertir todo patrón observado en POS en obligación Core ni atribuir novedad absoluta |
| Decisión del ecosistema | `ADR-0003-CLAVES-FISICAS-AISLADAS.md` | Diccionario versionado y traducción física en Dater/adaptador | Migrar gradualmente mapas físicos de modelos hacia la frontera de datos; conservar nombres lógicos en dominio, UI e IA |
| Arquitectura de referencia | `phase-5/architecture.yaml` | Dominio independiente; aplicación coordina puertos; presentación traduce; infraestructura implementa; composición conecta | Auditar imports y responsabilidades reales, no exigir clases vacías Object/Dater/Service por entidad |
| Método y ejemplo neutral | `phase-3/DICCIONARIO-DATOS.md`, `phase-4/NODOS-Y-AGREGADOS.md` | Separar modelo conceptual, lógico y físico; elegir anidamiento, referencia, índice o proyección por identidad, ciclo de vida, permisos y carga | `n8`, `a`–`i`, plazos e índices del ejemplo no son universales; el prefijo del nodo no determina autoridad |
| Contratos de adopción Engineering | `phase-19/REQUISITOS-ENGINEERING.md` | ENG-001–008: UX, autoridad, offline, entrega, telemetría, costo, legado e incidentes | Adoptar los contratos pertinentes y probar aceptación; no confundir sus gates documentales con seguridad o recuperación real |
| Enseñanza incorporada | `manuales/24-organizacion-y-operacion-del-proyecto.md` y prácticas OP01–OP12 | Pasos, ejemplos, comprobaciones y límites observados | Aplicables a POS u otros repositorios tras contrastar contexto; no añaden requisitos a Core |

En POS, la correspondencia entre estas técnicas y el código se registró en las
observaciones anteriores. Las diferencias también importan: un mapa físico en una
entidad no satisface la separación que pide el ADR; deduplicar un clic no garantiza
idempotencia de servidor; validar un JSON de entrega no prueba que hubo restauración
o aprobación humana; un gate textual no comprueba todas las dependencias del lenguaje.
El núcleo asíncrono de referencia tampoco se presenta como prueba automática de todas
las invariantes: su control de revisión mediante lectura/listado y escritura no
demuestra exclusión concurrente o compare-and-swap atómico entre procesos.

Para otro proyecto, el orden es: identificar autoridad y ámbito, documentar contratos
y consultas, seleccionar las fronteras mínimas, implementar pruebas positivas y
negativas, medir costos y solo entonces declarar el alcance realmente verificado.
No se ejecutaron nuevos experimentos científicos ni servicios externos en este cierre.

## Límites de la incorporación pedagógica

## Preflight R9 del 12 de octubre de 2026

Con autorización del responsable se recuperaron desde HEAD diez archivos eliminados
todavía necesarios: las cinco partes incluidas por `main.tex`, `referencias.bib`,
el diccionario terminológico, las dos imágenes declaradas en procedencia y el ZIP
histórico declarado en ese inventario. Se restauraron únicamente esas rutas, no los
archivos modificados ni las demás eliminaciones. El modelo histórico de memoria
permanece en su ruta separada y no se restauró `replication/src/cobria.mjs`.

La puerta de procedencia R2 aprobó; el maestro y el artículo se regeneraron con
197 y 14 páginas respectivamente. Se inspeccionaron sus primeras páginas renderizadas;
esto no es una revisión visual integral de las 211 páginas. R3, R4 y R5 aprobaron.
`make verificar-publicacion` falló en R6 porque `npm audit --audit-level=high`
informó 13 vulnerabilidades altas en el sitio. No se ejecutó `npm audit fix --force`,
no se rebajó el gate ni se presentó ese fallo como aprobación de publicación.

No hay nuevo commit candidato, clon limpio, doble construcción ni paquete RC2 de
este corte. Los archivos generados no representan una nueva release publicada.
El log del preflight está en `/tmp/cobria-r9-recuperacion.log`. Antes de construir
la candidata hay que corregir las dependencias con pruebas de compatibilidad y
resolver la selección de las restantes eliminaciones del árbol de trabajo.

La comprobación general posterior `make verificar` finalizó con código 0; su log
es `/tmp/cobria-r9-verificar-2026-10-12.log`. `git diff --check` no detectó errores.
Esta aprobación funcional no reemplaza la puerta de publicación R6 que falló.

Esta auditoría aporta trazabilidad estructural y enseñanza. No modifica COBRIA Core,
no añade observaciones a P1/P2/R1/S1/A1 y no demuestra superioridad arquitectónica,
ahorro porcentual, eficacia educativa o transferencia independiente. Estos resultados
requieren protocolos y ejecuciones propios.
