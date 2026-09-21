# Líneas base Core 1.1

Controles funcionales delimitados sobre LokiJS. No representan implementaciones industriales completas de CQRS ni Event Sourcing.

| Control | N | Escritura p50 ms | Lectura p50 ms | Recuperable |
|---|---:|---:|---:|---|
| crud-directo | 100 | 0.291 | 0.136 | sí |
| crud-directo | 1000 | 3.616 | 1.456 | sí |
| crud-directo | 5000 | 24.076 | 7.774 | sí |
| proyeccion-no-gobernada | 100 | 0.614 | 0.138 | no |
| proyeccion-no-gobernada | 1000 | 7.675 | 1.471 | no |
| proyeccion-no-gobernada | 5000 | 62.372 | 8.599 | no |
| cqrs-minimo | 100 | 0.613 | 0.140 | sí |
| cqrs-minimo | 1000 | 7.713 | 1.442 | sí |
| cqrs-minimo | 5000 | 62.292 | 7.892 | sí |
| bitacora-eventos | 100 | 0.633 | 0.144 | sí |
| bitacora-eventos | 1000 | 7.644 | 1.439 | sí |
| bitacora-eventos | 5000 | 62.947 | 8.560 | sí |
| cobria-c2 | 100 | 0.626 | 0.140 | sí |
| cobria-c2 | 1000 | 7.684 | 1.407 | sí |
| cobria-c2 | 5000 | 59.150 | 7.872 | sí |
