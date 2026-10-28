# Portabilidad construcción pública y servidor

PC8 separa comprobación local y cierre remoto. Se retiran rutas personales de los
ejecutables editoriales, se conserva una corrección de streaming verificable y se
prepara una construcción pública sin repositorios de referencia. No se modifica
Core 1.0, los congelamientos PC2 ni la evidencia histórica R7.

## Alcance y autoridad

Los cambios afectan exportador, comprobaciones de navegador, instalación del sitio,
regresiones HTTP, Makefile, CI y documentación. No hay despliegue, push ni modificación
de los tres proyectos observados. Los commits de prueba se crean únicamente en una
instantánea temporal, con autoría de herramienta declarada; no se hacen pasar por
commits humanos ni por el HEAD publicado de COBRIA.

## Construcción pública y referencias

`make construir-publico` genera los seis PDF y comprueba currículo, implementación,
talleres, contratos públicos, contenido, geometría, servidor y sitio. Los validadores
de adopción 21, 22, 23 y 25 que necesitan los repositorios originales quedan en
`make verificar-referencias-autorizadas`. No se eliminan ni se presentan como ejecutados
por el recorrido público. `COBRIA_PUBLIC_BUILD=1` prohíbe acceder a referencias mediante
el materializador Python, incluso si hay checkouts locales disponibles.

La CI pública no pide tokens de esos proyectos. La auditoría completa anterior
queda reservada a ejecución manual con `verify_references=true`, credencial de lectura
y commits explícitos de los manifiestos. Los trabajos conservan permisos mínimos y
no persisten credenciales de checkout. Preparar ese YAML no demuestra que GitHub
lo haya ejecutado para la versión candidata.

## Herramientas y versiones

| Componente | Observado localmente | Declarado para CI pública |
|---|---|---|
| Sistema | macOS ARM64 | Ubuntu 24.04; no observado en esta entrega |
| Node y npm | 24.2.0 y 11.3.0 | Node 22 mediante setup-node |
| Python y PDF | Python 3.9.6; pypdf 6.10.2 | Python 3.12; pypdf fijado en requirements-build.txt |
| Go | 1.27.1 | 1.22.x |
| Java | Temurin 25.0.4.1 | Temurin 21 |
| Navegador | Playwright 1.62.1, Chromium instalado por su gestor | Playwright del lockfile y Chromium instalado explícitamente |
| Documentos | LaTeX, Biber, Poppler y Ghostscript del equipo | Paquetes nativos declarados en el trabajo de CI |

Las versiones nativas y los paquetes de sistema no constituyen una imagen binaria
congelada. La tabla distingue lo ejecutado de lo previsto y no certifica compatibilidad
de las combinaciones que todavía no se observaron. Los experimentos nuevos requieren
además sus motores y presupuestos; construir documentos no los ejecuta.

El exportador importa Playwright de su paquete y espera las fuentes locales. No busca
la caché personal del autor ni una aplicación de macOS. Un navegador externo solo se
usa mediante `COBRIA_BROWSER_BIN` explícito. Ante fallo de lanzamiento se cierra el
servidor auxiliar en finally; el caso negativo con un binario inexistente terminó sin
timeout. Los talleres C5 y C8 utilizan el mismo cargador de navegador instalado.

## Corrección del servidor

`sitio/scripts/patch-vinext-pc8.mjs` valida versión y huella de la fuente de Vinext,
aplica una transformación idempotente durante postinstall y rechaza código desconocido.
`sitio/vendor/PC8-VINEXT-PATCH.md` conserva alcance, huellas y licencia del proveedor.
La corrección cancela una fuente cuando el destino ya está cerrado y espera el
resultado del pipeline. Solo clasifica como cancelación los códigos enumerados
con destino destruido; no suprime todas las excepciones.

Tres pruebas comprueban instalación, destino cerrado, compresión, cancelación tardía,
error real del productor y continuidad del servidor HTTP de prueba. La sonda C12 ya
no reproduce ERR_STREAM_UNABLE_TO_PIPE con el destino destruido; sus registros
históricos no se reescriben. La prueba adicional contra Vinext construido ejecutó
veinte cierres tempranos y veinte tardíos, con y sin gzip, verificó fuente tipográfica
por huella, 404, compresión y servicio posterior, sin errores del servidor detectados.
Esto no demuestra ausencia de todo fallo de red, disponibilidad distribuida ni una
corrección aceptada por los mantenedores del proveedor.

## Clones y artefactos

`replication/scripts/build-pc8-clean.mjs` conserva una instantánea del árbol con
inventario y huellas, sin dependencias, salidas, secretos o enlaces simbólicos.
La instantánea temporal incluye la historia Git necesaria y se clona dos veces.
Cada clon comienza limpio, instala desde lockfiles y ejecuta el recorrido público
con acceso a referencias prohibido. Los logs por intento y el registro actual están
en `output/review/pc8/`; un intento fallido no se borra para presentar éxito.

El primer intento reveló que una instantánea sin historia no puede verificar C0.
Se conservó como fallido y se corrigió la preparación, no la auditoría. El segundo
intento usa la instantánea `4fa139de5060a78a4a0b70d957c48538980fb16a`, hija del HEAD
local original `0c89c1ee27923dfdf612d5d9bec0ed3bd8698c1d`. El registro JSON determina
el estado real de cada clon y el resultado de la comparación.

Se comparan por bytes siete artefactos declarados: currículo, mapa de contenido,
los tres HTML del libro y dos catálogos públicos. No se promete identidad binaria
de los PDF: fechas, IDs y serialización del renderizador pueden variar. Sus textos,
páginas, geometría y descargas tienen comprobaciones separadas. Estos criterios no
deben ampliarse después para ocultar una divergencia observada.

La instantánea identifica los archivos efectivamente construidos, no todos los cambios
posteriores de orquestación o documentación del árbol principal. No sustituye un
commit final revisado ni la CI remota de ese mismo SHA.

## Resultado local registrado

Los dos clones de la instantánea terminaron con estado aprobado y siete artefactos
declarados idénticos por SHA-256. Cada uno generó y comprobó seis PDF, 139 rutas y
las pruebas del recorrido público, sin acceder a las referencias. El primer intento
fallido sin historia sigue registrado separadamente. La verificación general del
árbol local también terminó correctamente: 185 pruebas de réplica y 24 de sitio,
además de los talleres, validadores y tres regresiones de streaming.

La prueba integral de Vinext se ejecutó separadamente contra el primer clon construido;
la CI incorpora ese mismo paso después de construir. No se confunde esa prueba de
servidor con la comparación por bytes de los siete artefactos editoriales.

Los clones e instalaciones se conservaron para inspección. Al terminar quedaban
aproximadamente 4–5 GiB libres; no se eliminó material del usuario. Antes de reanudar
los experimentos PC3 se debe recuperar su presupuesto mínimo de espacio.

## Estado y pendientes

La verificación general local y las auditorías de dependencias se conservan en los
registros de esta entrega. Las consultas npm audit de sitio y réplica no reportaron
vulnerabilidades en ese momento; esto no es una garantía permanente de seguridad.

PC8 no se declara cerrada: falta confirmar el candidato final, observar el trabajo
remoto para ese SHA y registrar URL, versiones y resultados. No se activa la auditoría
de referencias sin autorización y acceso. La matriz de sistemas adicionales, el estudio
humano y la réplica externa mantienen sus pendientes propios.
