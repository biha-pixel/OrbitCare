import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const directory = "artifacts/presentation";
await mkdir(`${directory}/assets`, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, reducedMotion: "reduce", recordVideo: { dir: `${directory}/raw`, size: { width: 1920, height: 1080 } } });
const page = await context.newPage();
const recordingStarted = Date.now();
const recording = page.video();
const assets = {};
async function capture(name, selector) {
  const element = page.locator(selector).first();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(60);
  if (selector === ".replay-story") {
    await element.scrollIntoViewIfNeeded();
    const clip = await element.evaluate(el => { const box=el.getBoundingClientRect(); const text=el.querySelector('p').getBoundingClientRect(); return {x:box.x,y:box.y,width:Math.min(box.width,text.right-box.left+24),height:box.height}; });
    await page.screenshot({ path: `${directory}/assets/${name}.png`, clip, animations: "disabled" });
  } else await element.screenshot({ path: `${directory}/assets/${name}.png`, animations: "disabled" });
  assets[name] = `${directory}/assets/${name}.png`;
}
async function day24() { await page.getByRole("button", { name: /^Mission day 24(?:,|$)/ }).click(); }
try {
  await page.goto(process.env.ORBITCARE_DEMO_URL || "http://127.0.0.1:3000");
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  await capture("opening", ".change-brief");
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await page.getByRole("button", { name: "Stable", exact: true }).click(); await day24();
  await capture("stable-record", ".record-surface");
  for (let i = 0; i < 3; i++) await capture(`stable-metric-${i}`, `.brief-metric:nth-of-type(${i + 1})`);
  await page.getByRole("button", { name: "Sustained change", exact: true }).click(); await day24();
  for (const selectedDay of [14,22,23,24]) {
    await page.getByRole("button", { name: new RegExp(`^Mission day ${selectedDay}(?:,|$)`) }).click();
    await capture(`story-${selectedDay}`, ".replay-story");
  }
  await page.getByRole("button", { name: "Start at the reference", exact: true }).click();
  await page.locator(".timeline").evaluate(element => element.scrollIntoView({block:"center",behavior:"instant"}));
  const replayBox = await page.locator(".replay-story").evaluate(el => { const box=el.getBoundingClientRect(); const text=el.querySelector('p').getBoundingClientRect(); return {x:box.x,y:box.y,width:Math.min(box.width,text.right-box.left+24),height:box.height}; });
  const replayStart = (Date.now() - recordingStarted) / 1000;
  await page.waitForTimeout(650);
  await page.getByRole("button", { name: "Next turning point", exact: false }).click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Next turning point", exact: false }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Next turning point", exact: false }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Next turning point", exact: false }).click();
  await page.waitForTimeout(900);
  const replayDuration = (Date.now() - recordingStarted) / 1000 - replayStart;
  await capture("change-brief", ".change-brief");
  await capture("change-record", ".record-surface");
  for (let i = 0; i < 3; i++) await capture(`change-metric-${i}`, `.brief-metric:nth-of-type(${i + 1})`);
  for (const [name, selector] of [["comparison", ".comparison-flow"],["difference", ".comparison"],["coverage", ".reference-coverage"],["persistence", ".persistence"],["rule", ".rule-details"],["timeline", ".timeline"],["explanation", ".explanation"]]) await capture(name, selector);
  await page.locator(".rule-details").scrollIntoViewIfNeeded();
  const ruleBox = await page.locator(".rule-details").evaluate(element => {
    const first = element.querySelector("p").getBoundingClientRect();
    const last = element.querySelector(".assumption-label").getBoundingClientRect();
    return { x: first.left, y: first.top, width: first.width, height: last.bottom - first.top };
  });
  await page.screenshot({ path: `${directory}/assets/rule-body.png`, clip: ruleBox });
  assets["rule-body"] = `${directory}/assets/rule-body.png`;
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  await page.getByText("How to measure and record", { exact: true }).click();
  await capture("guide-choices", ".guide-choices");
  await capture("guide-method", ".guide-reading dl>div:nth-child(2)");
  await capture("guide-equipment", ".guide-reading dl>div:nth-child(3)");
  await capture("guide-quality", ".guide-reading dl>div:nth-child(4)");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Health explorer", exact: true }).click();
  await expect(page.locator(".system-panel h2")).toHaveText("Cardiovascular");
  await capture("body-map", ".body-stage");
  await capture("body-source", ".research-context-card");
  await capture("body-record", ".system-panel .metric-row");
  await capture("body-limit", ".system-limit");
  await page.getByRole("button", { name: "Explore sleep and fatigue region", exact: true }).click();
  await capture("body-sleep", ".body-stage");
  await page.getByRole("button", { name: "Urgent concern", exact: true }).click();
  await capture("urgent-boundary", ".urgent-boundary");
  await capture("urgent-direction", ".urgent-lead");
  await capture("urgent-no-contact", ".urgent-facts>p:first-child");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Health review", exact: true }).click();
  await page.getByRole("button", { name: "Missing data", exact: true }).click();
  await capture("missing-record", ".record-surface");
  await capture("missing-brief", ".change-brief");
  await page.locator(".research-connections > summary").click();
  await capture("nasa-connection", ".connections-grid article:first-child");
  await page.getByRole("button", { name: "NASA research", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A record across sampling visits" })).toBeVisible();
  await capture("research-plot", ".research-plot");
  for (let i = 0; i < 4; i++) await capture(`research-participant-${i}`, `.research-legend button:nth-of-type(${i + 1})`);
  await capture("research-observation", ".observation-readout");
  await capture("research-caveat", ".research-callout");
  await context.setOffline(true);
  await page.reload();
  await page.locator(".investigation > summary").click();
  await expect(page.getByText("Browser offline", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Sustained change", exact: true }).click(); await day24();
  await capture("offline-status", ".topbar-status");
  await page.evaluate(() => { document.documentElement.style.zoom = "1.4"; });
  await page.locator(".review-form").evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  const box = await page.locator(".review-form").boundingBox();
  const actionStart = (Date.now() - recordingStarted) / 1000;
  const wallStart = Date.now();
  await page.waitForTimeout(350);
  const note = "Verify resting conditions. Follow mission review procedures.";
  await page.getByLabel("Review note", { exact: false }).pressSequentially(note, { delay: 18 });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await page.waitForTimeout(Math.max(0, wallStart + 4400 - Date.now()));
  // Keep the recorded form stationary beyond the encoded interval; reload is
  // separate proof and must not enter the cropped action clip's final frame.
  await page.waitForTimeout(2000);
  await page.reload();
  await page.locator(".investigation > summary").click();
  await expect(page.getByText("Browser offline", { exact: true })).toBeVisible();
  await expect(page.getByText(note, { exact: true })).toBeVisible();
  await day24();
  await capture("persisted-review", ".history-panel");
  await capture("timeline-reviewed", ".timeline");
  const offline = await page.evaluate(() => navigator.onLine === false);
  await context.close();
  await writeFile(`${directory}/capture.json`, JSON.stringify({ assets, source: process.env.ORBITCARE_DEMO_URL || "http://127.0.0.1:3000", capturedAt: new Date().toISOString(), scenario: "Synthetic sustained change, mission day 24", replay: { start: replayStart, duration: replayDuration, box: replayBox }, action: { sourceVideo: await recording.path(), start: actionStart, duration: 4.4, box, note }, offline: { networkDisconnected: offline, realReloadBeforeReview: true, savedReviewSurvivedSecondReload: true } }, null, 2));
  console.log("Captured final UI closeups and actual offline review video; persistence verified after a second offline reload.");
} finally { await browser.close(); }
