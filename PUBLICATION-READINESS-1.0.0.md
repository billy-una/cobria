# Preparación de publicación de COBRIA Ecosistema 1.0.0

**Decisión actual:** publicación y versión estable retenidas; revisión local de la instantánea interna de fase 16.
**Candidata:** `ecosistema-1.0.0-rc2`.
**Fecha de corte:** 19 de octubre de 2026.

## Evidencia local vigente y antecedentes

La [revisión de fases 17 y 18](editorial/ecosistema-17-18/ENTREGA.md) identifica el ZIP
interno por huella y conserva separado su resultado automático de las puertas humanas.
La instantánea revisada es `2b0120a9c82b43ee903118b480ce02e29d110822`, no un commit
aprobado del repositorio principal. Los cambios posteriores requieren otra candidata.
El archivo conserva historia Git: su integridad no autoriza distribuirlo sin revisión
de privacidad y derechos. No está desplegado ni constituye una nueva RC2 publicada.

### Antecedente RC2 del 17 de octubre

El registro generado `review/RC2-LOCAL-2026-10-17.json` identifica el commit
`cf59f07e40e75a22db409c499a7970a54f19ef20`, dos construcciones desde clones limpios,
comparación aprobada e integridad del ZIP comprobada. La huella SHA-256 del paquete es
`be7c9fa805710db222780358917d2322d5d67f8a39d826dee45328f2d3a655e7`.

La reproducción utilizó copias locales de los repositorios de referencia, no incluidas
en el ZIP. No equivale a reproducción pública autónoma ni a réplica externa.
Los cambios posteriores a ese commit no forman parte de la candidata manifestada.

El comprobador público posterior exige el paquete local aprobado y compara sus
descargas con los bytes publicados, incluidas las copias optimizadas. Sus pruebas
sin red están aprobadas; la comprobación contra el despliegue real permanece pendiente.

## Cumplido automáticamente

- construcción reproducible con huellas;
- pruebas de Toolkit, aplicación neutral y sitio;
- revisión de dependencias de producción;
- integridad, metadatos y sincronización de productos PDF;
- licencia por tipo de artefacto, cita, historial y política de mantenimiento;
- canal estructurado para defectos, patrones y evidencia externa.

## Puertas que siguen abiertas

| Puerta | Estado | Quién puede cerrarla |
|---|---|---|
| GitHub Actions con referencias autorizadas | configuración preparada; ejecución remota no verificada | responsable con acceso de lectura a las referencias |
| publicación RC2 y comprobación de descargas públicas | pendiente; no se hizo push, despliegue ni release | persona autorizada y verificación contra artefactos públicos |
| lectura técnica y editorial independiente | pendiente | personas externas identificables |
| doble cribado bibliográfico | pendiente | dos personas trabajando independientemente |
| transferencia con consentimiento | pendiente | participantes y responsable ético |
| réplica en otra computadora | pendiente | equipo externo |
| autorización de publicación estable | pendiente | responsable humano del proyecto |
| firma y depósito público | opcional y pendiente | persona autorizada y servicio externo |

Por estas razones no existe la etiqueta `ecosistema-1.0.0`. Una automatización debe
rechazar su creación mientras alguna puerta obligatoria continúe pendiente. Este estado
no invalida la candidata: permite estudiarla, reproducirla y comunicar incidencias sin
presentarla como certificación o estándar oficial.

