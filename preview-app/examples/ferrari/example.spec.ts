import { test, expect } from '@playwright/test'
test('ferrari: 车漆对应渲染', async ({ page }) => {
  await page.goto('examples/ferrari/index.html')
  await page.locator('[data-paint=bianco]').click()
  await expect(page.locator('#paint-car')).toHaveAttribute('alt', /Bianco/)
  await expect(page.locator('#paint-note')).toContainText('明亮车身')
})
test('ferrari: 车款组合筛选和无结果恢复', async ({ page }) => {
  await page.goto('examples/ferrari/index.html')
  await page.locator('#series').selectOption('gt')
  await expect(page.locator('#cars article')).toHaveCount(1)
  await page.locator('#year').selectOption('2026')
  await expect(page.locator('#empty')).toBeVisible()
  await expect(page.locator('#series')).toHaveValue('gt')
  await page.locator('#reset').click()
  await expect(page.locator('#cars article')).toHaveCount(3)
})
