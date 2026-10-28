"""Observa la CI pública del SHA solicitado; no dispara jobs ni aprueba publicaciones."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import urllib.request

BASE='https://api.github.com/repos/billy-una/cobria'
REQUIRED={'COBRIA CI':{'public-build','package-integrity','infrastructure-config'},
          'COBRIA comprobaciones públicas':{'neutral (22)','neutral (24)'}}
STEPS={'public-build':{'Construcción sin referencias privadas','Regresión HTTP del servidor construido'},
       'package-integrity':{'Comprobar el manifiesto conservado sin regenerarlo'},
       'infrastructure-config':{'Validar configuración de infraestructura'},
       'neutral (22)':{'Instalación fijada y pruebas neutrales'},
       'neutral (24)':{'Instalación fijada y pruebas neutrales'}}

def fetch(path):
    request=urllib.request.Request(BASE+path,headers={'Accept':'application/vnd.github+json','User-Agent':'COBRIA-EP10-observacion'})
    with urllib.request.urlopen(request,timeout=30) as response:
        return json.load(response)

def assess(sha,main_sha,runs):
    """Solo acepta ambos workflows y sus jobs efectivos del SHA exacto."""
    missing=[];selected=[]
    for workflow,jobs in REQUIRED.items():
        candidates=[run for run in runs if run.get('name')==workflow and run.get('head_sha')==sha and run.get('head_branch')=='main' and run.get('event')=='push']
        if not candidates:
            missing.append(workflow);continue
        latest=max(candidates,key=lambda run:(run.get('run_number',0),run.get('run_attempt',1),run['id']))
        names={job.get('name') for job in latest.get('jobs',[]) if job.get('conclusion')=='success'
               and STEPS.get(job.get('name'),{'paso-obligatorio-desconocido'}).issubset({s.get('name') for s in job.get('steps',[]) if s.get('conclusion')=='success'})}
        selected.append({**latest,'requiredJobs':sorted(jobs),'requiredJobsPassed':jobs.issubset(names)})
    passed=main_sha==sha and not missing and all(run.get('status')=='completed' and run.get('conclusion')=='success' and run['requiredJobsPassed'] for run in selected)
    return {'sha':sha,'remoteMainSha':main_sha,'sameAsRemoteMain':main_sha==sha,'requiredWorkflows':list(REQUIRED),'missingWorkflows':missing,'runs':selected,'ciPassed':passed,'published':False}

def observe(sha):
    main_sha=fetch('/branches/main')['commit']['sha']
    listing=fetch('/actions/runs?head_sha='+sha+'&per_page=100')
    runs=[]
    for run in listing.get('workflow_runs',[]):
        if run.get('head_sha')!=sha or run.get('name') not in REQUIRED:continue
        jobs=fetch('/actions/runs/'+str(run['id'])+'/jobs?per_page=100')
        rows=[]
        for job in jobs.get('jobs',[]):
            annotations=[]
            # Las anotaciones distinguen un bloqueo del runner de un fallo del código.
            if job.get('conclusion')=='failure':
                annotations=fetch('/check-runs/'+str(job['id'])+'/annotations?per_page=100')
            rows.append({key:job.get(key) for key in ['id','name','status','conclusion','steps','html_url']}|{'annotations':annotations})
        runs.append({key:run.get(key) for key in ['id','name','head_sha','head_branch','event','run_number','run_attempt','status','conclusion','html_url']}|{'jobs':rows})
    report=assess(sha,main_sha,runs)
    report['observedAt']=datetime.now(timezone.utc).isoformat();report['observer']='herramienta-automatica-no-revision-humana'
    return report

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--sha',required=True);parser.add_argument('--output',type=Path,required=True);args=parser.parse_args()
    if not re.fullmatch('[0-9a-f]{40}',args.sha):parser.error('Se requiere un SHA completo de 40 caracteres.')
    try:report=observe(args.sha)
    except Exception as error:
        report={'sha':args.sha,'observedAt':datetime.now(timezone.utc).isoformat(),'ciPassed':False,'published':False,'status':'consulta-incompleta','error':str(error)}
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'sha':args.sha,'ciPassed':report['ciPassed'],'output':str(args.output),'error':report.get('error')},ensure_ascii=False))
    raise SystemExit(0 if report['ciPassed'] else 1)

if __name__=='__main__':main()
