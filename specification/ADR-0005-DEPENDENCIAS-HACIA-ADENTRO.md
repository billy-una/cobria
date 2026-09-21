# ADR-0005 — Dependencias hacia dominio y puertos de aplicación

**Estado:** aceptado  
**Fecha:** 2026-09-19  
**Responsable:** Billy Jak Cordero Porras

## Contexto

Los proyectos observados contienen capas y responsabilidades útiles, pero también pueden
acumular conectores, modelos, servicios y utilidades cuyos límites dependen de
convenciones humanas. COBRIA necesita una regla comprobable que funcione en proyectos
pequeños y grandes.

## Decisión

Dominio solo depende de dominio. Aplicación depende de dominio y de sus propios puertos.
Presentación e infraestructura implementan adaptaciones externas sin depender entre sí.
La raíz de composición conoce implementaciones concretas y construye el grafo.

Daters traducen forma física; repositorios controlan acceso; casos de uso coordinan;
controladores traducen protocolos. Una clase no combina estas cuatro responsabilidades.

## Consecuencias

- los casos de uso se prueban sin red ni base real;
- cambiar proveedor no obliga a cambiar dominio;
- aparecen interfaces y traducciones adicionales donde existe variabilidad real;
- la composición se vuelve un archivo importante y explícito;
- herramientas pueden detectar varias dependencias prohibidas.

## Alternativas descartadas

- capas según tecnología (`firebase/`, `html/`) como estructura principal;
- repositorio global accesible desde cualquier archivo;
- servicios estáticos como localizador de dependencias;
- exigir una interfaz para cada función aunque no exista frontera.

