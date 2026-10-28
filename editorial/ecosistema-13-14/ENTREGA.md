# Evidencia científica y edición documental de COBRIA

Las fases 13 y 14 del ecosistema distinguen evidencia histórica, contratos locales,
experimentos nuevos y calidad editorial. La propuesta sigue siendo independiente;
las comprobaciones automáticas no sustituyen participación humana ni certificación.

## Evidencia y réplica funcional

`editorial/generated/ecosistema-13-14/evidencia.json` verifica las huellas y conteos de
los tres archivos históricos R7. `trazabilidad.csv` relaciona cinco familias de
requisitos con implementación, prueba, alcance, amenaza y productos. Es una matriz
acotada a P1, P2, R1, S1 y A1, no un inventario exhaustivo de todas las frases científicas.

```sh
make generar-evidencia-ecosistema-13
make verificar-ecosistema-13-14
make diagnosticar-pc3
python3 replication/scripts/package-ecosystem-evidence.py
```

El paquete contiene los contratos congelados, pruebas y analizador con instrucciones
propias. Su preparación comprueba extracción e instalación en una carpeta nueva del
mismo equipo. No promete ejecutar el Makefile completo ni distribuir el ecosistema
entero. La aprobación de esa copia local no se declara réplica externa.

Los contratos y las pruebas sintéticas del análisis pueden ejecutarse sin los motores
remotos. Sus resultados no son corridas confirmatorias PC3. El diagnóstico conserva
espacio disponible, versiones accesibles y congelamientos; un resultado no preparado
impide atribuir una repetición remota. Conectores, piloto, instrumentación, corridas,
integridad del dataset y análisis completo mantienen sus requisitos previos.

## Literatura y afirmaciones compartidas

`revision-fuentes.json` conserva consultas, fecha, criterios, tres fuentes primarias
consultadas y extracción exploratoria. Las decisiones de dos revisores y adjudicación
quedan vacías: todavía no es una revisión sistemática completa ni un diagrama PRISMA.
La selección asistida no cuenta como doble cribado humano.

El artículo y el maestro incorporan la misma interpretación generada: separación de
lectura y escritura no implica beneficio universal; reconstrucción no exige historial
completo de eventos; revisión documental no equivale a transacción entre documentos.
Las referencias orientan la discusión, no prueban novedad absoluta de COBRIA.
La documentación CouchDB consultada es viva, no sustituye la versión experimental fijada.

## Edición y accesibilidad

```sh
make construir-editorial
make revisar-edicion-pc7
python3 replication/scripts/review-pc7-pdf.py
make auditar-pdf-ecosistema-14
make sincronizar-descargas
```

Los seis PDF conservan productos separados: especificación, artículo, maestro,
libro principal, cuaderno y anexo. Los HTML comparten currículo y fuentes locales.
Las comprobaciones de geometría revisan todas las secciones y la paridad de las
85 lecciones y sus prácticas; la extracción PDF contrasta el contenido con la fuente.

El exportador del libro, cuaderno y anexo solicita etiquetas y marcadores. La
normalización de metadatos conserva estructura, destinos e idioma; la compresión web
ya no rasteriza ni descarta deliberadamente el árbol semántico. Estas propiedades
estructurales no acreditan PDF/UA, orden de lectura correcto ni uso con lector de pantalla.
Los documentos LaTeX no se presentan como plenamente etiquetados.

La compresión web no remuestrea imágenes. La copia canónica conserva calidad de origen;
la descarga optimizada se identifica por huella y tamaño en el manifiesto. No se crean
dos libros con autoridades competidoras ni se despliega un sitio por sincronizarlos.
Esta estrategia prioriza conservar etiquetas y calidad: el libro sigue pesando
aproximadamente 43 MB y el ahorro es pequeño. Falta acordar un presupuesto de descarga
y validar una reducción adicional sin perder legibilidad ni accesibilidad.

El renderizador de revisión produce miniaturas de todas las páginas y cinco muestras
legibles por producto. Las miniaturas permiten localizar defectos gruesos, no leer
cada párrafo. La fase 14 no se cierra sin revisión legible integral de todas las páginas
y resolución de hallazgos. El informe registra expresamente ese límite.

## Pendientes de cierre

- Conectores nuevos e infraestructura realista; no basta con arrancar motores.
- Corridas nuevas según protocolo y estadísticas derivadas de sus crudos.
- Búsqueda bibliográfica exhaustiva, doble cribado y adjudicación auténtica.
- Revisión independiente, estudio consentido y réplica en otro equipo.
- Revisión visual integral y evaluación con tecnologías de apoyo.
- Presupuesto de peso web y optimización adicional del libro sin perder estructura.
- Construcción remota del SHA final y publicación expresamente autorizada.
