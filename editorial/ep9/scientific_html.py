"""Deriva HTML científico con MathML, citas y diagramas + transcripción.

Requiere Pandoc al regenerar. La publicación posterior usa los derivados y sus
huellas conservadas, sin depender de una instalación de un asistente.
"""
from pathlib import Path
from html import escape
import hashlib
import json
import os
import re
import shutil
import subprocess

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'editorial/ep9/generated'
WORK=ROOT/'output/review/ep9/scientific'
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def balanced(text, start):
    depth=1
    for at in range(start+1,len(text)):
        if text[at]=='{' and text[at-1]!='\\': depth+=1
        if text[at]=='}' and text[at-1]!='\\':
            depth-=1
            if depth==0: return text[start+1:at],at+1
    raise ValueError('Llave sin cerrar')

def expand(file, inputs, chain=()):
    file=file.resolve()
    if not file.is_relative_to(ROOT) or file in chain: raise ValueError('Include ajeno o circular')
    inputs.add(file)
    text=file.read_text()
    return re.sub(r'\\input\{([^}]+)\}',lambda m:expand(ROOT/(m[1] if m[1].endswith('.tex') else m[1]+'.tex'),inputs,chain+(file,)),text)

def diagrams(text, product):
    records=[]
    colors='\n'.join(re.findall(r'\\definecolor\{[^}]+\}\{[^}]+\}\{[^}]+\}',text))
    def transform(m):
        code=m[0];number=len(records)+1;stem=f'{product}-{number:02d}'
        nodes={}
        for match in re.finditer(r'\\node(?:\[[\s\S]*?\])?\s*\(([^)]+)\)[^{;]*\{',code):
            label,_=balanced(code,match.end()-1)
            nodes[match[1]]=re.sub(r'\\\\',' ',label)
        connections=[]
        for match in re.finditer(r'\\draw(\[[\s\S]*?\])?\s*([^;]+);',code):
            options,body=match[1] or '',match[2]
            ids=re.findall(r'\(([^)]+)\)',body)
            ids=[x.split('.')[0] for x in ids if x.split('.')[0] in nodes]
            if len(ids)<2: raise ValueError('Conexión no transcrita: '+match[0])
            label=re.search(r'node(?:\[[^]]*\])?\s*\{([^}]+)\}',body)
            directional=bool(re.search(r'Latex|->|arrow|arr|flow|line|\ba\b',options))
            for first,last in zip(ids,ids[1:]):
                connections.append((first,last,directional,label[1] if label else ''))
        if not nodes and '\\begin{axis}' in code:
            for i,(label,value) in enumerate(re.findall(r'\(([^(),]+),\s*([0-9.]+)\)',code)):
                nodes['punto-'+str(i+1)]=label+': '+value
        if not nodes: raise ValueError('Diagrama sin transcripción de nodos: '+stem)
        tex='\\documentclass[tikz,border=3pt]{standalone}\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage{newtxtext,newtxmath,pgfplots}\n\\pgfplotsset{compat=1.18}\n\\usetikzlibrary{arrows.meta,positioning,shapes.geometric,fit,backgrounds}\n'+colors+'\n\\newcommand{\\COBRIA}{\\textsf{COBRIA}}\n\\begin{document}\n'+code+'\n\\end{document}\n'
        source=WORK/(stem+'.tex');source.write_text(tex)
        subprocess.run(['latex','-interaction=batchmode','-halt-on-error','-output-directory='+str(WORK),str(source)],cwd=ROOT,check=True,stdout=subprocess.DEVNULL)
        svg=OUT/'figuras'/(stem+'.svg')
        subprocess.run(['dvisvgm','--no-fonts','--output='+str(svg),str(WORK/(stem+'.dvi'))],check=True,capture_output=True)
        transcript='\\begin{quote}\n\\textbf{Descripción textual del diagrama.}\n\\begin{itemize}\n'
        transcript+='\n'.join('\\item Nodo: '+label+'.' for label in nodes.values())
        transcript+='\n'+'\n'.join('\\item '+nodes[a]+(' $\\rightarrow$ ' if directed else ' conecta con ')+nodes[b]+(' ('+label+')' if label else '')+'.' for a,b,directed,label in connections)
        transcript+='\n\\end{itemize}\n\\end{quote}'
        records.append({'id':stem,'sourceSha256':hashlib.sha256(code.encode()).hexdigest(),'svg':str(svg.relative_to(ROOT)),'svgSha256':digest(svg),'nodes':nodes,'connections':connections,'transcription':'nodos, conexiones, dirección y rótulos extraídos; posición y color no sustituyen significado'})
        return '\\includegraphics{figuras/'+stem+'.svg}\n'+transcript
    return re.sub(r'\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}',transform,text),records

def generate():
    pandoc=os.environ.get('COBRIA_PANDOC_BIN') or shutil.which('pandoc')
    if not pandoc: raise SystemExit('Instale Pandoc 3.12.1 o indique COBRIA_PANDOC_BIN; no se simula la conversión.')
    version=subprocess.check_output([pandoc,'--version'],text=True).splitlines()[0]
    if version!='pandoc 3.12.1': raise SystemExit('Versión no fijada: '+version)
    OUT.mkdir(parents=True,exist_ok=True);(OUT/'figuras').mkdir(exist_ok=True);WORK.mkdir(parents=True,exist_ok=True)
    report={'date':'2026-10-25','pandoc':version,'scope':'derivación técnica revisable; no certificación de accesibilidad ni validación por lector de pantalla','documents':[]}
    products=[('articulo','articulo-cobria.tex','Contratos reconstruibles con ámbito explícito para sistemas NoSQL documentales'),('maestro','main.tex','COBRIA: documento maestro de investigación'),('especificacion','specification/COBRIA-ECOSISTEMA-1.0.tex','COBRIA: especificación candidata del ecosistema'),('ciega','review/blind-article.tex','Contratos reconstruibles: copia para revisión ciega')]
    for key,file,title in products:
        inputs=set();text=expand(ROOT/file,inputs)
        text=re.sub(r'(?<!\\)%[^\n]*','',text)
        text=re.sub(r'\\ifnum\\blindreview=1\s*([\s\S]*?)\\else\s*([\s\S]*?)\\fi',lambda m:m[1] if key=='ciega' else m[2],text)
        # Eliminar solo envoltorios de escala; su contenido permanece completo.
        for command in ['resizebox','scalebox']:
            while '\\'+command+'{' in text:
                start=text.index('\\'+command+'{');at=start+len(command)+1
                for _ in range(2 if command=='resizebox' else 1): _,at=balanced(text,at)
                while text[at].isspace(): at+=1
                content,end=balanced(text,at);text=text[:start]+content+text[end:]
        text,figures=diagrams(text,key)
        text=re.sub(r'\\begin\{(?:aviso|requisito)\}\{([^}]+)\}',r'\\subsection*{\1}',text)
        text=re.sub(r'\\end\{(?:aviso|requisito)\}','',text)
        def equation_anchor(m):
            labels=re.findall(r'\\label\{([^}]+)\}',m[0])
            return ''.join('\\hypertarget{'+label+'}{}\n' for label in labels)+re.sub(r'\\label\{[^}]+\}','',m[0])
        text=re.sub(r'\\begin\{(equation|align)\}[\s\S]*?\\end\{\1\}',equation_anchor,text)
        expanded=WORK/(key+'.tex');expanded.write_text(text)
        html=OUT/(key+'.html')
        result=subprocess.run([pandoc,str(expanded),'--from=latex','--to=html5','--standalone','--math-method=mathml','--citeproc','--bibliography=referencias.bib','--metadata=lang:es','--metadata=title:'+title,'--metadata=author:'+('Autor anonimizado' if key=='ciega' else 'Billy Jak Cordero Porras'),'--shift-heading-level-by=1','--toc','--output='+str(html)],cwd=ROOT,capture_output=True,text=True)
        (WORK/(key+'-warnings.txt')).write_text(result.stderr)
        if result.returncode: raise RuntimeError(result.stderr)
        # Pandoc usa «image» cuando el TikZ no tenía pie de figura (p. ej.,
        # la máquina de estados normativa). Dar un nombre descriptivo y
        # mantener la transcripción completa inmediatamente a continuación.
        rendered=html.read_text()
        for figure in figures:
            src='figuras/'+figure['id']+'.svg'
            description='Diagrama: '+', '.join(figure['nodes'].values())+'. Consulte la descripción textual siguiente.'
            rendered=re.sub(r'(<img\s+src="'+re.escape(src)+r'"[^>]*\balt=")image(")',lambda m:m[1]+escape(description,quote=True)+m[2],rendered)
        html.write_text(rendered)
        value=html.read_text()
        if 'tikzpicture' in value or 'COBRIAResumenCientifico' in value: raise ValueError('Contenido sin transformar')
        report['documents'].append({'id':key,'html':str(html.relative_to(ROOT)),'sourceSha256':{str(p.relative_to(ROOT)):digest(p) for p in sorted(inputs|{ROOT/'referencias.bib'})},'htmlSha256':digest(html),'diagrams':figures,'warnings':result.stderr.strip()})
    (OUT/'scientific-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({r['id']:len(r['diagrams']) for r in report['documents']}))
if __name__=='__main__': generate()
