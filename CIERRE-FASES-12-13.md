# Cierre de las fases 12 y 13

**Fecha:** 2026-09-21  
**Alcance:** COBRIA Toolkit y COBRIA Evidence  
**Naturaleza:** propuesta independiente; automatización no equivale a certificación.

## Toolkit

La herramienta ofrece validación, explicación, contexto, impacto, auditoría, medición,
generación, conformidad e informes. `iniciar` funciona como alias español. `informar`
produce HTML y JSON. `publicar` solo acepta `--simular`, valida ambiente y huella, declara
cero mutaciones y nunca solicita credenciales.

Los quince generadores existentes continúan produciendo código, prueba, documento y
manifiesto de forma idempotente. La no sobrescritura, rutas adversariales, auditor estático
y contexto protegido para agentes permanecen bajo pruebas.

## Evidencia científica

El inventario generado automáticamente enlaza fuente, SHA-256, estado y límite:

- 180 observaciones de conformidad local;
- 630 observaciones de comparación de alternativas;
- 30 repeticiones analíticas;
- 5 escenarios operacionales controlados;
- repetición confirmatoria distribuida preliminar e incompleta;
- 16 filas de trazabilidad científica;
- 0 réplicas externas recibidas.

La suma de observaciones internas inventariadas es 845. No se interpreta como 845 estudios,
participantes ni validaciones independientes.

## Puertas

```bash
make generar-inventario-cientifico
make verificar-cierre-12-13
```

La puerta automática verifica CLI, esquemas, generadores, auditor, contexto de agentes,
paquete externo, réplica pendiente, síntesis condicionada y huellas del inventario.

## Pendientes humanos o externos

- revisión independiente auténtica;
- doble cribado bibliográfico por personas distintas;
- réplica en otra computadora;
- estudio de transferencia con consentimiento;
- completar MongoDB y las celdas CouchDB/OpenSearch confirmatorias;
- firma, archivo público y DOI cuando el autor decida publicarlos.

La afirmación defendible sigue siendo que COBRIA ofrece contratos verificables localmente
y un programa experimental refutable. No se afirma certificación, universalidad,
superioridad productiva ni transferencia humana demostrada.
