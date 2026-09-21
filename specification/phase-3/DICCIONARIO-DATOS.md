# Diccionario de datos COBRIA — caso neutral

## Alcance

Este diccionario enseña el método COBRIA con una observación ambiental ficticia. No
copiar sus nombres o plazos como reglas universales. La fuente validable es
`data-dictionary.yaml`, escrita como JSON compatible con YAML 1.2 para poder validarla
sin dependencias externas.

## Tres niveles

### Conceptual

Una **observación ambiental** registra que una especie fue observada en un instante y
ámbito determinados. Tiene identidad estable, revisión, estado, procedencia y una
interpretación dependiente de un catálogo versionado.

### Lógico

`Observacion` expresa nombres del dominio: `observacionId`, `ambitoId`, `revision`,
`versionEsquema`, `ocurrioEn`, `especieCodigo`, `catalogoVersion`, `estado` y
`procedencia`. Estas propiedades son las únicas que usan dominio y casos de uso.

### Físico

El ejemplo persiste en el nodo `n8` y compacta nombres como `a`, `b`, `c`. Esta decisión
es local al adaptador. La traducción obligatoria es:

| Nodo/clave | Significado lógico | Regla principal |
|---|---|---|
| `n8` | colección física de observaciones | no es un nombre de dominio |
| `a` | `observacionId` | inmutable y única dentro de `ambitoId` |
| `b` | `ambitoId` | obligatorio en identidad, acceso e índice |
| `c` | `revision` | entero positivo y monotónico |
| `d` | `versionEsquema` | selecciona migración; no es revisión |
| `e` | `ocurrioEn` | RFC 3339 con zona u offset |
| `f` | `especieCodigo` | se interpreta con `catalogoVersion` |
| `g` | `catalogoVersion` | conserva significado histórico |
| `h` | `estado` | valor del catálogo declarado |
| `i` | `procedencia` | origen, tiempo conocido y método |

## Frontera Dater

```ts
type Observacion = {
  observacionId: string;
  ambitoId: string;
  revision: number;
  versionEsquema: number;
  ocurrioEn: string;
  especieCodigo: string;
  catalogoVersion: string;
  estado: "pendiente" | "verificada" | "descartada";
  procedencia: { fuenteId: string; registradoEn: string; metodo: string };
};

const ObservacionDater = {
  desdeFisico(x: Record<string, unknown>): Observacion {
    return migrarYValidar({
      observacionId: x.a,
      ambitoId: x.b,
      revision: x.c,
      versionEsquema: x.d,
      ocurrioEn: x.e,
      especieCodigo: x.f,
      catalogoVersion: x.g,
      estado: x.h,
      procedencia: x.i,
    });
  },
  haciaFisico(x: Observacion) {
    validar(x);
    return { a: x.observacionId, b: x.ambitoId, c: x.revision, d: 3,
      e: x.ocurrioEn, f: x.especieCodigo, g: x.catalogoVersion,
      h: x.estado, i: x.procedencia };
  },
};
```

El repositorio decide consultas, revisiones y ámbito. El Dater traduce y valida forma
física. Ninguno reemplaza las reglas de dominio.

## Identidad e índices

- Identidad lógica: `(ambitoId, observacionId)`.
- Índice único: `(b, a)` en la representación compacta.
- Lectura temporal: `(b, e desc)`.
- Consulta por especie: `(b, f)` solo si la carga real la justifica.
- Consulta operativa: `(b, h, e desc)` si el flujo por estado es frecuente.

Un índice no se crea solo porque un campo aparezca en el diccionario. Debe corresponder
a una consulta, cardinalidad, orden y medición documentados.

## Tiempo

- `ocurrioEn`: tiempo válido del hecho.
- `procedencia.registradoEn`: tiempo conocido por el sistema.
- `revision`: orden lógico, no fecha.
- `versionEsquema`: compatibilidad estructural, no fecha ni revisión.

## Sensibilidad y retención

La ubicación, procedencia y ámbito pueden revelar personas o recursos sensibles. El
diccionario clasifica cada dato, pero la política concreta debe fijar finalidad, base de
tratamiento, acceso, minimización y plazo. “Conservar para siempre” no es un valor por
defecto.

