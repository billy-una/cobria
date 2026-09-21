# Auditoría de cierre — fase 10

**Fecha:** 2026-09-19. **Alcance:** API, integración, UX y accesibilidad.

## Resultado

El gate local queda cerrado. La API neutral tiene OpenAPI 3.1, autenticación y ámbito, idempotencia, paginación opaca, errores estables RFC 9457, timeouts, reintentos y reglas de compatibilidad. Dos eventos declaran sobre, versión, orden limitado, retención y dead-letter.

El sitio incorpora idioma, salto al contenido, landmarks, navegación nombrada, foco visible, objetivos de 44 px, reducción de movimiento, código desplazable y navegación móvil preservada. Se corrigieron enlaces de catálogo y código.

Las pruebas del ejemplo de API se integraron al comando raíz y a CI; ya no dependen de
que una persona recuerde ejecutar el subproyecto por separado.

## Límite

La evidencia automática no equivale a conformidad WCAG 2.2 AA. Continúan pendientes teclado completo, VoiceOver, NVDA, zoom, reflujo a 320 CSS px, alto contraste, anuncios dinámicos y evaluación con personas. El OpenAPI es contrato neutral y no prueba una API desplegada.
