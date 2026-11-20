import { test, expect } from '@playwright/test'
test('knowledge task and citations point to matching source', async ({ page }) => {
  await page.goto('examples/claude/index.html')
  await page.selectOption('#material', 'policy')
  await page.locator('[data-task=questions]').click()
  await expect(page.locator('#summary-text')).toContainText('多个来源相互矛盾')
  await page.locator('#citations button').nth(1).click()
  await expect(page.locator('#paragraph-1')).toHaveClass('highlight')
  await expect(page.locator('#source-title')).toContainText('POL-006')
})
test('no source means no unsupported summary', async ({ page }) => {
  await page.goto('examples/claude/index.html')
  await page.selectOption('#material', 'none')
  await page.locator('[data-task=summary]').click()
  await expect(page.locator('#summary-text')).toContainText('没有材料时')
  await expect(page.locator('#citations button')).toHaveCount(0)
  await expect(page.locator('#source-text p')).toHaveCount(0)
})
