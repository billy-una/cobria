# Comentarios, docstrings y nombres

## Qué debe explicar un comentario

- por qué existe una excepción o compromiso;
- qué invariante no es evidente;
- qué amenaza o condición de carrera se evita;
- por qué una operación aparentemente redundante es necesaria;
- qué compatibilidad histórica se conserva;
- qué evidencia o ADR gobierna la decisión.

## Qué no debe comentar

- repetir la sintaxis (`incrementar contador` encima de `contador++`);
- describir código obsoleto que ya no existe;
- justificar una mala separación de responsabilidades;
- incluir secretos, datos personales o información de producción;
- afirmar seguridad o rendimiento sin evidencia.

## Docstrings públicos

Una API pública documenta intención, parámetros con unidades, resultado, errores
estables, efectos, idempotencia y ejemplos. No promete detalles internos innecesarios.

## Nombres

- nombres de dominio en español coherente dentro del producto;
- nombres oficiales de tecnologías y bibliografía en su forma original;
- claves físicas compactas solo en Dater/infraestructura;
- booleanos como predicados (`estaActiva`, `puedePublicar`);
- funciones con verbo y objeto (`registrarObservacion`);
- evitar `manager`, `helper`, `utils` o `service` sin responsabilidad precisa.

## Deuda técnica

Formato recomendado:

```text
TODO(COBRIA-123, equipo-datos): retirar lector v1 cuando no existan documentos v1.
```

La tarea enlazada conserva prioridad, riesgo y aceptación. Si no existe sistema de
seguimiento, use un registro versionado de deuda; nunca un identificador inventado.

