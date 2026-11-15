import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const directory = "artifacts/cinematic-after";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const findings = [];
try {
  for (const [width, height] of [[1920,1080],[1440,900],[1024,768],[390,844],[360,800]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.goto(process.env.ORBITCARE_AUDIT_URL || "http://127.0.0.1:3000");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".mission-space canvas")).toBeAttached();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${directory}/opening-${width}.png` });
    await page.locator(".mission-intro").screenshot({ path: `${directory}/intro-${width}.png` });
    findings.push({ width, height, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), webgl: await page.locator(".space-canvas").getAttribute("class"), errors });
    await page.getByRole("button", { name: "Explore Mission Demo", exact: true }).click();
    await expect(page.locator(".mission-tour")).toBeVisible();
    await page.screenshot({ path: `${directory}/tour-reference-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: "Next: Observe", exact: true }).click();
    await page.getByRole("button", { name: /Day 23 Persistence/ }).click();
    await page.screenshot({ path: `${directory}/tour-observe-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: "Next: Explain", exact: true }).click();
    await page.screenshot({ path: `${directory}/tour-explain-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: "Exit walkthrough", exact: true }).click();
    await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
    await page.screenshot({ path: `${directory}/replay-${width}.png`, fullPage: true });
    for (const [name, id] of [["Health explorer","explorer"],["NASA research","research"],["Help a crewmate","crew"]]) {
      await page.getByRole("button", { name, exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: `${directory}/${id}-${width}.png`, fullPage: true });
    }
    await context.close();
  }
  const fallback = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await fallback.addInitScript(() => { const get = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type === "webgl" || type === "webgl2" ? null : get.call(this,type,...args); }; });
  const page = await fallback.newPage(); await page.goto(process.env.ORBITCARE_AUDIT_URL || "http://127.0.0.1:3000");
  await expect(page.locator(".space-canvas")).not.toHaveClass(/ready/);
  await page.screenshot({ path: `${directory}/fallback-1440.png` });
  await fallback.close();
  await writeFile(`${directory}/findings.json`, JSON.stringify(findings, null, 2));
  console.log(JSON.stringify(findings, null, 2));
} finally { await browser.close(); }
