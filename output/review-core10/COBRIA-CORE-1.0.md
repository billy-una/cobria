# COBRIA Core 1.0

**Estado:** especificación normativa congelada  
**Fecha de congelación:** 24 de agosto de 2026  
**Autor:** Billy Jak Cordero Porras  
**Ámbito:** sistemas NoSQL documentales con representaciones derivadas reconstruibles

## 1. Propósito

COBRIA gobierna representaciones derivadas sin convertirlas en fuentes paralelas de verdad. Una implementación conforme conserva autoridad canónica, exige ámbito explícito, registra procedencia y versión, verifica equivalencia y puede reconstruir o retirar cada derivado.

Los términos **DEBE**, **NO DEBE**, **DEBERÍA**, **NO DEBERÍA** y **PUEDE** expresan requisitos normativos.

## 2. Contrato nuclear

Una proyección se define como:

`K = <C, f, theta, s, v, phi, e, r, o>`

- `C`: fuente documental canónica.
- `f`: transformación determinista o con entradas declaradas.
- `theta`: catálogos, parámetros y políticas versionados.
- `s`: ámbito de autorización y partición.
- `v`: versión del contrato y de la proyección.
- `phi`: ventana de frescura permitida.
- `e`: verificador de equivalencia lógica.
- `r`: procedimiento de reconstrucción repetible.
- `o`: propietario operacional, métricas y criterio de retiro.

## 3. Invariantes obligatorios

1. **Autoridad.** Solo `C` DEBE aceptar cambios autoritativos de dominio.
2. **Ámbito.** Identidad, claves, consultas, caché, eventos y recuperación DEBEN incluir `s`.
3. **Procedencia.** Cada derivado DEBE enlazar fuente, revisión, versión y transformación.
4. **Reconstrucción.** `r(C, theta, v)` DEBE producir una candidata completa sin depender del derivado activo.
5. **Equivalencia.** `e` DEBE comparar significado lógico mediante una regla congelada.
6. **Idempotencia.** Repetir una entrega lógica NO DEBE duplicar efectos.
7. **Monotonicidad.** Una revisión obsoleta NO DEBE reducir la revisión visible.
8. **Publicación segura.** Una candidata DEBE verificarse antes de sustituir la versión activa.
9. **Operabilidad.** Todo derivado DEBE declarar responsable, métricas, alertas y retiro.
10. **Fallo cerrado.** La ausencia de ámbito, versión o autorización DEBE rechazarse antes de leer o escribir.

## 4. Estados del ciclo de vida

`propuesta -> construcción -> verificación -> activa -> retirada`

- Una candidata que no supera equivalencia pasa a `rechazada`.
- Una construcción interrumpida NO DEBE alterar la versión activa.
- Una versión retirada PUEDE conservarse según retención, pero NO DEBE recibir nuevas escrituras.

## 5. Niveles de conformidad

### C1 — Fundamental

Autoridad canónica, identidad estable, ámbito explícito, revisión monotónica y frontera única de escritura.

### C2 — Reconstruible

Incluye C1, transformación y contrato versionados, idempotencia, equivalencia, reconstrucción total y publicación segura.

### C3 — Gobernado

Incluye C2, procedencia completa, presupuesto de frescura/costo, observabilidad, responsable, retiro y controles para analítica o IA.

Una implementación solo PUEDE declarar un nivel cuando supera todas sus pruebas obligatorias.

## 6. Pruebas normativas

- **P1:** lectura canónica y proyectada producen el mismo resultado lógico; se informan latencia, lecturas y bytes.
- **P2:** se informa amplificación de escritura, bytes, eventos y convergencia.
- **R1:** reconstrucción total e incremental son equivalentes, repetibles y publicables sin vaciar la versión activa.
- **S1:** ausencia o manipulación del ámbito produce cero documentos cruzados y rechazo cerrado.
- **A1:** un producto analítico conserva manifiesto, procedencia, partición temporal y abstención ante evidencia insuficiente.

## 7. Regla de decisión

Una proyección NO DEBE adoptarse solo por reducir latencia. Debe satisfacer equivalencia, ámbito, frescura, reconstrucción y operación. Si un índice canónico cumple el objetivo con menor riesgo, la implementación DEBERÍA conservar una sola representación.

## 8. Fuera de alcance

COBRIA 1.0 no define un motor de base de datos, ORM, protocolo distribuido ni algoritmo de consenso. No garantiza exactitud de modelos de IA, seguridad exhaustiva ni superioridad universal. SQLite, PostgreSQL y otros motores relacionales quedan fuera del conjunto confirmatorio NoSQL de esta versión.

## 9. Congelación

El contenido normativo anterior queda congelado como COBRIA Core 1.0. Cambios incompatibles requieren COBRIA 2.0; aclaraciones compatibles se publican como erratas 1.x sin reescribir resultados históricos.
