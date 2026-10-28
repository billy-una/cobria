# COBRIA Ecosistema 1.0 — especificación normativa

**Versión documental:** `1.0.0-rc1`  
**Estado:** candidata no estable  
**Núcleo normativo:** COBRIA Core 1.0 congelado  
**Naturaleza:** propuesta independiente; no es una certificación ni un estándar oficial

Este directorio es la entrada legible a la especificación normativa de COBRIA. El PDF
publicable se genera desde `COBRIA-ECOSISTEMA-1.0.tex`; los requisitos y la matriz de
trazabilidad se derivan del registro único `requirements-1.0.json`.

## Componentes y responsabilidades

| Componente | Responsabilidad |
|---|---|
| `COBRIA-CORE-1.0.md` | Núcleo congelado: autoridad, ámbito, revisión, derivación y reconstrucción. |
| `requirements-1.0.json` | Registro canónico de obligaciones, criterios, responsables, pruebas, evidencia y amenazas. |
| `CONFORMANCE-1.0.json` | Perfiles acumulativos C1, C2 y C3 y reglas de declaración. |
| `generated/requirements-1.0.tex` | Representación normativa generada; no se edita a mano. |
| `generated/traceability-1.0.tex` | Matriz de trazabilidad generada; no se edita a mano. |
| `COBRIA-ECOSISTEMA-1.0.tex` | Documento normativo completo y fuente del PDF. |

## Modelo resumido

```text
entrada autorizada
  → validación de identidad, capacidad, ámbito y revisión
  → escritura canónica
  → construcción de candidata separada
  → verificación de equivalencia
  → publicación por versión
  → observación, reparación o retiro gobernado
```

Una representación derivada facilita una lectura, búsqueda, análisis o respuesta, pero
no reemplaza la autoridad del documento canónico. La proyección transita por estados
explícitos: `DECLARADA → CONSTRUYENDO → CONSTRUIDA → VERIFICADA → PUBLICADA` y puede
terminar en `FALLIDA`, `RETIRADA` o `SUSTITUIDA` según las reglas normativas.

## Perfiles de conformidad

- **C1 Fundamental:** autoridad única, identidad estable, ámbito obligatorio, revisión
  monotónica y frontera de escritura.
- **C2 Reconstruible:** hereda C1 y añade transformación versionada, idempotencia,
  equivalencia, reconstrucción independiente y publicación segura.
- **C3 Gobernado:** hereda C1 y C2 y añade procedencia, presupuestos, observabilidad,
  propiedad operacional, retiro, analítica reproducible, IA con evidencia y seguridad.

`no-evaluado` impide declarar conformidad. Una declaración debe identificar versión,
commit, ambiente, configuración y evidencia. Superar un perfil no equivale a una
certificación oficial ni demuestra por sí solo rendimiento distribuido.

## Construcción y verificación

```bash
make generar-especificacion
make verificar-especificacion
```

La compuerta protege la huella de Core 1.0, valida identificadores, referencias,
comandos, herencia de perfiles, derivados generados y correspondencia entre fuente y
PDF. Las pruebas ejecutables demuestran únicamente el alcance declarado por cada caso.

## Licencia y cita

La licencia aplicable a textos y figuras se documenta en `../LICENSE-CONTENT.md`; la del
código, en `../LICENSE-CODE.txt`. La forma recomendada de citar la propuesta está en
`../CITATION.cff`.
