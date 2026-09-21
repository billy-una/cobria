# Cadena de suministro

La construcción parte de dependencias fijadas por lockfile y produce un SBOM CycloneDX (`replication/SBOM.cdx.json`). El pipeline debe comprobar pruebas, validadores, secretos, dependencias, licencias compatibles, integridad y procedencia antes de publicar un artefacto inmutable.

Una alerta no se silencia por conveniencia: se registra componente, versión, exposición, explotabilidad, decisión, responsable y plazo. Actualizar requiere pruebas de contrato y conformidad; aceptar temporalmente requiere control compensatorio. Los artefactos promovidos a producción son los mismos que fueron probados.

El repositorio no afirma ausencia de vulnerabilidades. El estado depende de la fecha, fuentes y entorno; por eso los informes incluyen marca temporal y pueden caducar.
