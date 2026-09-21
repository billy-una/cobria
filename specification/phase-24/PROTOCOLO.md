# Protocolo de revisión semántica independiente

## Pregunta

¿Puede una persona independiente decidir, usando evidencia acotada, si cada contrato
ENG-001..ENG-008 está semánticamente respaldado en tres sistemas distintos?

## Diseño

Dos revisores trabajan por separado sobre las muestras M-01, M-02 y M-03. No reciben la
clave de identidad ni los resultados automáticos de la fase 23. Cada decisión usa una de
tres categorías: `supported`, `unsupported` o `insufficient`, confianza de 1 a 5 y una
justificación. Después de cerrar ambas respuestas se calcula acuerdo bruto y kappa de
Cohen por decisión. Los desacuerdos se conservan y pasan a adjudicación por una tercera
persona; nunca se sustituyen silenciosamente.

## Independencia

Un revisor no debe haber escrito COBRIA ni los manifiestos evaluados. Debe declarar
conflictos, no conversar con el otro revisor antes del cierre y no intentar identificar
los proyectos. El cegamiento es parcial: fragmentos técnicos pueden revelar el dominio.

## Criterios de cierre

La fase solo cambia a `externally-reviewed` cuando existen seis respuestas válidas
(dos revisores por tres muestras), identidad humana atestiguada, matriz de acuerdo y
registro de adjudicación. Hasta entonces permanece `prepared-not-externally-reviewed`.

## Privacidad

No se recopilan nombres en el paquete público. El coordinador conserva por separado la
correspondencia entre código y persona, consentimiento y posibles conflictos.
