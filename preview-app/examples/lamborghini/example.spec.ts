import { test, expect } from '@playwright/test'
test('lamborghini: 真实汽车短片可播放暂停', async ({ page }) => {
  await page.goto('examples/lamborghini/index.html')
  await page.locator('#film-toggle').click()
  await expect
    .poll(() => page.locator('#reveal-film').evaluate((e: HTMLVideoElement) => !e.paused))
    .toBe(true)
  await page.locator('#film-toggle').click()
  await expect
    .poll(() => page.locator('#reveal-film').evaluate((e: HTMLVideoElement) => e.paused))
    .toBe(true)
})
test('lamborghini: 换涂装停止固定短片', async ({ page }) => {
  await page.goto('examples/lamborghini/index.html')
  await page.locator('#film-toggle').click()
  await page.locator('[data-finish=white]').click()
  await expect(page.locator('#finish-image')).toHaveAttribute('alt', /POLAR 超级跑车/)
  await expect(page.locator('#reveal-film')).toBeHidden()
  await expect
    .poll(() => page.locator('#reveal-film').evaluate((e: HTMLVideoElement) => e.paused))
    .toBe(true)
  await expect(page.locator('#film-status')).toContainText('固定展示 Titan')
})
