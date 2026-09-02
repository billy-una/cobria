# Auditoría profunda del ecosistema COBRIA

**Fecha de corte:** 1 de septiembre de 2026  
**Alcance:** especificación, implementación neutral, adaptadores, pruebas, resultados, artículo, documento maestro, libro y sitio.  
**Regla de honestidad:** una tarea que requiere personas, consentimiento o infraestructura externa no se marca como ejecutada por preparación documental.

## Dictamen ejecutivo

COBRIA posee una composición arquitectónica coherente y una producción editorial amplia, pero la auditoría encontró que parte de la evidencia empírica era más fuerte en volumen que en independencia del oráculo. R1 reconstruía de forma demasiado cercana a una copia, S1 no sembraba material ajeno y A1 se validaba principalmente con datos creados por el propio ensayo. Además, las comparaciones funcionales compartían casi la misma implementación. Estas debilidades podían producir aprobación sin demostrar completamente la propiedad declarada.

El arnés fue corregido, recibió pruebas mutantes y ahora distingue tres categorías: **evidencia histórica**, **validación funcional vigente** y **evidencia externa pendiente**. Las 450 corridas anteriores no fueron borradas ni reinterpretadas; quedaron reclasificadas como históricas hasta repetirlas con el oráculo fortalecido.

## Estado de los quince puntos prioritarios

| # | Mejora | Estado al cierre | Evidencia o siguiente puerta |
|---:|---|---|---|
| 1 | Revisión independiente real | preparada, pendiente humana | paquete y rúbrica en `review/` |
| 2 | Estudio de transferencia | preparado, pendiente participantes | protocolo, tareas y consentimiento en `human-study/` y `review/` |
| 3 | Repetición externa | paquete preparado | CLI, JSON, Markdown y manual; falta computadora/persona externa |
| 4 | OpenSearch 3.2.0 ARM nativo | pendiente infraestructura | incidente separado de COBRIA; no se sustituyen cifras |
| 5 | Infraestructura realista | parcialmente preparada | adaptadores y composición; faltan red, nodos, límites y servicios administrados |
| 6 | Comparación contra alternativas | mejorada | seis controles distintos, 540 corridas locales; no equivalen a marcos industriales |
| 7 | Métricas de costo total | parcial | latencia, escrituras, bytes, CPU y memoria; faltan costo monetario y mantenimiento longitudinal real |
| 8 | Estadística distribuida | completada sobre archivo histórico | p50, p95, p99, bootstrap pareado, fracción favorable y delta de Cliff |
| 9 | Trazabilidad integral | completada | matriz requisito-patrón-código-prueba-evidencia-amenaza-documento |
| 10 | Definición formal mínima | completada | invariantes, pre/poscondiciones, estados, publicación, aislamiento y equivalencia |
| 11 | Conformidad instalable | completada en alcance funcional | `cobria verificar --adaptador ...`; informe JSON y Markdown |
| 12 | Ejemplo neutral completo | existente y reforzado | observaciones del bosque, analítica e IA con procedencia |
| 13 | Revisión bibliográfica sistemática | protocolo preparado, cribado doble pendiente | no se inventaron segundos revisores |
| 14 | Separación editorial | aplicada conceptualmente | especificación normativa, artículo probatorio, tesis metodológica, libro pedagógico |
| 15 | Evolución controlada | aplicada | Core 1.0 congelado; 1.1 borrador; 1.2 paquete experimental; registro de cambios actualizado |

## Hallazgos adicionales a los quince puntos

### A. Validez del oráculo

Se añadieron dos adaptadores mutantes: uno oculta una manipulación de ámbito y otro corrompe una candidata. El arnés los rechaza. Esta prueba debe crecer hasta cubrir omisión, duplicación, revisión obsoleta y publicación no atómica. Un arnés que solo prueba implementaciones correctas no demuestra sensibilidad.

### B. Semántica de publicación

La implementación actual demuestra separación de candidata y activa, pero no un intercambio atómico provisto por cada motor. PUB-001 permanece con cobertura parcial. Cada adaptador distribuido debe implementar y probar alias, puntero o catálogo activo bajo interrupción.

### C. Concurrencia

Las 30 carreras locales mostraron exactamente el riesgo esperado: una reconstrucción desde instantánea quedó con 100 documentos obsoletos. La reparación por revisión recuperó equivalencia en 30/30. Esto no demuestra consenso ni aislamiento distribuido, pero invalida cualquier texto que suponga que construir una candidata basta sin verificar vigencia.

### D. Seguridad

S1 prueba aislamiento lógico de ámbito y rechazo de cargas contradictorias. No sustituye autenticación, autorización del motor, cifrado, auditoría de acceso, canales laterales ni pruebas de penetración. La etiqueta correcta es “cobertura funcional del contrato de ámbito”.

### E. Analítica e IA

A1 comprueba procedencia, reconstrucción, partición temporal y abstención sin evidencia. No mide exactitud predictiva, sesgo, calidad generativa, ataques de recuperación ni daño humano. Estas afirmaciones deben permanecer separadas.

### F. Paquete de datos y cadena de custodia

Faltan identificadores persistentes públicos, firma de artefactos, archivo inmutable de versiones y comprobación desde una descarga limpia. Antes de enviar a revista conviene depositar una versión cerrada en un repositorio con DOI y registrar las huellas de código, datos y PDF.

### G. Construcción limpia e iCloud

Algunos archivos del documento maestro aparecen como `dataless` en iCloud. Esto impide garantizar hoy una construcción limpia del maestro desde cero aunque existan PDF previos. Deben hidratarse y copiarse a un repositorio local versionado antes de declarar reproducibilidad editorial completa.

### H. Propiedad intelectual y novedad

COBRIA debe seguir presentándose como contribución composicional y normativa: integra fuentes canónicas, proyecciones, procedencia, reconstrucción, ámbitos y evidencia. La novedad defendible reside en el contrato unificado, perfiles, trazabilidad, batería y método de decisión, no en afirmar la invención aislada de cada mecanismo.

## Cambios ejecutados durante esta auditoría

- Corrección de R1, S1 y A1 y fortalecimiento de P1/P2.
- La duplicación ahora inyecta una entrega repetida en el flujo de reconstrucción y A1 observa el estado vacío del adaptador al retirar la evidencia.
- Validación contradictoria de ámbito en cinco adaptadores.
- Diez pruebas automatizadas locales, incluidas dos mutaciones negativas.
- Banco de 300 fallos ejecutables sin aprobaciones constantes.
- Treinta carreras con detección de obsolescencia y reparación equivalente.
- Seis controles funcionalmente diferenciados y 540 corridas regeneradas.
- Estadística sobre 270 corridas históricas con p50, p95, p99, MAD, IQR, colas e intervalos.
- Modelo formal, matriz de trazabilidad y CLI de conformidad.
- Corrección del artículo, libro y sitio para no sobreafirmar conformidad.
- Construcción limpia del sitio y revisión visual de siete páginas representativas del libro de 234 páginas.

## Puertas de publicación

1. Repetir las cinco baterías con el arnés corregido en los tres motores distribuidos.
2. Resolver o cerrar formalmente OpenSearch 3.2.0 ARM nativo.
3. Ejecutar una réplica descargada desde cero en otra computadora.
4. Recibir dos revisiones independientes y responder cada hallazgo.
5. Ejecutar el estudio de transferencia con consentimiento y aprobación ética aplicable.
6. Completar el doble cribado bibliográfico.
7. Depositar versión, datos, código y documentos con huellas e identificador persistente.
8. Solo después actualizar resumen, conclusiones y estado de Core 1.1/1.2.

## Conclusión

La mejora más importante ya no es añadir páginas ni patrones. Es cerrar el circuito entre afirmación, requisito, prueba sensible a fallos, resultado reproducible y repetición externa. COBRIA ahora documenta mejor dónde llega su evidencia y dónde no; esa reducción de sobreafirmación aumenta su calidad científica.
