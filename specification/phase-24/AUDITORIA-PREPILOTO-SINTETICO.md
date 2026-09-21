# Auditoría del prepiloto sintético

Fecha de recepción: 2026-09-20.

## Clasificación de las respuestas

Se recibieron seis archivos con cobertura completa de tres muestras y ocho contratos. Los
dos códigos usados fueron `R-ARCH24` y `R-QAOPS`. Sin embargo, los propios archivos declaran:

```json
{"type":"ai","independentWork":false}
```

Además, la declaración de conflicto los identifica como “revisión analítica simulada por
IA”. En consecuencia, fallan deliberadamente el requisito de atestación humana del esquema
oficial y **no cuentan como revisión independiente**.

## Resultado útil como prueba del instrumento

| Muestra | Acuerdo bruto | Kappa de Cohen | Desacuerdo |
|---|---:|---:|---|
| M-01 | 0,875 | 0,750 | ENG-007 |
| M-02 | 0,875 | 0,784 | ENG-007 |
| M-03 | 0,875 | 0,714 | ENG-007 |
| Global, 24 decisiones | 0,875 | 0,771 | ENG-007 en las tres muestras |

El patrón repetido de discrepancia en ENG-007 sugiere revisar la definición de
“estrangulamiento verificable de legado”: un fragmento puede mostrar aislamiento y
prohibición de crecimiento sin demostrar métricas de consumidores, presupuesto decreciente
o condición de retiro. Antes de la revisión humana conviene aclarar que `supported` exige
la cadena completa y que, cuando solo se observa una parte, corresponde `insufficient`.

## Distribución de decisiones

- R-ARCH24: 13 `supported`, 10 `insufficient`, 1 `unsupported`.
- R-QAOPS: 10 `supported`, 13 `insufficient`, 1 `unsupported`.
- Ambos recomendaron `revise-manifest` para las tres muestras.

Estas cifras describen únicamente un ensayo sintético del instrumento. No estiman acuerdo
humano, no validan los manifiestos y no deben citarse como resultado de transferencia.

## Huellas de los archivos recibidos

| Archivo | SHA-256 |
|---|---|
| respuesta-R-ARCH24-M-01.json | `1a02fa577c55656e7f6622c96d8127c58787494293ea1707b223c5b38b5b9c20` |
| respuesta-R-ARCH24-M-02.json | `7ddcb0938be4672c61ae3e389edc18350124e2e99b7d35bfddb51e85dbdde771` |
| respuesta-R-ARCH24-M-03.json | `37b2f558a99d7bea165ee7814cc98f8f2d3462a8ab8972ea6f2a253bf80dc794` |
| respuesta-R-QAOPS-M-01.json | `1b909fc8a45c2f108ea1615a722655833fe0f29203b474e4d6e246ffc6767cae` |
| respuesta-R-QAOPS-M-02.json | `02c570e7018ca0305edfd4d997a3be13314df9a75e47d390260b994681f33348` |
| respuesta-R-QAOPS-M-03.json | `9c47068ed09ba95fdce2061d46c01ecf9f43a59f72f49480381c199c0fc63648` |
