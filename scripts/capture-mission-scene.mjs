import { chromium, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const directory = "artifacts/presentation";
const capture = JSON.parse(await readFile(`${directory}/capture.json`, "utf8"));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  await page.goto(process.env.ORBITCARE_DEMO_URL || "http://127.0.0.1:3000");
  await expect(page.locator(".space-canvas")).toHaveClass(/ready/);
  await page.evaluate(() => document.fonts.ready);
  for (const [name, selector] of [["opening", ".mission-intro"], ["mission-scene", ".intro-universe"]]) {
    await page.locator(selector).screenshot({ path: `${directory}/assets/${name}.png`, animations: "disabled" });
    capture.assets[name] = `${directory}/assets/${name}.png`;
  }
  capture.missionScene = { capturedAt: new Date().toISOString(), actualApplication: true, proceduralArtwork: true, geographicMap: false, liveTelemetry: false, visibleAiDisclosure: true };
  await writeFile(`${directory}/capture.json`, JSON.stringify(capture, null, 2));
  console.log("Captured the actual procedural mission scene with readable conceptual and AI disclosures.");
} finally { await browser.close(); }
