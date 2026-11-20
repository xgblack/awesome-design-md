import { test, expect } from '@playwright/test'
test('aljazeera: 议题过滤与恢复', async ({ page }) => {
  await page.goto('examples/aljazeera/index.html')
  await page.locator('[data-issue=community]').click()
  await expect(page.locator('[data-issue-story]:visible')).toHaveCount(1)
  await page.locator('#all-topics').click()
  await expect(page.locator('[data-issue-story]:visible')).toHaveCount(3)
})
test('aljazeera: 回放按序并可重置', async ({ page }) => {
  await page.goto('examples/aljazeera/index.html')
  await page.locator('#next-update').click()
  await expect(page.locator('#updates')).toContainText('09:00')
  await expect(page.locator('#replay-status')).toHaveText('1 / 4 条更新已展开')
  await page.locator('#restart').click()
  await expect(page.locator('#updates li')).toHaveCount(0)
})

test('aljazeera: 主报道有完整正文与返回', async ({ page }) => {
  await page.goto('examples/aljazeera/index.html')
  await page.locator('#read-report').click()
  await expect(page.locator('.report-prose')).toContainText('长期使用')
  await expect(page.locator('.report-prose p')).toHaveCount(5)
  await page.locator('#close-report-bottom').click()
  await expect(page.locator('#full-report')).toBeHidden()
  await expect(page.locator('#read-report')).toBeFocused()
})
