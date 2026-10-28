# Escribir documentos que responden preguntas distintas

El equipo tiene un README enorme, pero una persona nueva no sabe ejecutar el programa y quien atiende un incidente no encuentra cómo restaurarlo. Mezclar una historia de diseño con comandos de emergencia obliga a leer demasiado cuando el tiempo importa.

## Antes de empezar

Ya puedes ejecutar un caso y explicar su entrada, resultado y rechazo. No necesitas inventar una plantilla para todo el proyecto.

## Vocabulario

- Tutorial: Recorrido para aprender haciendo una tarea.
- Referencia: Descripción precisa de contratos y parámetros.
- ADR: Registro de una decisión, sus opciones y consecuencias.

## Resolver el problema

Separa tutorial, referencia, explicación y guía operativa. El tutorial lleva de una copia nueva a una observación; la referencia define entradas y códigos; la explicación justifica el agregado; la guía operativa recupera un repositorio nuevo. Son necesidades distintas y pueden enlazarse sin repetir el mismo párrafo en cuatro lugares.

El ADR del agregado local conserva la opción elegida y lo descartado. El comentario de código debe aclarar una intención cercana; no puede sustituir esa historia. Una docstring de registrar debe explicar contexto, resultado, errores, efectos y límite de idempotencia. No prometas atomicidad si el repositorio usa dos operaciones separadas.

## Seguir el ejemplo

1. Consulta el tutorial y ejecuta una tarea de principio a fin.
2. Busca el mismo contrato en la referencia sin repetir los pasos de instalación.
3. Relaciona la decisión del agregado con su guía de recuperación.

Artefacto trabajado, no programa que se deba ejecutar:

```json
{
  "tutorial": "Registrar una visita desde una copia nueva",
  "referencia": {
    "entrada": [
      "documento",
      "contexto"
    ],
    "errores": [
      "ACCESS_DENIED",
      "IDEMPOTENCY_CONFLICT"
    ],
    "efecto": "registro en el repositorio"
  },
  "explicacion": "Por qué existe un límite de agregado",
  "guiaOperativa": "Restaurar en un repositorio nuevo y comprobar equivalencia"
}
```

## Alternativa y costo

Un solo README puede contener cuatro secciones claras en un proyecto pequeño. Dividirlo en docenas de archivos sin enlaces no lo vuelve más útil.

La documentación cambia con el contrato. Cada comando copiado y cada cifra histórica sin fuente aumenta el mantenimiento y la posibilidad de contradicción.

## Caso adverso y recuperación

Una guía de restauración que presupone claves, rutas o permisos no declarados no permite transferencia aunque su prosa sea correcta.

Ensaya la guía desde una carpeta nueva y registra cada supuesto faltante. Corrige la fuente compartida; no solo la captura o el PDF que la reproduce.

## Tu ejercicio

Redacta una docstring para registrar y una nota ADR que compare memoria con motor documental. Entrega además un enlace desde el tutorial hasta la recuperación.

## Solución explicada

La docstring declara actor, capacidad, ámbito, finalidad y clave; devuelve la observación y enumera rechazos. El ADR elige memoria solo para aprender y reconoce pérdida al cerrar. La alternativa documental exige persistencia y recuperación comprobadas. La guía indica un repositorio nuevo, no sobrescribir el activo. Cada documento responde una pregunta concreta.

## Revisar la entrega

- Se distinguen aprender, consultar, entender y operar.
- La docstring no inventa garantías.
- Los enlaces permiten ejecutar y recuperar sin conocimiento oculto.

## Continuar

Usa esa precisión para describir amenazas y controles que puedan rechazarse en pruebas.

Fuentes del proyecto:

- [34-documentacion-y-herramientas-practicas.md](../../manuales/34-documentacion-y-herramientas-practicas.md)
- [ADR-C8-AGREGADO-LOCAL.md](../../manuales/decisiones/ADR-C8-AGREGADO-LOCAL.md)
- [RECUPERACION-C8.md](../../manuales/operacion/RECUPERACION-C8.md)

