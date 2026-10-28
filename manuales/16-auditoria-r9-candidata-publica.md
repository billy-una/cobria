# Auditoría R9: candidata pública reproducible

R9 produce una candidata verificable sin confundir construcción con publicación. La
automatización crea dos clones limpios del mismo commit, instala dependencias fijadas,
ejecuta la compuerta editorial y científica y compara los resultados.

## Criterios automáticos

- seis PDF presentes, legibles y con número de páginas registrado;
- fuentes y sitio estático empaquetados de forma determinista;
- SBOM CycloneDX del monorepositorio;
- manifiesto y `SHA256SUMS` consistentes;
- Core 1.0 con su huella congelada;
- comparación de dos construcciones independientes;
- cero bloqueadores automáticos locales.

## Criterios públicos

La auditoría pública consulta la URL canónica, exige rutas esenciales, encabezados de
seguridad, versión RC2 y las seis descargas. Compara las huellas del manifiesto remoto
con el paquete local. Este control debe ejecutarse después del despliegue.

## Frontera humana

Crear la GitHub Release, firmar o promover una versión estable son acciones reservadas
por `specification/phase-16/agent-policy.json`. R9 puede preparar todos los archivos y
emitir una decisión automática; no puede inventar esa autorización ni afirmar que un
despliegue pendiente ya ocurrió.
