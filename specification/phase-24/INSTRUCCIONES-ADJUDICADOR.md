# Instrucciones para la tercera persona adjudicadora

Su tarea se limita a tres desacuerdos sobre ENG-007, “Estrangulamiento verificable de
legado”. No debe reevaluar los otros 21 acuerdos ni identificar los proyectos ocultos.

## Criterio ENG-007

Una decisión `supported` exige evidencia suficiente de las tres propiedades:

1. el legado está aislado detrás de una frontera explícita;
2. existe un control verificable que impide su nuevo crecimiento;
3. existe una condición, métrica o ruta explícita para retirarlo.

Use `insufficient` cuando solo se demuestre una parte. Use `unsupported` cuando la evidencia
contradiga el contrato o permita crecimiento funcional del legado.

## Procedimiento

1. Lea `RUBRICA.md`.
2. Revise los tres archivos `ADJUDICACION-M-*.json`.
3. Considere la evidencia original y las dos justificaciones anteriores, identificadas
   únicamente como Revisión A y Revisión B.
4. Complete una sola copia de `respuesta-adjudicacion.json` conforme al esquema.
5. Justifique cada decisión abordando ambas revisiones; no basta con elegir una por mayoría.
6. Devuelva únicamente `respuesta-adjudicacion.json`.

## Independencia y restricciones

- Debe ser una persona distinta de R-ARCH24 y R-QAOPS.
- No debe haber escrito COBRIA, los manifiestos ni las respuestas anteriores.
- No debe coordinar su decisión con los dos revisores ni con el autor.
- Debe declarar relaciones o conflictos conocidos.
- No debe buscar la identidad de M-01, M-02 o M-03.
- No debe usar IA para generar la decisión o su justificación.
- No debe alterar los archivos recibidos ni incluir datos personales en la entrega.

Tiempo estimado: 20 a 40 minutos.
