import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/kraken/index.html')
})
test('搜索类别联动，零结果可恢复', async ({ page }) => {
  await page.locator('#category').selectOption('stable')
  await expect(page.locator('.collection-row')).toHaveCount(1)
  await expect(page.locator('#rows')).toContainText('USDC')
  await page.locator('#search').fill('Bitcoin')
  await expect(page.locator('#empty')).toBeVisible()
  await page.locator('#clear').click()
  await expect(page.locator('.collection-row')).toHaveCount(4)
})
test('最多两项资产比较并解释供给与风险', async ({ page }) => {
  await page.locator('[data-select="btc"]').click()
  await page.locator('[data-select="eth"]').click()
  await page.locator('[data-select="usdc"]').click()
  await expect(page.locator('#notice')).toContainText('最多观察两项')
  await page.locator('#compare').click()
  await expect(page.locator('#comparison-body')).toContainText('2,100')
  await expect(page.locator('#comparison-body')).toContainText('智能合约')
  await page.keyboard.press('Escape')
  await expect(page.locator('#compare')).toBeFocused()
})
