# Protocolo de revisión de literatura COBRIA 1.2

## Pregunta

¿Qué mecanismos, propiedades y métodos de evaluación existen para gobernar representaciones derivadas reconstruibles en sistemas documentales, analíticos y de IA?

## Fuentes

ACM Digital Library, IEEE Xplore, SpringerLink, USENIX, arXiv para prepublicaciones identificadas como tales y documentación oficial de motores para propiedades operativas.

## Cadena base

`("materialized view" OR CQRS OR "event sourcing" OR provenance OR lineage OR "data contract") AND (rebuild OR reproducib* OR version* OR multi-tenant OR isolation)`

Extensiones: `RAG AND provenance`, `machine learning AND data leakage`, `NoSQL AND multi-tenant`, `change data capture AND recovery`.

## Inclusión

Trabajo primario o documentación oficial; propiedad o mecanismo relevante; método suficientemente descrito; texto completo disponible; español o inglés; 1990–2026.

## Exclusión

Contenido comercial sin detalles técnicos, duplicados, resúmenes secundarios sin fuente primaria, trabajos puramente relacionales sin relación transferible y afirmaciones sobre IA sin evaluación o procedencia.

## Selección

1. Deduplicar por DOI/título.
2. Revisar título y resumen.
3. Revisar texto completo.
4. Registrar causa de exclusión.
5. Extraer propiedad, mecanismo, costo, evidencia y diferencia con COBRIA.

## Semillas verificadas

- Chang et al. (2006), Bigtable, USENIX OSDI.
- DeCandia et al. (2007), Dynamo, ACM SOSP.
- Buneman, Khanna y Tan (2001), procedencia, ICDT.
- Gupta y Mumick, mantenimiento de vistas materializadas.
- Lewis et al. (2020), recuperación aumentada para tareas intensivas en conocimiento.
- Documentación oficial de MongoDB sobre multiinquilinato, búsqueda y concurrencia.

## Estado

Protocolo y semillas preparados. Una revisión sistemática completa requiere doble cribado independiente; no se presenta todavía como revisión sistemática concluida.

