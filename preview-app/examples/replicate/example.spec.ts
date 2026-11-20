import { test, expect } from '@playwright/test'
test('filters combine text and experiment type', async ({ page }) => {
  await page.goto('examples/replicate/index.html')
  await page.selectOption('#kind', 'texture')
  await expect(page.locator('.work')).toHaveCount(2)
  await page.fill('#search', 'missingzzz')
  await expect(page.locator('#empty')).toBeVisible()
})
test('work selection and code language stay linked', async ({ page }) => {
  await page.goto('examples/replicate/index.html')
  await page.click('[data-work=orbit]')
  await expect(page.locator('#work-title')).toHaveText('A different orbit.')
  await expect(page.locator('#work-prompt')).toContainText('Overlapping')
  await expect(page.locator('#work-model')).toContainText('orbital-vector')
  await page.click('[data-lang=curl]')
  await expect(page.locator('#code')).toContainText('orbit')
  await expect(page.locator('#code')).toContainText('curl')
})
