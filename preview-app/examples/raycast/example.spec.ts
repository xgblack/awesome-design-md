import { test, expect } from '@playwright/test'
test('command panel transforms input and Escape returns focus', async ({ page }) => {
  await page.goto('examples/raycast/index.html')
  await page.click('#open')
  await page.fill('#input', 'a small idea')
  await page.click('#execute')
  await expect(page.locator('#result')).toHaveText('A SMALL IDEA')
  await page.keyboard.press('Escape')
  await expect(page.locator('#palette')).not.toBeVisible()
  await expect(page.locator('#open')).toBeFocused()
})
test('extension toggles and no-result command search', async ({ page }) => {
  await page.goto('examples/raycast/index.html')
  await page.uncheck('#color-extension')
  await page.click('#open')
  await page.fill('#search', 'HEX')
  await expect(page.locator('#commands')).toContainText('No commands found')
  await expect(page.locator('#execute')).toBeDisabled()
})
