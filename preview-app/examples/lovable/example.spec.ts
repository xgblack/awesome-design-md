import { test, expect } from '@playwright/test'
test('template makes an editable website and exports real HTML', async ({ page }) => {
  await page.goto('examples/lovable/index.html')
  await page.locator('.suggestions [data-template=product]').click()
  await expect(page.locator('#prototype')).toContainText('Room to think')
  await page.fill('#plan-title', 'A calmer product')
  await expect(page.locator('#prototype h2')).toHaveText('A calmer product')
  await page.getByRole('button', { name: '上移第 2 章', exact: true }).click()
  await expect(page.locator('.proto-sections h3').first()).toHaveText('Made for momentum')
  const pending = page.waitForEvent('download')
  await page.click('#download')
  const file = await pending
  expect(file.suggestedFilename()).toBe('launchpaper-prototype.html')
  const { readFile } = await import('node:fs/promises')
  expect(await readFile((await file.path())!, 'utf8')).toContain('A calmer product')
})
test('unsupported prompts and empty export names are explicit', async ({ page }) => {
  await page.goto('examples/lovable/index.html')
  await page.fill('#prompt', '预约一个周末')
  await page.locator('#prompt-form button').click()
  await expect(page.locator('#feedback')).toContainText('不调用 AI')
  await expect(page.locator('#plan')).toBeHidden()
  await page.locator('.suggestions [data-template=portfolio]').click()
  await page.fill('#plan-title', '')
  await page.click('#download')
  await expect(page.locator('#plan-status')).toContainText('不能为空')
})

test('long titles remain contained and markup is rendered as text', async ({ page }) => {
  await page.goto('examples/lovable/index.html')
  await page.locator('.suggestions [data-template=portfolio]').click()
  await page.fill('#plan-title', 'A'.repeat(60))
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => innerWidth),
  )
  await page.fill('#plan-title', '<img src=x onerror=alert(1)>')
  await expect(page.locator('#prototype h2')).toHaveText('<img src=x onerror=alert(1)>')
  await expect(page.locator('#prototype img')).toHaveCount(0)
})
