import {test,expect} from '@playwright/test';
test('capture original website screenshots for the README',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('button',{name:'Start engine',exact:true}).click();await page.getByLabel('Throttle').fill('65');await page.waitForTimeout(8000);await page.getByRole('button',{name:'Pause',exact:true}).click();
 await page.screenshot({path:'docs/images/simulator-trent.png'});
 await page.getByLabel('EXPLORE AN ENGINE').selectOption('genx');await page.getByRole('button',{name:'Explore HP turbine',exact:true}).click();await page.getByRole('button',{name:'Start engine',exact:true}).click();await page.getByLabel('Throttle').fill('55');await page.waitForTimeout(4000);await page.getByRole('button',{name:'Pause',exact:true}).click();await page.locator('.workspace').screenshot({path:'docs/images/simulator-genx.png'});
 await page.getByRole('button',{name:'Compare engines',exact:true}).click();await expect(page.locator('table')).toBeVisible();await page.locator('.reference-section').screenshot({path:'docs/images/comparison.png'});
});
