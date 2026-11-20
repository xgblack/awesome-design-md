import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/slack/index.html')
})
test('切换团队频道同步讨论上下文', async ({ page }) => {
  await page.getByRole('button', { name: '# 设计评审', exact: true }).click()
  await expect(page.locator('#message')).toContainText('示例')
  await expect(page.locator('#activity-name')).toContainText('上下文')
})
test('本地回复按频道隔离，空白不发送且可撤回', async ({ page }) => {
  await page.getByRole('button', { name: '加入草稿 ↑' }).click()
  await expect(page.locator('#error')).toContainText('请先')
  await page.locator('#reply').fill('我会补充迁移文档')
  await page.getByRole('button', { name: '加入草稿 ↑' }).click()
  await page.locator('[data-kind="film"]').click()
  await expect(page.locator('#replies')).toHaveText('')
  await page.locator('[data-kind="garden"]').click()
  await expect(page.locator('#replies')).toContainText('迁移文档')
  await page.locator('#undo').click()
  await expect(page.locator('#replies')).toHaveText('')
})
