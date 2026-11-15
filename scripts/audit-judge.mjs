import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const directory = process.env.ORBITCARE_JUDGE_DIRECTORY || 'artifacts/judge-final';
await mkdir(directory, {recursive:true});
const browser = await chromium.launch();
const findings=[];
try {
  for (const [width,height] of [[1440,900],[1920,1080],[390,844],[360,800]]) {
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
    const page=await context.newPage();
    await page.goto(process.env.ORBITCARE_AUDIT_URL || 'http://127.0.0.1:3001');
    await expect(page.getByRole('button',{name:'Record check-in',exact:true})).toBeEnabled();
    await expect(page.locator('.cache-readiness').filter({hasText:'Offline ready'})).toBeVisible({timeout:45000});
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:`${directory}/opening-${width}.png`});
    findings.push(await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,action:document.querySelector('.brief-action').getBoundingClientRect().toJSON()})));
    await page.getByRole('button',{name:'Investigate the change',exact:true}).click();
    await page.getByRole('button',{name:'Start at the reference',exact:true}).click();
    for(let i=0;i<4;i++) await page.getByRole('button',{name:'Next turning point',exact:false}).click();
    await page.locator('.timeline').screenshot({path:`${directory}/replay-${width}.png`});
    await page.locator('.explanation').screenshot({path:`${directory}/explanation-${width}.png`});
    await page.locator('.research-connections > summary').click();
    await page.locator('.research-connections').screenshot({path:`${directory}/evidence-${width}.png`});
    await page.getByRole('button',{name:'Health explorer',exact:true}).click();
    await expect(page.locator('.system-panel h2')).toHaveText('Cardiovascular');
    await page.screenshot({path:`${directory}/explorer-${width}.png`,fullPage:true});
    await context.close();
  }
  const motionContext=await browser.newContext({reducedMotion:'no-preference'});
  const motionPage=await motionContext.newPage();
  await motionPage.goto(process.env.ORBITCARE_AUDIT_URL || 'http://127.0.0.1:3001');
  const logo=await motionPage.locator('.brand-mark').evaluate(element => {
    const planet=getComputedStyle(element.querySelector('.brand-planet'));
    const trace=getComputedStyle(element.querySelector('.brand-trace'));
    return {planet:{name:planet.animationName,iterations:planet.animationIterationCount,duration:planet.animationDuration},pulse:{name:trace.animationName,iterations:trace.animationIterationCount,duration:trace.animationDuration}};
  });
  expect(logo.planet).toEqual({name:'brand-orbit-loop',iterations:'infinite',duration:'7s'});
  expect(logo.pulse).toEqual({name:'heartbeat',iterations:'infinite',duration:'1.8s'});
  const originalTransform=await motionPage.locator('.brand-trace').evaluate(element=>getComputedStyle(element).transform);
  await expect.poll(()=>motionPage.locator('.brand-trace').evaluate(element=>getComputedStyle(element).transform)).not.toBe(originalTransform);
  await motionPage.emulateMedia({reducedMotion:'reduce'});
  expect(await motionPage.locator('.brand-trace').evaluate(element=>getComputedStyle(element).animationName)).toBe('none');
  expect(await motionPage.locator('.brand-planet').evaluate(element=>getComputedStyle(element).animationName)).toBe('none');
  await writeFile(`${directory}/logo-motion.json`,JSON.stringify({...logo,reducedMotionDisablesBoth:true,actualPulseMovementVerified:true},null,2));
  await motionContext.close();
  await writeFile(`${directory}/layout.json`,JSON.stringify(findings,null,2));
  console.log(`Captured opening, replay, explanation, evidence and explorer at four sizes in ${directory}.`);
} finally {await browser.close();}
