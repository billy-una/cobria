# Pilot correction log

El protocolo 1.0.0 se congela después del piloto P1/R1. Toda corrección posterior debe
registrar motivo, impacto y nueva versión sin sobrescribir resultados raw.

Correcciones admisibles tras el piloto:

- aumentar iteraciones si el reloj produce demasiados valores cero;
- limitar tamaños si la memoria del entorno cambia la configuración;
- corregir instrumentación sin cambiar semántica de B0--C4;
- agregar una línea base, nunca retirar la línea base más fuerte observada.

## Piloto ejecutado

- Manifiesto: `pilot-2026-08-20T17-18-21-955Z`.
- Entorno: Apple M2, 8 GB, Node.js 24.2.0.
- Observaciones: 126.
- P1 produjo valores p95 medibles desde N=1 000.
- R1 alcanzó exactitud 1.0 en todas las corridas piloto.
- Se descubrió y corrigió un defecto de reconstrucción repetida: el rebuild limpiaba la
  proyección sin reiniciar las claves de idempotencia asociadas con esa generación.
- La matriz final queda limitada a N=50 000 para evitar cambiar de configuración por
  presión de memoria.
- No se eliminaron líneas base ni escenarios desfavorables.
