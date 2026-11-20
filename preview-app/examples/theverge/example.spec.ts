import { test, expect } from '@playwright/test'
test('theverge: 声音主题过滤', async ({ page }) => {
  await page.goto('examples/theverge/index.html')
  await page.locator('[data-topic=scene]').click()
  await expect(page.locator('[data-story]:visible')).toHaveCount(1)
  await expect(page.locator('[data-story]:visible')).toContainText('房间也会开始回应')
  await expect(page.locator('#stream-status')).toContainText('1 条固定报道')
})
test('theverge: 完整器材报道展开与保持状态', async ({ page }) => {
  await page.goto('examples/theverge/index.html')
  await page.locator('[data-expand="0"]').click()
  await expect(page.locator('#story-0')).toContainText('20键桌面合成器概念')
  await expect(page.locator('#story-0')).toContainText('旋钮之间留出手指')
  await page.locator('[data-topic=design]').click()
  await page.locator('[data-topic=all]').click()
  await expect(page.locator('#story-0')).toBeVisible()
  await page.locator('[data-expand="0"]').click()
  await expect(page.locator('#story-0')).toBeHidden()
})
