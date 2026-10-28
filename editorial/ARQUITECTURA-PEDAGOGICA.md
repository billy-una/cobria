# Arquitectura pedagógica de COBRIA

**Estado:** fuente editorial de la candidata pública; no normativa  
**Fuente estructurada construida:** `editorial/curriculum.json`  
**Fuentes editables:** `editorial/pedagogy.json`, `editorial/pedagogy-extension.json`, `editorial/labs.json` y `editorial/engineering-practices.json`  
**Trazabilidad:** `editorial/content-map.json`

## Separación de productos

| Producto | Pregunta que responde | Autoridad |
|---|---|---|
| Documento maestro | ¿Cómo se desarrolló y evaluó la investigación? | Desarrollo metodológico |
| Artículo científico | ¿Cuál es la contribución concreta y qué evidencia la sostiene? | Síntesis científica |
| Especificación Core | ¿Qué debe cumplir una implementación C1, C2 o C3? | Normativa |
| Libro | ¿Cómo aprende y aplica una persona cada decisión? | Pedagógica |
| Sitio | ¿Cómo navega, practica y consulta el mismo contenido? | Pedagógica e interactiva |

El libro y el sitio comparten una ruta de diecisiete partes, 85 lecciones y 30
laboratorios auténticos. El artículo describe esa
ruta únicamente como artefacto de transferencia; no la presenta como prueba de eficacia
educativa. El maestro y la especificación no se copian completos dentro de cada lección:
se traducen según la necesidad del lector y se enlazan cuando una precisión normativa o
metodológica resulta necesaria.

Doce prácticas OP01-OP12 conectan los módulos con organización, diccionario, catálogos,
consultas, cachés, listeners, offline, UX, Functions, cobertura, telemetría y entrega.
Son profundización transversal y no incrementan el número de lecciones ni laboratorios
de la ruta. Se publican íntegramente en el libro y `/construir`, con vínculos desde los
módulos y el buscador. Cinco mecanismos tienen código y pruebas en
`replication/examples/operacion-documental/`; los otros fragmentos son contratos orientativos.

## Modelo de una lección

1. **Situación:** problema reconocible antes de introducir vocabulario técnico.
2. **En palabras sencillas:** una sola idea principal.
3. **Paso a paso:** acciones breves y ordenadas.
4. **Ejemplo realista:** caso neutral de observaciones de biodiversidad.
5. **Error frecuente:** atajo plausible y su consecuencia.
6. **Código o contrato mínimo:** fragmento legible, no pseudocomplejidad ornamental.
7. **Evidencia:** forma observable de comprobar el resultado.

## Reglas editoriales

- El lector no necesita formación previa en arquitectura.
- Todo término se explica antes de utilizarse como requisito.
- Una lección introduce una decisión principal y termina con una entrega revisable.
- Los ejemplos son NoSQL documentales, neutrales y sin nombres de los proyectos de origen.
- No se atribuye a COBRIA la invención aislada de mecanismos conocidos.
- La seguridad, la accesibilidad, la privacidad y la operación forman parte del recorrido,
  no anexos opcionales.
- Una prueba local no se describe como validación universal o humana.
- La web debe reflejar el mismo orden, títulos, ejemplos y resultados del libro.

## Criterio de completitud

Los requisitos siguientes son de completitud estructural. No acreditan profundidad,
ejecución de cada ejercicio ni comprensión del lector. La evaluación de cierre vigente
se rige por `ROADMAP-CIERRE-C0-C15.md` y la línea base `editorial/c0/coverage.json`.
Los campos de evidencia de las lecciones expresan qué comprobar, no que esa
comprobación ya se haya ejecutado.

Una parte está completa cuando posee propósito, resultados de aprendizaje, proyecto,
entrega, al menos cinco lecciones con el modelo anterior, un punto de control, fuentes,
vínculo navegable para cada lección y representación equivalente en el libro. El
recorrido completo contiene exactamente 30 laboratorios con procedimiento, resultado
esperado, solución comprobable y comando. La construcción debe detectar rutas faltantes,
contenido en inglés no justificado y diferencias entre la cantidad declarada y la real.

## Flujo de publicación

1. Se editan las cuatro fuentes humanas del currículo.
2. `node editorial/build-curriculum.mjs` valida y genera currículo y trazabilidad.
3. El libro y el sitio importan `curriculum.json`; ninguno mantiene una segunda lista.
4. Las fases de investigación permanecen en el anexo técnico, no en la ruta del lector.
5. Las cifras experimentales se leen de resultados verificables, nunca del currículo.
