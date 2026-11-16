import { expect, test } from "@playwright/test";

test("static preview applies host protections while retaining the working application", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  await expect(page.getByRole("button", { name: "Record check-in", exact: true })).toBeEnabled();
});

test("untrusted review text remains literal after persistence and reload", async ({ page }) => {
  const note = '<img src=x onerror="document.documentElement.dataset.injected=1">';
  await page.goto("/");
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await page.getByLabel("Review note", { exact: false }).fill(note);
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Enter health monitoring", exact: true }).click();
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await expect(page.getByText(note, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.injected)).toBeUndefined();
  await expect(page.locator('img[onerror]')).toHaveCount(0);
});
