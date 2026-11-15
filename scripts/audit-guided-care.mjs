import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const directory = `artifacts/alignment-${process.env.ORBITCARE_ALIGNMENT_PHASE || "first-pass"}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const layouts = [];
try {
  for (const [width,height] of [[1440,900],[1920,1080],[1024,768],[390,844],[360,800]]) {
    const page = await browser.newPage({ viewport: { width,height } });
    await page.goto(process.env.ORBITCARE_AUDIT_URL || "http://127.0.0.1:3000");
    await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${directory}/monitor-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: "Health explorer", exact: true }).click();
    await expect(page.locator(".system-panel h2")).toHaveText("Cardiovascular");
    await page.screenshot({ path: `${directory}/explorer-${width}.png`, fullPage: true });
    layouts.push(await page.evaluate(() => ({ width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,bodyMap:document.querySelector(".body-map").getBoundingClientRect().toJSON(),systemPanel:document.querySelector(".system-panel").getBoundingClientRect().toJSON() })));
    if(width===1440||width===390) {
      await page.getByRole("button", { name: "Explore sleep and fatigue region", exact: true }).click();
      await page.screenshot({ path: `${directory}/sleep-${width}.png`, fullPage: true });
      await page.getByRole("button", { name: "Explore activity and muscle region", exact: true }).click();
      await page.screenshot({ path: `${directory}/activity-${width}.png`, fullPage: true });
    }
    await page.getByRole("button", { name: "Urgent concern", exact: true }).click();
    await page.screenshot({ path: `${directory}/urgent-${width}.png` });
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Health review", exact: true }).click();
    await page.getByRole("button", { name: "Record check-in", exact: true }).click();
    await page.getByText("How to measure and record", { exact: true }).click();
    await page.screenshot({ path: `${directory}/guide-${width}.png` });
    await page.close();
  }
  await writeFile(`${directory}/layout-measurements.json`,JSON.stringify(layouts,null,2));
  console.log(`Captured guided care, urgent concern and body explorer at all five sizes: ${directory}`);
} finally { await browser.close(); }
