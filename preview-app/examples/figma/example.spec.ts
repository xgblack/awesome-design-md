import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/figma/index.html')
})
test('设计文件切换与组件编辑联动桌面手机画板', async ({ page }) => {
  await page.locator('#template').selectOption('portal')
  await expect(page.locator('#frame-heading')).toHaveText('A clearer client handoff.')
  await page.locator('#component-text').fill('Prototype handoff')
  await expect(page.locator('[data-card-label]').first()).toHaveText('Prototype handoff')
  await expect(page.locator('[data-card-label]').last()).toHaveText('Prototype handoff')
  await page.locator('#variant').selectOption('complete')
  await expect(page.locator('[data-state-label]').first()).toHaveText('已完成')
})
test('按钮组件独立修改，空评论提示且可加入反馈', async ({ page }) => {
  await page.locator('[data-component="button"]').click()
  await page.locator('#component-text').fill('')
  await expect(page.locator('#error')).toContainText('不能为空')
  await page.locator('#reset-design').click()
  await page.getByRole('button', { name: '添加评论 ＋' }).click()
  await expect(page.locator('#comment-error')).toContainText('请先')
  await page.locator('#comment').fill('把重要状态放在标题附近')
  await page.getByRole('button', { name: '添加评论 ＋' }).click()
  await expect(page.locator('#comments')).toContainText('重要状态')
})
