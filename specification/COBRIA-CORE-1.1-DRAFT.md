# COBRIA Core 1.1 — borrador compatible

**Estado:** borrador público; no sustituye COBRIA Core 1.0  
**Compatibilidad:** añade trazabilidad y pruebas sin modificar los diez invariantes de 1.0

## Convenciones normativas

**DEBE** y **NO DEBE** identifican condiciones obligatorias. **DEBERÍA** expresa una recomendación que exige justificar cualquier excepción. **PUEDE** identifica una opción.

## Requisitos trazables

| ID | Requisito | Nivel | Prueba mínima |
|---|---|---:|---|
| COBRIA-AUT-001 | Solo la fuente canónica DEBE aceptar cambios autoritativos. | C1 | Escritura paralela rechazada |
| COBRIA-ID-001 | La identidad DEBE ser estable e independiente de ubicación y proveedor. | C1 | Migración conserva referencias |
| COBRIA-SCP-001 | Toda operación DEBE declarar ámbito válido. | C1 | Ausencia y manipulación rechazadas |
| COBRIA-REV-001 | Una revisión obsoleta NO DEBE reemplazar una revisión posterior. | C1 | Entrega fuera de orden |
| COBRIA-VSN-001 | Documento, transformación y proyección DEBEN declarar versión. | C2 | Lectura multiversión |
| COBRIA-PRV-001 | Todo derivado DEBE enlazar origen, revisión y transformación. | C2 | Cadena de procedencia completa |
| COBRIA-IDM-001 | Repetir una entrega lógica NO DEBE duplicar efectos. | C2 | Reejecución con misma clave |
| COBRIA-REC-001 | La reconstrucción DEBE partir de fuentes declaradas, no del derivado activo. | C2 | Eliminación y reconstrucción total |
| COBRIA-EQV-001 | La candidata DEBE superar una equivalencia congelada antes de publicarse. | C2 | Comparación semántica |
| COBRIA-PUB-001 | Una interrupción NO DEBE vaciar ni sustituir la versión activa. | C2 | Fallo antes del intercambio |
| COBRIA-OBS-001 | Todo derivado DEBE declarar responsable, métricas y alertas. | C3 | Metadatos operativos presentes |
| COBRIA-RET-001 | Todo derivado DEBE poseer condición y procedimiento de retiro. | C3 | Retiro sin pérdida canónica |
| COBRIA-ANA-001 | Un conjunto analítico DEBE declarar fuentes, partición, transformación y huellas. | C3 | Reproducción por manifiesto |
| COBRIA-AI-001 | Una salida de IA DEBE abstenerse cuando la evidencia autorizada sea insuficiente. | C3 | Caso sin cobertura |
| COBRIA-SEC-001 | La recuperación NO DEBE mezclar ámbitos ni revelar la existencia de documentos ajenos. | C3 | Consultas negativas cruzadas |

## Ejemplo conforme

Una colección canónica conserva observaciones ambientales. Una proyección de búsqueda se construye en una colección versionada, incluye ámbito y revisión de origen, se verifica contra una consulta congelada y solo entonces se publica mediante un alias. Si se elimina, puede reconstruirse desde la colección canónica y el catálogo de transformación.

## Contraejemplo

Una tarea copia documentos a un índice, permite editar el índice directamente, omite la versión de transformación y lo consulta sin ámbito. Aunque la búsqueda sea rápida, incumple AUT-001, SCP-001, VSN-001, PRV-001 y REC-001.

## Perfiles

- **Operativo C1:** autoridad, identidad, ámbito, revisión y frontera de escritura.
- **Reconstruible C2:** C1 más versión, procedencia, idempotencia, equivalencia y publicación segura.
- **Gobernado C3:** C2 más operación, retiro, analítica reproducible y controles de IA.

## Compatibilidad

Una implementación conforme con 1.1 también debe superar las pruebas de Core 1.0. Este documento seguirá como borrador hasta ejecutar adaptadores distribuidos y recibir revisión externa.

