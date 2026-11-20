import { test, expect } from '@playwright/test'
test('human readings are real media with actual playback and rate', async ({ page }) => {
  await page.goto('examples/elevenlabs/index.html')
  await expect
    .poll(() => page.locator('#audio').evaluate((el: HTMLAudioElement) => el.duration))
    .toBeGreaterThan(17)
  await page.click('#play')
  await expect
    .poll(() => page.locator('#audio').evaluate((el: HTMLAudioElement) => el.paused))
    .toBe(false)
  await page.click('#play')
  await expect
    .poll(() => page.locator('#audio').evaluate((el: HTMLAudioElement) => el.paused))
    .toBe(true)
  await page.locator('[data-piece=timeMachine]').click()
  await expect(page.locator('#note-text')).toContainText('Aaron Elliott')
  await page.selectOption('#speed', '1.5')
  await expect
    .poll(() => page.locator('#audio').evaluate((el: HTMLAudioElement) => el.playbackRate))
    .toBe(1.5)
})
test('independent draft never becomes a fake transcript or generated voice', async ({ page }) => {
  await page.goto('examples/elevenlabs/index.html')
  const original = await page.locator('#audio').getAttribute('src')
  await page.fill('#draft', 'This is an independent project draft.')
  await expect(page.locator('#draft-count')).toContainText('不生成语音')
  expect(await page.locator('#audio').getAttribute('src')).toBe(original)
  await page.locator('[data-piece=bells]').click()
  await expect(page.locator('#piece-title')).toHaveText('A bell, a little longer.')
  await expect(page.locator('#note-text')).toContainText('不是所播音频的逐字稿')
})
test('audio failures can recover by selecting another local sample', async ({ page }) => {
  await page.goto('examples/elevenlabs/index.html')
  const mediaUrl = await page.locator('#audio').evaluate((el: HTMLAudioElement) => el.src)
  let blocked = false
  await page.route(mediaUrl, (r) => {
    if (r.request().resourceType() !== 'media') return r.continue()
    blocked = true
    return r.abort()
  })
  await page.reload()
  await expect.poll(() => blocked).toBe(true)
  await expect(page.locator('#play-state')).toContainText('未能加载')
  await page.locator('[data-piece=bells]').click()
  await expect
    .poll(() => page.locator('#audio').evaluate((el: HTMLAudioElement) => el.duration))
    .toBeGreaterThan(7)
  await page.click('#play')
  await expect
    .poll(() => page.locator('#audio').evaluate((el: HTMLAudioElement) => el.paused))
    .toBe(false)
})
