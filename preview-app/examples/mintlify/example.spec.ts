import { test, expect } from '@playwright/test'
test('language tab changes the actual request code', async ({ page }) => {
  await page.goto('examples/mintlify/index.html')
  await page.click('[data-language=python]')
  await expect(page.locator('#code')).toContainText('import requests')
  await page.click('[data-language=curl]')
  await expect(page.locator('#code')).toContainText('curl https')
})
test('documentation search reports no results and restores content', async ({ page }) => {
  await page.goto('examples/mintlify/index.html')
  await page.fill('#search', 'nonexistentzz')
  await expect(page.locator('#search-info')).toContainText('没有匹配')
  await page.fill('#search', '温度')
  await expect(page.locator('#readings')).toBeVisible()
  await page.fill('#search', '')
  await expect(page.locator('#search-info')).toHaveText('4 个匹配章节')
})
