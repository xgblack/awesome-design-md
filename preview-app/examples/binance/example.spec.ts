import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/binance/index.html')
})
test('资产搜索与空结果恢复', async ({ page }) => {
  await page.locator('#search').fill('xyz')
  await expect(page.locator('#empty')).toBeVisible()
  await page.getByRole('button', { name: '清空搜索' }).click()
  await page.locator('#search').fill('BTC')
  await expect(page.locator('tbody tr')).toHaveCount(1)
  await expect(page.locator('tbody')).toContainText('68,400.00')
})
test('换算拒绝负数，固定价格正确计算', async ({ page }) => {
  await page.getByRole('button', { name: '纸面换算', exact: true }).click()
  await page.locator('#amount').fill('-2')
  await page.getByRole('button', { name: '计算示例数量' }).click()
  await expect(page.locator('#error')).toContainText('请输入')
  await page.locator('#amount').fill('68400')
  await page.getByRole('button', { name: '计算示例数量' }).click()
  await expect(page.locator('#result')).toContainText('1.00000000 BTC')
})
