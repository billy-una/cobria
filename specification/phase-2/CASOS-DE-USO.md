# Casos de uso del ecosistema COBRIA

Cada caso expresa una intención, no una pantalla ni una tecnología.

## CU-01 — Iniciar un proyecto

**Actor principal:** ACT-01 o ACT-02.  
**Resultado:** alcance, responsables, riesgos y estructura mínima documentados.  
**Flujo:** describir necesidad → seleccionar nivel de adopción → registrar decisiones →
crear estructura mínima → verificar consistencia.  
**Excepciones:** si faltan responsables o aceptación, el proyecto permanece propuesto.

## CU-02 — Modelar un dato

**Actor principal:** ACT-04.  
**Resultado:** dato definido conceptual, lógica y físicamente, con identidad, ámbito,
tiempo, sensibilidad, retención, procedencia y responsable.  
**Excepciones:** una clave física sin significado no puede publicarse como contrato.

## CU-03 — Diseñar un módulo por capas

**Actor principal:** ACT-02 o ACT-03.  
**Resultado:** intención, dominio, puertos, adaptadores y composición poseen fronteras
comprobables.  
**Excepciones:** una dependencia de proveedor en dominio requiere corrección o ADR.

## CU-04 — Elegir un patrón o mecanismo

**Actor principal:** ACT-03.  
**Resultado:** problema, contexto, alternativa simple, consecuencias y prueba quedan
registrados.  
**Excepciones:** si no existe fuerza recurrente, se documenta como mecanismo o decisión,
no como patrón.

## CU-05 — Crear una representación derivada

**Actor principal:** ACT-04.  
**Resultado:** la proyección declara fuente, transformación, versión, ámbito, frescura,
equivalencia, reconstrucción, publicación, responsable y retiro.  
**Excepciones:** si un índice satisface el requisito con menor costo, se conserva una sola
representación.

## CU-06 — Verificar conformidad Core

**Actor principal:** ACT-06.  
**Resultado:** informe reproducible C1, C2 o C3 con requisitos aprobados y fallidos.  
**Excepciones:** una prueba omitida produce resultado incompleto, no conformidad.

## CU-07 — Preparar y promover un ambiente

**Actor principal:** ACT-07.  
**Resultado:** destino, cuenta, rama, variables, reglas, artefacto, pruebas, humo y
rollback están verificados.  
**Excepciones:** staging no recibe datos personales reales sin base y controles explícitos.

## CU-08 — Auditar seguridad y privacidad

**Actor principal:** ACT-05.  
**Resultado:** activos, actores, capacidades, amenazas, controles, evidencia y riesgo
residual quedan registrados.  
**Excepciones:** ausencia de hallazgos automáticos no equivale a seguridad completa.

## CU-09 — Evaluar rendimiento y costo

**Actor principal:** ACT-06 o ACT-07.  
**Resultado:** alternativas comparadas bajo carga, configuración, semilla y ambiente
congelados, incluyendo resultados negativos.  
**Excepciones:** una medición local no se generaliza a clúster o producción.

## CU-10 — Asistir un cambio con IA

**Actor principal:** ACT-09; supervisor ACT-02.  
**Resultado:** cambio acotado, explicado, probado y revisable sin exceder capacidades.  
**Excepciones:** el agente se abstiene ante falta de contexto, autorización o evidencia.

## CU-11 — Publicar conocimiento COBRIA

**Actor principal:** ACT-08 o ACT-10.  
**Resultado:** especificación, evidencia, artículo, maestro, libro y sitio conservan
versión, naturaleza y fuentes correctas.  
**Excepciones:** una cifra sin evidencia canónica no se publica como resultado.

## CU-12 — Reproducir o revisar externamente

**Actor principal:** ACT-08 externo.  
**Resultado:** revisión o réplica firmada identifica versión, ambiente, procedimiento,
resultados, desacuerdos y limitaciones.  
**Excepciones:** el autor no se presenta como revisor independiente ni participante.

