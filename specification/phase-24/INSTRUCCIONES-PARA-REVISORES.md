# Instrucciones para la revisión independiente de COBRIA

Gracias por colaborar con esta revisión. El objetivo no es evaluar a la persona autora ni
calificar la calidad general de los proyectos. Se busca determinar si los fragmentos
presentados respaldan semánticamente ocho contratos de ingeniería de software.

## Antes de comenzar

1. Lea `PROTOCOLO.md` y `RUBRICA.md`.
2. Elija un código privado con formato `R-ABC` de 3 a 12 letras o números. Use el mismo
   código en sus tres respuestas y comuníquelo únicamente al coordinador.
3. Declare cualquier relación previa con COBRIA, su autor o los repositorios que crea
   reconocer. Un conflicto no invalida automáticamente la revisión, pero debe registrarse.
4. Trabaje sin conversar con el otro revisor hasta entregar las tres respuestas.

## Trabajo requerido

Revise `M-01.json`, `M-02.json` y `M-03.json`. Para cada muestra cree un archivo nuevo:

```text
respuesta-R-ABC-M-01.json
respuesta-R-ABC-M-02.json
respuesta-R-ABC-M-03.json
```

Cada archivo debe seguir `review-response.schema.json`. Para los ocho contratos indique:

- `supported`: el fragmento respalda el contrato completo;
- `unsupported`: el fragmento contradice o no implementa el contrato;
- `insufficient`: la evidencia es parcial o no permite decidir;
- confianza de 1 a 5;
- una justificación concreta de al menos 20 caracteres.

No busque deliberadamente qué proyecto se oculta detrás de cada muestra. No ejecute código,
no incluya datos personales y no cambie los archivos recibidos.

## Entrega

Devuelva únicamente sus tres archivos `respuesta-*.json`. No devuelva nombres, teléfono,
correo, documentos de identidad ni la carpeta completa. El coordinador validará el formato
y mantendrá separada cualquier constancia de consentimiento o identidad.

## Tiempo estimado

Entre 60 y 120 minutos por persona. Puede detenerse y registrar `insufficient` cuando el
fragmento no permita una decisión defendible.
