import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
export async function auditEp3Browser(page,base,check,output){
  const data=JSON.parse(await fs.readFile(path.join(root,'editorial/ep3/areas.json')));
  const curriculum=JSON.parse(await fs.readFile(path.join(root,'editorial/curriculum.json')));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const area of data.areas){
    await page.waitForLoadState('networkidle');
    const route=curriculum.modules.find(module=>module.key===area.key).route;
    await page.goto(base+route,{waitUntil:'networkidle'});
    const section=page.locator('#caso-desarrollado');
    check('EP3 caso '+area.key,await section.getByRole('heading',{level:2,name:area.title,exact:true}).count()===1);
    if(area.key==='patrones'){
      const summary=section.getByText('Revisión de las treinta fichas especializadas',{exact:true});
      await summary.focus();await page.keyboard.press('Enter');
      check('EP3 treinta revisiones accesibles',await section.locator('details>section').count()===30);
    }
  }
  await page.waitForLoadState('networkidle');
  await page.goto(base+'/datos',{waitUntil:'networkidle'});
  await page.getByRole('link',{name:'Abrir el caso desarrollado de esta área',exact:true}).click();
  check('EP3 índice del caso',new URL(page.url()).hash==='#caso-desarrollado');
  const section=page.locator('#caso-desarrollado');
  const command=await section.locator('.manual-code pre').first().innerText();
  await section.getByRole('button',{name:'Copiar ejemplo de código'}).first().click();
  await page.waitForFunction(()=>document.querySelector('#caso-desarrollado .copy-toast[data-visible="true"]')?.textContent.includes('copiado'));
  check('EP3 copiar comando',await page.evaluate(()=>navigator.clipboard.readText())===command);
  await section.getByText('Consultar la solución del caso',{exact:true}).focus();await page.keyboard.press('Enter');
  check('EP3 solución por teclado',await section.locator('details').first().evaluate(element=>element.open));
  await page.screenshot({path:path.join(output,'datos-escritorio.png')});
  for(const width of [390,320]){
    await page.setViewportSize({width,height:844});await page.waitForLoadState('networkidle');
    check(`EP3 sin desbordamiento global a ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  await page.screenshot({path:path.join(output,'datos-movil.png')});
}
