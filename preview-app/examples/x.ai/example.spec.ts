import { test, expect } from '@playwright/test'
test('topic and year combine without inventing missing notes', async ({ page }) => {
  await page.goto('examples/x.ai/index.html')
  await page.selectOption('#topic', 'evaluation')
  await page.selectOption('#year', '2025')
  await expect(page.locator('#empty')).toBeVisible()
  await page.selectOption('#year', '2026')
  await expect(page.locator('.entry')).toHaveCount(1)
})
test('comparison requires distinct versions and shows textual changes', async ({ page }) => {
  await page.goto('examples/x.ai/index.html')
  await page.selectOption('#right', 'v1')
  await page.click('#compare-button')
  await expect(page.locator('#diff')).toContainText('两个不同版本')
  await page.selectOption('#right', 'v2')
  await page.click('#compare-button')
  await expect(page.locator('#diff')).toContainText('+ 新增')
})
