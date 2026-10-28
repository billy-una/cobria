"""Renderiza cada página y hojas de contacto; no sustituye una lectura minuciosa."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import shutil
import subprocess
from PIL import Image, ImageDraw
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'output/review/ep9/render'

def render(item):
    pdf=ROOT/item['pdf']; folder=OUT/item['id']; folder.mkdir(parents=True,exist_ok=True)
    pages=len(PdfReader(pdf).pages)
    subprocess.run([shutil.which('pdftoppm'),'-scale-to','650','-png',str(pdf),str(folder/'pagina')],check=True,capture_output=True)
    files=sorted(folder.glob('pagina-*.png'))
    if len(files)!=pages: raise ValueError('Render incompleto: '+item['id'])
    sheets=[]; records=[]
    for offset in range(0,pages,30):
        sheet=Image.new('RGB',(1800,1740),'#dce4df');draw=ImageDraw.Draw(sheet)
        for index,file in enumerate(files[offset:offset+30]):
            image=Image.open(file).convert('RGB'); image.thumbnail((285,320))
            x=(index%6)*300+(300-image.width)//2; y=(index//6)*348
            sheet.paste(image,(x,y+20));draw.text((x,y+3),item['id']+' · '+str(offset+index+1),fill='black')
            records.append({'page':offset+index+1,'render':str(file.relative_to(ROOT)),'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'inspection':'pendiente-vision-macro'})
        target=folder/('contacto-'+str(offset//30+1).zfill(2)+'.jpg');sheet.save(target,quality=90);sheets.append(str(target.relative_to(ROOT)))
    return {'id':item['id'],'pdf':item['pdf'],'sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pages':records,'contactSheets':sheets}

if __name__=='__main__':
    OUT.mkdir(parents=True,exist_ok=True)
    products=json.loads((ROOT/'editorial/ep9/products.json').read_text())['products']
    with ThreadPoolExecutor(max_workers=3) as pool: results=list(pool.map(render,products))
    (OUT/'REGISTRO.json').write_text(json.dumps({'method':'Todas las páginas rasterizadas a 650 px; hojas de contacto para inspección macro y ampliación selectiva. No equivale a lectura palabra por palabra ni prueba de tecnología de apoyo.','documents':results},ensure_ascii=False,indent=2)+'\n')
    print('Renderizadas',sum(len(x['pages']) for x in results),'páginas.')
