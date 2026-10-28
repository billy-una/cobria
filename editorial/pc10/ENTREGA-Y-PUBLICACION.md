# Preparación de entrega y publicación de COBRIA

PC9 dispone de un protocolo y formularios nuevos. PC10 registra un paquete local
identificado, no una publicación ni una versión estable. Core 1.0 y RC2 se conservan.

## Preparación automatizada

Desde la raíz del repositorio:

```sh
make verificar-pc9-pc10
make preparar-pc9-pc10
```

La preparación crea una carpeta nueva en `output/review/pc9/` con un ZIP editorial,
inventario SHA-256 y `PC10-preparacion.json`. Incluye seis PDF existentes: no afirma
que se hayan recompilado desde el árbol final. Registra HEAD y si existen cambios
sin commit; la identidad efectiva del subconjunto es su inventario, no solo HEAD.
Excluye las respuestas históricas, los consentimientos y los repositorios originales.

El ZIP es útil para revisión editorial preliminar. Para verificar su integridad:

```sh
python3 replication/scripts/prepare-pc9-pc10.py --verify RUTA_AL_ZIP
python3 replication/scripts/prepare-pc9-pc10.py --response RUTA_A_RESPUESTA_JSON
```

Una respuesta completa solo supera controles de formato. Ni esta operación ni la
preparación publican, reclutan participantes o declaran revisión independiente.

## Condiciones de candidata publicable

1. Resolver los bloqueantes técnicos y científicos de PC0–PC8; conservar pendientes
   admisibles de una propuesta visibles, con su alcance exacto.
2. Revisar el diff y acordar el commit final. Ejecutar CI para ese mismo SHA;
   registrar URL y resultado real, sin trasladar el éxito de otra instantánea.
3. Recompilar los seis PDF, sincronizar descargas y construir el sitio desde ese
   commit. Verificar licencias, atribuciones y fuentes; no añadir ISBN ni avales.
4. Producir una distribución ejecutable completa distinta del ZIP editorial, con
   instrucciones probadas en extracción nueva y manifiestos de fuentes y productos.
5. Recibir y resolver la evidencia externa aplicable de PC9. Una propuesta limitada
   puede conservar pendientes, pero no presentarse como validada externamente.
6. Registrar autorización humana del responsable sobre SHA, huella del paquete,
   ambiente, alcance del despliegue y fecha. Sin autorización, no publicar ni etiquetar.
7. Tras desplegar, comparar rutas, cabeceras, identidad y los bytes de las seis
   descargas contra el paquete aprobado. Conservar resultados y plan de reversión.

La preparación actual deja esas condiciones como bloqueantes explícitos. No cambia
las versiones globales para hacer pasar RC2 por una candidata nueva, ni reemplaza
su ZIP histórico. La denominación final se acuerda al congelar la entrega.

## Estado de esta entrega

Preparación automatizable implementada; participación externa, CI del SHA final,
distribución ejecutable final y publicación siguen pendientes. No hay autorización
implícita para enviar mensajes, modificar declaraciones de revisores ni desplegar.
