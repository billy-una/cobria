import path from 'node:path';

// Se ejecuta dentro del servidor Workers local del auditor EP1; nunca publica.
export async function auditEp2Browser(page,base,check,output){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base+'/comenzar',{waitUntil:'networkidle'});
  await page.getByRole('link',{name:'Abrir el taller desde cero: diez unidades',exact:true}).click();
  await page.waitForURL('**/comenzar/desde-cero');
  await page.waitForLoadState('networkidle');
  check('EP2 entrada desde la guía',await page.getByRole('heading',{level:1,name:'De una idea a tu primera prueba'}).count()===1);
  check('EP2 diez unidades navegables',await page.locator('section[id^="unidad-"]').count()===10);
  await page.getByRole('link',{name:'Error y registro con controles',exact:true}).click();
  check('EP2 índice lleva al registro',new URL(page.url()).hash==='#unidad-09');
  const section=page.locator('#unidad-09');
  const snippet=await section.locator('.manual-code pre').first().innerText();
  await section.getByRole('button',{name:'Copiar ejemplo de código'}).first().click();
  await page.waitForFunction(()=>document.querySelector('#unidad-09 .copy-toast[data-visible="true"]')?.textContent.includes('copiado'));
  check('EP2 copia del ejemplo real',await page.evaluate(()=>navigator.clipboard.readText())===snippet&&snippet.includes('claveIdempotencia'));
  const answer=section.locator('details');
  check('EP2 solución inicialmente cerrada',!await answer.evaluate(element=>element.open));
  await answer.locator('summary').focus();await page.keyboard.press('Enter');
  check('EP2 solución accesible por teclado',await answer.evaluate(element=>element.open));
  await page.screenshot({path:path.join(output,'taller-escritorio.png')});
  for(const width of [390,320]){
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({width,height:844});
    await page.waitForLoadState('networkidle');
    check(`EP2 sin desbordamiento global a ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
  }
  await page.getByRole('link',{name:'Prueba propia y recuperación de una regresión',exact:true}).click();
  await page.waitForFunction(()=>{const box=document.querySelector('#unidad-10').getBoundingClientRect();return box.top>=0&&box.top<innerHeight;});
  check('EP2 unidad final en móvil',await page.locator('#unidad-10').isVisible());
  await page.waitForLoadState('networkidle');
  await page.screenshot({path:path.join(output,'taller-movil.png')});
}
