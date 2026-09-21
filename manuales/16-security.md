# COBRIA Security

**Versión:** 1.0  
**Estado:** estable como guía; no constituye certificación ni asesoría jurídica  
**Fuente verificable:** `specification/phase-7/`

## Propósito

La seguridad y la privacidad son propiedades del flujo. Cada operación sensible declara
actor, capacidad, ámbito, finalidad, datos, evidencia y respuesta ante fallo. Un firewall,
App Check o login no reemplaza autorización dentro del sistema.

## Modelo de amenazas

Para cada amenaza documente activo, atacante, frontera, condición, impacto, prevención,
detección, respuesta y prueba negativa. Las fronteras mínimas son cliente–API,
API–aplicación, aplicación–adaptador, adaptador–motor NoSQL, webhook–sistema y
construcción–registro de artefactos.

## Identidad, capacidad y ámbito

```text
autenticar actor
  → derivar capacidades confiables
  → validar ámbito solicitado
  → comprobar finalidad
  → validar entrada
  → ejecutar caso de uso
  → auditar resultado con lista positiva
```

No se aceptan comodines implícitos. La autorización ocurre antes de leer, consultar caché,
reconstruir o revelar si un recurso existe. Un agente de IA es otro actor: recibe identidad,
capacidades mínimas, herramientas enumeradas, presupuesto y ámbito.

## Controles por capa

| Capa | Control principal |
|---|---|
| Presentación | no confiar en validación cliente; evitar fugas en errores |
| Aplicación | autorizar intención, ámbito y finalidad antes de recursos |
| Dominio | proteger invariantes independientemente del origen |
| Infraestructura | parametrizar, aislar claves, cifrar y normalizar fallos |
| Composición | inyectar secretos/identidades y denegar configuración inválida |
| Operación | mínimo privilegio, red, alertas, rotación, respaldo e incidentes |

## Validación y fallo cerrado

Toda entrada tiene gramática, tamaño, cardinalidad, profundidad y tiempo máximos. Una
condición desconocida no concede acceso. Los casos negativos incluyen identidad ausente,
ámbito manipulado, permiso comodín, repetición alterada, cursor malformado, payload grande,
webhook vencido y worker con token obsoleto.

## Secretos

Los secretos viven en un gestor o identidad de carga; una variable de entorno es un
transporte, no un almacén. Cada secreto tiene propietario, alcance, consumidores,
rotación, revocación y registro. Nunca aparece en Git, imagen, captura, URL, log, error ni
ejemplo. Una filtración exige revocar primero y limpiar después; borrar el commit no basta.

## Functions y endpoints públicos

Una Function pública debe:

- verificar identidad o firma;
- derivar ámbito en servidor;
- aplicar capacidad y finalidad;
- limitar tamaño, tiempo, frecuencia y costo;
- usar idempotencia;
- mantener dependencias mínimas;
- registrar solo campos aprobados;
- reintentar con política acotada;
- enviar a dead-letter únicamente al agotar intentos;
- poder deshabilitarse o revertirse.

Firebase App Check o una atestación equivalente añade señal; no reemplaza ninguno de
estos controles.

## Webhooks

Se verifica el cuerpo original, algoritmo, identificador de clave, firma constante,
marca temporal y ventana antirrepetición. El ID del evento es idempotente. Se limitan
método, contenido, tamaño y tipos permitidos. La respuesta no revela objetos internos.

## Privacidad y retención

Antes de crear un atributo se registra finalidad, clase, origen, consumidores, periodo y
eliminación. Los derivados no extienden automáticamente la retención. Borrar requiere
localizar canónicos, proyecciones, índices, cachés, conjuntos analíticos y respaldos, y
emitir constancia sin conservar el contenido. Datos personales requieren revisión humana
y jurídica del contexto.

## Cadena de suministro

- lockfile y versiones revisadas;
- SBOM CycloneDX;
- escaneo de secretos y dependencias;
- pruebas antes de actualizar;
- artefacto inmutable promovido entre ambientes;
- procedencia del build;
- licencias compatibles;
- registro de exposición, decisión, responsable y plazo para cada alerta.

“Cero vulnerabilidades conocidas” solo describe la herramienta, fecha y dependencias
analizadas; no demuestra ausencia de vulnerabilidades.

## Incidentes

Detectar → preservar evidencia → contener → erradicar → recuperar → comunicar → aprender.
Nunca se borra evidencia para cerrar un incidente. Cada acción posterior tiene responsable,
fecha y prueba de regresión. La reconstrucción de derivados parte de fuentes verificadas.

## Laboratorio Security

1. Dibuje activos, actores y fronteras.
2. Modele diez amenazas y una prueba negativa por amenaza prioritaria.
3. Intente leer y escribir con ámbito ausente, ajeno y manipulado.
4. Pruebe repetición con contenido diferente.
5. Genere SBOM y revise dependencias.
6. Simule secreto filtrado y documente revocación.
7. Ejecute el runbook sobre un incidente ficticio sin datos reales.

**Criterio de avance:** ninguna operación sensible carece de actor, capacidad, ámbito,
finalidad y evidencia; los bloqueadores críticos están cerrados o impiden la promoción.
