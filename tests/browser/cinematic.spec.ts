import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the optional opening leads to the real fixture, comparison and local review", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".intro-copy")).toContainText("Far from Earth");
  await page.getByRole("button", { name: "Explore Mission Demo", exact: true }).click();
  await expect(page.locator("#tour-heading")).toBeFocused();
  await expect(page.locator(".tour-reference strong")).toHaveText("60 bpm");
  await expect(page.locator(".tour-chart [role=img]")).toHaveAttribute("aria-label", /through mission day 14/);
  await page.getByRole("button", { name: "Next: Observe", exact: true }).click();
  await expect(page.locator(".tour-observation")).toContainText("69 bpm");
  await expect(page.locator(".tour-observation")).toContainText("1 / 3 required");
  await page.getByRole("button", { name: /Day 23 Persistence/ }).click();
  await expect(page.locator(".tour-observation")).toContainText("2 / 3 required");
  await page.getByRole("button", { name: "Next: Explain", exact: true }).click();
  await expect(page.locator(".comparison-flow")).toContainText("60");
  await expect(page.locator(".comparison-flow")).toContainText("71");
  await expect(page.locator(".comparison")).toContainText("+11 bpm");
  await expect(page.locator(".review-form")).toHaveCount(0);
  await page.getByRole("button", { name: "Next: Record", exact: true }).click();
  await page.getByLabel("Review note", { exact: false }).fill("Guided mission: verify recorded resting conditions.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.locator(".tour-local-record")).toContainText("1 review action");
  await expect(page.locator(".explanation .status-pill")).toHaveText("Review suggested");
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await page.getByRole("button", { name: "Exit walkthrough", exact: true }).click();
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  await expect(page.getByLabel("Open a workspace")).toHaveValue("drift");
  await expect(page.getByLabel("Open a workspace").locator("option")).toHaveCount(5);
  await page.getByLabel("Open a workspace").selectOption("guided-mission");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export workspace JSON", exact: true }).click();
  const stream = await (await download).createReadStream();
  const chunks = []; for await (const chunk of stream!) chunks.push(chunk);
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported.workspace.reviews[0].note).toContain("Guided mission:");
  expect(exported.workspace.checkIns[23].heartRate).toBe(71);
});

test("walkthrough survives prepared offline reload with an actual saved review", async ({ page, context }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore Mission Demo", exact: true }).click();
  await page.getByRole("button", { name: "04 Record", exact: true }).click();
  await page.getByLabel("Review note", { exact: false }).fill("Saved before real network disconnection.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 30000 });
  await context.setOffline(true); await page.reload();
  await page.getByRole("button", { name: "Explore Mission Demo", exact: true }).click();
  await page.getByRole("button", { name: "04 Record", exact: true }).click();
  await expect(page.locator(".tour-local-record")).toContainText("1 review action");
  await page.getByRole("button", { name: "Next: Offline", exact: true }).click();
  await expect(page.locator(".offline-actual")).toHaveText("Actual browser connection: offline");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export demo record", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("OrbitCare-guided-mission.json");
  await expect(page.locator(".tour-offline")).toContainText("first-ever offline visit cannot load");
});

test("opening and all walkthrough stages are accessible by keyboard and on mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const [width, height] of [[1920,1080],[1440,900],[1024,768],[390,844],[360,800]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const audit = async () => {
    const result = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
  };
  await audit();
  await page.getByRole("button", { name: "Explore Mission Demo", exact: true }).focus(); await page.keyboard.press("Enter");
  for (const stage of ["01 Reference","02 Observe","03 Explain","04 Record","05 Offline"]) {
    await page.getByRole("button", { name: stage, exact: true }).focus(); await page.keyboard.press("Enter");
    await expect(page.locator("#tour-heading")).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await audit();
  }
  await page.getByRole("button", { name: "Urgent concern", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("approved mission");
});

test("WebGL denial retains immediate app access", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type: string, ...args: unknown[]) { return type === "webgl" || type === "webgl2" ? null : original.call(this, type, ...args); } as typeof HTMLCanvasElement.prototype.getContext; });
  const page = await context.newPage(); await page.goto("/");
  await expect(page.locator(".space-canvas")).not.toHaveClass(/ready/);
  await expect(page.locator(".fallback-earth")).toBeVisible();
  await page.getByRole("button", { name: "Pause scene", exact: true }).click();
  await expect(page.getByRole("button", { name: "Resume scene", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  await expect(page.locator(".mission-intro")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeVisible();
  await context.close();
});

test("the 3D scene pauses, handles context loss and releases its canvas on exit", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator(".space-canvas");
  await expect(canvas).toHaveClass(/ready/);
  await page.getByRole("button", { name: "Pause scene", exact: true }).click();
  await expect(canvas).toHaveClass(/ready/);
  const paused = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
  await page.waitForTimeout(250);
  expect(await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).toBe(paused);
  await canvas.evaluate((element: HTMLCanvasElement) => element.getContext("webgl")!.getExtension("WEBGL_lose_context")!.loseContext());
  await expect(canvas).not.toHaveClass(/ready/);
  await expect(page.locator(".fallback-earth")).toBeVisible();
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  await expect(page.locator(".space-canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Mission overview", exact: true }).click();
  await expect(page.locator(".space-canvas")).toHaveClass(/ready/);
});

test("turning points disclose only observed stages and retain the complete record", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await expect(page.locator(".all-mission-days")).not.toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Start at the reference", exact: true }).click();
  await expect(page.locator(".replay-milestones button:disabled")).toHaveCount(3);
  await expect(page.locator(".replay-milestones")).not.toContainText("Day 22");
  await page.getByRole("button", { name: "Next turning point", exact: false }).click();
  await page.getByRole("button", { name: "Next turning point", exact: false }).click();
  await expect(page.locator(".replay-milestones button:disabled")).toHaveCount(2);
  await expect(page.locator(".replay-milestones")).toContainText("Day 22");
  await page.getByText("Complete day-by-day record", { exact: true }).click();
  await expect(page.locator(".day-grid button")).toHaveCount(28);
  await expect(page.locator(".day-grid .future-day.flagged-day")).toHaveCount(0);
});

test("touch users can explore, exit, and reach crew guidance without completing a tour", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await context.newPage(); await page.goto("/");
  await page.getByRole("button", { name: "Explore Mission Demo", exact: true }).tap();
  await page.getByRole("button", { name: "Next: Observe", exact: true }).tap();
  await page.getByRole("button", { name: /Day 24 Review rule met/ }).tap();
  await expect(page.locator(".tour-observation")).toContainText("3 / 3 required");
  await page.getByRole("button", { name: "Exit walkthrough", exact: true }).tap();
  await page.getByRole("button", { name: "Open guided mission demo", exact: true }).tap();
  await expect(page.locator("#tour-heading")).toHaveText("One changed day is a starting point.");
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).tap();
  await expect(page.locator(".crew-guidance")).toContainText("approved mission");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("resetting the guided fixture preserves its identity and unrelated saved reviews", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await page.getByLabel("Review note", { exact: false }).fill("Preserve the original monitoring review.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await page.getByRole("button", { name: "Open guided mission demo", exact: true }).click();
  await page.getByRole("button", { name: "04 Record", exact: true }).click();
  await page.getByLabel("Review note", { exact: false }).fill("Temporary tutorial review.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  await page.getByLabel("Open a workspace").selectOption("guided-mission");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Reset current workspace", exact: true }).click();
  await expect(page.getByLabel("Open a workspace")).toHaveValue("guided-mission");
  await expect(page.getByLabel("Open a workspace").locator("option")).toHaveCount(5);
  await page.getByRole("button", { name: "Health review", exact: true }).click();
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeDisabled();
  await expect(page.locator(".history-panel")).not.toContainText("Temporary tutorial review.");
  await page.getByRole("button", { name: "Sustained change", exact: true }).click();
  await expect(page.locator(".history-panel")).toContainText("Preserve the original monitoring review.");
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
});
