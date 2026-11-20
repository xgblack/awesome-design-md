import { test, expect } from '@playwright/test'
test('dji: 拍摄任务切换真实器材', async ({ page }) => {
  await page.goto('examples/dji/index.html')
  await page.locator('[data-task=studio]').click()
  await expect(page.locator('#kit-name')).toHaveText('Tern Pocket')
  await expect(page.locator('#kit-image')).toHaveAttribute('src', /tern-pocket/)
  await expect(page.locator('#box-items')).toContainText('稳定器')
})
test('dji: 组合物件与不兼容边界', async ({ page }) => {
  await page.goto('examples/dji/index.html')
  await page.locator('#bundle').selectOption('field')
  await expect(page.locator('#box-items li')).toHaveCount(4)
  await expect(page.locator('#box-items')).toContainText('备用电池')
  await page.locator('[data-task=studio]').click()
  await expect(page.locator('#bundle')).toHaveValue('basic')
  await expect(page.locator('#kit-status')).toContainText('不兼容')
  await expect(page.locator('#bundle option[value=field]')).toBeDisabled()
})
