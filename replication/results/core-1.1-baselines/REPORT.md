# Líneas base funcionales Core 1.1

Modelos mínimos delimitados sobre LokiJS. No representan implementaciones industriales completas, un índice físico del motor, CQRS con mensajería ni Event Sourcing con todas sus garantías.

| Control | N | Escritura p50 ms | Lectura p50 ms | Recuperación aplicable | Recuperable |
|---|---:|---:|---:|---|---|
| documento-directo | 100 | 0.522 | 0.197 | no | sí |
| documento-directo | 1000 | 3.781 | 1.486 | no | sí |
| documento-directo | 5000 | 29.388 | 9.145 | no | sí |
| indice-filtrado | 100 | 0.674 | 0.185 | no | sí |
| indice-filtrado | 1000 | 3.755 | 1.483 | no | sí |
| indice-filtrado | 5000 | 28.206 | 9.012 | no | sí |
| proyeccion-no-gobernada | 100 | 1.081 | 0.078 | sí | no |
| proyeccion-no-gobernada | 1000 | 4.988 | 0.492 | sí | no |
| proyeccion-no-gobernada | 5000 | 43.933 | 2.775 | sí | no |
| cqrs-minimo | 100 | 0.944 | 0.080 | sí | sí |
| cqrs-minimo | 1000 | 5.324 | 0.514 | sí | sí |
| cqrs-minimo | 5000 | 42.758 | 3.021 | sí | sí |
| bitacora-reconstruible | 100 | 0.493 | 0.204 | sí | sí |
| bitacora-reconstruible | 1000 | 3.879 | 1.565 | sí | sí |
| bitacora-reconstruible | 5000 | 33.446 | 9.866 | sí | sí |
| cobria-c2 | 100 | 1.373 | 0.065 | sí | sí |
| cobria-c2 | 1000 | 7.925 | 0.456 | sí | sí |
| cobria-c2 | 5000 | 59.202 | 2.887 | sí | sí |
