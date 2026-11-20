import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/nerdwallet/index.html')
})
test('成本按假设计算，零次合法负数无效', async ({ page }) => {
  await page.locator('#trips').fill('-1')
  await page.getByRole('button', { name: '计算演示成本 →' }).click()
  await expect(page.locator('#error')).toContainText('0–1000')
  await page.locator('#trips').fill('0')
  await page.getByRole('button', { name: '计算演示成本 →' }).click()
  await expect(page.locator('#results')).toContainText('¥0.00')
})
test('比较勾选改变方案，无选择有提示', async ({ page }) => {
  await page.locator('input[value="bus"]').uncheck()
  await expect(page.locator('.result-row')).toHaveCount(2)
  await page.locator('input[value="bike"]').uncheck()
  await page.locator('input[value="mixed"]').uncheck()
  await expect(page.locator('#summary')).toContainText('至少选择一种')
})
