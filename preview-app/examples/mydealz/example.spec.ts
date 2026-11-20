import { test, expect } from '@playwright/test'
test('mydealz: 单票投票可撤回', async ({ page }) => {
  await page.goto('examples/mydealz/index.html')
  const score = page.locator('[data-vote="0,1"]').locator('..').locator('output')
  await page.getByRole('button', { name: '升温 0', exact: true }).click()
  await expect(score).toHaveText('87°')
  await page.getByRole('button', { name: '升温 0', exact: true }).click()
  await expect(score).toHaveText('86°')
})
test('mydealz: 有效期筛选与无结果', async ({ page }) => {
  await page.goto('examples/mydealz/index.html')
  await page.locator('#valid-only').check()
  await expect(page.locator('.deal')).toHaveCount(3)
  await page.locator('#deal-search').fill('不存在')
  await expect(page.locator('#deal-status')).toContainText('没有匹配')
})
