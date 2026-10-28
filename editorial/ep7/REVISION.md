# Revisión bibliográfica dirigida y procedencia EP7

Corpus de 46 referencias compartidas. Revisión exploratoria asistida; no revisión sistemática concluida.

## Comparación de mecanismos

### lectura

Separar modelos de consulta y mantener una representación precomputada. Costo: Coordinación, almacenamiento y obsolescencia.

Relación: COBRIA pide declarar autoridad, ámbito y reconstrucción del derivado.

Límite: Es una comparación conceptual; no demuestra que CQRS o una vista carezcan de esos controles en una implementación concreta.

Fuentes: fowler2011cqrs, microsoft2025materialized.

### historia

Historia de cambios e información inmutable para derivar estado. Costo: Retención, reproducción y evolución de transformaciones.

Relación: COBRIA puede reconstruir desde un corte canónico y no exige conservar todos los eventos.

Límite: No reemplaza registro de eventos, consenso o recuperación física del motor.

Fuentes: fowler2005eventsourcing, helland2015immutability.

### procedencia

Explicar origen, derivación, actividad y responsabilidad. Costo: Capturar y mantener relaciones de procedencia.

Relación: La ficha de proyección vincula fuentes, transformación, versión y reparación.

Límite: No se declara equivalencia formal ni conformidad W3C de COBRIA.

Fuentes: buneman2001provenance, w3c2013prov.

### esquema

Evolución y mapeo del esquema con costos de lectura y almacenamiento. Costo: Migraciones, índices y adaptación a cargas.

Relación: Se separa modelo lógico, Dater físico y derivado versionado.

Límite: Aulbach y Ni son antecedentes de esquemas SaaS, no ensayos de COBRIA en motores documentales. Scherzinger se identifica por su versión arXiv.

Fuentes: aulbach2009flexibleschemas, ni2014adaptiveschema, scherzinger2013schema.

### analitica

Definir características reutilizables y evitar información indebida entre particiones. Costo: Materialización, desfase y validación temporal.

Relación: Los productos analíticos declaran corte, origen y separación de entidades.

Límite: El consumidor determinista A1 no mide predicción ni calidad generativa.

Fuentes: li2023featurestore, kapoor2023leakage.

### motores

Actualización condicional, revisiones documentales y alias. Costo: Semánticas y condiciones diferentes por motor.

Relación: Cada adaptador debe probar las capacidades realmente requeridas.

Límite: Un alias atómico no demuestra por sí solo CAS de revisión, equivalencia ni publicación segura COBRIA; una guía viva no acredita una versión experimental.

Fuentes: mongodbAtomicity, apacheCouchDocumentApi, opensearch32Alias.

## Correcciones de identidad

- aulbach2009flexibleschemas: author, doi. Fuente: https://doi.org/10.1145/1559845.1559941
- ni2014adaptiveschema: author, doi, url. Fuente: https://dbgroup.cs.tsinghua.edu.cn/ligl/papers/tkde14-multitenant.pdf
- li2023featurestore: author, primaryclass, version. Fuente: https://arxiv.org/abs/2305.20077v1
- hevner2004designscience: pages. Fuente: https://api.crossref.org/works/10.2307%2F25148625 · Metadatos editoriales: 75–106; se conserva la trazabilidad de la corrección.
- roa2015iso25000: url, note. Fuente: https://revistas.udistrital.edu.co/index.php/tia/article/download/8373/11349/47605 · Discrepancia conservada entre el PDF (Roa Molina; 26–32) y ficha OJS (Paola Andrea Roa; 27–33); no se homogeneiza silenciosamente.

Las consultas, exclusiones y limitaciones están en selection.json; los estados HTTP observados, incluidos errores, en link-check.json. No se redistribuye el texto íntegro de terceros.
