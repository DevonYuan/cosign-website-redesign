import { defineConfig, devices } from "@playwright/test";
import path from "path";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Chromium-based mobile emulation rather than iPhone 14/WebKit: this
      // environment doesn't have WebKit's host libraries installed, and
      // www/'s mobile-nav behavior isn't engine-specific.
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
  // www/ is plain static HTML/CSS/JS with no build step and no backend
  // dependency — serve.js is a zero-dependency static file server so this
  // suite is self-sufficient with nothing pre-started, matching the pattern
  // in frontend/playwright.config.ts and backend/tests/playwright.config.ts.
  webServer: {
    command: "node serve.js",
    cwd: path.resolve(__dirname),
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
