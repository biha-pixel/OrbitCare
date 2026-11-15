import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, mkdir } from "node:fs/promises";

test.use({ timezoneId: "Asia/Colombo" });

test("Crew Assist is independent of stable, changed, missing and empty workspaces", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Stable", "Sustained change", "Missing data"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Help a crewmate." })).toBeFocused();
    await expect(page.locator(".crew-guidance")).toContainText("Use your mission emergency procedures now.");
    await expect(page.locator(".crew-guidance")).toContainText("No approved mission-specific emergency protocol is installed in this prototype.");
    await expect(page.locator(".crew-guidance")).toContainText("No contact has been made by OrbitCare.");
    await expect(page.locator(".crew-guidance")).toContainText("Do not wait for three days");
    await expect(page.locator(".crew-assist form")).toHaveCount(0);
    await page.getByRole("button", { name: "Monitor my health", exact: true }).click();
  }
  await page.getByRole("button", { name: "Your data", exact: true }).click();
  await page.getByRole("button", { name: "Create an empty test workspace", exact: true }).click();
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await expect(page.locator(".crew-guidance")).toContainText("cannot diagnose or evaluate an emergency");
  await expect(page.locator(".crew-assist input,.crew-assist textarea")).toHaveCount(1); // closed incident import only
  expect((await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
});

test("synthetic drill prepares a sourced handoff, exports and persists without medical contact", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Investigate the change", exact: true }).click();
  await page.getByText("Complete day-by-day record", { exact: true }).click();
  await page.getByRole("button", { name: /^Mission day 22(?:,|$)/ }).click();
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await page.getByRole("button", { name: "Start Crew Emergency Drill", exact: true }).click();
  await expect(page.locator(".crew-drill-brief")).toContainText("not an application detection");
  await expect(page.locator(".crew-assist form")).toHaveCount(0);
  await page.getByRole("button", { name: "Continue drill: record observations", exact: true }).click();
  await expect(page.getByLabel("Fictional crewmember identifier", { exact: true })).toHaveValue("SIM-CREW-01");
  await expect(page.getByLabel("Measured observations", { exact: false })).toHaveValue("");
  await expect(page.getByLabel("User-reported contact status", { exact: true })).toHaveValue("unknown");
  await page.getByText("Optional historical monitoring context", { exact: true }).click();
  await page.getByLabel("Include history:", { exact: false }).check();
  await page.getByLabel("Additional notes", { exact: true }).fill("Synthetic drill note. <script>window.fakeMedicalAlert=true</script>");
  await page.getByRole("button", { name: "Prepare handoff", exact: true }).click();
  await expect(page.locator(".crew-handoff")).toContainText("SIMULATION / TRAINING ONLY");
  await expect(page.locator(".crew-handoff")).toContainText("never current incident measurements");
  await expect(page.locator(".crew-handoff")).toContainText("through mission day 22");
  await expect(page.locator(".crew-handoff")).toContainText("Unknown / not recorded");
  await expect(page.locator(".crew-handoff")).toContainText("OrbitCare has not contacted or notified anyone");
  expect(await page.evaluate(() => "fakeMedicalAlert" in window)).toBe(false);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export incident JSON", exact: true }).click();
  const file = await downloaded; const payload = JSON.parse(await readFile((await file.path())!, "utf8"));
  expect(payload.kind).toBe("crew-incident"); expect(payload.incident.incidentAt).toBe("2026-11-15T08:00:00.000Z");
  expect(payload.incident.measurements).toEqual({ text: "", observedAt: null, source: "unknown" });
  expect(payload.incident.contact.status).toBe("unknown"); expect(payload.incident.history.record.day).toBe(22);
  expect(payload.incident.history.reviews.every((row: { day: number }) => row.day <= 22)).toBe(true);
  await mkdir("artifacts/crew-final", { recursive: true });
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".crew-screen")).not.toBeVisible();
  await expect(page.locator(".skip-link")).not.toBeVisible();
  await expect(page.locator(".crew-handoff")).toBeVisible();
  await page.pdf({ path: "artifacts/crew-final/drill-handoff.pdf", format: "A4", printBackground: true, margin: { top: "16mm", bottom: "16mm", left: "16mm", right: "16mm" } });
  await page.emulateMedia({ media: "screen" });
  await page.reload();
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await expect(page.locator(".crew-handoff")).toHaveCount(0);
  await page.getByText("Show local incident records (1)", { exact: true }).click();
  await page.getByRole("button", { name: /^Simulation \/ training only · SIM-CREW-01/ }).click();
  await expect(page.locator(".crew-handoff")).toContainText("Synthetic drill note.");
  await page.getByLabel("Import incident JSON", { exact: true }).setInputFiles({ name: "incident.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
  await expect(page.locator(".crew-document")).toBeVisible();
  await expect(page.getByLabel("User-reported contact status", { exact: true })).toHaveValue("unknown");
  await page.getByRole("button", { name: "Prepare handoff", exact: true }).click();
  await expect(page.locator(".crew-handoff")).toContainText("Imported (UTC): 2026-");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
});

test("a blank incident keeps unknowns, labels contact as user reported and protects drafts", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await page.getByRole("button", { name: "Document an incident (optional)", exact: true }).click();
  await expect(page.locator(".crew-document")).toHaveAttribute("autocomplete", "off");
  await page.getByRole("button", { name: "Save incident locally", exact: true }).click();
  await expect(page.getByLabel("Fictional crewmember identifier", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Fictional crewmember identifier", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Fictional crewmember identifier", { exact: true }).fill("Fictional C02");
  await page.getByLabel("User-reported contact status", { exact: true }).selectOption("confirmation-reported");
  await page.getByLabel("Contact details reported by you", { exact: true }).fill("User reports that designated personnel replied via the mission channel.");
  page.once("dialog", dialog => dialog.dismiss());
  await page.getByRole("button", { name: "Monitor my health", exact: true }).click();
  await expect(page.locator(".crew-document")).toBeVisible();
  await page.getByRole("button", { name: "Prepare handoff", exact: true }).click();
  await expect(page.locator(".crew-handoff")).toContainText("User reports contact confirmed");
  await expect(page.locator(".crew-handoff")).toContainText("not independently verified");
  await expect(page.locator(".crew-handoff")).toContainText("Incident time (UTC; user entered): Unknown / not recorded");
  await expect(page.locator(".crew-handoff")).toContainText("Not selected. No historical monitoring data included.");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download handoff text", exact: true }).click();
  const text = await readFile((await (await download).path())!, "utf8");
  expect(text).toContain("Fictional C02"); expect(text).toContain("No approved mission-specific emergency protocol");
  await page.getByText("Show local incident records (1)", { exact: true }).click();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Delete local incident", exact: true }).click();
  await expect(page.getByText("Show local incident records (0)", { exact: true })).toBeVisible();
});

test("unvisited Crew Assist works after real offline reload with local incident persistence", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByText("Offline ready", { exact: true }).first()).toBeVisible({ timeout: 45000 });
  await context.setOffline(true); await page.reload();
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await expect(page.locator(".crew-guidance")).toContainText("immediately follow");
  await page.getByRole("button", { name: "Start Crew Emergency Drill", exact: true }).click();
  await page.getByRole("button", { name: "Continue drill: record observations", exact: true }).click();
  await page.getByLabel("Actions you report having taken", { exact: false }).fill("Synthetic offline workflow: recorded observations only. No communication is simulated.");
  await page.getByRole("button", { name: "Prepare handoff", exact: true }).click();
  await expect(page.locator(".crew-feedback")).toContainText("saved on this device");
  await page.reload(); await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await page.getByText("Show local incident records (1)", { exact: true }).click();
  await page.getByRole("button", { name: /^Simulation \/ training only · SIM-CREW-01/ }).click();
  await expect(page.locator(".crew-handoff")).toContainText("Synthetic offline workflow");
  const file = page.waitForEvent("download"); await page.getByRole("button", { name: "Export incident JSON", exact: true }).click(); expect((await file).suggestedFilename()).toBe("OrbitCare-crew-handoff.json");
  expect(await page.evaluate(() => navigator.onLine)).toBe(false);
});

test("incident timestamps export in UTC and a malformed import preserves the saved record", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).click();
  await page.getByRole("button", { name: "Document an incident (optional)", exact: true }).click();
  await page.getByLabel("Fictional crewmember identifier", { exact: true }).fill("Fictional time-test C02");
  await page.getByLabel("Incident timestamp (device local time)", { exact: false }).fill("2026-11-15T18:30");
  await page.getByLabel("Observation timestamp (device local time)", { exact: true }).fill("2026-11-15T18:31");
  await page.getByLabel("Contact report timestamp (device local time)", { exact: true }).fill("2026-11-15T18:32");
  await page.getByRole("button", { name: "Prepare handoff", exact: true }).click();
  const downloaded = page.waitForEvent("download"); await page.getByRole("button", { name: "Export incident JSON", exact: true }).click();
  const record = JSON.parse(await readFile((await (await downloaded).path())!, "utf8")).incident;
  expect(record.incidentAt).toBe("2026-11-15T13:00:00.000Z");
  expect(record.measurements.observedAt).toBe("2026-11-15T13:01:00.000Z");
  expect(record.contact.reportedAt).toBe("2026-11-15T13:02:00.000Z");
  expect(record.measurements.text).toBe(""); expect(record.contact.status).toBe("unknown");
  await page.getByText("Show local incident records (1)", { exact: true }).click();
  await page.getByLabel("Import incident JSON", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from("{bad") });
  await expect(page.locator(".crew-error")).toContainText("Import rejected");
  await expect(page.getByText("Show local incident records (1)", { exact: true })).toBeVisible();
  await expect(page.locator(".crew-handoff")).toContainText("Fictional time-test C02");
});

test("Crew Assist supports keyboard, four viewport sizes and static reduced-motion guidance", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/");
  await page.getByRole("button", { name: "Help a crewmate", exact: true }).focus(); await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1, name: "Help a crewmate." })).toBeFocused();
  for (const [width,height] of [[1440,900],[1920,1080],[390,844],[360,800]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator(".crew-mode .view-transition").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
    await page.screenshot({ path: `artifacts/crew-final/guidance-${width}.png`, fullPage: true });
  }
  await page.getByRole("button", { name: "Document an incident (optional)", exact: true }).click();
  await page.getByLabel("Fictional crewmember identifier", { exact: true }).fill("Fictional mobile C02");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
