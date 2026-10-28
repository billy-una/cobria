# Reproducción exacta de COBRIA Ecosistema 1.0.0-rc2

## Requisitos

- Git, Node.js 22, npm, Python 3.12, Java 21 y Go 1.22;
- LaTeX con `latexmk`, Biber y los paquetes indicados por la integración continua;
- Chromium para Playwright y al menos 10 GB libres;
- sistema Unix compatible con `make`.

Las fases de adopción 21–25 necesitan además acceso a los repositorios de referencia
y a los commits congelados en sus manifiestos. No están incluidos en el ZIP COBRIA.
Si GitHub exige autenticación, una copia de COBRIA por sí sola no reproduce esas fases.
Puede proporcionar copias locales sin incorporar credenciales ni código privado al
paquete:

```sh
python3 replication/scripts/build-remediation-r9.py \
  --reference-root /ruta/a/proyectos \
  --output output/release/rc2-mi-ejecucion
python3 replication/scripts/validate-remediation-r9.py \
  --output output/release/rc2-mi-ejecucion
```

La carpeta de referencias contiene `POSGUAPILES-1`, `CRMHOTEL_NUEVO` y `BSHandball`,
cada uno con su historia Git necesaria. También puede exportar `COBRIA_REFERENCE_ROOT`
al ejecutar las verificaciones directamente. Los validadores materializan la revisión
congelada y verifican sus resultados; no ejecutan código de esos proyectos.
El informe registra esta dependencia como `referenceInputs`. Una doble construcción
con referencias locales no demuestra reproducción pública autónoma ni réplica externa.
R9 rechaza destinos ya existentes para no borrar candidatas anteriores.

### Preparación de GitHub Actions

El trabajo `publication-candidate` obtiene COBRIA en `cobria/` y las tres referencias
en `references/`, fuera del árbol candidato. Las referencias se inspeccionan en sus
revisiones congeladas; no se ejecuta su código. Configure, si desea ejecutar ese
trabajo, el secreto `COBRIA_REFERENCE_TOKEN` con lectura de contenido exclusivamente
en los tres repositorios autorizados. No use permisos de escritura. El flujo no
persiste credenciales en los checkouts ni incluye las referencias en los artefactos.

Sin ese secreto, incluido normalmente el caso de solicitudes desde forks, el trabajo
falla con un mensaje explícito antes de instalar dependencias; no salta fases para
aparentar una validación completa. Los trabajos de integridad e infraestructura
permanecen separados. Configurar el flujo no lo ejecuta ni acredita CI remota.

El registro local del paquete se genera sin alterar su ZIP mediante:

```sh
python3 replication/scripts/record-rc2-verification.py \
  --output output/release/ecosistema-1.0.0-rc2-20261017-intento03 \
  --date 2026-10-17
```

El comando rechaza sobrescribir un registro existente. Conserva el commit original
del paquete, no lo sustituye por el HEAD que documente resultados posteriormente.

## Construcción desde un clon limpio

```sh
git clone https://github.com/billy-una/cobria.git
cd cobria
git checkout <commit-del-manifiesto>
npm ci --prefix replication
npm ci --prefix sitio
npm ci --prefix libro-cobria
cd libro-cobria && npx playwright install chromium && cd ..
make verificar-publicacion
```

La puerta R9 automatiza dos construcciones aisladas y compara contenido, páginas,
sitio, SBOM y Core:

```sh
make construir-rc2
make verificar-r9
```

## Verificación del paquete

```sh
cd output/release/ecosistema-1.0.0-rc2/COBRIA-Ecosistema-1.0.0-rc2
shasum -a 256 -c SHA256SUMS
```

Cada huella pública debe coincidir con el archivo descargado. Una diferencia invalida
la candidata hasta explicar y reconstruir el artefacto. No se debe sustituir un archivo
conservando el mismo número de versión.

## Alcance de la reproducibilidad

### Comprobación del sitio tras un despliegue autorizado

La comprobación pública necesita el paquete local verificado que se pretende servir:

```sh
python3 replication/scripts/audit-public-r9.py \
  --output output/release/ecosistema-1.0.0-rc2-20261017-intento03
```

No despliega ni publica. Antes de consultar la red valida la candidata, su manifiesto
y las seis fuentes, y recupera del ZIP del sitio las descargas exactas aprobadas.
Compara los PDF públicos con esos bytes, no solo con huellas declaradas por el servidor.
El libro optimizado se compara con la copia optimizada incluida en el sitio; su fuente
editorial se verifica por separado. Un archivo local ausente bloquea la comprobación.

Se verifican seis rutas, cabeceras básicas y las seis descargas. Las peticiones tienen
límite de tamaño y tiempo, utilizan exclusivamente las rutas canónicas y rechazan
redirecciones fuera del origen HTTPS. Esto no constituye una auditoría exhaustiva de
seguridad, accesibilidad o de todas las rutas del sitio. Los informes fechados se
guardan en `output/review/ecosistema-1.0.0-rc2/`, sin modificar la candidata ni
sobrescribir comprobaciones anteriores. Las pruebas sin red no acreditan el despliegue.

La igualdad exacta se exige para fuentes, sitio estático, SBOM, manifiestos y archivos
empaquetados determinísticamente. Para PDF se registra además una huella semántica del
texto y el número de páginas, porque metadatos del motor de impresión pueden variar
entre plataformas. La comparación no convierte una ejecución local en validación
externa ni reemplaza inspección visual.

La construcción normaliza exclusivamente el nombre generado
`__vite_rsc_importer_resources_<huella>.Resources` en `dist/server/index.js.map`:
Vite RSC deriva esa huella de la ruta absoluta del clon. No se modifican código
ejecutable, fuentes, posiciones ni coordenadas del mapa. La comparación del sitio
conserva igualdad SHA-256 exacta e incluye el mapa normalizado.
