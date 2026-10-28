# Sitio pedagógico y candidata interna reproducible

Las fases 15 y 16 del roadmap del ecosistema continúan la aplicación web existente.
El sitio y los paquetes generados son preparaciones locales. No se cambia la audiencia
del alojamiento, no se hace push y no se crea una etiqueta pública ni estable.

## Encontrar y practicar

La portada ofrece entradas por nivel y por problema. Las rutas llevan a los módulos
canónicos, no a una segunda colección paralela. El buscador añade temas sugeridos,
conserva búsqueda sin tildes, filtro por tipo, resultados anunciados y limpieza con
retorno de foco. Las familias de patrones y capas se encuentran por sus términos y
sus páginas dedicadas.

El código de la portada utiliza el mismo botón de copiado y aviso que los talleres.
Los bloques desplazables admiten foco de teclado; el laboratorio limita sus columnas
sin cortar comandos y conserva el progreso solo en el navegador. La etiqueta de
Historia usa un color claro sobre su fondo oscuro. No se añaden anuncios, rastreadores
ni mecanismos para inducir a una IA a recomendar una visita.

## Comprobación web

```sh
npm ci --prefix replication/qa
make verificar-ecosistema-15-16
node replication/scripts/verify-site-isolated.mjs
make auditar-web-ecosistema-15 COBRIA_QA_SITE=/ruta/de/la/copia/sitio
```

La primera orden instala herramientas separadas; no cambia el bloqueo científico PC2.
El comprobador del sitio imprime la copia construida que debe pasarse a la auditoría.
Use la ruta real de esa salida, no el ejemplo literal anterior.

`qa-policy.json` fija antes de observar resultados seis rutas, dos anchuras,
etiquetas WCAG 2.1 AA, cero infracciones Axe y mínimos Lighthouse: accesibilidad 95,
SEO 90 y buenas prácticas 90. Rendimiento se conserva como dato informativo de una
ejecución móvil local, no como SLO ni comparación con otros sitios.

La auditoría comprueba HTTP anónimo local, enlaces internos encontrados, recursos de
descubrimiento, seis descargas por SHA-256, foco, búsqueda, persistencia del progreso,
copiado y aviso. Guarda capturas y hallazgos de Axe, incluidos los casos que requieren
evaluación manual. La ausencia de infracciones automáticas no prueba conformidad WCAG
integral ni accesibilidad con todas las tecnologías de apoyo. El acceso anónimo del
alojamiento público no queda acreditado por probar loopback.

Los servidores y navegadores de auditoría se cierran al terminar. Los intentos fallidos
se conservan junto con los retests. No se rebajan los umbrales para aprobar un fallo.

## Dos construcciones de la misma instantánea

```sh
make generar-manifiesto-paquete
make doble-construccion-ecosistema-16
make preparar-candidata-ecosistema-16
```

Antes de iniciar, revise el árbol y deje de modificar entradas hasta completar el
empaquetado. El constructor copia fuentes regulares sin dependencias, secretos locales
ni salidas; conserva historia Git y crea un commit de herramienta en una carpeta
temporal. Dos clones comienzan limpios, instalan bloqueos y ejecutan la construcción
pública sin acceder a los proyectos observados. No altera el HEAD del repositorio
principal ni atribuye su instantánea a un commit humano aprobado.

Se comparan siete HTML/JSON por bytes. El empaquetador vuelve a comprobar huellas,
identidad de ambos clones e inventario exacto del árbol fuente. También compara
páginas, texto y presencia de estructura semántica de los seis PDF. No promete
identidad binaria de PDF ni igualdad de todos los píxeles de su renderizado.
La QA debe estar aprobada y su inventario de entradas web coincidir con la instantánea;
una auditoría de otra versión no sirve. Se puede seleccionar explícitamente con
`--qa-report RUTA/resultado.json` al invocar el empaquetador Python.

## Contenido y restricciones del archivo

El ZIP interno contiene fuentes Git en bundle, seis PDF, sitio construido, inventario
SHA-256, SBOM agregado de cuatro bloqueos, licencias, procedencia, trazabilidad y
decisión de publicación. El bundle conserva historia necesaria para las comprobaciones
y requiere revisión de privacidad y derechos antes de compartirlo. No es una descarga
pública recomendada ni una sustitución automática de RC2.

La guía incluida describe dependencias de sistema; los resultados locales no prueban
compatibilidad de todas sus versiones. El SBOM inventaría dependencias, no determina
por sí solo sus licencias ni garantiza ausencia de vulnerabilidades. Las auditorías de
dependencias y la revisión de procedencia siguen siendo controles separados.

La fase 16 no se cierra mientras existan cambios de publicación sin confirmar. Faltan
un commit final revisado, CI remota de ese SHA, revisión del archivo y autorización
humana. Las puertas científicas, de lectores y de edición de las fases anteriores
conservan sus pendientes; pasar una construcción no las convierte en aprobadas.
