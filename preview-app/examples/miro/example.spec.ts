import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/miro/index.html')
})
test('移至菜单实际改变便签分组', async ({ page }) => {
  await page.locator('[data-move="1"]').selectOption('1')
  await expect(page.locator('[data-group="1"]')).toContainText('第一个项目')
  await expect(page.locator('[data-group="0"]')).not.toContainText('第一个项目')
})
test('票额用完禁用新票，撤回后可继续', async ({ page }) => {
  for (const id of [1, 2, 3]) await page.locator(`[data-vote="${id}"]`).click()
  await expect(page.locator('#votes')).toContainText('已投 3 / 3')
  await expect(page.locator('[data-vote="4"]')).toBeDisabled()
  await page.locator('[data-vote="1"]').click()
  await expect(page.locator('[data-vote="4"]')).toBeEnabled()
})
