import { test, expect } from '@playwright/test'
test('branch selection changes an actual DOM preview', async ({ page }) => {
  await page.goto('examples/vercel/index.html')
  await page.selectOption('#branch', 'field')
  await expect(page.locator('#preview-title')).toHaveText('The long way home.')
  await page.click('#run')
  await expect(page.locator('#status')).toContainText('回放完成')
})
test('failure and cancel do not produce deployment', async ({ page }) => {
  await page.goto('examples/vercel/index.html')
  await page.check('#fail')
  await page.click('#run')
  await expect(page.locator('#status')).toContainText('模拟构建失败')
  await page.uncheck('#fail')
  await page.click('#run')
  await page.click('#cancel')
  await expect(page.locator('#status')).toContainText('回放已取消')
})
