import { defineConfig } from '@playwright/test'
const external = process.env.ATLAS_BASE_URL
export default defineConfig({
  testDir: '.',
  testMatch: ['examples/**/*.spec.ts', 'tests/browser/**/*.spec.ts'],
  fullyParallel: true,
  workers: 4,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list']],
  outputDir: '.playwright-results',
  use: {
    baseURL: external || 'http://127.0.0.1:4173/',
    browserName: 'chromium',
    channel: 'chrome',
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: external
    ? undefined
    : {
        command: 'vp dev --port 4173 --strictPort',
        url: 'http://127.0.0.1:4173/',
        reuseExistingServer: true,
        timeout: 30_000,
      },
})
