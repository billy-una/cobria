"""Empaqueta lecturas HTML desde las mismas fuentes y verifica su texto.

Solo usa la biblioteca estándar y pypdf. No modifica los PDF ni simula una
certificación; la conversión científica requiere su manifiesto previo.
"""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json
import re
import shutil
import sys
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2]
TARGET=ROOT/'sitio/public/lecturas'
VOID={'meta','link','img','br','hr','input','source','col','area','base','embed','param','track','wbr'}
class Node:
    def __init__(self,tag='',attrs=None,text=''):
        self.tag=tag;self.attrs=dict(attrs or []);self.children=[];self.text=text
    def walk(self):
        yield self
        for child in self.children: yield from child.walk()
    def inner_text(self):
        if self.tag in {'style','script'}: return ''
        return self.text+''.join(x.inner_text() for x in self.children)
    def html(self):
        if not self.tag: return escape(self.text,quote=False)
        attrs=''.join(' '+k+('="'+escape(v,quote=True)+'"' if v is not None else '') for k,v in self.attrs.items())
        opening='<'+self.tag+attrs+'>'
        return opening if self.tag in VOID else opening+''.join(x.html() for x in self.children)+'</'+self.tag+'>'
class Tree(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=True);self.root=Node('root');self.stack=[self.root];self.feed(text)
    def handle_starttag(self,tag,attrs):
        node=Node(tag,attrs);self.stack[-1].children.append(node)
        if tag not in VOID:self.stack.append(node)
    def handle_startendtag(self,tag,attrs): self.handle_starttag(tag,attrs);self.handle_endtag(tag)
    def handle_endtag(self,tag):
        for index in range(len(self.stack)-1,0,-1):
            if self.stack[index].tag==tag:self.stack=self.stack[:index];break
    def handle_data(self,text):self.stack[-1].children.append(Node(text=text))
def sha(file):return hashlib.sha256(file.read_bytes()).hexdigest()
def normalized(text):return re.sub(r'\s+','',text)
def parse(text):return Tree(text).root

def reader(text,title):
    tree=parse(text);body=next(n for n in tree.walk() if n.tag=='body');expected=normalized(body.inner_text())
    shift=sum(n.tag=='h1' for n in body.walk())>1
    for cover in [n for n in body.walk() if n.attrs.get('class')=='cover-title']:
        for child in cover.children:
            if child.tag=='h2':child.tag='p'
    first=True;used={n.attrs['id'] for n in tree.walk() if 'id' in n.attrs};counter=0
    for n in list(body.walk()):
        if n.tag in {'h1','h2','h3','h4','h5'}:
            old=n.tag
            if old=='h1' and first:first=False
            elif shift:n.tag='h'+str(min(6,int(old[1])+1))
            if 'id' not in n.attrs:
                counter+=1;candidate='lectura-seccion-'+str(counter)
                while candidate in used:counter+=1;candidate='lectura-seccion-'+str(counter)
                n.attrs['id']=candidate;used.add(candidate)
        if n.tag=='th':n.attrs.setdefault('scope','col')
        if n.tag=='img' and not n.attrs.get('alt'):n.attrs['alt']='';n.attrs['role']='presentation'
        if n.attrs.get('role')=='img' and 'family-flow' in n.attrs.get('class',''):
            n.attrs['role']='list'
            for c in n.children:
                if c.tag=='div':c.attrs['role']='listitem'
        if n.tag=='figure':
            caption=next((x for x in n.walk() if x.tag=='figcaption'),None)
            if caption:
                n.attrs.setdefault('aria-label',caption.inner_text())
                for image in [x for x in n.walk() if x.tag=='img']:
                    image.attrs['alt']=caption.inner_text()
    def wrap_tables(parent):
        result=[]
        for child in parent.children:
            wrap_tables(child)
            if child.tag=='table':
                region=Node('div',[('class','table-scroll'),('role','region'),('aria-label','Tabla de consulta; puede desplazarse con el teclado'),('tabindex','0')]);region.children=[child];result.append(region)
            else:result.append(child)
        parent.children=result
    wrap_tables(body)
    # El título de Parte de LaTeX puede introducir un salto H1→H3 en Pandoc.
    # Normalizar el nivel no elimina el encabezado ni altera su texto.
    previous=0
    for n in body.walk():
        if re.fullmatch(r'h[1-6]',n.tag):
            level=int(n.tag[1])
            if previous and level>previous+1:n.tag='h'+str(previous+1)
            previous=int(n.tag[1])
    actual=normalized(body.inner_text())
    if expected!=actual:raise ValueError('La adaptación perdió o cambió texto visible: '+title)
    main=next((n for n in body.walk() if n.tag=='main'),None)
    if main is None:main=Node('main',[('id','contenido-principal')]);main.children=body.children;body.children=[main]
    main.attrs['tabindex']='-1';target=main.attrs.get('id','contenido-principal')
    headings=[n for n in main.walk() if n.tag=='h2' and n.inner_text().strip()]
    # Índice completo, plegable y de teclado; no depende de JavaScript.
    index='<details class="reader-navigation"><summary>Índice de esta lectura</summary><nav aria-label="Índice completo de la obra"><ol>'+''.join('<li><a href="#'+escape(n.attrs['id'])+'">'+escape(n.inner_text())+'</a></li>' for n in headings)+'</ol></nav></details>'
    intro='<a class="skip" href="#'+escape(target)+'">Saltar al contenido</a><nav aria-label="Navegación de lectura"><a href="/recursos">Recursos COBRIA</a> · <a href="/comenzar">Ruta práctica</a></nav><p>Lectura HTML de la misma fuente editorial. Los PDF no se declaran conformes con PDF/UA; la prueba con tecnología de apoyo sigue pendiente.</p>'+index
    html='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+'</title><link rel="stylesheet" href="reader.css"></head><body>'+intro+''.join(n.html() for n in body.children)+'</body></html>'
    return html,{'visibleTextPreserved':True,'sourceTextSha256':hashlib.sha256(expected.encode()).hexdigest(),'headings':len(headings)}

def build(check=False):
    scientific=json.loads((ROOT/'editorial/ep9/generated/scientific-manifest.json').read_text())
    for item in scientific['documents']:
        for p,h in item['sourceSha256'].items():
            if sha(ROOT/p)!=h:raise ValueError('Fuente científica cambió; regenerar con Pandoc: '+p)
        if sha(ROOT/item['html'])!=item['htmlSha256']:raise ValueError('Derivado científico alterado')
        for figure in item['diagrams']:
            if sha(ROOT/figure['svg'])!=figure['svgSha256']:raise ValueError('Figura divergente')
    products=json.loads((ROOT/'editorial/ep9/products.json').read_text())['products'];records=[];outputs={}
    for item in products:
        if item['id']=='ciega':continue # copia privada, no se distribuye junto al autor
        source=ROOT/(item['html'] or 'editorial/ep9/generated/'+item['id']+'.html')
        text,parity=reader(source.read_text(),{'libro':'COBRIA: manual práctico','cuaderno':'COBRIA: cuaderno de trabajo','anexo':'COBRIA: anexo técnico'}.get(item['id'],'COBRIA: '+item['id']))
        filename=item['id']+'.html';outputs[filename]=text.encode()
        pdf=PdfReader(ROOT/item['pdf']);catalog=pdf.trailer['/Root']
        records.append({'id':item['id'],'href':'/lecturas/'+filename,'source':str(source.relative_to(ROOT)),'sourceSha256':sha(source),'htmlSha256':hashlib.sha256(outputs[filename]).hexdigest(),'pdf':item['pdf'],'pdfSha256':sha(ROOT/item['pdf']),'pdfTagged':bool(catalog.get('/StructTreeRoot')),'pdfUaCertified':False,**parity})
    assets=[]
    for base,folder in [(ROOT/'libro-cobria/assets','assets'),(ROOT/'libro-cobria/fonts','fonts'),(ROOT/'editorial/ep9/generated/figuras','figuras')]:
        for file in sorted(base.iterdir()):
            if not file.is_file() or file.is_symlink():continue
            if file.name.startswith('ciega-'):continue
            if file.suffix not in {'.png','.svg','.ttf','.txt'}:continue
            relative=folder+'/'+file.name;assets.append({'path':relative,'source':str(file.relative_to(ROOT)),'sha256':sha(file)})
    outputs['reader.css']=(ROOT/'editorial/ep9/reader.css').read_bytes()
    manifest={'schemaVersion':'1.0.0','date':'2026-10-25','status':'lecturas-locales-no-certificadas','published':False,'screenReaderTested':False,'items':records,'assets':assets,'cssSha256':hashlib.sha256(outputs['reader.css']).hexdigest()}
    outputs['manifest.json']=(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
    for relative,content in outputs.items():
        target=TARGET/relative
        if check:
            if not target.is_file() or target.read_bytes()!=content:raise ValueError('Lectura desactualizada: '+relative)
        else:
            target.parent.mkdir(parents=True,exist_ok=True)
            if target.is_symlink():raise ValueError('Salida enlazada rechazada')
            target.write_bytes(content)
    for a in assets:
        target=TARGET/a['path']
        if check:
            if not target.is_file() or sha(target)!=a['sha256']:raise ValueError('Recurso divergente: '+a['path'])
        else:
            target.parent.mkdir(parents=True,exist_ok=True)
            if target.is_symlink():raise ValueError('Recurso enlazado rechazado')
            shutil.copyfile(ROOT/a['source'],target)
    print('EP9: seis lecturas HTML, texto preservado por transformación, recursos locales y límites explícitos.')
    return manifest
if __name__=='__main__':build('--check' in sys.argv)
