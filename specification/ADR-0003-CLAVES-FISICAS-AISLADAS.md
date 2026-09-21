# ADR-0003 — Aislar claves físicas compactas mediante Dater

**Estado:** aceptado  
**Fecha:** 2026-09-16  
**Responsable:** Billy Jak Cordero Porras

## Contexto

Algunos sistemas compactan rutas o atributos con nombres como `n8`, `a`, `b` y `c` para
reducir tamaño, conservar compatibilidad o seguir una convención histórica. Esas claves
abaratan almacenamiento en ciertos motores, pero son opacas, se confunden entre nodos y
pueden filtrar detalles físicos hacia dominio, interfaz y analítica.

## Decisión

Las claves compactas se permiten solo en la representación física y deben aparecer en
un diccionario versionado. Un Dater traduce entre nombres físicos y lógicos. Dominio,
casos de uso, API, UI, analítica y agentes de IA consumen nombres lógicos.

Cada clave física declara significado, tipo, obligatoriedad, formato, ámbito, tiempo,
procedencia, sensibilidad, retención, versión, responsable, consumidores, índices,
ejemplo y reglas. Si falta uno de los campos obligatorios, la clave no está aprobada.

## Consecuencias

- las optimizaciones físicas pueden cambiar sin renombrar el dominio;
- existe costo de traducción, documentación y pruebas del Dater;
- consultas administrativas directas necesitan una vista o herramienta explicativa;
- dos nodos pueden reutilizar `a` únicamente si cada diccionario los identifica por
  entidad y versión; nunca se infiere que significan lo mismo.

## Alternativas descartadas

- usar claves compactas en todo el código: reduce legibilidad y aumenta acoplamiento;
- prohibir toda compactación: ignora sistemas heredados y restricciones reales;
- documentar solo en comentarios: no permite validación ni migración automática.

