.PHONY: ayuda verificar inventario-cierre verificar-cierre-0-1 verificar-cierre-2-3 generar-catalogo-patrones verificar-cierre-4-5 verificar-fase-2 verificar-fase-3 verificar-fase-4 verificar-fase-5 verificar-fase-6 verificar-fase-7 verificar-fase-8 verificar-fase-9 verificar-fase-10 verificar-fase-11 verificar-fase-12 verificar-fase-13 verificar-fase-14 verificar-fase-15 verificar-fase-16 verificar-fase-17 verificar-fase-18 verificar-fase-19 verificar-fase-20 verificar-fase-21 verificar-fase-22 verificar-fase-23 verificar-fase-24 verificar-fase-25 verificar-fase-26 verificar-fase-27 verificar-fase-28 verificar-fase-29 verificar-fase-30 verificar-fase-31 medir-fase-15 generar-contexto-agente sincronizar-editorial preparar-paquete-fase-18 preparar-revision-fase-24 preparar-revision-fase-28 procesar-respuestas-fase-29 procesar-adjudicacion-fase-30 generar-plantilla-fase-31 generar-manifiestos generar-esquemas verificar-replica verificar-sitio sincronizar-descargas construir-sitio construir-maestro construir-articulo construir-articulo-ciego construir-editorial

ayuda:
	@echo "COBRIA — comandos del monorepositorio"
	@echo "  make verificar              Ejecuta las pruebas de réplica y del sitio"
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

verificar: verificar-fase-2 verificar-fase-3 verificar-fase-4 verificar-fase-5 verificar-fase-6 verificar-fase-7 verificar-fase-8 verificar-fase-9 verificar-fase-10 verificar-fase-11 verificar-fase-12 verificar-fase-13 verificar-fase-14 verificar-fase-15 verificar-fase-16 verificar-fase-17 verificar-fase-18 verificar-fase-19 verificar-fase-20 verificar-fase-21 verificar-fase-22 verificar-fase-23 verificar-fase-24 verificar-fase-25 verificar-fase-26 verificar-fase-27 verificar-fase-28 verificar-fase-29 verificar-fase-30 verificar-fase-31 verificar-fase-32 verificar-fase-33 verificar-fase-34 verificar-fase-35 verificar-fase-36 verificar-replica verificar-sitio

inventario-cierre:
	node replication/scripts/generate-release-baseline.mjs

verificar-cierre-0-1: inventario-cierre
	python3 replication/scripts/validate-closure-phase01.py

verificar-cierre-2-3:
	python3 replication/scripts/validate-closure-phase23.py

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
	cd sitio && npm run lint
	cd sitio && npm test

construir-maestro:
	mkdir -p build/maestro
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build/maestro main.tex
	cp build/maestro/main.pdf output/pdf/COBRIA-documento-maestro-ecosistema.pdf

construir-articulo:
	mkdir -p build/articulo
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build/articulo articulo-cobria.tex
	cp build/articulo/articulo-cobria.pdf output/pdf/COBRIA-articulo-cientifico-actualizado.pdf

construir-editorial: construir-maestro construir-articulo
	cd libro-cobria && node build-book.mjs && node export-pdf.mjs
	mkdir -p build/especificacion
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build/especificacion specification/COBRIA-ECOSISTEMA-1.0.tex
	cp build/especificacion/COBRIA-ECOSISTEMA-1.0.pdf output/pdf/COBRIA-especificacion-ecosistema-1.0.pdf
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-ecosistema-manual-completo.pdf "COBRIA: patrones, capas, datos y software verificable" "Libro pedagógico de la propuesta independiente COBRIA"
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-cuaderno-de-trabajo.pdf "COBRIA: cuaderno de trabajo" "Laboratorios y práctica guiada del Ecosistema COBRIA"
	python3 replication/scripts/set_pdf_metadata.py output/pdf/COBRIA-anexo-tecnico.pdf "COBRIA: anexo técnico" "Trazabilidad del programa de investigación COBRIA"

verificar-cierre-14-15: sincronizar-descargas
	python3 replication/scripts/validate-closure-phase1415.py
	cd sitio && npm run lint
	cd sitio && node --test tests/rendered-html.test.mjs

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

construir-articulo-ciego:
	mkdir -p build/review
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build/review review/blind-article.tex
.PHONY: verificar-cierre-6-7
.PHONY: verificar-cierre-8-9
.PHONY: ejecutar-ensayo-operacional-8-9 validar-ensayo-operacional-8-9
.PHONY: verificar-cierre-10-11
.PHONY: generar-inventario-cientifico verificar-cierre-12-13
.PHONY: construir-editorial verificar-cierre-14-15
.PHONY: construir-rc1 verificar-cierre-16 auditar-rc1 verificar-cierre-17 verificar-cierre-18 preparar-estable
