import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/oracle/index.html')
})
test('事务分析切换联动企业架构说明', async ({ page }) => {
  await page.locator('[data-mode="search"]').click()
  await expect(page.locator('#diagram-title')).toHaveText('事务与分析视图')
  await expect(page.locator('#approach-steps')).toContainText('工作负载')
})
test('企业资料检索与空态恢复', async ({ page }) => {
  await page.locator('#query').fill('治理')
  await page.getByRole('button', { name: '阅读 ↗' }).click()
  await expect(page.locator('#doc-title')).toHaveText('数据治理与访问策略')
  await page.keyboard.press('Escape')
  await page.locator('#query').fill('不存在')
  await expect(page.locator('#empty')).toBeVisible()
  await page.locator('#clear').click()
  await expect(page.locator('.document-row')).toHaveCount(3)
})
