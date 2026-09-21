#!/usr/bin/env python3
"""Valida contratos de API, integración, UX y accesibilidad de fase 10."""
import json
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'specification/phase-10'
api=json.loads((BASE/'openapi.json').read_text(encoding='utf-8'))
events=json.loads((BASE/'events.json').read_text(encoding='utf-8'))
ux=json.loads((BASE/'ux-accessibility.json').read_text(encoding='utf-8'))
errors=[]

if api.get('openapi')!='3.1.0': errors.append('OpenAPI debe ser 3.1.0')
if 'example.invalid' not in api.get('servers',[{}])[0].get('url',''): errors.append('el contrato pedagógico no debe apuntar a producción')
paths=api.get('paths',{})
observations=paths.get('/ambitos/{ambito}/observaciones',{})
for method in ('get','post'):
    operation=observations.get(method,{})
    if not operation.get('operationId') or not operation.get('x-timeout-ms') or not operation.get('x-retry'): errors.append(f'{method}: timeout/reintento/identidad incompletos')
    if not {'400','403','429','503'}.issubset(operation.get('responses',{})): errors.append(f'{method}: respuestas operativas incompletas')
if 'IdempotencyKey' not in json.dumps(observations.get('post',{})): errors.append('POST sin idempotencia')
if not {'Limite','Cursor'}.issubset(set(part.split('/')[-1] for part in [x.get('$ref','') for x in observations.get('get',{}).get('parameters',[])])): errors.append('GET sin paginación por cursor')
problem=api.get('components',{}).get('schemas',{}).get('Problema',{})
if not {'type','title','status','code','traceId'}.issubset(problem.get('required',[])): errors.append('problema RFC 9457 incompleto')

for event in events.get('events',[]):
    for field in ('id','name','producer','consumers','required','idempotency','ordering','retention','pii','deadLetter'):
        if not event.get(field): errors.append(f"{event.get('id')}: falta {field}")
    if not {'eventId','eventType','occurredAt','scope','sourceRevision','schemaVersion'}.issubset(event.get('required',[])): errors.append(f"{event.get('id')}: sobre incompleto")

if ux.get('target')!='WCAG-2.2-AA' or 'not-full-conformance' not in ux.get('claim',''): errors.append('objetivo o límite de accesibilidad incorrecto')
if len(ux.get('requiredStates',[]))<8 or len(ux.get('automatedChecks',[]))<10 or len(ux.get('manualChecks',[]))<10: errors.append('matriz UX/accesibilidad incompleta')
for name in ('CONTRATOS-API-E-INTEGRACION.md','UX-ESTADOS-Y-FORMULARIOS.md','ACCESIBILIDAD.md'):
    if not (BASE/name).is_file(): errors.append(f'falta {name}')

layout=(ROOT/'sitio/app/layout.tsx').read_text(encoding='utf-8')
home=(ROOT/'sitio/app/page.tsx').read_text(encoding='utf-8')
manual=(ROOT/'sitio/app/manual.tsx').read_text(encoding='utf-8')
css=(ROOT/'sitio/app/globals.css').read_text(encoding='utf-8')
checks={'idioma':'<html lang="es">' in layout,'salto':'skip-link' in layout and '#contenido' in layout,'main':'id="contenido"' in home and 'id="contenido"' in manual,'nav':'aria-label="Navegación principal"' in home and 'aria-label="Navegación principal"' in manual,'foco':':focus-visible' in css,'movimiento':'prefers-reduced-motion' in css,'movil':'display:flex!important' in css}
for name,ok in checks.items():
    if not ok: errors.append(f'control UI ausente: {name}')
tests=(ROOT/'replication/examples/ecosistema-app/test/app.test.mjs').read_text(encoding='utf-8')
for token in ('cursor opaco','CURSOR_INVALID','PAGE_SIZE_INVALID'):
    if token not in tests: errors.append(f'falta prueba API: {token}')

if errors:
    print('Fase 10 inválida:'); print('\n'.join(f'- {e}' for e in errors)); sys.exit(1)
print(f"Fase 10 válida: {len(paths)} rutas, {len(events['events'])} eventos, {len(ux['automatedChecks'])} controles automáticos y {len(ux['manualChecks'])} pruebas manuales declaradas.")
