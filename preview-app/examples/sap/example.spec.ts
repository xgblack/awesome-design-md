import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/sap/index.html')
})
test('模块与企业规模联动到不同业务资料', async ({ page }) => {
  await page.locator('[data-service="inventory"]').click()
  await expect(page.locator('#service-title')).toContainText('库存')
  await expect(page.locator('#items')).toContainText('仓位')
  await page.locator('#scale').selectOption('enterprise')
  await expect(page.locator('[data-item]')).toHaveCount(5)
  await expect(page.locator('#items')).toContainText('多账套')
  await expect(page.locator('#download')).toBeDisabled()
})
test('只在资料齐全后下载，切换模块清空确认', async ({ page }) => {
  await expect(page.locator('#download')).toBeDisabled()
  for (const checkbox of await page.locator('[data-item]').all()) await checkbox.check()
  await expect(page.locator('#progress')).toContainText('3 / 3')
  const d = page.waitForEvent('download')
  await page.locator('#download').click()
  expect((await d).suggestedFilename()).toBe('forma-implementation.md')
  await page.locator('[data-service="finance"]').click()
  await expect(page.locator('#progress')).toContainText('0 / 3')
  await expect(page.locator('#download')).toBeDisabled()
})
