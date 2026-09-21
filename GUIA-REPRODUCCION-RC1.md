# Guía de reproducción de COBRIA Ecosistema 1.0.0-rc1

## Requisitos

- Git, Node.js 22 o posterior, Python 3.9 o posterior;
- `latexmk`, una distribución LaTeX y Ghostscript;
- espacio suficiente para dependencias, compilaciones y PDF;
- motores externos únicamente para las pruebas distribuidas que los requieren.

## Verificación del paquete

```bash
shasum -a 256 COBRIA-Ecosistema-1.0.0-rc1.zip
unzip COBRIA-Ecosistema-1.0.0-rc1.zip
cd COBRIA-Ecosistema-1.0.0-rc1
shasum -a 256 -c SHA256SUMS
```

## Reconstrucción desde las fuentes incluidas

```bash
mkdir fuentes
tar -xzf fuentes.tar.gz -C fuentes
cd fuentes
npm ci --prefix replication
npm ci --prefix sitio
make construir-editorial
make verificar-cierre-14-15
make verificar
```

Las pruebas de MongoDB, CouchDB u OpenSearch pueden requerir servicios externos y se
identifican como tales. Una omisión por falta de infraestructura debe registrarse como
pendiente; nunca debe transformarse en un resultado aprobado.

## Equivalencia

Los PDF se comparan por número de páginas, metadatos y huella del artefacto canónico.
La candidata completa se compara mediante SHA-256. Dos ejecuciones sobre el mismo commit,
con los mismos artefactos canónicos, deben producir el mismo ZIP y el mismo manifiesto.
