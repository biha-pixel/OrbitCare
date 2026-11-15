import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const base = process.env.ORBITCARE_DEMO_URL || "http://127.0.0.1:3000";
await mkdir("artifacts/demo", { recursive: true });
await mkdir("public/demo", { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1600, height: 1200 }, recordVideo: { dir: "artifacts/demo", size: { width: 1600, height: 1200 } } });
const page = await context.newPage();
const recordingStarted = Date.now();
const video = page.video();
async function caption(text) {
  await page.evaluate(text => {
    let node = document.getElementById("capture-caption");
    if (!node) { node = document.createElement("div"); node.id = "capture-caption"; document.body.append(node); }
    node.textContent = text;
    node.style.cssText = "position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#122235;color:white;padding:18px 28px;font:500 22px/1.4 'IBM Plex Sans',sans-serif;text-align:center;box-shadow:0 -2px 10px #12223522;pointer-events:none";
  }, text);
}
async function prepare() {
  await page.evaluate(() => { document.documentElement.style.zoom = ".88"; window.scrollTo(0, 0); });
}
try {
  await page.goto(base);
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  await page.getByRole("button", { name: "Stable", exact: true }).click();
  await prepare();
  await caption("OrbitCare · Understand personal change, even offline.");
  const start = Date.now();
  const until = async seconds => { const wait = start + seconds * 1000 - Date.now(); if (wait > 0) await page.waitForTimeout(wait); };
  await until(3);
  await page.getByRole("button", { name: "Sustained change", exact: true }).click();
  await caption("Simulated readings depart from a fixed personal reference.");
  await until(7);
  await page.getByRole("button", { name: "Mission day 24, review suggested", exact: true }).click();
  await caption("Three consecutive changed days suggest review. No diagnosis.");
  await until(10);
  await page.screenshot({ path: "artifacts/demo/personal-comparison.png" });
  await caption("Inspect the difference, persistence, and transparent prototype rule.");
  await until(14);
  await context.setOffline(true);
  await page.reload();
  await prepare();
  await expect(page.getByText("Browser offline", { exact: true })).toBeVisible();
  await caption("Network disconnected. Reloaded from the prepared offline application.");
  await until(19);
  await page.getByLabel("Review note", { exact: false }).fill("Verify resting conditions; follow mission review procedures.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await caption("Review recorded locally while offline. Nothing sent to Earth.");
  await page.evaluate(() => window.scrollTo(0, 0));
  await until(24);
  await caption("Notice. Explain. Record a review. · Research prototype, not a medical system.");
  await page.screenshot({ path: "artifacts/demo/offline-review.png" });
  await until(28.4);
  const trim = Math.max(0, (start - recordingStarted) / 1000);
  await context.close();
  const path = await video.path();
  // Closing/flushing the recorder can append frames. Trim the measured setup
  // interval, never totalDuration-minus-actionTime (which would cut the intro).
  const encoded = spawnSync("ffmpeg", ["-y", "-ss", String(trim), "-i", path, "-t", "28.4", "-vf", "scale=1600:1200", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", "public/demo/OrbitCare-demo.mp4"], { encoding: "utf8" });
  if (encoded.status !== 0) throw new Error(encoded.stderr);
  const final = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration,size", "-of", "json", "public/demo/OrbitCare-demo.mp4"], { encoding: "utf8" });
  const result = { ...JSON.parse(final.stdout).format, capturedAt: new Date().toISOString(), source: base, networkDisconnection: "Playwright context.setOffline(true), followed by real reload and local review save", captionOverlay: "English captions added during actual UI capture", audio: "none" };
  if (Number(result.duration) > 30) throw new Error("Demo exceeds 30 seconds.");
  await writeFile("artifacts/demo/verification.json", JSON.stringify(result, null, 2));
  console.log(result);
} finally { await browser.close(); }
