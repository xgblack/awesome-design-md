import { test, expect } from '@playwright/test'
test('product identity and resources change together', async ({ page }) => {
  await page.goto('examples/hashicorp/index.html')
  await page.click('[data-product=vault]')
  await expect(page.locator('#product-title')).toHaveText('Trust should have a lifetime.')
  await page.click('.resource')
  await expect(page.locator('#read-body')).toContainText('最小权限')
})
test('empty difficulty can recover without changing product', async ({ page }) => {
  await page.goto('examples/hashicorp/index.html')
  await page.click('[data-product=vault]')
  await page.selectOption('#level', 'advanced')
  await expect(page.locator('#empty')).toBeVisible()
  await page.selectOption('#level', 'all')
  await expect(page.locator('.resource')).toHaveCount(1)
})
