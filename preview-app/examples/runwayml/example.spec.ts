import { test, expect } from '@playwright/test'
test('film selection updates actual media and poster identity', async ({ page }) => {
  await page.goto('examples/runwayml/index.html')
  await page.click('[data-film=ocean]')
  await expect(page.locator('#film-title')).toHaveText('The space between waves.')
  await expect(page.locator('#film-prompt')).toContainText('coastline')
  await expect
    .poll(() => page.locator('#film').evaluate((el: HTMLVideoElement) => el.currentSrc))
    .toContain('ocean')
  await expect
    .poll(() => page.locator('#film').evaluate((el: HTMLVideoElement) => el.duration))
    .toBeGreaterThan(3)
})
test('play pause and shot seek use real video time', async ({ page }) => {
  await page.goto('examples/runwayml/index.html')
  await page.click('#play')
  await expect
    .poll(() => page.locator('#film').evaluate((el: HTMLVideoElement) => el.paused))
    .toBe(false)
  await page.click('#stop')
  await expect
    .poll(() => page.locator('#film').evaluate((el: HTMLVideoElement) => el.paused))
    .toBe(true)
  await page.locator('[data-shot]').nth(2).click()
  await expect
    .poll(() => page.locator('#film').evaluate((el: HTMLVideoElement) => el.currentTime))
    .toBeGreaterThan(2.5)
})
