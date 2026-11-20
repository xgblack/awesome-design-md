import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/wise/index.html')
})
test('固定汇率扣费与互换币种，非法值不算', async ({ page }) => {
  await expect(page.locator('#converted')).toHaveText('19,900.00 JPY')
  await page.getByRole('button', { name: '互换币种' }).click()
  await expect(page.locator('#converted')).toHaveText('49.75 CNY')
  await page.locator('#amount').fill('-1')
  await page.getByRole('button', { name: '更新演示换算' }).click()
  await expect(page.locator('#error')).toContainText('金额需大于')
})
test('目的地更新预算，超预算说明数值', async ({ page }) => {
  await page.locator('#destination').selectOption('lisbon')
  await expect(page.locator('#trip-total')).toHaveText('¥2,450')
  await page.locator('#stay').fill('3000')
  await expect(page.locator('#trip-message')).toContainText('超出参考上限 ¥950')
})
