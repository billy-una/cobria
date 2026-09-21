# COBRIA Toolkit

**Versión:** 1.0  
**Estado:** ejecutable localmente; no despliega ni certifica por sí solo

## Propósito

Toolkit convierte reglas repetibles en comandos comprensibles por personas, CI y agentes.
Automatiza validación, generación, explicación y simulación; las decisiones semánticas y
atestaciones humanas permanecen fuera de su autoridad.

## Comandos

| Comando | Resultado |
|---|---|
| `iniciar` o `init` | manifiesto mínimo sin sobrescribir |
| `validar` | estructura, IDs, versiones y referencias |
| `explicar` | descripción y procedencia de un concepto |
| `contexto` | paquete acotado para persona o agente |
| `impacto` | dependencias y consumidores afectados |
| `auditar` | hallazgos estáticos explicables |
| `medir` | inventario de manifiestos y estados |
| `generar` | código, prueba, documento y manifiesto |
| `verificar` | conformidad funcional de un adaptador |
| `informar` | salida HTML y JSON con límites |
| `publicar --simular` | plan sin despliegue, credenciales ni mutaciones |

## Seguridad de generación

Antes de escribir se valida tipo, nombre y destino. La misma entrada produce los mismos
bytes. Un archivo idéntico se conserva; uno divergente detiene toda la operación. Los
nombres que escapan rutas o inyectan código se rechazan. Cada generación incluye caso
negativo y cuatro artefactos relacionados.

## Informes duales

La salida humana está en español y la salida JSON usa códigos estables. `informar` produce
ambos archivos y declara que el análisis es local. Un hallazgo automático no se convierte
en defecto confirmado, ranking o certificación.

## Modo de simulación

```bash
node replication/src/cli.mjs publicar --simular \
  --ambiente staging \
  --artefacto sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
  --json
```

Sin `--simular`, el comando falla. La salida declara `mutations: 0` y enumera cuenta,
variables, reglas, pruebas, humo y rollback que una promoción real debería comprobar.

## Agentes de IA

Un agente recibe tarea, rutas autorizadas, archivos protegidos, comandos de aceptación y
presupuesto. Toolkit no le permite modificar Core congelado, resultados experimentales o
atestaciones humanas. Un informe generado por IA se identifica como tal.

**Criterio de avance:** ningún comando destructivo opera sin objetivo validado y las
salidas distinguen propuesta, implementación, ejecución y validación externa.
