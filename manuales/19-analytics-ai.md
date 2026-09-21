# COBRIA Analytics & AI

**Versión:** 1.0  
**Estado:** implementado en una tubería neutral determinista; modelos externos no evaluados  
**Fuentes:** `specification/analytics-ai/` y `replication/examples/ecosistema-app/`

## Propósito

Analítica e inteligencia artificial consumen evidencia gobernada; no reemplazan la fuente
canónica ni adquieren autoridad de escritura. Cada resultado debe poder explicar con qué
datos, versión, transformación, partición, política y modelo fue producido.

## Del dato operacional al conjunto reproducible

Un conjunto declara finalidad, consentimiento, ámbito, fuentes y revisiones, tiempo válido,
tiempo conocido, transformación versionada, exclusiones, partición, semilla y huella. El
tiempo válido dice cuándo ocurrió un hecho; el conocido dice cuándo el sistema pudo usarlo.
Una observación conocida después del corte no puede aparecer en entrenamiento.

La partición se diseña por entidad y tiempo antes de calcular rasgos. Si la misma entidad
aparece a ambos lados, existe fuga aunque los documentos sean diferentes.

```js
const manifiesto = construirConjuntoAnalitico({
  documentos,
  ambito: 'reserva-sur',
  corteTemporal: '2026-09-30T23:59:59Z',
  transformacion: { nombre: 'conteo-especies', version: '1.0.0' },
  calcularHuella,
  semilla: 42
});
```

## Características y modelos

Una característica declara significado, tipo, unidad, cálculo, ventana temporal, versión,
nulos y procedencia. El registro de modelos conserva identificador, versión, finalidad,
manifiesto de entrenamiento, evaluación, umbrales, responsable, rollback y retiro. Cambiar
prompt, incrustación, proveedor o política de recuperación produce otra versión evaluable.

## RAG limitado por ámbito

El orden de seguridad es obligatorio:

```text
autenticar → autorizar capacidad → filtrar ámbito → recuperar
→ ordenar → verificar citas → responder o abstenerse
```

Filtrar después de la similitud puede revelar existencia, puntuación o contenido ajeno. Una
cita incluye identidad, revisión y procedencia; un enlace decorativo no basta.

## Herramientas y agentes

Cada herramienta declara capacidad, esquema de entrada, ámbito, límite de costo, timeout,
idempotencia y necesidad de confirmación. El agente recibe la lista mínima. Una acción de
alto impacto requiere aprobación humana y vuelve a comprobar autorización al ejecutarse.
El contenido recuperado se trata como dato no confiable, nunca como instrucciones.

## Abstención, evaluación y deriva

Sin evidencia suficiente el resultado es `EVIDENCIA_INSUFICIENTE`. Se evalúan
reproducibilidad, fuga, violaciones de ámbito, citas, abstención, calidad por periodos y
grupos, deriva y costo. Una alerta de deriva no escribe ni reentrena por sí misma.

La evidencia histórica disponible contiene 30 repeticiones deterministas con cero fugas
temporales y de ámbito, 30 abstenciones apropiadas y citas válidas. Solo evalúa recuperación
léxica; no demuestra calidad generativa, ausencia de sesgo o utilidad humana.

## Auditoría narrativa

El registro conserva solicitud, finalidad, política, versiones, herramientas ofrecidas,
evidencia seleccionada, abstención, revisión y resultado, excluyendo secretos y contenido
personal innecesario. La retroalimentación es una observación, no verdad automática.

## Laboratorio

1. Construya dos particiones por entidad y tiempo.
2. Introduzca una fuga y compruebe el rechazo.
3. Intente recuperar contenido de otro ámbito.
4. Ejecute consulta con evidencia y sin evidencia.
5. Cambie el umbral y compare abstención y cobertura.
6. Registre una versión de modelo y ensaye rollback.
7. Simule deriva sin permitir reentrenamiento automático.

**Criterio de avance:** ninguna salida adquiere autoridad de escritura y cada resultado se
rastrea hasta entradas, versión, transformación, política y evidencia.
