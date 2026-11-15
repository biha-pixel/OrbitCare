import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("fresh judge opens, changes scenario, investigates, checks evidence and records action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Sustained change", exact: true })).toBeEnabled();
  await expect(page.locator(".mission-purpose")).toContainText("Spot personal changes in space");
  await expect(page.locator(".investigation")).not.toHaveAttribute("open", "");
  await expect(page.locator(".brief-reading").first()).toContainText("60");
  await expect(page.locator(".brief-reading").first()).toContainText("71");
  await page.getByRole("button", { name: "Stable", exact: true }).click();
  await page.getByRole("button", { name: "Sustained change", exact: true }).click();
  await page.getByRole("button", { name: "Investigate the change", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#timeline-heading")).toBeFocused();
  await page.getByRole("button", { name: "Start at the reference", exact: true }).click();
  await expect(page.locator(".replay-story")).toContainText("Establish the personal reference");
  for (const [day, title] of [[15,"Observe against the fixed reference"], [22,"A changed reading appears"], [23,"The change persists"], [24,"The review rule is met"]] as const) {
    await page.getByRole("button", { name: "Next turning point", exact: false }).click();
    await expect(page.getByRole("slider", { name: "Selected mission day" })).toHaveValue(String(day));
    await expect(page.locator(".replay-story")).toContainText(title);
    await expect(page.locator(".day-grid .future-day.flagged-day")).toHaveCount(0);
    await expect(page.locator(".day-grid .future-day.gap-day")).toHaveCount(0);
  }
  await expect(page.locator(".comparison-flow")).toContainText("71");
  await expect(page.locator(".rule-details")).toContainText("not a NASA or clinical threshold");
  await page.getByText("Reference quality and uncertainty", { exact: true }).click();
  await expect(page.locator(".explanation")).toContainText("14 valid observations");
  await page.locator(".research-connections > summary").click();
  await expect(page.locator(".connections-grid article")).toHaveCount(4);
  await expect(page.locator(".real-data-connection")).toContainText("do not calibrate or validate");
  await page.getByLabel("Review note", { exact: false }).fill("Judge journey: verify resting conditions.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.locator(".history-panel")).toContainText("Judge journey: verify resting conditions.");
  await expect(page.locator(".explanation .status-pill")).toHaveText("Review suggested");
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("judge investigation and research connections work after an offline reload", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await page.getByRole("button", { name: "Start at the reference", exact: true }).click();
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Next turning point", exact: false }).click();
  await expect(page.locator(".replay-story")).toContainText("The review rule is met");
  await page.locator(".research-connections > summary").click();
  await expect(page.locator(".connections-grid")).toContainText("NASA");
  await page.getByLabel("Review note", { exact: false }).fill("Offline judge replay verified.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await expect(page.locator(".history-panel")).toContainText("Offline judge replay verified.");
});

test("missing and non-comparable investigation preserves uncertainty and as-of history", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Missing data", exact: true }).click();
  await page.getByRole("button", { name: "Investigate this day", exact: true }).click();
  await page.getByText("Complete day-by-day record", { exact: true }).click();
  await page.getByRole("button", { name: /^Mission day 25,/ }).click();
  await expect(page.locator(".replay-story")).toContainText("exclude the comparison");
  await expect(page.locator(".comparison-flow")).toContainText("—");
  await page.getByRole("button", { name: "Next turning point", exact: false }).click();
  await expect(page.locator(".replay-story")).toContainText("A gap is not a reassuring result");
  await page.getByLabel("Review note", { exact: false }).fill("Missing reading context.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await page.getByRole("button", { name: /^Mission day 14,/ }).click();
  await expect(page.locator(".history-panel")).not.toContainText("Missing reading context.");
  await expect(page.locator(".day-grid .future-day .day-review-event")).toHaveCount(0);
  await expect(page.locator(".day-grid .future-day.gap-day")).toHaveCount(0);
  await expect(page.locator(".scenario-spark")).toHaveCount(0);
});

test("opening and investigation remain accessible at four judge sizes and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  for (const [width, height] of [[1440,900],[1920,1080],[390,844],[360,800]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const button = page.getByRole("button", { name: "Investigate the change", exact: true });
    const box = await button.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(height);
    expect(await page.locator(".brand-planet").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  }
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  expect(await page.locator(".replay-story").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
});

test("replay stays within an empty workspace and explorer follows the selected indicator", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Inspect Sleep duration: Review suggested", exact: true }).click();
  await page.getByRole("button", { name: "Explore the human context", exact: false }).click();
  await expect(page.locator(".system-panel h2")).toHaveText("Sleep & fatigue");
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  await page.getByRole("button", { name: "Create an empty test workspace", exact: true }).click();
  await page.getByRole("button", { name: "Investigate this day", exact: true }).click();
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await expect(page.getByRole("slider", { name: "Selected mission day" })).toHaveValue("1");
  await expect(page.getByRole("button", { name: "Replay", exact: true })).toBeVisible({ timeout: 5000 });
  expect(errors).toEqual([]);
});
