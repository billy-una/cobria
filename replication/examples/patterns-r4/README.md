# Referencia ejecutable de patrones COBRIA R4

Este directorio contiene la implementación pedagógica y neutral de los treinta patrones
publicados por COBRIA. TypeScript es la referencia completa: cada patrón tiene un caso
conforme y otro adverso. Los ejemplos seleccionados en Python, Java y Go solo se
publican cuando cuentan con una prueba ejecutable en este mismo directorio.

Los fragmentos del libro y del sitio se extraen de estas fuentes. No se mantienen copias
escritas a mano. La referencia demuestra contratos en memoria; no sustituye los
adaptadores NoSQL ni afirma rendimiento de producción.

PC1 endurece las claves propias, los diccionarios y las entradas numéricas/temporales.
El conteo usa `Map`: una clave como `constructor` no se confunde con una propiedad
heredada. Catálogos y huellas solo leen entradas propias. La existencia de una especie
en un catálogo se comprueba en el patrón 4; el patrón 5 cuenta etiquetas, no las certifica.

Reconstrucción total devuelve `candidata-calculada`, con `equivalenciaVerificada: false`.
Publicación por versión devuelve `activaPropuesta` y `persistida: false`; bandeja de
salida y retiro también son planes, no escrituras. La aprobación humana recibida
es declarada, no una identidad autenticada. PC2 probará publicadores reales.
Estos cambios alteran las salidas pedagógicas anteriores; no modifican Core congelado.

La idempotencia usa JSON serializado en memoria: no canoniza el orden de propiedades,
no conserva un registro en disco y no garantiza exclusión concurrente. Los fragmentos
dependen de tipos y validadores del archivo completo; no son programas autónomos.

```sh
npm test
python3 -m unittest discover -s multilang/python -p 'test_*.py'
javac -d /tmp/cobria-r4-java multilang/java/ProcesamientoIdempotente.java
java -cp /tmp/cobria-r4-java ProcesamientoIdempotente
go test ./multilang/go/...
```
