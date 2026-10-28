"""Construcción doble de instantánea sin historia; no aprueba ni publica una release.

Conserva los clones y registros en output/review/ep10. El árbol de trabajo del
autor no se confirma ni se limpia. Las auditorías no acreditan revisión humana.
"""
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2]
EXCLUDED={'node_modules','.git','__pycache__','dist','.wrangler','.next','.vinext'}
STATE={'editorial/ep10/estado.json','editorial/ep10/recibo.json'}
SECRET=re.compile(rb'(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)')
PERSONAL=re.compile(rb'/(?:Users|Volumes)/[A-Za-z0-9][A-Za-z0-9 _.-]{1,}/')

def sha(file):return hashlib.sha256(file.read_bytes()).hexdigest()
def json_write(file,value):file.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def git(args,cwd=ROOT):return subprocess.check_output(['git',*args],cwd=cwd,text=True).strip()

def inventory(root=ROOT):
    names=subprocess.check_output(['git','ls-files','-z','--cached','--others','--exclude-standard'],cwd=root).decode().split('\0')
    rows=[];findings=[]
    for name in sorted(set(names)):
        if not name or name in STATE or name.startswith(('output/','build/')) or any(x in EXCLUDED for x in Path(name).parts):continue
        file=root/name
        if not file.exists():continue # eliminación del árbol de trabajo, no se recupera desde HEAD
        if file.is_symlink() or not file.is_file():raise ValueError('Archivo no regular: '+name)
        if Path(name).is_absolute() or '..' in Path(name).parts:raise ValueError('Ruta ajena')
        if any(x.startswith('.env') or x in {'.npmrc','.netrc'} for x in Path(name).parts) or file.suffix.lower() in {'.pem','.key','.p12','.pfx'}:raise ValueError('Ruta sensible: '+name)
        data=file.read_bytes()
        if SECRET.search(data):raise ValueError('Posible secreto; revisar sin imprimir valor: '+name)
        if PERSONAL.search(data):findings.append({'path':name,'kind':'ruta-personal-requiere-revision'})
        if name.startswith('specification/phase-24/responses/') or name.endswith('CLAVE-COORDINACION.md'):
            findings.append({'path':name,'kind':'revision-historica-o-clave-de-coordinacion-no-distribuir-automaticamente'})
        rows.append({'path':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'mode':file.stat().st_mode&0o777})
    if not rows or sum(x['bytes'] for x in rows)>1024**3:raise ValueError('Inventario vacío o excesivo')
    return rows,findings

def pdf_fingerprint(file):
    reader=PdfReader(file)
    texts=[' '.join((page.extract_text() or '').split()) for page in reader.pages]
    sizes=[[float(v) for v in page.mediabox] for page in reader.pages]
    metadata=reader.metadata or {}
    return {'pages':len(texts),'pageTextSha256':[hashlib.sha256(t.encode()).hexdigest() for t in texts],
            'pageBoxes':sizes,'title':metadata.get('/Title'),'author':metadata.get('/Author'),
            'language':str(reader.trailer['/Root'].get('/Lang','')),
            'tagged':bool(reader.trailer['/Root'].get('/StructTreeRoot'))}

def run(command,cwd,output,label,allowed=(0,)):
    log=output/(label+'.log')
    print(label,flush=True)
    with log.open('w') as stream:
        result=subprocess.run(command,cwd=cwd,stdout=stream,stderr=subprocess.STDOUT,
                              env={**os.environ,'COBRIA_PUBLIC_BUILD':'1'})
    if result.returncode not in allowed:raise RuntimeError(label+': salida '+str(result.returncode)+'; '+str(log))
    return result.returncode

def raster(file,directory):
    directory.mkdir(parents=True,exist_ok=False)
    subprocess.run(['pdftoppm','-scale-to','650','-png',str(file),str(directory/'pagina')],check=True,capture_output=True)
    return [sha(p) for p in sorted(directory.glob('pagina-*.png'))]

def compare_pdf(first,second,approved,output,key):
    values=[pdf_fingerprint(p) for p in [first,second,approved]]
    result={'id':key,'semanticEquivalentBetweenBuilds':values[0]==values[1],
            'semanticEquivalentToEp9':values[0]==values[2],'pages':values[0]['pages'],
            'binaryIdentity':sha(first)==sha(second),'sha256':[sha(first),sha(second)],
            'criterion':'texto normalizado por página, cajas, título, autor, idioma y presencia de etiquetas; no certifica PDF/UA'}
    if not result['semanticEquivalentBetweenBuilds'] or not result['semanticEquivalentToEp9']:
        result['differences']=[k for k in values[0] if values[0][k]!=values[1][k] or values[0][k]!=values[2][k]]
        result['differentTextPages']=[i+1 for i,t in enumerate(values[0]['pageTextSha256']) if i>=len(values[2]['pageTextSha256']) or t!=values[2]['pageTextSha256'][i]]
        return result
    # Comparar todas las páginas, no solo una selección. Los PNG permanecen
    # disponibles para ampliar cualquier divergencia detectada.
    images=[raster(p,output/(key+'-'+str(i))) for i,p in enumerate([first,second,approved],1)]
    result['rasterEquivalentBetweenBuilds']=images[0]==images[1]
    result['rasterEquivalentToEp9']=images[0]==images[2]
    result['rasterScale']=650
    result['rasterDifferentPages']=[i+1 for i in range(len(images[0])) if images[0][i]!=images[1][i] or images[0][i]!=images[2][i]]
    json_write(output/(key+'-comparacion.json'),{'id':key,'semantic':values,'rasterPageSha256':images,'result':result})
    return result

def sbom(source):
    components=[]
    for project in ['replication','sitio','libro-cobria','replication/qa']:
        lock=json.loads((source/project/'package-lock.json').read_text())
        for name,data in lock.get('packages',{}).items():
            if not name:continue
            package=name.split('node_modules/')[-1]
            components.append({'type':'library','bom-ref':project+':'+name,'name':package,'version':data.get('version','no-declarada'),
                               'licenses':[{'license':{'name':str(data['license'])}}] if data.get('license') else [],
                               'properties':[{'name':'cobria:lockfile','value':project+'/package-lock.json'}]})
    for line in (source/'requirements-build.txt').read_text().splitlines():
        if '==' in line:
            name,version=line.split('==',1);components.append({'type':'library','bom-ref':'python:'+name,'name':name,'version':version})
    return {'bomFormat':'CycloneDX','specVersion':'1.5','version':1,'components':components}

def document_package(clone,output,report,products):
    """Solo derivados públicos y avisos; excluye Git, respuestas y copia ciega."""
    members={}
    for product in products:
        if product['id']!='ciega':members['pdf/'+Path(product['pdf']).name]=clone/product['pdf']
    for file in (clone/'sitio/public/lecturas').rglob('*'):
        if file.is_file():members['lecturas/'+file.relative_to(clone/'sitio/public/lecturas').as_posix()]=file
    for name in ['LICENSE','LICENSES.md','LICENSE-CODE.txt','LICENSE-CONTENT.md','PROVENANCE.md','NOTICE']:
        members[name]=clone/name
    members['SBOM.cdx.json']=output/'SBOM.cdx.json'
    notes=("# COBRIA: documentos de candidata local\n\nPropuesta independiente, no estable ni certificada. "
           "Preparada el 28 de octubre de 2026, sin publicación ni aprobación humana del SHA.\n\n"
           "Instantánea de fuentes sin historia: "+report['snapshotCommit']+". No es el HEAD aprobado de main.\n\n"
           "Incluye seis PDF y seis lecturas HTML. La copia ciega y las respuestas de revisores están excluidas. "
           "Las rutas de navegación del sitio requieren su alojamiento; el ZIP no instala ni despliega una web.\n\n"
           "Este paquete es documental: no incluye las fuentes ejecutables ni se presenta como réplica completa. "
           "Las fuentes deben pasar una revisión de privacidad y derechos antes de su distribución.\n\n"
           "No se afirma PDF/UA, revisión independiente ni aprobación de CI. Consulte LICENSES.md y PROVENANCE.md.\n")
    (output/'LEAME-DOCUMENTOS.md').write_text(notes);members['LEAME.md']=output/'LEAME-DOCUMENTOS.md'
    manifest={'kind':'documentos-candidata-local-no-publicada','snapshotCommit':report['snapshotCommit'],'approvedMainCommit':False,'published':False,'date':'2026-10-28',
              'completeSourceReplica':False,'files':[{'path':name,'bytes':file.stat().st_size,'sha256':sha(file)} for name,file in sorted(members.items())]}
    archive=output/'COBRIA-documentos-candidata-local.zip'
    with zipfile.ZipFile(archive,'x',zipfile.ZIP_DEFLATED) as target:
        for name,file in sorted(members.items()):
            if file.is_symlink() or SECRET.search(file.read_bytes()):raise ValueError('Recurso no admisible: '+name)
            target.write(file,name)
        target.writestr('MANIFEST.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    with zipfile.ZipFile(archive) as target:
        if set(target.namelist())!={*members,'MANIFEST.json'}:raise ValueError('Miembros ZIP divergentes')
        for entry in manifest['files']:
            if hashlib.sha256(target.read(entry['path'])).hexdigest()!=entry['sha256']:raise ValueError('Huella ZIP divergente')
    return {'path':str(archive.relative_to(ROOT)),'sha256':sha(archive),'bytes':archive.stat().st_size,'files':len(members),'published':False,'completeSourceReplica':False}

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--prepare-only',action='store_true');args=parser.parse_args()
    stamp=datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    output=ROOT/'output/review/ep10'/stamp;output.mkdir(parents=True,exist_ok=False)
    report={'phase':'EP10','kind':'instantanea-local-sin-historia-no-release','date':'2026-10-28','sourceHead':git(['rev-parse','HEAD']),
            'sourceWorkingTreeClean':not git(['status','--porcelain']),'published':False,'approvedMainCommit':False,'remoteCiObserved':False,
            'builds':[],'status':'preparando','output':str(output.relative_to(ROOT))}
    report['toolchain']={'python':sys.version.split()[0],
                         'node':subprocess.check_output(['node','--version'],text=True).strip(),
                         'npm':subprocess.check_output(['npm','--version'],text=True).strip(),
                         'browserOverride':bool(os.environ.get('COBRIA_BROWSER_BIN')),
                         'platform':sys.platform}
    def save():
        json_write(output/'RECIBO.json',report);json_write(ROOT/'editorial/ep10/recibo.json',report)
    try:
        if shutil.disk_usage(ROOT).free<10*1024**3:raise ValueError('Se requieren 10 GiB libres; no se borran datos')
        run(['node','editorial/ep7/build.mjs','--check'],ROOT,output,'preflight-procedencia')
        rows,findings=inventory();json_write(output/'FUENTES.json',rows);json_write(output/'PRIVACIDAD.json',{'automaticReviewOnly':True,'secretPatternsFound':0,'findings':findings,'sourceRedistributionApproved':False})
        source=output/'source';source.mkdir()
        for row in rows:
            target=source/row['path'];target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/row['path'],target);target.chmod(row['mode'])
        git(['init','--quiet','--initial-branch=instantanea-ep10'],source);git(['add','--all'],source)
        subprocess.run(['git','-c','core.hooksPath=/dev/null','-c','commit.gpgsign=false','-c','user.name=COBRIA Verificación Local','-c','user.email=local-build@invalid','commit','--quiet','-m','Instantánea EP10 sin historia; no aprobación de publicación'],cwd=source,check=True,
                       env={**os.environ,'GIT_AUTHOR_DATE':'2026-10-28T12:00:00Z','GIT_COMMITTER_DATE':'2026-10-28T12:00:00Z'})
        report.update(snapshotCommit=git(['rev-parse','HEAD'],source),sourceFiles=len(rows),sourceInventorySha256=sha(output/'FUENTES.json'),privacyFindings=len(findings),status='instantanea-preparada');save()
        json_write(output/'SBOM.cdx.json',sbom(source))
        if args.prepare_only:return
        products=json.loads((source/'editorial/ep9/products.json').read_text())['products']
        clones=[]
        for index in [1,2]:
            clone=output/('clone-'+str(index));git(['clone','--quiet','--no-local',str(source),str(clone)]);clones.append(clone)
            item={'index':index,'commit':git(['rev-parse','HEAD'],clone),'cleanBeforeInstall':not git(['status','--porcelain'],clone),'referenceRepositoriesAvailable':False,'status':'instalando'}
            if not item['cleanBeforeInstall']:raise ValueError('Clon inicial no limpio')
            report['builds'].append(item);save()
            for project in ['replication','sitio','libro-cobria']:run(['npm','ci','--no-audit','--no-fund','--prefix',project],clone,output,f'clon-{index}-instalar-{project}')
            item['status']='construyendo';save()
            run(['make','construir-publico','construir-articulo-ciego'],clone,output,f'clon-{index}-construir')
            run(['node','editorial/ep9/browser.mjs'],clone,output,f'clon-{index}-lecturas')
            run(['node','replication/scripts/review-pc8-server.mjs',str(clone/'sitio')],clone,output,f'clon-{index}-servidor')
            item['status']='aprobado';save()
        report['status']='comparando';save()
        with ThreadPoolExecutor(max_workers=2) as pool:
            report['pdfComparisons']=list(pool.map(lambda p:compare_pdf(clones[0]/p['pdf'],clones[1]/p['pdf'],ROOT/p['pdf'],output/'raster',p['id']),products))
        if any(not d.get('semanticEquivalentBetweenBuilds') or not d.get('semanticEquivalentToEp9') or not d.get('rasterEquivalentBetweenBuilds') or not d.get('rasterEquivalentToEp9') for d in report['pdfComparisons']):raise ValueError('Divergencia PDF; conservar páginas y revisar antes de empaquetar')
        paths=['editorial/curriculum.json','editorial/content-map.json','libro-cobria/index.html','libro-cobria/cuaderno.html','libro-cobria/anexo-tecnico.html','sitio/public/catalogo.json','sitio/public/pattern-catalog.json']
        report['editorialComparisons']=[{'path':p,'equivalent':sha(clones[0]/p)==sha(clones[1]/p),'sha256':sha(clones[0]/p)} for p in paths]
        if not all(x['equivalent'] for x in report['editorialComparisons']):raise ValueError('Derivado editorial divergente')
        report['audits']=[]
        for project in ['replication','sitio','libro-cobria','replication/qa']:
            code=run(['npm','audit','--package-lock-only','--json','--prefix',project],source,output,'audit-'+project.replace('/','-'),allowed=(0,1))
            audit=json.loads((output/('audit-'+project.replace('/','-')+'.log')).read_text())
            report['audits'].append({'project':project,'exitCode':code,'vulnerabilities':audit.get('metadata',{}).get('vulnerabilities'),'error':audit.get('error')})
        report['documentPackage']=document_package(clones[0],output,report,products)
        current,_=inventory()
        if current!=rows:raise ValueError('Las entradas del checkout original cambiaron; no reutilizar esta candidata')
        report['status']='verificada-localmente-pendiente-aprobacion-y-CI';report['sourceRedistributionApproved']=False
        report['limitations']=['Instantánea local aislada; no es un commit aprobado de main.','Un equipo macOS ARM; no es réplica externa.','Comparación visual a 650 px; no sustituye evaluación con tecnología de apoyo.','Revisar datos históricos, rutas personales, dependencias y derechos antes de redistribuir las fuentes.','No se publica ni se inventa una ejecución de CI remota.']
    except KeyboardInterrupt:
        report['status']='interrumpida-sin-candidata-aprobada';report['error']='Interrupción durante preparación; no reutilizar como verificación completa';save();raise
    except Exception as error:
        report['status']='fallida-con-evidencia-conservada';report['error']=str(error);save();raise
    finally:save();print(json.dumps(report,ensure_ascii=False,indent=2),flush=True)

if __name__=='__main__':main()
