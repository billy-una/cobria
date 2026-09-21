# Manual para agentes de IA

## Objetivo

Un agente debe comprender qué es autoridad, qué puede editar, qué debe regenerar y cómo
demostrar un cambio antes de escribir. `AGENTS.md` ofrece instrucciones jerárquicas y
`agent-policy.json` constituye el contrato legible por máquinas.

## Secuencia obligatoria

1. leer instrucciones raíz y del módulo;
2. identificar objetivo, alcance y autoridad;
3. consultar fuentes y trazabilidad antes de inferir;
4. declarar archivos, invariantes, pruebas, riesgos y decisiones humanas pendientes;
5. validar el plan contra la política;
6. hacer el cambio mínimo;
7. ejecutar pruebas específicas y después el gate integral;
8. informar evidencia y limitaciones sin exagerar.

## Confusiones que se deben impedir

- Una clave `a` no es un concepto del dominio: es una representación física traducida.
- Un derivado no sustituye al documento canónico como autoridad.
- `staging` no es producción y no comparte sus datos personales o secretos.
- Un texto pedagógico no modifica la especificación normativa.
- Una prueba local no demuestra comportamiento distribuido ni seguridad productiva.

## Cambios prohibidos sin persona autorizada

Despliegue productivo, rotación de secretos, consentimiento de participantes, publicación
formal, aceptación legal y cambios incompatibles al núcleo congelado requieren decisión
humana. El agente puede preparar material y verificaciones, pero no declarar esa decisión.

## Contexto portátil

Ejecute `npm run context:agent` dentro de `replication/`. El JSON generado reúne tarea,
política, instrucciones y checks recomendados, por lo que puede suministrarse a otra IA
sin copiar el repositorio completo.
