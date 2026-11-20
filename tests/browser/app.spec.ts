import { test, expect } from '@playwright/test';
test('operating controls, architecture switch, learning, sources and comparison',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text()+' '+m.location().url);});
 await page.goto('/');await expect(page.getByRole('heading',{name:'The engine room. Take control.'})).toBeVisible();
 await expect(page.locator('[data-spool]')).toHaveCount(3);await expect(page.locator('[data-component="ipc"]')).toHaveAttribute('data-shaft','ip');
 await expect(page.getByLabel('Throttle')).toBeDisabled();
 await page.screenshot({path:'test-results/desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Start engine',exact:true}).click();await expect(page.getByLabel('Throttle')).toBeEnabled();
 await page.getByLabel('Throttle').fill('70');await expect(page.getByText('70% command')).toBeVisible();
 await page.waitForTimeout(1600);await page.getByRole('button',{name:'Pause',exact:true}).click();
 const paused=await page.getByTestId('gauge-N3 · HP speed').textContent();await page.waitForTimeout(300);await expect(page.getByTestId('gauge-N3 · HP speed')).toHaveText(paused!);
 await page.getByRole('button',{name:'¼× Slow'}).click();await expect(page.getByRole('button',{name:'¼× Slow'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Resume',exact:true}).click();await page.getByRole('button',{name:'Stop engine',exact:true}).click();await expect(page.getByRole('status',{name:'Engine state'})).toContainText('Spooling down');
 await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.getByRole('status',{name:'Engine state'})).toHaveText('Engine off');await expect(page.getByTestId('gauge-N3 · HP speed')).toHaveText('0');
 for(const name of ['Airflow','Shafts','Labels','Casing']){await page.getByLabel(name,{exact:true}).uncheck();await expect(page.getByLabel(name,{exact:true})).not.toBeChecked();}await expect(page.getByTestId('airflow')).toHaveCount(0);await expect(page.getByTestId('shafts')).toHaveCount(0);await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.getByRole('button',{name:'Follow the air · Start tour'}).click();await expect(page.getByRole('heading',{name:'One entrance. Two paths.'})).toBeVisible();for(let i=0;i<4;i++)await page.getByRole('button',{name:'Next section'}).click();await expect(page.getByText('Guided tour · 5 of 5')).toBeVisible();await page.getByRole('button',{name:'Finish tour'}).click();
 await page.getByRole('button',{name:'Explore combustion',exact:true}).click();await expect(page.getByText('Fuel mixes with compressed air', {exact:false})).toBeVisible();
 await page.getByLabel('EXPLORE AN ENGINE').selectOption('genx');await expect(page.locator('[data-spool]')).toHaveCount(2);await expect(page.locator('[data-component="booster"]')).toHaveAttribute('data-shaft','lp');await expect(page.locator('[data-component="ipt"]')).toHaveCount(0);await expect(page.getByText('Boeing 787-8',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Start engine',exact:true}).click();await page.getByLabel('Throttle').focus();await page.keyboard.press('ArrowRight');await expect(page.getByLabel('Throttle')).toHaveValue('1');await page.getByRole('button',{name:'Reset',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('status',{name:'Engine state'})).toHaveText('Engine off');
 await page.screenshot({path:'test-results/genx.png',fullPage:true});
 await page.getByRole('button',{name:'Compare engines',exact:true}).click();await expect(page.getByRole('cell',{name:'1 fan / 4 booster / 10 HP'})).toBeVisible();await expect(page.getByRole('cell',{name:'1 HP / 2 IP / 6 LP'})).toBeVisible();await page.screenshot({path:'test-results/compare.png',fullPage:true});
 await page.getByRole('button',{name:'Sources & accuracy',exact:true}).click();await expect(page.getByRole('link',{name:/UK CAA/})).toHaveAttribute('href',/caa.co.uk/);expect(errors).toEqual([]);
});
test('mobile layout and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.getByText('Reduced motion:',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await page.getByRole('button',{name:'Start engine',exact:true}).click();const path=page.locator('[data-testid="airflow"] path[stroke-dashoffset]').first();const offset=await path.getAttribute('stroke-dashoffset');await page.waitForTimeout(1000);await expect(path).toHaveAttribute('stroke-dashoffset',offset!);await page.screenshot({path:'test-results/mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Explore HP compressor',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:'Prepare the air for combustion.'})).toBeVisible();
 await page.getByLabel('EXPLORE AN ENGINE').selectOption('genx');await expect(page.locator('[data-spool]')).toHaveCount(2);
});

test('both airflow routes traverse their intended assemblies',async({page})=>{
 await page.goto('/');
 for(const engine of ['trent','genx']){
  await page.getByLabel('EXPLORE AN ENGINE').selectOption(engine);
  const result=await page.evaluate(()=>{
   const core=document.querySelector('[data-flow="core"]') as SVGPathElement;
   const bypass=document.querySelector('[data-flow="bypass"]') as SVGPathElement;
   const samples=(path:SVGPathElement)=>Array.from({length:1500},(_,i)=>path.getPointAtLength(i/1499*path.getTotalLength()));
   const corePoints=samples(core),bypassPoints=samples(bypass);
   const bounds=[...document.querySelectorAll('[data-component]')].map(g=>({id:g.getAttribute('data-component'),r:(g.querySelector('rect') as SVGRectElement)}));
   return {components:bounds.map(({id,r})=>{const center=r.x.baseVal.value+r.width.baseVal.value/2;const point=corePoints.reduce((a,b)=>Math.abs(a.x-center)<Math.abs(b.x-center)?a:b);return {id,inside:point.y>=r.y.baseVal.value&&point.y<=r.y.baseVal.value+r.height.baseVal.value};}),bypassAvoidsCombustor:bypassPoints.filter(p=>p.x>=548&&p.x<=633).every(p=>p.y<164),coreEntersCombustor:corePoints.some(p=>p.x>=548&&p.x<=633&&p.y>=164&&p.y<=210)};
  });
  expect(result.components.every(c=>c.inside),JSON.stringify(result.components)).toBe(true);expect(result.bypassAvoidsCombustor).toBe(true);expect(result.coreEntersCombustor).toBe(true);
 }
});


test('engine sound can be enabled, switched and muted without browser errors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await page.getByRole('button',{name:'Enable sound',exact:true}).click();await expect(page.getByRole('button',{name:'Sound on',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Start engine',exact:true}).click();await page.getByLabel('Throttle').fill('60');await page.waitForTimeout(400);
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByLabel('EXPLORE AN ENGINE').selectOption('genx');await page.getByRole('button',{name:'Start engine',exact:true}).click();await page.waitForTimeout(400);
 await page.getByRole('button',{name:'Sound on',exact:true}).click();await expect(page.getByRole('button',{name:'Enable sound',exact:true})).toHaveAttribute('aria-pressed','false');expect(errors).toEqual([]);await expect(page.getByRole('alert')).toHaveCount(0);
});
test('temperature unit switch updates panel and engine callouts',async({page})=>{await page.goto('/');const panel=page.getByRole('region',{name:'Section temperatures'});await expect(panel.locator('strong').first()).toHaveText('20 °C');await page.getByRole('button',{name:'°F',exact:true}).click();await expect(panel.locator('strong').first()).toHaveText('68 °F');await expect(page.locator('.heat-callouts')).toContainText('68 °F');await page.getByRole('button',{name:'°C',exact:true}).click();await expect(panel.locator('strong').first()).toHaveText('20 °C');});
