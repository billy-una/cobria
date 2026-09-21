# Lenguaje, internacionalización, fechas, monedas y unidades

## Separación de textos

La lógica produce códigos y parámetros estables. Presentación selecciona idioma y
transforma esos códigos en mensajes. Registros técnicos conservan el código, no dependen
de la frase mostrada. Cambiar una traducción no cambia el contrato.

## Idiomas

- idioma editorial principal: español;
- etiqueta recomendada: `es-CR` para interfaz costarricense;
- reserva de fallback: español neutro antes de mostrar claves internas;
- no concatenar fragmentos traducidos;
- soportar plural, género gramatical cuando sea necesario y longitud variable;
- nombres de personas, especies y lugares no se traducen automáticamente.

## Fechas y tiempo

- persistir instantes como RFC 3339/ISO 8601 con `Z` u offset;
- usar identificador IANA (`America/Costa_Rica`) para reglas civiles futuras;
- distinguir tiempo válido, tiempo conocido, revisión y versión;
- formatear en presentación mediante configuración regional;
- no almacenar una fecha ambigua como `03/04/26`;
- duración usa unidad explícita, preferiblemente milisegundos en interfaces técnicas o
  formato ISO 8601 donde el contrato lo requiera.

## Moneda

Representar dinero como cantidad entera en unidad menor más código ISO 4217:

```json
{ "cantidadMenor": 125050, "moneda": "CRC" }
```

No usar coma o punto formateado como valor persistido. Redondeo, impuestos y conversión
deben declarar política, versión y fecha/tasa de referencia.

## Medidas

Cada cantidad declara unidad y, cuando aplique, precisión, sistema y condición de
medición. No mezclar metros y centímetros en un número sin tipo. Para analítica, la
transformación de unidad forma parte de la procedencia.

## Accesibilidad lingüística

Mensajes indican problema y posible acción sin culpar a la persona. No dependen solo de
color o icono. Lectores de pantalla reciben texto completo y los errores se asocian al
control pertinente.

