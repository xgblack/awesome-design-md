import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/ibm/index.html')
})
test('主题过滤真实资源，不重置已选阅读包', async ({ page }) => {
  await page.locator('[data-doc="ai"]').check()
  await page.locator('#topic').selectOption('mobility')
  await expect(page.locator('.resource')).toHaveCount(2)
  await expect(page.locator('#selected')).toContainText('AI')
})
test('空选禁导出，选择后下载真实Markdown', async ({ page }) => {
  await expect(page.locator('#download')).toBeDisabled()
  await page.locator('[data-doc="governance"]').check()
  const download = page.waitForEvent('download')
  await page.locator('#download').click()
  expect((await download).suggestedFilename()).toBe('enterprise-grid-reading.md')
})
