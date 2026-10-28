.PHONY: ayuda verificar verificar-curriculo verificar-publicacion verificar-publicacion-publica verificar-integridad-paquete inventario-cierre verificar-cierre-0-1 verificar-cierre-2-3 generar-catalogo-patrones verificar-cierre-4-5 verificar-fase-2 verificar-fase-3 verificar-fase-4 verificar-fase-5 verificar-fase-6 verificar-fase-7 verificar-fase-8 verificar-fase-9 verificar-fase-10 verificar-fase-11 verificar-fase-12 verificar-fase-13 verificar-fase-14 verificar-fase-15 verificar-fase-16 verificar-fase-17 verificar-fase-18 verificar-fase-19 verificar-fase-20 verificar-fase-21 verificar-fase-22 verificar-fase-23 verificar-fase-24 verificar-fase-25 verificar-fase-26 verificar-fase-27 verificar-fase-28 verificar-fase-29 verificar-fase-30 verificar-fase-31 medir-fase-15 generar-contexto-agente sincronizar-editorial preparar-paquete-fase-18 preparar-revision-fase-24 preparar-revision-fase-28 procesar-respuestas-fase-29 procesar-adjudicacion-fase-30 generar-plantilla-fase-31 generar-manifiestos generar-esquemas verificar-replica verificar-sitio sincronizar-descargas construir-sitio construir-maestro construir-articulo construir-articulo-ciego construir-editorial
.PHONY: verificar-procedencia generar-especificacion construir-especificacion verificar-especificacion generar-ejemplos-r4 verificar-r4 verificar-r5 verificar-r6 analizar-r7 verificar-r7 verificar-r8 construir-rc2 verificar-r9 verificar-r9-publica

ayuda:
	@echo "COBRIA — comandos del monorepositorio"
	@echo "  make verificar              Ejecuta las pruebas de réplica y del sitio"
	@echo "  make verificar-publicacion Construye y verifica una candidata desde fuentes locales"
	@echo "  make verificar-publicacion-publica Añade comprobaciones contra el sitio desplegado"
	@echo "  make verificar-procedencia Valida licencias, archivo y procedencia de R2"
	@echo "  make verificar-especificacion Construye y valida la especificación normativa R3"
	@echo "  make verificar-r4           Ejecuta los ejemplos pedagógicos y valida su publicación"
	@echo "  make verificar-r5           Valida la edición pedagógica, accesible y enlazada del libro"
	@echo "  make verificar-r6           Valida el sitio unificado, seguro y verificable"
	@echo "  make analizar-r7            Regenera tablas, estadística y gráfico confirmatorios"
	@echo "  make verificar-r7           Valida protocolo, 270 observaciones y evidencia R7"
	@echo "  make verificar-r8           Valida sincronización científica y editorial R8"
	@echo "  make construir-rc2          Construye RC2 dos veces desde clones limpios"
	@echo "  make verificar-r9           Valida el paquete local reproducible de RC2"
	@echo "  make verificar-r9-publica   Compara RC2 con el sitio público desplegado"
	@echo "  make inventario-cierre      Regenera la línea base del Ecosistema 1.0"
	@echo "  make verificar-cierre-0-1   Valida inventario, fuentes e identidad"
	@echo "  make verificar-cierre-2-3   Valida Fundamentos, rutas, Layers y ejemplo"
	@echo "  make generar-catalogo-patrones Genera las fichas enriquecidas de Pattern Design"
	@echo "  make verificar-cierre-4-5   Valida Pattern Design, Data, Core y adaptadores"
	@echo "  make verificar-cierre-6-7   Valida API/UX, accesibilidad y Security"
	@echo "  make verificar-cierre-8-9   Valida Quality/Performance y Cloud/Operations"
	@echo "  make verificar-cierre-10-11 Valida Analytics/AI y aplicación COBRIA Build"
	@echo "  make verificar-cierre-12-13 Valida Toolkit, evidencia y transferencia"
	@echo "  make generar-inventario-cientifico Regenera el estado científico con huellas"
	@echo "  make ejecutar-ensayo-operacional-8-9 Ejecuta cinco escenarios locales controlados"
	@echo "  make validar-ensayo-operacional-8-9 Verifica huellas de la última ejecución"
	@echo "  make verificar-fase-2       Valida requisitos y trazabilidad de la fase 2"
	@echo "  make verificar-fase-3       Valida diccionario, catálogos y ejemplos de datos"
	@echo "  make verificar-fase-4       Valida nodos, relaciones y derivados NoSQL"
	@echo "  make verificar-fase-5       Valida capas, responsabilidades e imports"
	@echo "  make verificar-fase-6       Valida documentación, errores e idioma"
	@echo "  make verificar-fase-7       Valida seguridad, privacidad y suministro"
	@echo "  make verificar-fase-8       Valida ambientes, cloud y entrega"
	@echo "  make verificar-fase-9       Valida calidad, observabilidad y evidencia"
	@echo "  make verificar-fase-10      Valida API, integración, UX y accesibilidad"
	@echo "  make verificar-fase-11      Valida manifiestos y referencias"
	@echo "  make verificar-fase-12      Valida esquemas y CLI"
	@echo "  make verificar-fase-13      Valida generadores y no sobrescritura"
	@echo "  make verificar-fase-14      Valida auditoría estática e impacto"
	@echo "  make medir-fase-15          Regenera el benchmark comparativo local"
	@echo "  make verificar-fase-15      Valida rendimiento, costos y presupuestos"
	@echo "  make generar-contexto-agente Genera un paquete de contexto para IA"
	@echo "  make verificar-fase-16      Valida contexto y límites para agentes"
	@echo "  make sincronizar-editorial  Regenera identidad y afirmaciones compartidas"
	@echo "  make verificar-fase-17      Valida sincronización de todos los productos"
	@echo "  make preparar-paquete-fase-18 Prepara paquete externo con huellas"
	@echo "  make verificar-fase-18      Valida preparación y pendientes externos"
	@echo "  make verificar-fase-19      Valida COBRIA Engineering e integración editorial"
	@echo "  make verificar-fase-20      Ejecuta el laboratorio neutral Engineering"
	@echo "  make verificar-fase-21      Repite el piloto estructural en POS Guápiles"
	@echo "  make verificar-fase-22      Valida evaluación Engineering por manifiesto"
	@echo "  make verificar-fase-23      Compara transferencia Engineering en tres repositorios"
	@echo "  make preparar-revision-fase-24 Genera el paquete ciego de revisión semántica"
	@echo "  make verificar-fase-24      Valida preparación sin simular revisores humanos"
	@echo "  make verificar-fase-25      Valida evidencia dimensional de ENG-007"
	@echo "  make verificar-fase-26      Valida rúbrica Engineering de 24 dimensiones"
	@echo "  make verificar-fase-27      Valida expediente comparativo de 72 decisiones"
	@echo "  make preparar-revision-fase-28 Prepara dos formularios dimensionales ciegos"
	@echo "  make verificar-fase-28      Valida 144 juicios vacíos sin atestación simulada"
	@echo "  make procesar-respuestas-fase-29 Procesa dos respuestas humanas completas"
	@echo "  make verificar-fase-29      Mantiene acuerdo nulo mientras no existan respuestas"
	@echo "  make procesar-adjudicacion-fase-30 Procesa solo desacuerdos humanos auténticos"
	@echo "  make verificar-fase-30      Valida adjudicación vacía y originales protegidos"
	@echo "  make generar-plantilla-fase-31 Genera captura para cinco ensayos operacionales"
	@echo "  make verificar-fase-31      Valida protocolo sin afirmar ejecución real"
	@echo "  make verificar-fase-32      Prepara réplica externa sin inventar resultados"
	@echo "  make verificar-fase-33      Genera síntesis condicionada por evidencia"
	@echo "  make verificar-fase-34      Sincroniza el estado editorial de cierre"
	@echo "  make verificar-fase-35      Construye candidato local con huellas"
	@echo "  make verificar-fase-36      Evalúa publicación sin publicar ni firmar"
	@echo "  make generar-manifiestos    Regenera las vistas de máquina"
	@echo "  make generar-esquemas       Regenera JSON Schema específicos"
	@echo "  make verificar-replica      Ejecuta el conjunto científico de pruebas"
	@echo "  make verificar-sitio        Construye y prueba el sitio"
	@echo "  make sincronizar-descargas  Copia los PDF canónicos al sitio"
	@echo "  make construir-sitio        Genera la versión publicable del sitio"
	@echo "  make construir-maestro      Compila el documento maestro"
	@echo "  make construir-articulo     Compila el artículo científico"
	@echo "  make verificar-cierre-18   Valida publicación y retiene la etiqueta estable si faltan personas"
	@echo "  make preparar-estable      Rechaza la promoción mientras existan puertas humanas pendientes"

verificar: verificar-curriculo verificar-fase-2 verificar-fase-3 verificar-fase-4 verificar-fase-5 verificar-fase-6 verificar-fase-7 verificar-fase-8 verificar-fase-9 verificar-fase-10 verificar-fase-11 verificar-fase-12 verificar-fase-13 verificar-fase-14 verificar-fase-15 verificar-fase-16 verificar-fase-17 verificar-fase-18 verificar-fase-19 verificar-fase-20 verificar-fase-21 verificar-fase-22 verificar-fase-23 verificar-fase-24 verificar-fase-25 verificar-fase-26 verificar-fase-27 verificar-fase-28 verificar-fase-29 verificar-fase-30 verificar-fase-31 verificar-fase-32 verificar-fase-33 verificar-fase-34 verificar-fase-35 verificar-fase-36 verificar-r7 verificar-r8 verificar-replica verificar-sitio

.PHONY: verificar-c0
verificar: verificar-c0

.PHONY: verificar-c1
verificar: verificar-c1

.PHONY: verificar-c2
verificar: verificar-c2

verificar-c2: verificar-curriculo
	node --test replication/tests/c2-data.test.mjs
	node replication/scripts/verify-c2-data.mjs

.PHONY: verificar-c3
verificar: verificar-c3

verificar-c3: verificar-curriculo
	node --test replication/tests/c3-architecture.test.mjs
	node replication/scripts/verify-c3-layers.mjs

verificar-c1: verificar-curriculo
	node --test replication/tests/c1-simulation.test.mjs replication/tests/c1-learning.test.mjs
	node replication/scripts/verify-c1-start.mjs

verificar-c0:
	node editorial/audit-c0.mjs --check
	node --test replication/tests/c0-audit.test.mjs

verificar-curriculo:
	node editorial/build-curriculum.mjs
	python3 replication/scripts/validate-curriculum.py
	python3 -m unittest discover -s replication/tests -p 'test_*.py'
	node --test replication/tests/standards-map.test.mjs
	npm test --prefix replication/examples/operacion-documental

verificar-publicacion: verificar-procedencia sincronizar-editorial construir-editorial verificar-especificacion verificar-r4 verificar-r5 verificar-r6 verificar verificar-cierre-0-1 verificar-cierre-2-3 verificar-cierre-4-5 verificar-cierre-6-7 verificar-cierre-8-9 verificar-cierre-10-11 verificar-cierre-12-13 verificar-cierre-14-15 verificar-integridad-paquete

verificar-publicacion-publica: verificar-publicacion verificar-cierre-16 verificar-cierre-17 verificar-cierre-18

verificar-integridad-paquete:
	python3 replication/scripts/validate-release-manifest.py

.PHONY: generar-manifiesto-paquete verificar-pc0
verificar: verificar-pc0
generar-manifiesto-paquete:
	python3 replication/scripts/build-release-manifest.py

verificar-pc0:
	python3 -m unittest discover -s replication/tests -p 'test_release_manifest.py'
	python3 replication/scripts/validate-release-manifest.py

.PHONY: verificar-pc1
verificar-pc1: verificar-r4

.PHONY: verificar-pc2
.PHONY: verificar-pc7 revisar-edicion-pc7
verificar-pc7:
	node --test replication/tests/pc7-fonts.test.mjs
revisar-edicion-pc7: verificar-pc7
	node replication/scripts/review-pc7-book.mjs
verificar: verificar-pc7

.PHONY: verificar-publico verificar-referencias-autorizadas verificar-pc8 construir-publico
verificar-publico: export COBRIA_PUBLIC_BUILD=1
verificar-publico: verificar-curriculo verificar-c0 verificar-c1 verificar-c2 verificar-c3 verificar-c4 verificar-c5 verificar-c6 verificar-c7 verificar-c8 verificar-c9 verificar-c10 verificar-pc0 verificar-pc2 verificar-pc3 verificar-pc5 verificar-pc6 verificar-pc7 verificar-pc8 verificar-replica verificar-r7 verificar-r8 verificar-sitio
verificar-publico: $(addprefix verificar-fase-,2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 24 26 27 28 29 30 31 32 33 34 35 36)

construir-publico: export COBRIA_PUBLIC_BUILD=1
construir-publico: construir-editorial verificar-publico verificar-especificacion sincronizar-descargas
	node replication/scripts/review-pc7-book.mjs
	python3 replication/scripts/review-pc7-pdf.py
	python3 replication/scripts/validate-closure-phase1415.py

verificar-referencias-autorizadas: verificar-fase-21 verificar-fase-22 verificar-fase-23 verificar-fase-25

verificar-pc8:
	npm run test:stream --prefix sitio
	node --test replication/tests/pc8-portability.test.mjs
verificar: verificar-pc8
.PHONY: verificar-pc9-pc10 preparar-pc9-pc10
verificar-pc9-pc10:
	python3 -m unittest discover -s replication/tests -p 'test_pc9_pc10.py'
preparar-pc9-pc10: verificar-pc9-pc10
	python3 replication/scripts/prepare-pc9-pc10.py
verificar: verificar-pc9-pc10
verificar-publico: verificar-pc9-pc10
.PHONY: verificar-ecosistema-11-12 probar-instalacion-toolkit
verificar-ecosistema-11-12:
	npm test --prefix replication/examples/ecosistema-app
	node --test replication/tests/ecosystem-build-toolkit.test.mjs
probar-instalacion-toolkit:
	node replication/scripts/verify-ecosystem-build-toolkit.mjs
verificar: verificar-ecosistema-11-12
verificar-publico: verificar-ecosistema-11-12
.PHONY: generar-evidencia-ecosistema-13 verificar-ecosistema-13-14 auditar-pdf-ecosistema-14
generar-evidencia-ecosistema-13:
	python3 replication/scripts/build-ecosystem-evidence.py
verificar-ecosistema-13-14:
	python3 replication/scripts/build-ecosystem-evidence.py --check
	python3 -m unittest discover -s replication/tests -p 'test_ecosystem_evidence.py'
	python3 -m unittest discover -s replication/tests -p 'test_pdf_metadata_structure.py'
auditar-pdf-ecosistema-14:
	python3 replication/scripts/audit-ecosystem-pdfs.py --downloads
verificar: verificar-ecosistema-13-14
verificar-publico: verificar-ecosistema-13-14
.PHONY: verificar-ecosistema-15-16 auditar-web-ecosistema-15
verificar-ecosistema-15-16:
	node --test replication/tests/ecosystem-site-candidate.test.mjs
	python3 -m unittest discover -s replication/tests -p 'test_ecosystem_candidate.py'
auditar-web-ecosistema-15:
	node replication/scripts/audit-site-ecosystem.mjs "$(COBRIA_QA_SITE)"
verificar: verificar-ecosistema-15-16
verificar-publico: verificar-ecosistema-15-16
.PHONY: doble-construccion-ecosistema-16 preparar-candidata-ecosistema-16
doble-construccion-ecosistema-16:
	node replication/scripts/build-pc8-clean.mjs
preparar-candidata-ecosistema-16:
	python3 replication/scripts/package-ecosystem-candidate.py
.PHONY: verificar-pc3 verificar-pc5 verificar-pc6 diagnosticar-pc3
verificar-pc3:
	node --test replication/tests/pc3-analysis.test.mjs replication/tests/pc3-storage.test.mjs
diagnosticar-pc3:
	node replication/scripts/preflight-pc3.mjs
verificar-pc5:
	npm test --prefix replication/examples/integral-c8
verificar-pc6:
	node --test replication/tests/pc6-curriculum.test.mjs
verificar: verificar-pc3 verificar-pc5 verificar-pc6
verificar: verificar-pc2
verificar-pc2:
	node --test replication/tests/pc2-contracts.test.mjs replication/tests/pc2-freeze.test.mjs replication/tests/pc2-analysis.test.mjs
	node replication/scripts/freeze-pc2.mjs --check
	node replication/scripts/check-pc2-analysis.mjs --check

verificar-procedencia:
	python3 replication/scripts/validate-remediation-r2.py

generar-especificacion:
	node replication/scripts/generate-specification-r3.mjs

construir-especificacion: generar-especificacion
	mkdir -p build/especificacion output/pdf
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build/especificacion specification/COBRIA-ECOSISTEMA-1.0.tex
	cp build/especificacion/COBRIA-ECOSISTEMA-1.0.pdf output/pdf/COBRIA-especificacion-ecosistema-1.0.pdf
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-especificacion-ecosistema-1.0.pdf "COBRIA Ecosistema 1.0: especificación normativa" "Requisitos, contratos y conformidad de la propuesta independiente COBRIA"

verificar-especificacion: construir-especificacion
	node replication/scripts/generate-specification-r3.mjs --check
	python3 replication/scripts/validate-remediation-r3.py

generar-ejemplos-r4:
	node libro-cobria/generate-practical-examples.mjs
	node replication/scripts/generate-pattern-catalog.mjs

verificar-r4: generar-ejemplos-r4
	npm test --prefix replication/examples/patterns-r4
	python3 -m unittest discover -s replication/examples/patterns-r4/multilang/python -p 'test_*.py'
	java_dir=$$(mktemp -d /tmp/cobria-r4-java.XXXXXX); test -n "$$java_dir"; javac -d "$$java_dir" replication/examples/patterns-r4/multilang/java/ProcesamientoIdempotente.java; java -cp "$$java_dir" ProcesamientoIdempotente
	cd replication/examples/patterns-r4/multilang/go && go test ./...
	python3 replication/scripts/validate-remediation-r4.py

verificar-r5: construir-editorial
	python3 replication/scripts/validate-remediation-r5.py

verificar-r6: sincronizar-editorial sincronizar-descargas verificar-sitio
	cd sitio && npm audit --audit-level=high
	python3 replication/scripts/validate-remediation-r6.py

analizar-r7:
	cd replication && npm run statistics:r7

verificar-r7: analizar-r7
	python3 replication/scripts/validate-remediation-r7.py

verificar-r8: sincronizar-editorial
	node replication/scripts/sync-editorial.mjs --check
	python3 replication/scripts/validate-remediation-r8.py

construir-rc2:
	python3 replication/scripts/build-remediation-r9.py

verificar-r9:
	python3 replication/scripts/validate-remediation-r9.py

verificar-r9-publica: verificar-r9
	python3 replication/scripts/audit-public-r9.py

inventario-cierre:
	node replication/scripts/generate-release-baseline.mjs

verificar-cierre-0-1: inventario-cierre
	python3 replication/scripts/validate-closure-phase01.py

verificar-cierre-2-3:
	python3 replication/scripts/validate-closure-phase23.py

.PHONY: verificar-c4
.PHONY: verificar-c5
.PHONY: verificar-c6
.PHONY: verificar-c7
.PHONY: verificar-c8
.PHONY: verificar-c9
.PHONY: verificar-c10
verificar: verificar-c10

verificar-c10:
	node libro-cobria/build-book.mjs
	node --test replication/tests/c10-reader.test.mjs

verificar: verificar-c9

verificar-c9:
	node libro-cobria/build-book.mjs
	node --test replication/tests/c9-toolkit.test.mjs replication/tests/c9-documentation.test.mjs
	node replication/examples/documentacion-c9/recorrido.mjs
	node replication/examples/integral-c8/verificar.mjs

verificar: verificar-c8

verificar-c8:
	node libro-cobria/build-book.mjs
	npm test --prefix replication/examples/integral-c8
	node replication/examples/integral-c8/verificar.mjs
	node --test replication/tests/c8-workshop.test.mjs

verificar: verificar-c7

verificar-c7:
	node libro-cobria/build-book.mjs
	npm test --prefix replication/examples/analitica-c7
	node replication/examples/analitica-c7/demo.mjs
	node replication/examples/analitica-c7/evaluar.mjs
	node --test replication/tests/c7-workshop.test.mjs

verificar: verificar-c6

verificar-c6:
	node libro-cobria/build-book.mjs
	npm test --prefix replication/examples/operacion-c6
	node replication/examples/operacion-c6/demo.mjs
	node replication/examples/operacion-c6/medir.mjs
	node --test replication/tests/c6-workshop.test.mjs

verificar: verificar-c5

verificar-c5:
	node libro-cobria/build-book.mjs
	npm test --prefix replication/examples/api-ux-c5
	node --test replication/tests/c5-workshop.test.mjs

verificar: verificar-c4

verificar-c4: generar-ejemplos-r4 generar-catalogo-patrones
	node libro-cobria/build-book.mjs
	node sitio/scripts/generate-search-pages.mjs
	npm test --prefix replication/examples/patterns-r4
	node --test replication/tests/c4-patterns.test.mjs

generar-catalogo-patrones:
	node replication/scripts/generate-pattern-catalog.mjs

verificar-cierre-4-5: generar-catalogo-patrones
	python3 replication/scripts/validate-closure-phase45.py

verificar-cierre-6-7:
	python3 replication/scripts/validate-closure-phase67.py

verificar-cierre-8-9:
	python3 replication/scripts/validate-closure-phase89.py
	python3 replication/scripts/validate-operational-phase89.py

verificar-cierre-10-11:
	python3 replication/scripts/validate-closure-phase1011.py

generar-inventario-cientifico:
	node replication/scripts/generate-scientific-inventory.mjs

verificar-cierre-12-13: generar-inventario-cientifico
	python3 replication/scripts/validate-closure-phase1213.py

ejecutar-ensayo-operacional-8-9:
	node replication/scripts/run-operational-phase89.mjs
	python3 replication/scripts/validate-operational-phase89.py

validar-ensayo-operacional-8-9:
	python3 replication/scripts/validate-operational-phase89.py

verificar-fase-2:
	python3 replication/scripts/validate-phase2.py

verificar-fase-3:
	python3 replication/scripts/validate-phase3.py

verificar-fase-4:
	python3 replication/scripts/validate-phase4.py

verificar-fase-5:
	python3 replication/scripts/validate-phase5.py

verificar-fase-6:
	python3 replication/scripts/validate-phase6.py

verificar-fase-7:
	python3 replication/scripts/validate-phase7.py

verificar-fase-8:
	python3 replication/scripts/validate-phase8.py

verificar-fase-9:
	python3 replication/scripts/validate-phase9.py

verificar-fase-10:
	python3 replication/scripts/validate-phase10.py

generar-manifiestos:
	python3 replication/scripts/generate-phase11-manifests.py

verificar-fase-11:
	python3 replication/scripts/validate-phase11.py

generar-esquemas:
	python3 replication/scripts/generate-phase12-schemas.py

verificar-fase-12:
	python3 replication/scripts/validate-phase12.py

verificar-fase-13:
	python3 replication/scripts/validate-phase13.py

verificar-fase-14:
	python3 replication/scripts/validate-phase14.py

medir-fase-15:
	cd replication && npm run performance:phase15

verificar-fase-15:
	python3 replication/scripts/validate-phase15.py

generar-contexto-agente:
	cd replication && npm run context:agent

verificar-fase-16:
	python3 replication/scripts/validate-phase16.py

sincronizar-editorial:
	node replication/scripts/sync-editorial.mjs

verificar-fase-17:
	python3 replication/scripts/validate-phase17.py

preparar-paquete-fase-18:
	node replication/scripts/build-phase18-package.mjs

verificar-fase-18:
	python3 replication/scripts/validate-phase18.py

verificar-fase-19:
	python3 replication/scripts/validate-phase19.py

verificar-fase-20:
	python3 replication/scripts/validate-phase20.py

verificar-fase-21:
	python3 replication/scripts/validate-phase21.py

verificar-fase-22:
	python3 replication/scripts/validate-phase22.py

verificar-fase-23:
	python3 replication/scripts/validate-phase23.py

preparar-revision-fase-24:
	node replication/scripts/build-phase24-review-package.mjs

verificar-fase-24:
	python3 replication/scripts/validate-phase24.py

verificar-fase-25:
	python3 replication/scripts/validate-phase25.py

verificar-fase-26:
	python3 replication/scripts/validate-phase26.py

verificar-fase-27:
	node replication/scripts/generate-phase27-dossier.mjs
	python3 replication/scripts/validate-phase27.py

preparar-revision-fase-28:
	node replication/scripts/build-phase28-dimensional-review.mjs

verificar-fase-28:
	python3 replication/scripts/validate-phase28.py

procesar-respuestas-fase-29:
	node replication/scripts/ingest-phase29-responses.mjs

verificar-fase-29:
	python3 replication/scripts/validate-phase29.py

procesar-adjudicacion-fase-30:
	node replication/scripts/process-phase30-adjudication.mjs

verificar-fase-30:
	python3 replication/scripts/validate-phase30.py

generar-plantilla-fase-31:
	node replication/scripts/generate-phase31-template.mjs

verificar-fase-31:
	python3 replication/scripts/validate-phase31.py

verificar-fase-32:
	python3 replication/scripts/validate-phase32.py

verificar-fase-33:
	python3 replication/scripts/validate-phase33.py

verificar-fase-34:
	python3 replication/scripts/validate-phase34.py

verificar-fase-35: verificar-fase-33 verificar-fase-34
	python3 replication/scripts/validate-phase35.py

verificar-fase-36:
	python3 replication/scripts/validate-phase36.py

verificar-replica:
	cd replication && npm test
	cd replication/examples/ecosistema-app && npm test

sincronizar-descargas:
	cd sitio && node scripts/sync-downloads.mjs

construir-sitio: sincronizar-descargas
	cd sitio && npm run build

verificar-sitio:
ifeq ($(COBRIA_SITE_ISOLATED),1)
	node replication/scripts/verify-site-isolated.mjs
else
	cd sitio && npm run lint
	cd sitio && npm test
endif

construir-maestro:
	mkdir -p build/maestro output/pdf
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build/maestro main.tex
	cp build/maestro/main.pdf output/pdf/COBRIA-documento-maestro-ecosistema.pdf
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-documento-maestro-ecosistema.pdf "COBRIA: diseño y evaluación de contratos reconstruibles para sistemas NoSQL documentales" "Desarrollo científico de la propuesta independiente COBRIA"

.PHONY: generar-ep6 verificar-ep6
.PHONY: generar-ep7 verificar-ep7 generar-ep8 verificar-ep8 revisar-edicion-ep7
revisar-edicion-ep7:
	python3 editorial/ep7/verify-pdf.py
generar-ep7:
	node editorial/ep7/build.mjs
generar-ep8:
	node editorial/ep8/build.mjs
construir-maestro construir-articulo construir-articulo-ciego: generar-ep7 generar-ep8
verificar: verificar-ep7 verificar-ep8
verificar-ep7:
	node editorial/ep7/build.mjs --check
	node --test replication/tests/ep7-literature.test.mjs
verificar-ep8:
	node editorial/ep8/build.mjs --check
	node --test replication/tests/ep8-scope.test.mjs

.PHONY: generar-lecturas-ep9 verificar-ep9
generar-lecturas-ep9:
	python3 editorial/ep9/reader_html.py
verificar: verificar-ep9
verificar-ep9:
	python3 -m unittest discover -s replication/tests -p 'test_ep9_readers.py'
	python3 editorial/ep9/reader_html.py
	python3 editorial/ep9/reader_html.py --check
	python3 editorial/ep9/verify.py

# Una compilación nueva puede variar en metadatos PDF: aquí se comprueban las
# fuentes y lecturas. EP10 compara aparte con los PDF inspeccionados de EP9.
.PHONY: verificar-ep9-construccion
verificar-ep9-construccion:
	python3 -m unittest discover -s replication/tests -p 'test_ep9_readers.py'
	python3 editorial/ep9/reader_html.py --check
verificar-publico: verificar-ep4 verificar-ep5 verificar-ep6 verificar-ep7 verificar-ep8 verificar-ep9-construccion

.PHONY: verificar-ep10 preparar-ep10
verificar-ep10:
	python3 -m unittest discover -s replication/tests -p 'test_ep10_candidate.py'
	python3 -m unittest discover -s editorial/ep10 -p 'test_observe_ci.py'
preparar-ep10: verificar-ep10
	python3 editorial/ep10/candidate.py
verificar: verificar-ep10
verificar-publico: verificar-ep10
generar-ep6:
	node editorial/ep6/build.mjs
construir-maestro construir-articulo construir-articulo-ciego: generar-ep6
verificar: verificar-ep6
verificar-ep6:
	node editorial/ep6/build.mjs --check
	node --test replication/tests/ep6-scientific.test.mjs
.PHONY: revisar-edicion-ep6
revisar-edicion-ep6:
	python3 editorial/ep6/verify-pdf.py

construir-articulo:
	mkdir -p build/articulo output/pdf
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build/articulo articulo-cobria.tex
	cp build/articulo/articulo-cobria.pdf output/pdf/COBRIA-articulo-cientifico-actualizado.pdf
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-articulo-cientifico-actualizado.pdf "Contratos reconstruibles con ámbito explícito para sistemas NoSQL documentales" "Artículo científico de la propuesta independiente COBRIA"

construir-editorial: generar-ejemplos-r4 construir-maestro construir-articulo
	cd libro-cobria && npm run all
	$(MAKE) construir-especificacion
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-ecosistema-manual-completo.pdf "COBRIA: patrones, capas, datos y software verificable" "Libro pedagógico de la propuesta independiente COBRIA"
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-cuaderno-de-trabajo.pdf "COBRIA: cuaderno de trabajo" "Laboratorios y práctica guiada del Ecosistema COBRIA"
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-anexo-tecnico.pdf "COBRIA: anexo técnico" "Trazabilidad del programa de investigación COBRIA"

verificar-cierre-14-15: sincronizar-descargas verificar-sitio
	python3 replication/scripts/validate-closure-phase1415.py

construir-rc1:
	python3 replication/scripts/build-closure-phase16.py

verificar-cierre-16:
	python3 replication/scripts/build-closure-phase16.py --output /tmp/cobria-rc1-a
	python3 replication/scripts/build-closure-phase16.py --output /tmp/cobria-rc1-b
	cmp /tmp/cobria-rc1-a/BUILD-SUMMARY.json /tmp/cobria-rc1-b/BUILD-SUMMARY.json

auditar-rc1:
	python3 replication/scripts/audit-closure-phase17.py

verificar-cierre-17: auditar-rc1

verificar-cierre-18:
	python3 replication/scripts/validate-closure-phase18.py

preparar-estable:
	python3 replication/scripts/prepare-stable-release.py

.PHONY: verificar-ep0 capturar-ep0
verificar: verificar-ep0
verificar-publico: verificar-ep0
verificar-ep0:
	node --test replication/tests/ep0-baseline.test.mjs

.PHONY: verificar-ep1 auditar-ep1-local
.PHONY: verificar-ep2 generar-ep2
.PHONY: verificar-ep3 generar-ep3
.PHONY: revisar-edicion-ep3
revisar-edicion-ep3:
	python3 replication/scripts/review-ep3-pdf.py
verificar: verificar-ep3 verificar-ep4
verificar: verificar-ep5
.PHONY: verificar-ep5
verificar-ep5:
	node --test replication/tests/ep5-learning.test.mjs

.PHONY: verificar-ep4
.PHONY: revisar-edicion-ep4
revisar-edicion-ep4:
	python3 editorial/ep4/verify-pdf.py
verificar-ep4:
	node --test replication/tests/ep4-recorrido.test.mjs
	node --test replication/tests/ep4-editorial.test.mjs
verificar-publico: verificar-ep3
generar-ep3:
	node editorial/ep3/build.mjs
verificar-ep3:
	node --test replication/tests/ep3-areas.test.mjs replication/tests/ep3-editorial.test.mjs
	node replication/scripts/verify-ep3-areas.mjs
.PHONY: revisar-edicion-ep2
revisar-edicion-ep2:
	python3 replication/scripts/review-ep2-pdf.py
verificar: verificar-ep2
verificar-publico: verificar-ep2
generar-ep2:
	node editorial/ep2/build.mjs
verificar-ep2:
	node --test replication/tests/ep2-start.test.mjs
	node replication/scripts/verify-ep2-start.mjs
verificar: verificar-ep1
verificar-publico: verificar-ep1
verificar-ep1:
	node --test replication/tests/ep1-routing.test.mjs
	python3 -m unittest discover -s replication/tests -p 'test_ep1_web_pdf.py'

# Copia construida explícita; solo escucha en loopback, no publica.
auditar-ep1-local:
	node replication/scripts/audit-ep1-local.mjs "$(COBRIA_EP1_SITE)"

# Consulta anónima; conserva una captura nueva. No construye ni despliega productos.
capturar-ep0:
	node replication/scripts/capture-ep0.mjs

.PHONY: verificar-ecosistema-17-18 revisar-candidata-ecosistema-17 decidir-publicacion-ecosistema-18
verificar: verificar-ecosistema-17-18
verificar-publico: verificar-ecosistema-17-18
verificar-ecosistema-17-18:
	python3 -m unittest discover -s replication/tests -p 'test_ecosystem_release_review.py'

# Rutas explícitas: no se selecciona otra candidata ni se sobrescribe evidencia.
revisar-candidata-ecosistema-17:
	python3 replication/scripts/ecosystem_release_review.py revisar --candidate "$(COBRIA_CANDIDATE)" --output "$(COBRIA_REVIEW_OUTPUT)"

decidir-publicacion-ecosistema-18:
	python3 replication/scripts/ecosystem_release_review.py decidir --candidate "$(COBRIA_CANDIDATE)" --audit "$(COBRIA_REVIEW_REPORT)" --output "$(COBRIA_DECISION_OUTPUT)"

construir-articulo-ciego:
	mkdir -p build/review output/pdf
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build/review review/blind-article.tex
	cp build/review/blind-article.pdf output/pdf/COBRIA-articulo-revision-ciega.pdf
.PHONY: verificar-cierre-6-7
.PHONY: verificar-cierre-8-9
.PHONY: ejecutar-ensayo-operacional-8-9 validar-ensayo-operacional-8-9
.PHONY: verificar-cierre-10-11
.PHONY: generar-inventario-cientifico verificar-cierre-12-13
.PHONY: construir-editorial verificar-cierre-14-15
.PHONY: construir-rc1 verificar-cierre-16 auditar-rc1 verificar-cierre-17 verificar-cierre-18 preparar-estable
