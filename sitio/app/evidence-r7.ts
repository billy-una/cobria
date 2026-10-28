// Generado por sync-editorial.mjs; no editar.
export const evidenceR7 = {
  "schemaVersion": "1.0.0",
  "generatedFrom": "replication/results/core-r7-statistics/summary.json",
  "status": "confirmatorio-completo-interno",
  "scope": "resultados internos de un nodo por motor; no generalizables",
  "protocol": {
    "id": "COBRIA-R7-confirmatorio",
    "sizes": [
      100,
      1000,
      5000
    ],
    "runsPerSize": 30
  },
  "observations": 270,
  "engines": [
    {
      "id": "mongodb",
      "version": "8.0.29",
      "architecture": "amd64",
      "observations": 90,
      "allContractsPass": true,
      "rawSha256": "f513915bddffd207781fa9dc7ac1c4b2013ea1b5fd5b1884f07fe8bda867fbcc"
    },
    {
      "id": "couchdb",
      "version": "3.4.3",
      "architecture": "amd64",
      "observations": 90,
      "allContractsPass": true,
      "rawSha256": "be18a40594e477ad26b8678f76c105ef4b7e64af520b4d18cdcf95a1fd63351a"
    },
    {
      "id": "opensearch",
      "version": "3.2.0",
      "architecture": "arm64",
      "observations": 90,
      "allContractsPass": true,
      "rawSha256": "261146fc71360f2dd98dd3f66e27f010b27778f8a159ba8c8ef720272ea95197"
    }
  ],
  "method": {
    "percentiles": "interpolación lineal",
    "intervals": "bootstrap percentil de mediana, 5000 remuestras",
    "dispersion": "MAD e IQR",
    "pairedEffect": "dz sobre diferencias pareadas y razón pareada mediana",
    "test": "permutación de signos, 20000 remuestras",
    "multiplicity": "Holm"
  },
  "comparisons": [
    {
      "motor": "mongodb",
      "n": 100,
      "corridas": 30,
      "diferencia_pareada_media_ms": -2.4464151666586984,
      "razón_pareada_mediana": 0.9297399736966353,
      "tamaño_efecto_dz": -0.30462134276216507,
      "fracción_proyección_más_rápida": 0.9333333333333333,
      "p_raw": 0.00004999750012499375,
      "p_holm": 0.00044997750112494374
    },
    {
      "motor": "mongodb",
      "n": 1000,
      "corridas": 30,
      "diferencia_pareada_media_ms": -15.484079200000997,
      "razón_pareada_mediana": 0.8690784556007671,
      "tamaño_efecto_dz": -0.37560277022796984,
      "fracción_proyección_más_rápida": 0.9333333333333333,
      "p_raw": 0.00004999750012499375,
      "p_holm": 0.00044997750112494374
    },
    {
      "motor": "mongodb",
      "n": 5000,
      "corridas": 30,
      "diferencia_pareada_media_ms": -48.20615276665606,
      "razón_pareada_mediana": 0.8425932516772253,
      "tamaño_efecto_dz": -0.5730893283442972,
      "fracción_proyección_más_rápida": 0.8333333333333334,
      "p_raw": 0.0005499725013749313,
      "p_holm": 0.0010999450027498626
    },
    {
      "motor": "couchdb",
      "n": 100,
      "corridas": 30,
      "diferencia_pareada_media_ms": -58.535279133316365,
      "razón_pareada_mediana": 0.5119681924981486,
      "tamaño_efecto_dz": -1.817159186797469,
      "fracción_proyección_más_rápida": 1,
      "p_raw": 0.00004999750012499375,
      "p_holm": 0.00044997750112494374
    },
    {
      "motor": "couchdb",
      "n": 1000,
      "corridas": 30,
      "diferencia_pareada_media_ms": -581.8552890000942,
      "razón_pareada_mediana": 0.3720256022558992,
      "tamaño_efecto_dz": -2.592431646141112,
      "fracción_proyección_más_rápida": 1,
      "p_raw": 0.00004999750012499375,
      "p_holm": 0.00044997750112494374
    },
    {
      "motor": "couchdb",
      "n": 5000,
      "corridas": 30,
      "diferencia_pareada_media_ms": -2923.3879013333303,
      "razón_pareada_mediana": 0.3577795300479378,
      "tamaño_efecto_dz": -2.647532733785677,
      "fracción_proyección_más_rápida": 1,
      "p_raw": 0.00004999750012499375,
      "p_holm": 0.00044997750112494374
    },
    {
      "motor": "opensearch",
      "n": 100,
      "corridas": 30,
      "diferencia_pareada_media_ms": 0.019876366667206942,
      "razón_pareada_mediana": 0.9400723697497944,
      "tamaño_efecto_dz": 0.002102138952876187,
      "fracción_proyección_más_rápida": 0.5666666666666667,
      "p_raw": 0.9929503524823758,
      "p_holm": 0.9929503524823758
    },
    {
      "motor": "opensearch",
      "n": 1000,
      "corridas": 30,
      "diferencia_pareada_media_ms": -9.237604166666399,
      "razón_pareada_mediana": 0.71400431271017,
      "tamaño_efecto_dz": -0.7737789478579749,
      "fracción_proyección_más_rápida": 0.9333333333333333,
      "p_raw": 0.00004999750012499375,
      "p_holm": 0.00044997750112494374
    },
    {
      "motor": "opensearch",
      "n": 5000,
      "corridas": 30,
      "diferencia_pareada_media_ms": -42.43890969999981,
      "razón_pareada_mediana": 0.45234355310368,
      "tamaño_efecto_dz": -1.6445909875889242,
      "fracción_proyección_más_rápida": 1,
      "p_raw": 0.00004999750012499375,
      "p_holm": 0.00044997750112494374
    }
  ],
  "negativeResults": [
    {
      "motor": "opensearch",
      "n": 100,
      "resultado": "la diferencia media no favoreció la proyección; la comparación no fue concluyente tras el ajuste de Holm",
      "razón": 0.9400723697497944,
      "p_holm": 0.9929503524823758
    }
  ],
  "alternatives": {
    "scope": "microcomparación algorítmica en un proceso Node.js; no demuestra rendimiento distribuido",
    "observations": 630,
    "strategies": [
      "cobria",
      "cqrs",
      "events",
      "materialized-view",
      "native-index",
      "projection-without-contract",
      "single-document"
    ],
    "sizes": [
      1000,
      10000,
      50000
    ],
    "runsPerCell": 30,
    "complete": true,
    "rawSha256": "d8f08c7f774eb342a67ef7dc58107645a8ed21804cf48856b19ea310c09003fd"
  },
  "humanPending": [
    "réplica externa independiente",
    "estudio de transferencia",
    "doble cribado bibliográfico"
  ]
} as const;
