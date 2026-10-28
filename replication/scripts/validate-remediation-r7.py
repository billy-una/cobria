#!/usr/bin/env python3
"""Compuerta de integridad y reproducibilidad de la evidencia interna R7."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REP = ROOT / "replication"
PROTOCOL_PATH = REP / "protocol/r7-confirmatory.json"
RESULTS = REP / "results/core-r7-confirmatory"
STATS = REP / "results/core-r7-statistics"
EXPECTED_CORE = "9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"R7: {message}")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


require(sha256(ROOT / "specification/COBRIA-CORE-1.0.md") == EXPECTED_CORE, "Core 1.0 cambió")
protocol = json.loads(PROTOCOL_PATH.read_text())
require(protocol["frozenAt"] == "2026-09-23T00:25:00-06:00", "el protocolo no conserva su congelamiento")
require(protocol["engines"] == ["mongodb", "couchdb", "opensearch"], "motores inesperados")
require(protocol["sizes"] == [100, 1000, 5000] and protocol["runsPerSize"] == 30, "diseño confirmatorio alterado")
require(protocol["warmupRunsPerSize"] == 2 and protocol["seed"] == 20260923, "calentamiento o semilla alterados")
require(protocol["executionOrder"].startswith("aleatorio determinista"), "falta orden aleatorio determinista")
require(set(protocol["experiments"]) == {"P1", "P2", "R1", "S1", "A1"}, "experimentos alterados")

total = 0
raw_hashes: dict[str, str] = {}
for engine in protocol["engines"]:
    raw = RESULTS / engine / "raw.jsonl"
    manifest_path = RESULTS / engine / "run-manifest.json"
    environment_path = RESULTS / engine / "environment.json"
    require(raw.is_file() and manifest_path.is_file() and environment_path.is_file(), f"falta evidencia de {engine}")
    rows = [json.loads(line) for line in raw.read_text().splitlines() if line.strip()]
    manifest = json.loads(manifest_path.read_text())
    environment = json.loads(environment_path.read_text())
    require(len(rows) == 90 and manifest["observations"] == 90, f"{engine} no contiene 90 observaciones")
    require(manifest["complete"] is True and manifest["allPass"] is True, f"{engine} no cerró conformidad")
    require(environment["engine"] == engine and environment["container"]["architecture"] in {"amd64", "arm64"}, f"entorno inválido para {engine}")
    require(environment["engineInfo"]["version"], f"falta versión real de {engine}")
    if engine == "opensearch":
        require(environment["engineInfo"]["version"] == "3.2.0" and environment["container"]["architecture"] == "arm64", "OpenSearch no fue ejecutado como 3.2.0 ARM nativo")
    keys = [(row["size"], row["run"]) for row in rows]
    require(len(set(keys)) == len(keys), f"{engine} contiene corridas duplicadas")
    for size in protocol["sizes"]:
        require(sum(row["size"] == size for row in rows) == 30, f"{engine}/{size} no contiene 30 corridas")
    for row in rows:
        require(all(row[test]["pass"] is True for test in protocol["experiments"]), f"{engine} contiene una prueba contractual fallida")
        resources = row["resources"]
        require(resources["wallMs"] > 0 and resources["cpuUserMicros"] >= 0 and resources["maxRssBytes"] > 0, f"{engine} contiene instrumentación inválida")
        require(resources["storageBytes"] >= 0 and resources["logicalBytes"] >= 0 and resources["documentCount"] > 0, f"{engine} contiene almacenamiento inválido")
    total += len(rows)
    raw_hashes[engine] = sha256(raw)

require(total == 270, "el confirmatorio distribuido no suma 270 observaciones")

alternative_raw = REP / "results/core-1.3-alternatives/raw.json"
alternative_summary = REP / "results/core-1.3-alternatives/summary.json"
alternatives = json.loads(alternative_raw.read_text())
summary = json.loads(alternative_summary.read_text())
strategies = {row["strategy"] for row in alternatives}
require(len(alternatives) == 630 and summary["rawCount"] == 630, "la comparación de alternativas no suma 630 observaciones")
require(strategies == {"single-document", "native-index", "materialized-view", "cqrs", "events", "projection-without-contract", "cobria"}, "faltan estrategias comparables")
require(len({(row["strategy"], row["size"], row["run"]) for row in alternatives}) == 630, "hay alternativas duplicadas")

stats = json.loads((STATS / "summary.json").read_text())
require(stats["status"] == "confirmatorio-completo-interno" and not stats["missingCells"], "la estadística no está completa")
require(stats["rawSha256"] == raw_hashes, "la estadística no corresponde a los datos crudos")
require(len(stats["metrics"]) == 90 and len(stats["comparisons"]) == 9, "faltan métricas o comparaciones")
require(stats["alternatives"]["complete"] is True and stats["alternatives"]["observations"] == 630, "alternativas no integradas")
require(any(row["motor"] == "opensearch" and row["n"] == 100 for row in stats["negativeResults"]), "no se publicó el resultado no concluyente")
require(stats["humanPending"] == protocol["humanPending"], "se ocultaron puertas humanas")
require((STATS / "summary.csv").is_file() and (STATS / "paired-ratios.svg").is_file() and (STATS / "REPORT.md").is_file(), "faltan derivados automáticos")

print("R7 válida: 270 corridas distribuidas, 630 alternativas, estadística regenerada y puertas externas abiertas.")
