import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const phase = process.env.ORBITCARE_AUDIT_PHASE || "baseline";
const directory = `artifacts/upgrade-${phase}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const findings = [];
try {
  for (const [width, height] of [[1440,900],[1920,1080],[1024,768],[390,844],[360,800]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(process.env.ORBITCARE_AUDIT_URL || "http://127.0.0.1:3000");
    await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${directory}/monitor-${width}.png`, fullPage: true });
    await page.screenshot({ path: `${directory}/opening-${width}.png` });
    findings.push(await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, contentHeight: document.documentElement.scrollHeight, heading: document.querySelector("h1")?.getBoundingClientRect().toJSON(), charts: [...document.querySelectorAll(".plot")].map(element => element.getBoundingClientRect().toJSON()), explanation: document.querySelector(".explanation")?.getBoundingClientRect().toJSON() })));
    await page.getByRole("button", { name: "Record check-in", exact: true }).click();
    await page.screenshot({ path: `${directory}/checkin-${width}.png` });
    await page.keyboard.press("Escape");
    if (width === 1440 || width === 390) for (const [name, id] of [["NASA research","research"],["Method & evidence","method"],["Your data","data"]]) {
      await page.getByRole("button", { name, exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      await page.screenshot({ path: `${directory}/${id}-${width}.png`, fullPage: true });
    }
    await context.close();
  }
  await writeFile(`${directory}/layout-measurements.json`, JSON.stringify(findings, null, 2));
  console.log(`Captured ${phase}: five viewports, monitor/opening/check-in and desktop/mobile supporting views.`);
} finally { await browser.close(); }
