# ADR-0001 — Separar el ecosistema general de COBRIA Core

**Estado:** aceptado  
**Fecha:** 2026-09-07  
**Responsable:** Billy Jak Cordero Porras

## Contexto

COBRIA nació como propuesta para datos canónicos y proyecciones reconstruibles NoSQL.
El material posterior incorporó capas, patrones, documentación, seguridad, nube,
operación, experiencia de usuario e IA. Convertir toda recomendación en requisito Core
haría imposible distinguir la contribución científica de un manual general de software.

## Decisión

COBRIA será un ecosistema pedagógico y verificable gobernado por `MANIFESTO.md`.
COBRIA Core permanecerá como especificación normativa estrecha para autoridad,
identidad, ámbito, revisión, procedencia, equivalencia, reconstrucción, publicación y
retiro de representaciones documentales NoSQL derivadas.

Libro, sitio y manuales explican o amplían prácticas, pero no crean conformidad Core.
Artículo y documento maestro pueden analizar el ecosistema, aunque toda afirmación
empírica debe señalar la evidencia y la versión evaluada.

## Alternativas descartadas

1. **Convertir COBRIA completo en una norma:** mezcla recomendaciones generales con
   requisitos evaluados y produce conformidad ambigua.
2. **Mantener productos independientes:** favorece contradicciones terminológicas y
   duplicación editorial.
3. **Reducir COBRIA solamente a Core:** pierde el valor pedagógico para personas menos
   experimentadas y agentes de IA.

## Consecuencias

- existen fuentes canónicas diferentes para norma, evidencia y enseñanza;
- toda página o capítulo debe indicar su naturaleza;
- los niveles C1, C2 y C3 pertenecen a Core, no al ecosistema completo;
- nuevas áreas se incorporan como manuales antes de considerar una norma;
- cambios incompatibles de Core requieren la política de versiones de Core.

## Criterio de revisión

La decisión se revisará si evidencia externa demuestra que la separación impide adoptar
o verificar COBRIA. Agregar contenido editorial, por sí solo, no justifica cambiarla.

