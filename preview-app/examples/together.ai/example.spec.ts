import { test, expect } from '@playwright/test'
test('capability filters intersect batch support', async ({ page }) => {
  await page.goto('examples/together.ai/index.html')
  await page.selectOption('#type', 'audio')
  await page.check('#batch')
  await expect(page.locator('#rows tr')).toHaveCount(0)
  await page.uncheck('#batch')
  await expect(page.locator('#rows tr')).toHaveCount(1)
})
test('cost uses disclosed fixed rate and rejects unsupported batch', async ({ page }) => {
  await page.goto('examples/together.ai/index.html')
  await page.check('#batch-price')
  await page.click('#form button')
  await expect(page.locator('#cost')).toContainText('$0.2000')
  await page.selectOption('#workload', 'voice')
  await page.click('#form button')
  await expect(page.locator('#cost')).toContainText('不支持批量')
})

test('fractional token inputs cannot create a misleading estimate', async ({ page }) => {
  await page.goto('examples/together.ai/index.html')
  await page.fill('#tokens', '1.5')
  await page.locator('#tokens').evaluate((el: HTMLInputElement) => (el.step = 'any'))
  await page.click('#form button')
  await expect(page.locator('#cost')).toContainText('整数 token 数')
})
