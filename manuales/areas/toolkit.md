# Generar sin sobrescribir y auditar sin certificar

Una IA propone generar un proyecto sobre una carpeta que ya contiene cambios. Un generador que sobrescribe archivos puede destruir una decisión que no conoce. Un informe verde de estructura tampoco demuestra que el nuevo programa esté autorizado o sea correcto.

## Antes de empezar

Sabes usar una terminal y reconocer la carpeta raíz. El Toolkit tiene dependencias propias; el taller inicial sin paquetes no las instala.

## Vocabulario

- Simulación: Plan de cambios sin crear ni modificar archivos.
- Generador: Herramienta que produce una estructura repetible.
- Auditor estático: Análisis del texto o estructura del programa, no de todos sus comportamientos.

## Resolver el problema

Instala las dependencias de réplica con npm ci --prefix replication antes del Toolkit. Usa --ayuda para consultar opciones reales y --simular para examinar el plan. El recorrido documentacion-c9 ya comprueba instalación local, generación y conflictos. Las rutas de salida deben ser propias y no contener secretos ni escritores concurrentes.

El plan simulado declara cero mutaciones y rutas previstas. Una generación real produce código, prueba, documento y manifiesto; todavía debes completar dominio, permisos y datos. El auditor estático encuentra reglas que sabe expresar, con falsos positivos y límites documentados. No convierte una carpeta en una certificación de seguridad ni en una conformidad Core completa.

## Seguir el ejemplo

1. Instala con el bloqueo declarado y consulta la ayuda del CLI.
2. Usa el ejemplo de simulación del tutorial C9 y revisa todas las rutas.
3. Solo en una copia propia, genera, ejecuta la prueba y repite para observar la idempotencia o el conflicto.

Artefacto trabajado, no programa que se deba ejecutar:

```json
{
  "comando": "generar --tipo entidad --nombre Observacion --directorio ejemplo-propio --simular --json",
  "aceptacion": {
    "status": "simulated",
    "mutations": 0,
    "created": []
  },
  "decision": "Revisar rutas y completar reglas antes de generar realmente"
}
```

## Alternativa y costo

Escribir una entidad pequeña a mano puede ser más comprensible que adoptar quince plantillas. Usa el generador cuando la repetición real compense mantenerlo.

Las plantillas crean dependencias sobre sus convenciones y necesitan evolución. Una prueba generada puede aprobar un esqueleto que todavía desconoce el negocio.

## Caso adverso y recuperación

Eliminar --simular cambia la autoridad del comando: ya puede escribir. Cambiar el destino a una carpeta ajena no está autorizado por haber revisado otro plan.

Detente ante un conflicto y compara el contenido. No borres la carpeta para conseguir un estado verde; elige un destino nuevo o integra manualmente con revisión.

## Tu ejercicio

Entrega un plan de generación con rutas esperadas, responsable, regla pendiente y prueba negativa que el esqueleto aún no cubre. Explica cómo comprobarás que la simulación no escribió nada.

## Solución explicada

El plan conserva mutations cero y created vacío; se contrasta el inventario anterior y posterior. La regla pendiente puede ser autorización por ámbito y su prueba negativa debe rechazar otra reserva. Antes de generar de verdad se revisa de nuevo el destino. La salida estructural del auditor no se presenta como validación funcional ni como permiso de publicación.

## Revisar la entrega

- Simulación y escritura tienen autoridad distinta.
- El destino no sobrescribe contenido divergente.
- Se identifica una regla que debe añadirse después de generar.

## Continuar

Conserva la evidencia de qué se ejecutó y qué sigue pendiente antes de publicar.

Fuentes del proyecto:

- [34-documentacion-y-herramientas-practicas.md](../../manuales/34-documentacion-y-herramientas-practicas.md)
- [cli.mjs](../../replication/src/cli.mjs)
- [recorrido.mjs](../../replication/examples/documentacion-c9/recorrido.mjs)

