import { test, expect } from '@playwright/test'
test('playstation: 玩法筛选', async ({ page }) => {
  await page.goto('examples/playstation/index.html')
  await page.locator('[data-genre=puzzle]').click()
  await expect(page.locator('[data-genre-game]:visible')).toHaveCount(1)
  await expect(page.locator('#genre-status')).toContainText('1 款')
})
test('playstation: 试玩去重和时间冲突', async ({ page }) => {
  await page.goto('examples/playstation/index.html')
  await page.locator('[data-session="0"]').click()
  await page.locator('[data-session="1"]').click()
  await expect(page.locator('#session-status')).toContainText('时间冲突')
  await page.locator('[data-session="2"]').click()
  await expect(page.locator('#sessions > p')).toHaveCount(2)
  await page.locator('#clear-sessions').click()
  await expect(page.locator('#sessions')).toHaveText('还没有选择作品。')
})
