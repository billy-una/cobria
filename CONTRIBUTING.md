# Cómo contribuir a COBRIA

COBRIA acepta correcciones, ejemplos, patrones, pruebas y resultados reproducibles. Es
una propuesta independiente y abierta: contribuir no convierte una observación en norma,
validación externa ni certificación.

## Antes de comenzar

- lea `MANIFESTO.md`, `AGENTS.md` y la especificación más cercana al cambio;
- busque una incidencia existente o abra una que describa necesidad y resultado esperado;
- no incluya secretos, datos personales, credenciales ni material sin licencia;
- identifique cada afirmación como propuesta, implementada, ejecutada o validada por terceros.

## Preparar un cambio

Use una rama breve y limite el cambio a una responsabilidad. Para código, agregue una
prueba que falle antes de la corrección. Para documentación, enlace la fuente normativa o
la evidencia. No edite manualmente resultados generados.

```bash
make ayuda
make verificar
```

Una solicitud debe explicar objetivo, alcance, archivos, invariantes, pruebas, riesgos y
trabajo humano pendiente. Los cambios al Core congelado requieren nueva versión, ADR y
revisión humana. Las discusiones técnicas y los defectos se registran en el canal de
incidencias del repositorio.

## Revisión

La revisión comprueba claridad, separación de autoridad, pruebas, licencias y límites de
la evidencia. La identidad de una persona revisora no se inventa ni se sustituye con una
simulación de IA. Al participar, quien contribuye conserva la autoría de su aporte y
acepta publicarlo bajo las licencias aplicables descritas en `LICENSES.md`.

