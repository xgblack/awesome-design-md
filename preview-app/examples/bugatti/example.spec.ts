import { test, expect } from '@playwright/test'
test('bugatti: 外观对应独立渲染', async ({ page }) => {
  await page.goto('examples/bugatti/index.html')
  await page.locator('[data-paint=noir]').click()
  await expect(page.locator('#finish-car')).toHaveAttribute('alt', /Noir GT/)
  await expect(page.locator('#paint-note')).toContainText('深色漆面')
  await page.locator('[data-paint=ivory]').click()
  await expect(page.locator('#hero-car')).toHaveAttribute('src', /aurel-ivory/)
})
test('bugatti: 工艺细节和目录返回焦点', async ({ page }) => {
  await page.goto('examples/bugatti/index.html')
  await page.locator('[data-hot=metal]').click()
  await expect(page.locator('#craft-note')).toContainText('独立旋钮')
  await page.locator('#index-open').click()
  await expect(page.locator('#index')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#index')).not.toBeVisible()
  await expect(page.locator('#index-open')).toBeFocused()
})
