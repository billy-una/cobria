# ADR-0017 — Fuente canónica editorial

**Estado:** aceptada  
**Fecha:** 2026-09-20

## Decisión

Identidad, versiones, módulos y afirmaciones compartidas se declaran una vez en
`editorial/canonical.json`. Un generador crea los formatos consumidos por LaTeX, libro y
sitio. CI falla cuando un derivado difiere o una cifra no coincide con su evidencia.

## Consecuencias

Se reduce la contradicción por copia manual. El contenido narrativo sigue necesitando
revisión humana y visual; la sincronización estructural no garantiza calidad editorial.
