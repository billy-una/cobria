#!/usr/bin/env python3
"""Valida el contrato defensivo y la evidencia ejecutable de la fase 7."""
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "specification/phase-7"
APP = ROOT / "replication/examples/ecosistema-app"
manifest = json.loads((BASE / "security.json").read_text(encoding="utf-8"))
errors: list[str] = []

for name in ("MODELO-DE-AMENAZAS.md", "CAPACIDADES-Y-REGLAS-POR-NODO.md", "PRIVACIDAD-Y-RETENCION.md", "SECRETOS-WEBHOOKS-Y-ABUSO.md", "CADENA-DE-SUMINISTRO.md", "RUNBOOK-INCIDENTES.md", "REGISTRO-RIESGOS-DEPENDENCIAS.md"):
    if not (BASE / name).is_file(): errors.append(f"falta documento: {name}")
if manifest.get("phase") != 7 or not manifest.get("schemaVersion"): errors.append("identidad o versión inválida")

negative_ids = {item.get("id") for item in manifest.get("negativeTests", [])}
for operation in manifest.get("sensitiveOperations", []):
    for field in ("id", "actor", "capability", "scope", "purpose", "audit", "negativeTest"):
        if not operation.get(field): errors.append(f"{operation.get('id', 'operación')}: falta {field}")
    if operation.get("negativeTest") not in negative_ids: errors.append(f"{operation.get('id')}: prueba negativa inexistente")
    audit = {"actorId", "capacidad", "ambito", "finalidad", "resultado", "codigo", "ocurridoEn"}
    if not audit.issubset(set(operation.get("audit", []))): errors.append(f"{operation.get('id')}: auditoría incompleta")

expected_nodes = {"documento-canonico", "dato-fechado", "catalogo-versionado", "proyeccion", "evento-salida", "conjunto-analitico"}
nodes = {item.get("node") for item in manifest.get("nodePolicies", [])}
if nodes != expected_nodes: errors.append(f"políticas de nodo incompletas: {sorted(expected_nodes - nodes)}")
for node in manifest.get("nodePolicies", []):
    for field in ("write", "read", "retention"):
        if not node.get(field): errors.append(f"{node.get('node')}: falta {field}")
for key in ("privacy", "secrets", "webhooks", "abuseControls", "supplyChain", "incidentSeverities"):
    if not manifest.get(key): errors.append(f"sección vacía: {key}")

authorizer = (APP / "src/application/security/autorizar-capacidad.mjs").read_text(encoding="utf-8")
for token in ("actorId", "finalidad", "permisos", "ambitos", "ACCESS_DENIED", "SCOPE_INVALID"):
    if token not in authorizer: errors.append(f"autorizador no aplica {token}")
if ".includes(capacidad)" not in authorizer or ".includes(ambito)" not in authorizer: errors.append("autorizador no exige coincidencia explícita")

audit_source = (APP / "src/infrastructure/security/auditoria-memoria.mjs").read_text(encoding="utf-8")
executable_audit = re.sub(r"//.*", "", audit_source)
if "claveIdempotencia" in executable_audit or "documento" in executable_audit: errors.append("auditoría persiste datos no permitidos")
tests = (APP / "test/app.test.mjs").read_text(encoding="utf-8")
for phrase in ("otro ámbito", "sin identidad", "comodines", "ámbitos manipulados", "sin copiar datos sensibles"):
    if phrase not in tests: errors.append(f"falta prueba negativa: {phrase}")

sbom = ROOT / "replication/SBOM.cdx.json"
if not sbom.is_file(): errors.append("falta SBOM CycloneDX")
else:
    data = json.loads(sbom.read_text(encoding="utf-8"))
    if data.get("bomFormat") != "CycloneDX" or not data.get("components"): errors.append("SBOM inválido o vacío")

source_text = "\n".join(path.read_text(encoding="utf-8", errors="ignore") for path in (APP / "src").rglob("*.mjs"))
for pattern in (r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----", r"AKIA[0-9A-Z]{16}"):
    if re.search(pattern, source_text): errors.append(f"posible secreto en código: {pattern}")

if errors:
    print("Fase 7 inválida:")
    print("\n".join(f"- {error}" for error in errors))
    sys.exit(1)
print(f"Fase 7 válida: {len(manifest['sensitiveOperations'])} operaciones sensibles, {len(manifest['negativeTests'])} casos negativos y {len(manifest['nodePolicies'])} políticas de nodo.")
