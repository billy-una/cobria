# Cierre de las fases 0 y 1 del Ecosistema COBRIA

**Fecha:** 21 de septiembre de 2026  
**Release objetivo:** `ecosistema-1.0.0`  
**Core protegido:** COBRIA Core 1.0

## Fase 0. Congelación y limpieza

### Ejecutado

- Se creó `editorial/release-scope.json` como alcance legible por herramientas.
- Se creó un inventario determinista mediante
  `replication/scripts/generate-release-baseline.mjs`.
- Se registró la huella SHA-256 del Core protegido.
- Se clasificaron fuente, evidencia, generados, paquetes de revisión e históricos.
- Se documentaron fuentes y derivados en `ARCHIVO-Y-FUENTES-CANONICAS.md`.
- Se excluyeron borradores, prelibros, QA y paquetes internos de la futura descarga
  pública mediante una política explícita.
- Se añadió `make inventario-cierre`.
- Se comprobó que dos generaciones consecutivas del inventario producen el mismo
  archivo.

### Hallazgo de línea base

El commit actual no representa todavía la integración completa. El inventario registra
la rama, commit, cantidad y clasificación de cambios sin modificar ni descartar trabajo.
La mayor acumulación corresponde a paquetes de revisión y material generado; esto
confirma que la futura candidata debe construirse desde fuentes seleccionadas y no desde
todo el directorio de trabajo.

### Puerta de cierre

- **Inventario y clasificación:** superados.
- **Fuentes canónicas:** declaradas.
- **Core congelado:** huella registrada y validada.
- **Árbol Git limpio y release confirmada:** pendiente. Requiere revisar la selección de
  archivos y producir commits deliberados; no es seguro confirmar automáticamente todo
  el árbol acumulado.

La fase queda **preparada técnicamente, con cierre Git pendiente**. Esta condición no
impide desarrollar la identidad, pero sí impide publicar una release reproducible.

## Fase 1. Identidad, taxonomía y arquitectura editorial

### Ejecutado

- Se creó `IDENTIDAD-ECOSISTEMA-COBRIA.md`.
- Se fijó **COBRIA Ecosistema 1.0** como primera edición pública objetivo.
- Se mantuvo **COBRIA Core 1.0** con ciclo de versión independiente.
- Se definió Pattern Design como centro pedagógico del ecosistema.
- Se registraron diecisiete partes COBRIA en la fuente canónica.
- Se añadieron Toolkit y Evidence al registro de productos.
- Se actualizó el glosario con estado de madurez y nombres oficiales.
- Se sincronizaron los derivados editoriales utilizados por libro, sitio y LaTeX.
- Se actualizó el validador de productos para reconocer las siete salidas públicas.
- Se añadió `make verificar-cierre-0-1`.

### Identidad aprobada por el plan

> COBRIA es un ecosistema de patrones, manuales, contratos, herramientas y evidencia
> para ayudar a personas y agentes de inteligencia artificial a diseñar, construir,
> comprender, probar, asegurar, desplegar, operar y evolucionar software.

### Partes registradas

Manifesto, Fundamentos, Layers, Pattern Design, Data, Core, API & UX, Security,
Quality, Performance, Cloud & Operations, Analytics & AI, Engineering, Build, Toolkit,
Evidence y Knowledge.

### Puerta de cierre

- **Identidad y promesa:** superadas.
- **Taxonomía y versiones:** superadas.
- **Registro de productos:** superado.
- **Sincronización de derivados de identidad:** superada.
- **Aplicación visual y textual en todas las páginas del libro y sitio:** corresponde a
  las fases editoriales 14 y 15; no se afirma terminada aquí.

La fase 1 queda **cerrada en sus fuentes canónicas**.

## Verificación

```sh
make verificar-cierre-0-1
node replication/scripts/sync-editorial.mjs --check
python3 replication/scripts/validate-phase17.py
git diff --check
```

Los validadores no crean revisión humana, no publican, no modifican evidencia y no
alteran el Core protegido.
