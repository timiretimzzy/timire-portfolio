import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests run against the production build served by `vite preview`,
 * not the dev server. Set PW_CHROMIUM to use a pre-installed Chromium binary.
 */
const executablePath = process.env.PW_CHROMIUM || undefined

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list']],
  timeout: 45_000,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'off',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
