const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html'],
    ['list']
  ],

  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  webServer: {
    command: 'npx http-server . -p 4173 -c-1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 20_000
  },

  // Keep CI feedback quick while covering Chromium and WebKit on desktop/mobile.
  // Local runs retain the full four-project matrix.
  projects: process.env.CI ? [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } }
  ] : [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Desktop Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } }
  ]
});
