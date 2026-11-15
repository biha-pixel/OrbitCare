import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
});

test("scenario decisions, timeline replay, and no future observations", async ({ page }) => {
  await expect(page.getByText("3 indicators suggest a closer look.")).toBeVisible();
  await page.getByRole("button", { name: "Mission day 22", exact: true }).click();
  await expect(page.getByText("A change is emerging in the record.")).toBeVisible();
  await page.getByText("Inspect the monitoring data table", { exact: true }).click();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(23);
  await page.getByRole("button", { name: "Mission day 24,", exact: false }).click();
  await expect(page.getByText("3 indicators suggest a closer look.")).toBeVisible();
  await page.getByRole("button", { name: "Stable", exact: true }).click();
  await expect(page.getByText("Within the current comparison rules.")).toBeVisible();
  await page.getByRole("button", { name: "Missing data", exact: true }).click();
  await expect(page.getByText("An incomplete picture needs context.")).toBeVisible();
  await page.getByRole("button", { name: "Return to reference", exact: true }).click();
  await expect(page.getByText("Within the current comparison rules.")).toBeVisible();
  await page.getByRole("button", { name: "Mission day 21, review suggested", exact: true }).click();
  await expect(page.getByText("3 indicators suggest a closer look.")).toBeVisible();
});

test("check-ins validate, persist, and require deliberate edits", async ({ page }) => {
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  await page.getByLabel("Mission day", { exact: true }).fill("29");
  await page.locator('input[name="heartRate"]').fill("72");
  await page.locator('input[name="sleep"]').fill("0");
  await page.locator('select[name="fatigue"]').selectOption("4");
  await page.locator('input[name="exercise"]').fill("0");
  await page.getByRole("button", { name: "Save check-in", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Check-in recorded for mission day 29" })).toBeVisible();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Mission day 29", exact: false })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  await page.getByRole("button", { name: "Save check-in", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Confirm replacement");
  await page.getByLabel("Replace the existing check-in", { exact: false }).check();
  await page.locator('input[name="heartRate"]').fill("60");
  await page.getByRole("button", { name: "Save check-in", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("local review records do not clear flags", async ({ page }) => {
  await page.getByLabel("Review note", { exact: false }).fill("Repeat under comparable resting conditions.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("3 indicators suggest a closer look.")).toBeVisible();
  await expect(page.getByText("Repeat under comparable resting conditions.", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Repeat under comparable resting conditions.", { exact: true })).toBeVisible();
});

test("NASA observations and evidence are separated and inspectable", async ({ page }) => {
  await page.getByRole("button", { name: "NASA research", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Real observations. A different kind of context." })).toBeVisible();
  await expect(page.getByText("Four participants. Three days in space.", { exact: true })).toBeVisible();
  await page.getByText("Inspect all 28 sodium observations", { exact: true }).click();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(5);
  await expect(page.getByRole("row").filter({ hasText: "C001" })).toContainText("141");
  await page.getByRole("button", { name: "Potassium", exact: true }).click();
  await expect(page.getByRole("row").filter({ hasText: "C001" })).toContainText("4.6");
  await page.getByRole("button", { name: "Method & evidence", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Every flag has a paper trail." })).toBeVisible();
  await expect(page.getByText("Engineering assumptions, not medical thresholds.", { exact: true })).toBeVisible();
});

test("export, validated import, and reset preserve workspace separation", async ({ page }) => {
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export workspace JSON", exact: true }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  page.once("dialog", dialog => dialog.accept());
  await page.getByLabel("Import workspace JSON file").setInputFiles(path!);
  await expect(page.getByLabel("Open a workspace")).toHaveValue(/.+/);
  await expect(page.getByLabel("Open a workspace").locator("option:checked")).toContainText("imported");
  const before = await page.getByLabel("Open a workspace").locator("option").count();
  await page.getByLabel("Import workspace JSON file").setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from('{"schemaVersion":99}') });
  await expect(page.getByRole("alert").filter({ hasText: "Import rejected" })).toBeVisible();
  await expect(page.getByLabel("Open a workspace").locator("option")).toHaveCount(before);
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Reset current workspace", exact: true }).click();
  await expect(page.getByText("Workspace reset. Offline assets remain available.")).toBeVisible();
});

test("empty custom workspace has honest missing and reference states", async ({ page }) => {
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  await page.getByRole("button", { name: "Create an empty test workspace", exact: true }).click();
  await expect(page.getByText("Establishing a personal reference.")).toBeVisible();
  await expect(page.getByText("User-entered test workspace", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  await page.getByLabel("Mission day", { exact: true }).fill("15");
  await page.locator('input[name="heartRate"]').fill("60");
  await page.getByRole("button", { name: "Save check-in", exact: true }).click();
  await expect(page.getByText("An incomplete picture needs context.")).toBeVisible();
});

test("production app reopens offline, saves, exports, and opens uncached views", async ({ page, context }) => {
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 30000 });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("Browser offline", { exact: true })).toBeVisible();
  await expect(page.getByText("3 indicators suggest a closer look.")).toBeVisible();
  await page.getByLabel("Review note", { exact: false }).fill("Offline follow-up recorded.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Offline follow-up recorded.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "NASA research", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A record across sampling visits" })).toBeVisible();
  await page.getByRole("button", { name: "Method & evidence", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Every flag has a paper trail." })).toBeVisible();
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export workspace JSON", exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toContain("OrbitCare");
});

test("fresh offline browser cannot claim a prepared application", async ({ browser, baseURL }) => {
  const fresh = await browser.newContext({ offline: true });
  const page = await fresh.newPage();
  await expect(page.goto(baseURL!)).rejects.toThrow();
  await fresh.close();
});

test("responsive layouts, keyboard entry, and accessibility", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await mkdir("artifacts", { recursive: true });
  for (const width of [1440, 768, 360]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.getByRole("heading", { name: "Mission health review", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/monitor-${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Tab");
  await page.getByRole("button", { name: "Record check-in", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("later mission days remain inspectable and the printable record contains observations", async ({ page }) => {
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Mission day", { exact: true }).fill("200");
  await dialog.getByLabel("Resting heart rate", { exact: false }).fill("72");
  await dialog.getByLabel("Sleep duration", { exact: false }).fill("6");
  await dialog.getByRole("button", { name: "Save check-in", exact: true }).click();
  await expect(page.getByRole("button", { name: "Mission day 200, incomplete data", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("img", { name: /^Resting heart rate through mission day 200/ })).toBeVisible();
  await expect(page.getByText("A change is emerging in the record.")).not.toBeVisible();
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("heading", { name: "OrbitCare monitoring review", exact: true })).toBeVisible();
  await expect(page.locator(".print-record")).toContainText("200");
  await expect(page.locator(".print-record")).toContainText("72");
  await expect(page.locator(".print-record")).toContainText("not NASA or clinical thresholds");
});

test("research, method, data, and entry dialog pass automated accessibility checks", async ({ page }) => {
  for (const name of ["NASA research", "Method & evidence", "Your data", "Health review"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(audit.violations.map(issue => ({ id: issue.id, nodes: issue.nodes.map(node => ({ target: node.target, message: node.failureSummary })) })), `${name} accessibility`).toEqual([]);
  }
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations.map(issue => ({ id: issue.id, nodes: issue.nodes.map(node => ({ target: node.target, message: node.failureSummary })) })), "Entry dialog accessibility").toEqual([]);
});

test("public demonstration plays within the time limit and the fallback has seven slides", async ({ page, request }) => {
  await page.goto("/demo/");
  const video = page.locator("video");
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(1);
  const duration = await video.evaluate((element: HTMLVideoElement) => element.duration);
  expect(duration).toBeGreaterThan(27);
  expect(duration).toBeLessThanOrEqual(30);
  await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(1);
  await video.evaluate((element: HTMLVideoElement) => element.pause());
  const pdf = await request.get("/demo/OrbitCare-seven-slides.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect(((await pdf.body()).toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length).toBe(7);
  const source = await request.get("/research/OSD-575-original.csv");
  expect(source.status()).toBe(200);
  expect((await source.body()).length).toBe(25275);
});
