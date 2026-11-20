import { test, expect } from '@playwright/test'
test('app props update both device DOMs and React Native source', async ({ page }) => {
  await page.goto('examples/expo/index.html')
  await page.fill('#title', 'Release checklist')
  await page.fill('#body', 'Review docs and run the build')
  await page.locator('#form button').click()
  await expect(page.locator('.note-title').first()).toHaveText('Release checklist')
  await expect(page.locator('.note-title').last()).toHaveText('Release checklist')
  await expect(page.locator('#native-source')).toContainText('Release checklist')
  await page.locator('[data-platform=android]').click()
  await expect(page.locator('#command')).toHaveText('npx expo run:android')
})
test('empty title cannot overwrite the current app', async ({ page }) => {
  await page.goto('examples/expo/index.html')
  await page.fill('#title', '   ')
  await page.locator('#form button').click()
  await expect(page.locator('#feedback')).toContainText('请先填写')
  await expect(page.locator('.note-title').first()).toHaveText('Take the slower road.')
})

test('long app content stays inside both device previews', async ({ page }) => {
  await page.goto('examples/expo/index.html')
  await page.fill('#title', 'T'.repeat(60))
  await page.fill('#body', 'B'.repeat(240))
  await page.locator('#form button').click()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => innerWidth),
  )
  await expect(page.locator('.note-title').first()).toHaveText('T'.repeat(60))
})
