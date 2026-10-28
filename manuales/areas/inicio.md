# Preparar una entrega pequeña que puedas explicar

Una brigada quiere registrar tres colibríes y contar una sola visita aunque alguien pulse dos veces. Si el primer objetivo es instalar nube, autenticación e IA, será difícil saber qué parte está fallando. La primera entrega debe ser más pequeña que el sistema deseado, pero conservar una regla de cantidad y un límite de reserva.

## Antes de empezar

Completa las diez unidades de De una idea a tu primera prueba. Usa la copia de ecosistema-app, no una base de datos personal.

## Vocabulario

- Entrega: Resultado observable que otra persona puede repetir.
- Memoria: Datos que desaparecen al terminar el proceso.
- Requisito: Conducta pedida y su condición de aceptación.

## Resolver el problema

Escribe primero una frase comprobable: al enviar la misma visita dos veces, queda una observación con cantidad tres. Una segunda frase cubre el rechazo: cero no se guarda. Una tercera separa las reservas. Esas frases son requisitos, no nombres de carpetas ni promesas de una tecnología.

Guarda una copia intacta y trabaja en otra carpeta. Abre package.json para distinguir las tareas disponibles y ejecuta start desde la aplicación. Mira el archivo que produce la salida antes de buscar una pantalla. Este inicio termina en la terminal; no tiene un servidor HTTP oculto ni conserva sesiones entre procesos.

## Seguir el ejemplo

1. Ejecuta las diez unidades del taller inicial en orden y conserva un cambio propio.
2. Ejecuta npm --prefix replication/examples/ecosistema-app start desde la raíz de COBRIA.
3. Comprueba la cantidad, la repetición y los dos rechazos en la misma ejecución.

Artefacto trabajado, no programa que se deba ejecutar:

```json
{
  "requisito": "La misma visita no se cuenta dos veces",
  "entrada": {
    "id": "obs-001",
    "ambito": "reserva-sur",
    "cantidad": 3,
    "revision": 1
  },
  "esperado": {
    "observaciones": 1,
    "colibries": 3
  },
  "rechazos": [
    "cantidad cero",
    "reserva no autorizada"
  ]
}
```

## Alternativa y costo

Una hoja de cálculo puede bastar para un recuento personal sin colaboración ni controles de acceso. No construyas todas las capas solo para justificar el uso del manual.

La copia de aprendizaje evita riesgo, pero no conserva información al cerrar. Anota esa limitación como una decisión de esta entrega, no como un defecto que se corrige escondiendo archivos.

## Caso adverso y recuperación

El proceso termina y al abrirlo de nuevo no aparecen visitas anteriores. Es el comportamiento de un almacén en memoria; cambiar el texto de éxito no añade persistencia.

Vuelve al ejemplo original y distingue repetir una intención dentro del proceso de repetir el proceso completo. La persistencia documental pertenece al recorrido de aplicación completa.

## Tu ejercicio

Escribe tres criterios para una visita de cinco colibríes. Cambia el programa de tu copia y entrega entrada, comando y salida. No cambies la prohibición de cantidad cero.

## Solución explicada

La entrada usa cantidad cinco; la repetición mantiene una observación; la cantidad cero sigue rechazándose. El criterio de éxito no es que aparezca una ventana: es que coincidan datos, efectos y rechazos. Adjunta la versión de Node y explica que los registros se perderán al cerrar.

## Revisar la entrega

- La cantidad cinco se observa en una ejecución real.
- La repetición conserva un solo efecto.
- La entrega declara memoria y no promete autenticación.

## Continuar

Ahora convierte la entrada en un objeto que no pueda existir con una cantidad inválida.

Fuentes del proyecto:

- [35-programar-desde-cero.md](../../manuales/35-programar-desde-cero.md)
- [primer-recorrido.mjs](../../replication/examples/ecosistema-app/src/primer-recorrido.mjs)

