# Protocolo experimental COBRIA 1.1

## Preguntas

- **PI1:** ¿qué costo introduce COBRIA frente a CRUD documental directo?
- **PI2:** ¿cuánto mejora recuperación, trazabilidad y aislamiento?
- **PI3:** ¿los resultados se conservan entre motores y tamaños?
- **PI4:** ¿pueden reproducirse conjuntos analíticos e índices para IA sin fuga de ámbito?

## Líneas base

CRUD directo, proyección no gobernada, CQRS mínimo, bitácora de eventos y COBRIA C2. No se afirmará equivalencia completa con implementaciones industriales de CQRS o Event Sourcing; son controles operacionales delimitados.

## Escenarios

P1 lectura equivalente; P2 costo de escritura; R1 reconstrucción; S1 aislamiento; A1 manifiesto analítico; D1 eliminación; D2 interrupción; D3 concurrencia; D4 revisiones en conflicto; D5 desconexión; D6 reanudación; D7 migración de esquema; D8 migración de motor.

## Motores

PouchDB y LokiJS como controles locales. MongoDB y CouchDB como adaptadores distribuidos. Un motor solo entra en resultados cuando se registra versión, configuración, topología y salida completa de conformidad.

## Diseño

Tamaños 100, 1 000, 5 000 y 25 000; calentamiento declarado; mínimo 30 repeticiones por celda; orden aleatorizado; semilla registrada. Se informan p50, p95, p99, mediana, desviación absoluta mediana e intervalo bootstrap del 95 %.

## Variables

Latencia, rendimiento, bytes leídos/escritos, amplificación, almacenamiento, convergencia, tiempo de recuperación, divergencia, documentos cruzados, citas válidas y abstención apropiada.

## Reglas de análisis

No eliminar valores atípicos sin causa operacional registrada. Comparar mediante razón de medianas e intervalo bootstrap; añadir tamaño de efecto no paramétrico. Separar resultados confirmatorios de pilotos y ejecuciones incompletas.

## Criterios

Autoridad, ámbito y equivalencia son puertas obligatorias. Una mejora de latencia no compensa su incumplimiento. Los experimentos MongoDB/CouchDB permanecen “preparados” mientras no exista infraestructura ejecutable.

