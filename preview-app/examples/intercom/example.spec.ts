import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/intercom/index.html')
})
test('切换问题同步上下文', async ({ page }) => {
  await page.locator('[data-q="2"]').click()
  await expect(page.locator('#messages')).toContainText('误把一份文档')
  await expect(page.locator('#context')).toContainText('归档不是删除')
})
test('空回复报错，加入后重置清空', async ({ page }) => {
  await page.getByRole('button', { name: '加入本次对话 ↑' }).click()
  await expect(page.locator('#error')).toContainText('没有内容')
  await page.locator('#reply').fill('可以从项目权限设置检查。')
  await page.getByRole('button', { name: '加入本次对话 ↑' }).click()
  await expect(page.locator('.reply')).toContainText('权限设置')
  await page.getByRole('button', { name: '重置会话' }).click()
  await expect(page.locator('.reply')).toHaveCount(0)
})
