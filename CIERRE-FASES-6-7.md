# Cierre de las fases 6 y 7

**Fecha de corte:** 2026-09-21  
**Alcance:** COBRIA API & UX y COBRIA Security  
**Naturaleza:** propuesta independiente; no es certificación de accesibilidad, seguridad ni cumplimiento jurídico.

## Resultado

Las dos áreas ya forman parte ejecutable y pública del ecosistema. La fase 6 define
contratos HTTP y de eventos, errores RFC 9457, idempotencia, cursores, estados completos
de interfaz, formularios, internacionalización y el objetivo WCAG 2.2 AA. La fase 7
conecta amenazas, identidad, capacidad, ámbito, finalidad, privacidad, secretos,
Functions, webhooks, cadena de suministro e incidentes.

## Evidencia trazable

| Aspecto | Fuente | Evidencia ejecutable |
|---|---|---|
| HTTP y eventos | `specification/phase-10/` | `validate-phase10.py` |
| UX y accesibilidad | `ux-accessibility.json` y manual 15 | controles de sitio y matriz manual |
| Problemas seguros | `problema-http.mjs` | pruebas de controladores neutrales |
| Amenazas y autorización | `specification/phase-7/` | `validate-phase7.py` y casos negativos |
| Dependencias | lockfile, SBOM y registro de riesgos | `npm audit --json` |
| Publicación pedagógica | rutas `/api-ux` y `/seguridad` | pruebas del sitio y sitemap |

La compuerta unificada es:

```bash
make verificar-cierre-6-7
```

## Límites y pendientes humanos

- Los controles automáticos no prueban conformidad WCAG. Quedan revisión por teclado,
  VoiceOver, NVDA, zoom, reflujo, alto contraste y comprensión con personas.
- La auditoría de dependencias describe únicamente el lockfile, herramienta y fecha del
  corte; no demuestra ausencia de vulnerabilidades.
- No se ejecutó pentest externo, revisión jurídica ni certificación de privacidad.
- Las políticas deben volver a probarse en el proveedor y ambiente de despliegue real.
- Ningún resultado de esta fase convierte la propuesta COBRIA en norma oficial.

## Criterio para continuar

Los contratos y controles reproducibles deben permanecer verdes. Los pendientes humanos
se conservan visibles y no pueden sustituirse por atestaciones inventadas o automáticas.
