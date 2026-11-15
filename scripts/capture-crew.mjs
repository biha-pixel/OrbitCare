import { chromium, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";

const directory = "artifacts/presentation";
const capture = JSON.parse(await readFile(`${directory}/capture.json`, "utf8"));
const source = process.env.ORBITCARE_DEMO_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(source);
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await page.getByRole("button", { name: "Start Crew Emergency Drill", exact: true }).click();
  await expect(page.locator(".drill-banner")).toContainText("Simulation / training only");
  await page.evaluate(() => document.fonts.ready);
  for (const [name, selector] of [["crew-guidance", ".crew-guidance"], ["crew-drill", ".crew-drill-brief"]]) {
    await page.locator(selector).screenshot({ path: `${directory}/assets/${name}.png`, animations: "disabled" });
    capture.assets[name] = `${directory}/assets/${name}.png`;
  }
  await page.getByRole("button", { name: "Continue drill: record observations", exact: true }).click();
  await expect(page.getByLabel("Measured observations", { exact: false })).toHaveValue("");
  await expect(page.getByLabel("User-reported contact status", { exact: true })).toHaveValue("unknown");
  await page.getByRole("button", { name: "Prepare handoff", exact: true }).click();
  await expect(page.locator(".handoff-overview")).toContainText("Unknown / not recorded");
  await page.locator(".handoff-overview").screenshot({ path: `${directory}/assets/crew-handoff.png`, animations: "disabled" });
  capture.assets["crew-handoff"] = `${directory}/assets/crew-handoff.png`;
  capture.crewAssist = { capturedAt: new Date().toISOString(), source, scenario: "Deterministic fictional Mars day-24 Crew Emergency Drill", syntheticOnly: true, measurementsSupplied: false, contactStatus: "unknown", historicalContextSelected: false };
  await writeFile(`${directory}/capture.json`, JSON.stringify(capture, null, 2));
  console.log("Captured actual Crew Assist drill guidance and unknown-observation handoff; no vital signs or contact invented.");
} finally { await browser.close(); }
