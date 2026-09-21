# COBRIA Layers

**Versión:** 1.0  
**Estado:** estable para la ruta del Ecosistema 1.0  
**Propósito:** separar conocimiento y autoridad, no multiplicar carpetas

La especificación verificable está en `specification/phase-5/`. El ejemplo ejecutable
está en `replication/examples/ecosistema-app/`.

## Resultado de aprendizaje

El lector puede ubicar responsabilidades y reconocer cuándo Object, Dater, Service,
UseCase, Catalog, Indexer, Connector o Repository mezclan funciones distintas.

## Modelo de capas

```text
Presentación ───────> Aplicación ───────> Dominio
Infraestructura ───> Aplicación y Dominio
Composición ───────> todas, únicamente para conectarlas
```

Dominio no depende de UI, SDK ni configuración. Aplicación declara capacidades mediante
puertos. Infraestructura las implementa. Presentación traduce interacciones. Composición
elige implementaciones. Un proyecto pequeño puede usar menos carpetas, no menos claridad.

## Responsabilidades por capa

| Capa | Puede conocer | No debe conocer |
|---|---|---|
| Dominio | entidades, valores, políticas, catálogos | HTTP, UI, SDK, rutas, entorno |
| Aplicación | dominio, casos de uso, puertos | proveedor, componentes, rutas físicas |
| Presentación | aplicación, protocolo, estado visible | consultas físicas, secretos, reglas nuevas |
| Infraestructura | puertos, SDK, persistencia, red | navegación visual o decisiones del usuario |
| Composición | implementaciones necesarias | reglas de negocio ocultas |

## Los nombres observados y su significado

| Nombre | Responsabilidad correcta | Concepto conocido | Señal de mezcla |
|---|---|---|---|
| `Object` | identidad, valores e invariantes | Entity / Value Object | serializa claves físicas |
| `Dater` | traducción lógica ↔ física | Data Mapper / Serializer | consulta, autoriza y orquesta |
| `Repository` | acceso por identidad y ámbito | Repository | devuelve consultas del SDK |
| `UseCase` | intención y resultado estable | Interactor / Command Handler | recibe objetos del framework |
| `Service` | política o coordinación precisa | Application/Domain Service | utilidades sin frontera |
| `Catalog` | vocabulario gobernado | Reference Data / Registry | lista mágica duplicada |
| `Indexer` | construir una lectura derivada | Projection Builder | autoridad editable |
| `Connector` | encapsular red, SDK o proveedor | Adapter / Gateway | filtra tipos del proveedor |
| `Controller` | traducir protocolo | Controller / Presenter | consulta directamente |
| `Registry` | composición explícita | Registry | localizador global oculto |

`Dater` es terminología propia de los proyectos de referencia. Puede conservarse como
traductor físico; no se presenta como un patrón universal.

## Dominio y aplicación

Dominio contiene entidades, objetos de valor, políticas, catálogos e invariantes. Una
entidad no sabe cómo se guarda. Aplicación expresa intenciones, autoriza antes de tocar
recursos, coordina puertos y devuelve resultados estables.

```js
export class RegistrarObservacion {
  constructor({ repositorio, autorizar }) {
    this.repositorio = repositorio;
    this.autorizar = autorizar;
  }
  async ejecutar(entrada, contexto) {
    this.autorizar(contexto, "crear", entrada.ambito);
    return this.repositorio.guardar(entrada);
  }
}
```

Un servicio de aplicación reúne coordinación compartida. Un servicio de dominio expresa
una política entre objetos. Ninguno es un lugar genérico para código sin dueño.

## Datos e infraestructura

Implementa Repository, Dater, Connector, Indexer, observabilidad y proveedores.

```text
RepositorioObservaciones
  usa ObservacionDater para traducir
  usa MongoConnector para comunicar
  conserva ámbito, identidad y revisión

ResumenPorEspecieIndexer
  lee fuentes autorizadas
  construye una candidata
  verifica y publica sin adquirir autoridad
```

Separarlos permite cambiar representación, consulta o transporte por razones distintas.
En un ejemplo pequeño pueden vivir cerca; sus responsabilidades siguen separadas.

## Presentación y composición

Presentación traduce interacción a casos de uso y resultados a carga, vacío, error,
éxito y reintento. Composición construye el grafo y decide si un puerto usa MongoDB,
memoria o CouchDB.

```js
const repositorio = new RepositorioMongo({ connector, dater });
const registrar = new RegistrarObservacion({ repositorio, autorizar });
const controller = new RegistrarObservacionController({ registrar, mensajes });
```

## Estructura recomendada

```text
src/
├── domain/{entities,values,policies,catalogs,errors}/
├── application/{use-cases,ports,contracts,services}/
├── presentation/{controllers,presenters,i18n,views-or-routes}/
├── infrastructure/
│   ├── data/{daters,repositories,migrations}/
│   ├── connectors/
│   ├── projections/
│   ├── observability/
│   └── security/
└── composition.(js|ts|py|java|go)
```

No se crean carpetas vacías para aparentar arquitectura. Cada directorio aparece cuando
existe una responsabilidad con cambio o prueba independiente.

## Dependencias prohibidas

- Dominio importando componentes o SDK.
- Aplicación leyendo entorno o formando rutas físicas.
- Presentación importando un repositorio concreto.
- Repository tomando decisiones del dominio.
- Dater autorizando o coordinando casos de uso.
- Connector exponiendo errores internos como contrato público.
- Indexer permitiendo editar la proyección como autoridad.
- Router HTTP conteniendo una transacción completa.
- Service Registry actuando como localizador invisible.

## Ficha de responsabilidad por archivo

1. ¿Qué única responsabilidad justifica su existencia?
2. ¿Qué capa la posee?
3. ¿Qué entrada, resultado y errores expone?
4. ¿Qué dependencias necesita y por qué?
5. ¿Qué datos, catálogos o nodos toca?
6. ¿Qué actor, capacidad y ámbito aplican?
7. ¿Qué prueba demuestra comportamiento y rechazo?
8. ¿Quién revisa su evolución y cómo se retira?

Dos ciclos de cambio independientes sugieren dos componentes.

## Migración desde legado

1. Medir y congelar crecimiento heredado.
2. Elegir un flujo, no toda la aplicación.
3. Crear prueba de caracterización.
4. Nombrar entrada, resultado y errores.
5. Extraer regla de dominio.
6. Declarar puerto desde aplicación.
7. Envolver proveedor con Connector, Repository y Dater según necesidad.
8. Conectar en composición.
9. Mantener una fachada temporal.
10. Reducir presupuesto legacy y retirar la fachada.

## Laboratorio de capas

Sobre un controlador que consulta directamente una base: identifique intención, escriba
una prueba, extraiga caso de uso, declare puerto, mueva traducción a infraestructura,
conecte en composición, ejecute el auditor y sustituya el repositorio por memoria.

**Criterio de avance:** dominio y aplicación no importan infraestructura y otra persona
explica Object, Dater, Repository, Service, UseCase, Catalog, Indexer y Connector sin
confundir responsabilidades.
