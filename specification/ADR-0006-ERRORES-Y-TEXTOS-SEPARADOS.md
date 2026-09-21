# ADR-0006 — Separar códigos de error y textos visibles

**Estado:** aceptado  
**Fecha:** 2026-09-19  
**Responsable:** Billy Jak Cordero Porras

## Contexto

Clasificar fallos por su mensaje acopla lógica, presentación, pruebas y registros a una
frase. Traducir o mejorar la redacción puede cambiar el comportamiento. Además, mensajes
del proveedor pueden filtrar información interna.

## Decisión

Dominio, aplicación e infraestructura producen códigos estables con parámetros seguros.
Presentación asigna estado de protocolo y texto localizado. Los registros conservan
código, correlación y causa protegida; la respuesta pública no expone secretos ni rutas.

## Consecuencias

- traducciones cambian sin romper consumidores;
- pruebas verifican códigos en lugar de frases;
- se mantiene un catálogo versionado;
- cada protocolo necesita un adaptador de errores;
- causas técnicas se registran separadamente del mensaje público.

## Alternativas descartadas

- expresiones regulares sobre `error.message`;
- mensajes en inglés incrustados en casos de uso;
- devolver directamente errores del proveedor;
- usar códigos HTTP como única semántica del dominio.

