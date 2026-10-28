# Integrar una aplicación sin ocultar pasos

Un libro presenta capítulos correctos por separado, pero cada uno usa una entidad distinta y al unirlos no coinciden contratos, permisos ni formatos. La persona debe inventar la conexión que el material prometía enseñar.

## Antes de empezar

Recorre los casos de registro, datos, API y seguridad. La persistencia documental local necesita las dependencias fijadas del ejemplo integral.

## Vocabulario

- Hito: Estado ejecutable con una conducta demostrada.
- Agregado: Límite de datos y reglas que cambia como unidad.
- Prueba integral: Comprobación de varias piezas conectadas en un flujo.

## Resolver el problema

Conserva el proyecto conductor: observaciones, catálogo, resumen y recuperación. Primero funciona memoria; luego se aprende el diccionario; después se conecta HTTP y un motor documental local. El ejemplo integral C8 ya tiene formulario, catálogo y persistencia PouchDB. Su guía declara instalación, ambiente y sesiones DEMO. No lo describas como autenticación institucional ni como despliegue administrado.

Cada incremento debe mantener el anterior. Una prueba de registro no reemplaza la de migración y la interfaz no reemplaza la prueba de permiso. El ADR del agregado explica por qué el registro durable integra operación y resultado en una unidad. Esa decisión difiere de las dos escrituras del taller en memoria y no debe atribuirse retroactivamente a aquel.

## Seguir el ejemplo

1. Consulta el hito en memoria y conserva sus rechazos.
2. Sigue manuales/33-aplicacion-integral-neutral.md para instalar el ejemplo C8 con su bloqueo de dependencias.
3. Ejecuta el flujo permitido, cierra, reabre y comprueba persistencia y recuperación según su guía.

Artefacto trabajado, no programa que se deba ejecutar:

```json
{
  "hitos": [
    {
      "nombre": "memoria",
      "demuestra": "reglas y repetición secuencial"
    },
    {
      "nombre": "datos",
      "demuestra": "traducción y catálogo"
    },
    {
      "nombre": "HTTP",
      "demuestra": "contrato y estados"
    },
    {
      "nombre": "documental local",
      "demuestra": "persistencia y recuperación del ejemplo"
    }
  ],
  "noDemuestra": [
    "autenticación productiva",
    "servicio administrado",
    "distribución multinodo"
  ]
}
```

## Alternativa y costo

Mantén memoria para enseñar reglas si aún no necesitas persistencia. Conectar un motor antes de entender el contrato agrega fallos que dificultan aprender.

Una aplicación integral tiene más configuración y dependencias. El bloqueo, la guía de arranque y la recuperación forman parte de su mantenibilidad.

## Caso adverso y recuperación

Cambiar la entidad de cada capítulo impide reproducir una entrega completa. Un motor persistente tampoco vuelve confiable un contexto de usuario que sigue siendo DEMO.

Fija un hito funcional, compara contratos y conecta una frontera por vez. Ejecuta sus pruebas antes de añadir otra tecnología; conserva una ruta de regreso al hito anterior.

## Tu ejercicio

Redacta una lista de aceptación para pasar del hito de memoria al documental. Incluye reinicio, repetición, catálogo, permiso cruzado y recuperación en otro destino.

## Solución explicada

Después del reinicio debe existir el registro, el reintento no duplica la intención bajo el contrato durable y la edición del catálogo sigue interpretable. El ámbito ajeno se rechaza. La recuperación prueba un destino nuevo con fuentes y huellas. La lista señala la guía exacta y las dependencias, y mantiene pendientes autenticación productiva y operación remota.

## Revisar la entrega

- Los hitos usan el mismo vocabulario y contratos.
- Se comprueba reinicio y recuperación, no solo primer arranque.
- Se separa DEMO de identidad confiable.

## Continuar

Automatiza trabajo repetitivo sin confundir un esqueleto generado con una solución terminada.

Fuentes del proyecto:

- [33-aplicacion-integral-neutral.md](../../manuales/33-aplicacion-integral-neutral.md)
- [README.md](../../replication/examples/integral-c8/README.md)
- [ADR-C8-AGREGADO-LOCAL.md](../../manuales/decisiones/ADR-C8-AGREGADO-LOCAL.md)

