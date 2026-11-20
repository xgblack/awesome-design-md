import { test, expect } from '@playwright/test'
test('medium selection changes the actual workbench', async ({ page }) => {
  await page.goto('examples/minimax/index.html')
  await page.click('[data-kind=narration]')
  await expect(page.locator('#text-body')).toContainText('认真看过这个地方')
  await expect(page.locator('#boundary')).toContainText('没有草稿对应人声录音')
  await page.click('[data-kind=story]')
  await page.click('[data-frame=ocean]')
  await expect(page.locator('#frame-caption')).toContainText('Transition frame')
})
test('sound version swaps a real local audio resource', async ({ page }) => {
  await page.goto('examples/minimax/index.html')
  await page.click('[data-kind=music]')
  await expect(page.locator('#audio')).toBeVisible()
  await page.selectOption('#version', 'bells')
  await expect
    .poll(() => page.locator('#audio').evaluate((el: HTMLAudioElement) => el.currentSrc))
    .toContain('bells')
  await expect(page.locator('#audio-note')).toContainText('不含人声')
})

test('voice task uses a real pre-recorded reading, not the draft text', async ({ page }) => {
  await page.goto('examples/minimax/index.html')
  await page.locator('[data-kind=narration]').click()
  await expect(page.locator('#task-prompt')).toHaveValue(/independent of/)
  await expect
    .poll(() => page.locator('#voice-audio').evaluate((el: HTMLAudioElement) => el.duration))
    .toBeGreaterThan(17)
  await page.selectOption('#voice-version', 'timeMachine')
  await expect
    .poll(() => page.locator('#voice-audio').evaluate((el: HTMLAudioElement) => el.currentSrc))
    .toContain('time-machine')
  await expect(page.locator('#voice-note')).toContainText('非音色克隆')
})

test('failed sound sample recovers with a different local resource', async ({ page }) => {
  await page.goto('examples/minimax/index.html')
  const mediaUrl = await page.locator('#audio').evaluate((el: HTMLAudioElement) => el.src)
  let blocked = false
  await page.route(mediaUrl, (r) => {
    if (r.request().resourceType() !== 'media') return r.continue()
    blocked = true
    return r.abort()
  })
  await page.reload()
  await expect.poll(() => blocked).toBe(true)
  await page.locator('[data-kind=music]').click()
  await expect(page.locator('#audio-note')).toContainText('加载失败')
  await page.selectOption('#version', 'bells')
  await expect
    .poll(() => page.locator('#audio').evaluate((el: HTMLAudioElement) => el.duration))
    .toBeGreaterThan(7)
  await expect(page.locator('#audio-note')).toContainText('不含人声')
})
