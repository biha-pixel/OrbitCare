import { defineConfig, devices } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1, timeout: 45000,
  // Chromium downloads were canceled with this Windows workspace's artifact path.
  // A dedicated OS-temp download directory also keeps exports out of source control.
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000", viewport: { width: 1440, height: 1000 }, acceptDownloads: true, launchOptions: { downloadsPath: join(tmpdir(), "orbitcare-playwright-downloads") }, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : { command: "node scripts/serve.mjs", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI, timeout: 15000 },
  reporter: [["list"], ["html", { open: "never" }]],
});
