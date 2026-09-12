import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "pnpm --dir ../backend demo",
      url: "http://127.0.0.1:5000/api/health",
      timeout: 120000,
      reuseExistingServer: false,
    },
    {
      command: "pnpm dev --host localhost",
      url: "http://localhost:5173",
      reuseExistingServer: false,
    },
  ],
});
