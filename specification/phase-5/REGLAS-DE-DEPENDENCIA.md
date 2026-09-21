# Reglas de dependencia COBRIA Layers

## Permitidas

| Desde | Hacia |
|---|---|
| dominio | dominio |
| aplicación | aplicación, dominio |
| presentación | presentación, aplicación, dominio |
| infraestructura | infraestructura, aplicación, dominio |
| composición | todas las capas |

## Prohibidas

- dominio → aplicación, presentación, infraestructura o composición;
- aplicación → presentación, infraestructura o composición;
- presentación → infraestructura;
- infraestructura → presentación o composición;
- cualquier capa → una ruta física fuera de infraestructura/datos;
- caso de uso → SDK, variable de entorno o singleton global;
- controlador → proveedor de persistencia;
- Dater → autorización o navegación visual.

## Excepciones

Una excepción necesita ADR con alcance temporal, propietario, riesgo, prueba y fecha de
retiro. Cambiar la tabla para aceptar un atajo local no es una excepción válida.

## Política de importación

La validación automática inspecciona imports relativos del ejemplo neutral. En otros
lenguajes debe aplicarse la misma semántica mediante herramientas propias: reglas de
módulos, analizadores de dependencias o pruebas de arquitectura.

