// Genuine screenshots only: a fresh browser context with the shipped synthetic fixture.
import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const baseURL = process.env.ORBITCARE_AUDIT_URL || "http://127.0.0.1:3000";
await mkdir("docs/images", { recursive: true });
await mkdir("artifacts/release-audit/screenshots", { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await context.newPage();
const captures = [];
try {
  await page.goto(baseURL);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  async function capture(name, description) {
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `artifacts/release-audit/screenshots/${name}.png`, animations: "disabled" });
    const bytes = await page.screenshot({ path: `docs/images/${name}.jpg`, type: "jpeg", quality: 82, animations: "disabled" });
    captures.push({ name, description, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
  }
  await expect(page.locator(".mission-intro")).toBeVisible();
  await capture("mission-overview", "Actual optional procedural mission opening; artwork is visibly disclosed.");
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  await expect(page.getByRole("button", { name: "Investigate the change", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await page.getByText("Complete day-by-day record", { exact: true }).click();
  await page.getByRole("button", { name: /^Mission day 24(?:,|$)/ }).click();
  await page.locator(".investigation > summary").click();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await capture("health-review", "Shipped synthetic sustained-change fixture explicitly selected at mission day 24.");
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await page.locator(".replay-story").scrollIntoViewIfNeeded();
  await capture("decision-replay", "Actual as-of decision replay and investigation for the default synthetic fixture.");
  await page.getByRole("button", { name: "Health explorer", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".body-map")).toBeVisible();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await capture("health-explorer", "Actual schematic educational selector; highlights are navigation, not organ-health conclusions.");
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Help a crewmate.", exact: true })).toBeVisible();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await capture("crew-assist", "Actual urgent-procedure signpost before optional fictional documentation.");
  await page.getByRole("button", { name: "NASA research", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A record across sampling visits", exact: true })).toBeVisible();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await capture("nasa-research", "Actual separate original-value OSD-575 research explorer.");
  await page.getByRole("button", { name: "Mission overview", exact: true }).click();
  await page.setViewportSize({ width: 1280, height: 640 });
  await capture("social-preview", "Unaltered 1280 by 640 actual application screenshot for optional GitHub social preview.");
  const manifest = { capturedAt: new Date().toISOString(), baseURL, sourceRevision: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), postSubmissionPreparation: true, viewport: "1600x1000; social-preview 1280x640", context: "Fresh isolated browser, default shipped synthetic fixture, no imported or real user records", captures };
  await writeFile("artifacts/release-audit/screenshot-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  console.log(JSON.stringify(captures.map(({ name, bytes }) => ({ name, bytes })), null, 2));
} finally { await context.close(); await browser.close(); }
