import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/mercury/index.html')
})
test('工作室切换联动记录与净额', async ({ page }) => {
  await page.locator('[data-studio="film"]').click()
  await expect(page.locator('#studio-name')).toContainText('远山')
  await expect(page.locator('#records')).toContainText('外景器材')
  await expect(page.locator('#total')).toHaveText('¥48,100')
})
test('筛选联动总额，空态可恢复', async ({ page }) => {
  await page.locator('#filter').selectOption('recurring')
  await expect(page.locator('#total')).toHaveText('¥-7,700')
  await page.locator('#filter').selectOption('none')
  await expect(page.locator('#empty')).toBeVisible()
  await page.getByRole('button', { name: '查看全部记录' }).click()
  await expect(page.locator('.record')).toHaveCount(4)
})
