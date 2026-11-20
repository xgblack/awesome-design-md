import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/cal/index.html')
})
test('同一可用时间随时区转换；已占用不能选', async ({ page }) => {
  await page.locator('#zone').selectOption('0')
  await expect(page.locator('#slots')).toContainText('06:00')
  await page.locator('[data-day="24"]').click()
  await expect(page.getByRole('button', { name: '07:00 已占用' })).toBeDisabled()
})
test('主题空白不生成草稿，填写后可撤销', async ({ page }) => {
  await page.locator('[data-hour="14"]').click()
  await page.getByRole('button', { name: '生成本地草稿' }).click()
  await expect(page.locator('#error')).toContainText('请先')
  await page.locator('#topic').fill('杂志第一期')
  await page.getByRole('button', { name: '生成本地草稿' }).click()
  await expect(page.locator('#draft')).toContainText('杂志第一期')
  await page.getByRole('button', { name: '撤销草稿' }).click()
  await expect(page.locator('#draft')).toBeHidden()
})
