# ADR-0002 — Mantener requisitos en dos niveles

**Estado:** aceptado  
**Fecha:** 2026-09-15  
**Responsable:** Billy Jak Cordero Porras

## Contexto

COBRIA Core posee requisitos técnicos trazables sobre autoridad, identidad, ámbito,
revisión, procedencia y reconstrucción. El ecosistema ampliado necesita requisitos para
enseñanza, capas, documentación, nube, seguridad, calidad, IA y publicación. Mezclarlos
haría parecer que cualquier usuario de COBRIA debe implementar todo el ecosistema para
obtener conformidad Core.

## Decisión

Se mantienen dos espacios de identificadores:

- `AUT-001`…`CON-001`: requisitos de Core y sus complementos técnicos;
- `ECO-RF-*` y `ECO-RNF-*`: requisitos funcionales y no funcionales del ecosistema.

Un requisito ECO puede referenciar una prueba Core, pero no cambia su significado ni su
estado. La adopción de un módulo general es selectiva; la conformidad Core depende solo
del perfil C1, C2 o C3 declarado.

## Consecuencias

- se evita inflar Core con prácticas generales;
- la trazabilidad debe indicar siempre el espacio y la versión;
- el artículo científico puede concentrarse en Core, mientras el libro enseña el
  ecosistema;
- una futura herramienta debe validar ambos espacios sin confundirlos.

