import { test, expect } from '@playwright/test'
test('model and task recipe agree on command and response', async ({ page }) => {
  await page.goto('examples/ollama/index.html')
  await page.selectOption('#sample', 'explain')
  await expect(page.locator('#command')).toContainText('loom-code')
  await page.click('#run')
  await expect(page.locator('#output')).toContainText('Set 按首次出现的顺序')
})
test('unknown requests and mismatched models never generate answers', async ({ page }) => {
  await page.goto('examples/ollama/index.html')
  await page.selectOption('#model', 'vision')
  await page.click('#run')
  await expect(page.locator('#feedback')).toContainText('不匹配')
  await page.fill('#input', 'Describe my private file')
  await page.click('#run')
  await expect(page.locator('#feedback')).toContainText('不运行真实模型')
  await expect(page.locator('#copy-result')).toBeDisabled()
})
