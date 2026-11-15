import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator(".investigation > summary").click();
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
});

test("measurement guides explain all four methods without changing entry behavior", async ({ page }) => {
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("How to measure and record", { exact: true }).click();
  await expect(dialog.locator(".guide-reading")).toContainText("count for 30 seconds and multiply by two");
  await expect(dialog.getByRole("link", { name: /American Heart Association/ })).toHaveAttribute("href", /heart\.org/);
  await dialog.getByRole("button", { name: "Sleep duration", exact: true }).click();
  await expect(dialog.locator(".guide-reading")).toContainText("preceding 24-hour");
  await expect(dialog.locator(".guide-convention")).toContainText("reporting convention");
  await dialog.getByRole("button", { name: "Self-reported fatigue", exact: true }).click();
  await expect(dialog.locator(".guide-reading")).toContainText("1 no fatigue");
  await expect(dialog.locator(".guide-reading")).toContainText("not clinically validated");
  await dialog.getByRole("button", { name: "Exercise / activity context", exact: true }).click();
  await expect(dialog.locator(".guide-reading")).toContainText("No independent alert or exercise target");
  await dialog.getByText("How to measure and record", { exact: true }).click();
  await expect(dialog.locator('input[name="heartRate"]')).toHaveValue("71");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("urgent concern is immediate in stable and empty records and makes no contact", async ({ page }) => {
  await page.getByRole("button", { name: "Stable", exact: true }).click();
  await page.getByRole("button", { name: "Urgent concern", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Use your mission emergency procedures now." })).toBeFocused();
  await expect(dialog).toContainText("Do not wait for three days");
  await expect(dialog).toContainText("No contact has been made by OrbitCare.");
  await expect(dialog).toContainText("No mission protocol is installed here.");
  await expect(dialog.locator("form,input,textarea")).toHaveCount(0);
  await expect(dialog.getByRole("button")).toHaveCount(1);
  await dialog.locator("summary").click();
  await expect(dialog.getByRole("link", { name: /Medical training/ })).toHaveAttribute("href", "https://www.nasa.gov/reference/5-0-training/");
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  await page.getByRole("button", { name: "Create an empty test workspace", exact: true }).click();
  await page.getByRole("button", { name: "Urgent concern", exact: true }).click();
  await expect(dialog).toContainText("immediately follow");
  await expect(dialog).toContainText("Ground support may be delayed");
});

test("check-in can reach the urgent pathway without saving a measurement", async ({ page }) => {
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  await page.getByRole("button", { name: "Serious symptoms? Open urgent pathway", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Use your mission emergency procedures now." })).toBeVisible();
});

test("next steps reflect missing information and local review does not send a request", async ({ page }) => {
  await page.getByRole("button", { name: "Missing data", exact: true }).click();
  await page.getByRole("button", { name: "Mission day 26, incomplete data", exact: true }).click();
  await expect(page.locator(".next-step-panel")).toContainText("Leave an unknown value blank");
  await expect(page.locator('select[name="reviewAction"]')).toHaveValue("Add context");
  await expect(page.locator('select[name="reviewAction"] option', { hasText: "Verify measurement" })).toHaveCount(0);
  await page.locator('select[name="reviewAction"]').selectOption("Request medical review");
  await expect(page.locator(".action-help")).toContainText("sends no request or notification");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Nothing was sent to medical support" })).toBeVisible();
  await page.getByRole("button", { name: "Review recent observations", exact: true }).click();
  await expect(page.getByRole("heading", { name: "What was known on this day?", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await page.getByRole("button", { name: "Serious symptoms?", exact: false }).click();
  await expect(page.getByRole("dialog")).toContainText("Do not wait for three days");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Replay", exact: true })).toBeVisible();
});

test("body regions map to original indicators, research and interpretation boundaries", async ({ page }) => {
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await page.getByRole("button", { name: "Explore the human context", exact: false }).click();
  const frozenDay = await page.locator(".explorer-day strong").textContent();
  // Replay ticks every 650 ms. A contextual navigation must pause it.
  await page.waitForTimeout(750);
  await expect(page.locator(".explorer-day strong")).toHaveText(frozenDay!);
  await expect(page.locator(".system-panel h2")).toHaveText("Cardiovascular");
  await expect(page.locator(".system-panel .metric-name")).toHaveText("Resting heart rate");
  await expect(page.locator(".research-context-card a")).toHaveAttribute("href", "https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/");
  await expect(page.locator(".system-limit")).toContainText("educational navigation point");
  const region = page.getByRole("button", { name: "Explore cardiovascular region", exact: true });
  await region.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "Explore sleep and fatigue region", exact: true })).toBeFocused();
  await expect(page.locator(".system-panel .metric-name")).toHaveText(["Sleep duration", "Self-reported fatigue"]);
  await expect(page.locator(".system-limit")).toContainText("does not measure brain function");
  await expect(page.locator(".research-context-card a")).toHaveAttribute("href", /inadequate-sleep/);
  await page.getByRole("button", { name: "Activity context", exact: false }).first().click();
  await expect(page.locator(".activity-reading")).toContainText("minutes on day");
  await expect(page.locator(".system-limit")).toContainText("does not measure muscle loss");
  await expect(page.locator(".system-panel .metric-row")).toHaveCount(0);
  await page.getByRole("button", { name: "Return to monitoring & review", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Mission health review", exact: true })).toBeVisible();
});

test("explorer replay uses the same as-of day and does not show future observations", async ({ page }) => {
  await page.getByRole("button", { name: "Mission day 22", exact: true }).click();
  await page.getByRole("button", { name: "Health explorer", exact: true }).click();
  await page.locator(".explorer-table summary").click();
  await expect(page.locator(".explorer-table tbody tr")).toHaveCount(22);
  await page.getByRole("button", { name: "Previous explorer mission day", exact: true }).click();
  await expect(page.locator(".explorer-table tbody tr")).toHaveCount(21);
  await page.getByRole("button", { name: "Return to monitoring & review", exact: true }).click();
  await expect(page.getByRole("slider", { name: "Selected mission day", exact: true })).toHaveValue("21");
  await expect(page.getByRole("button", { name: "Mission day 24, not yet displayed", exact: true })).toHaveAttribute("data-state", "future");
});

test("new explorer and guidance are responsive, accessible and respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Health explorer", exact: true }).click();
  for (const [width, height] of [[1440,900],[1024,768],[390,844],[360,800]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Explore activity and muscle region", exact: true }).click();
    await expect(page.locator(".system-panel h2")).toHaveText("Activity context");
    await expect(page.getByRole("button", { name: "Urgent concern", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Explore cardiovascular region", exact: true }).click();
  }
  expect(await page.locator(".map-connectors path").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole("button", { name: "Health review", exact: true }).click();
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  await page.getByText("How to measure and record", { exact: true }).click();
  const guideAudit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(guideAudit.violations).toEqual([]);
});

test("unvisited explorer, guidance and urgent signpost all work after actual offline reload", async ({ page, context }) => {
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  await context.setOffline(true); await page.reload(); await page.locator(".investigation > summary").click();
  await page.getByRole("button", { name: "Health explorer", exact: true }).click();
  await expect(page.locator(".system-panel h2")).toHaveText("Cardiovascular");
  await page.getByRole("button", { name: "Sleep & fatigue", exact: false }).first().click();
  await expect(page.locator(".system-panel .metric-row")).toHaveCount(2);
  await page.getByRole("button", { name: "Urgent concern", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("No contact has been made by OrbitCare.");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Health review", exact: true }).click();
  await page.getByRole("button", { name: "Record check-in", exact: true }).click();
  await page.getByText("How to measure and record", { exact: true }).click();
  await expect(page.locator(".guide-reading")).toContainText("count for 30 seconds");
  await page.keyboard.press("Escape");
  if (!(await page.locator(".investigation").getAttribute("open")) && !(await page.locator(".investigation").evaluate(element => (element as HTMLDetailsElement).open))) await page.locator(".investigation > summary").click();
  await page.getByLabel("Review note", { exact: false }).fill("Guided offline review; no communication sent.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await page.reload(); await page.locator(".investigation > summary").click();
  await expect(page.getByText("Guided offline review; no communication sent.", { exact: true })).toBeVisible();
});
