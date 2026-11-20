import { test, expect } from '@playwright/test'
test('explicit example actions produce local event records', async ({ page }) => {
  await page.goto('examples/posthog/index.html')
  await page.click('#view')
  await page.click('#save')
  await expect(page.locator('#events li')).toHaveCount(2)
  await expect(page.locator('#events')).toContainText('reading_list_added')
  await page.click('#clear')
  await expect(page.locator('#empty')).toBeVisible()
})
test('language changes snippet without producing tracking events', async ({ page }) => {
  await page.goto('examples/posthog/index.html')
  await page.click('[data-lang=python]')
  await expect(page.locator('#snippet')).toContainText('not executed')
  await expect(page.locator('#events li')).toHaveCount(0)
})
