import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/coinbase/index.html')
})
test('金额转换为资产数量，超预算不可确认', async ({ page }) => {
  await page.locator('#btc').fill('600')
  await expect(page.locator('#quantities')).toContainText('0.010000')
  await expect(page.locator('#balance')).toHaveText('$0.00')
  await page.locator('#confirm').click()
  await expect(page.locator('#confirmed')).toContainText('没有发起交易')
  await page.locator('#eth').fill('900')
  await expect(page.locator('#confirm')).toBeDisabled()
  await expect(page.locator('#message')).toContainText('超过')
})
test('样本切换同步账户，非法与空输入拒绝', async ({ page }) => {
  await page.locator('#preset').selectOption('b')
  await expect(page.locator('#income')).toHaveText('$2,000.00')
  await expect(page.locator('#balance')).toHaveText('$200.00')
  await page.locator('#btc').fill('-1')
  await expect(page.locator('#confirm')).toBeDisabled()
  await page.locator('#btc').fill('')
  await expect(page.locator('#balance')).toHaveText('—')
})
