import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
try {
  const page=await browser.newPage();
  const response=await page.goto('https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=resources',{waitUntil:'networkidle',timeout:60000});
  const result={status:response.status(),url:page.url(),text:await page.locator('body').innerText(),links:await page.locator('a[href]').evaluateAll(elements=>elements.map(e=>({text:e.textContent,url:e.href})).filter(e=>/nasa.gov|asc-csa|pdf|health-monitoring/.test(e.url)))};
  await mkdir('artifacts/judge-final',{recursive:true});
  await writeFile('artifacts/judge-final/challenge-resource-inspection.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
} finally {await browser.close();}
