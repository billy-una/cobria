# ADR-0004 — Diseñar topología por identidad y ciclo de vida

**Estado:** aceptado  
**Fecha:** 2026-09-19  
**Responsable:** Billy Jak Cordero Porras

## Contexto

Los almacenes documentales permiten anidar o separar información con facilidad. Diseñar
la topología según pantallas o nombres físicos genera listas crecientes, permisos
mezclados, escrituras paralelas y derivados difíciles de retirar.

## Decisión

La decisión de anidar, separar, referenciar, indexar o proyectar se toma mediante
identidad, propietario, ámbito, ciclo de vida, cardinalidad, crecimiento, atomicidad,
consultas, consistencia, retención y costo.

Los detalles pequeños y acotados que comparten todas esas propiedades pueden formar el
agregado. Los catálogos, eventos operativos, proyecciones y conjuntos analíticos se
separan porque poseen ciclos, responsables o garantías diferentes.

## Consecuencias

- la topología se explica sin depender del proveedor;
- se requieren manifiestos y pruebas adicionales;
- algunas lecturas necesitan índices o composición;
- la duplicación solo se acepta con autoridad y reconstrucción claras;
- migrar una ruta física no obliga a renombrar el dominio.

## Alternativas descartadas

- una colección por pantalla;
- un documento gigante por organización;
- normalización relacional trasladada literalmente a NoSQL;
- duplicación de cada consulta sin medición;
- inferir significado a partir de `nX`, `snX` o `lX`.

