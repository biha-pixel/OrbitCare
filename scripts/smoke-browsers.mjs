import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "msedge" });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(process.env.ORBITCARE_SMOKE_URL || "http://127.0.0.1:3000");
  await expect(page.getByText("3 indicators suggest a closer look.")).toBeVisible();
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("Browser offline", { exact: true })).toBeVisible();
  await page.getByLabel("Review note", { exact: false }).fill("Edge offline smoke check.");
  await page.getByRole("button", { name: "Record action", exact: true }).click();
  await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Edge offline smoke check.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "NASA research", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A record across sampling visits" })).toBeVisible();
  if (errors.length) throw new Error(errors.join("; "));
  console.log("Microsoft Edge smoke PASS: initial analysis, actual offline reload, persisted review, bundled research, no page errors.");
} finally { await browser.close(); }
