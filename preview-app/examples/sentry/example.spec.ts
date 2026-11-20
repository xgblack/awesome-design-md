import { test, expect } from '@playwright/test'
test('teaching error reveals selected source frame', async ({ page }) => {
  await page.goto('examples/sentry/index.html')
  await page.click('#trigger')
  await expect(page.locator('#issue-title')).toContainText('MissingResource')
  await expect(page.locator('.frame')).toHaveCount(2)
  await page.locator('.frame').nth(1).click()
  await expect(page.locator('#source')).toContainText('missing-cover.webp')
})
test('vendor filtering and success state are distinct', async ({ page }) => {
  await page.goto('examples/sentry/index.html')
  await page.click('#trigger')
  await page.uncheck('#app-only')
  await expect(page.locator('.frame')).toHaveCount(3)
  await page.click('#success')
  await expect(page.locator('#frames')).toContainText('没有异常栈')
  await expect(page.locator('.frame')).toHaveCount(0)
})
