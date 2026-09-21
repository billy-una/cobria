# Fase 23 — comparación de transferencia entre proyectos

Esta fase aplica el motor genérico de la fase 22 a tres repositorios distintos, sin modificarlos y leyendo únicamente objetos de commits congelados. El objetivo es observar si los ocho contratos Engineering pueden describirse fuera del proyecto piloto.

| Proyecto | Evidencia estructural | Validación operacional |
|---|---:|---:|
| POS Guápiles | 8/8 | 0 |
| CRMHotel | 5/8 | 0 |
| BSHandball | 4/8 | 0 |

El resultado **no es una clasificación de calidad**. Una brecha indica que las rutas y términos declarados no aportaron evidencia completa. Puede representar una ausencia real, otra forma de implementación o una limitación del manifiesto.

ENG-001, ENG-002 y ENG-007 presentaron evidencia estructural en los tres repositorios. ENG-004 y ENG-008 solo quedaron completos en uno. Estado, autoridad y control del legado resultaron más fáciles de reconocer mediante artefactos locales; promoción e incidentes usan evidencia más heterogénea.

## Reproducción

```bash
make verificar-fase-23
```

El gate regenera los tres informes y la comparación, comprueba commits distintos, los ocho contratos, determinismo y cero afirmaciones operacionales.

## Límites

- Los manifiestos fueron preparados por el autor de COBRIA.
- La presencia textual no demuestra comportamiento.
- No se ejecutaron pruebas propias de los proyectos ni ambientes reales.
- La siguiente validación requiere revisión semántica independiente y manifiestos preparados por equipos ajenos al autor.
