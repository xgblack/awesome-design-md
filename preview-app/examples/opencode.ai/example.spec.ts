import { test, expect } from '@playwright/test'
test('patch selection and additions filter change exact text', async ({ page }) => {
  await page.goto('examples/opencode.ai/index.html')
  await page.selectOption('#patch', 'escape')
  await page.selectOption('#lines', 'add')
  await expect(page.locator('#file')).toHaveText('src/render.ts')
  await expect(page.locator('#diff-output')).toContainText('target.textContent')
  await expect(page.locator('#diff-output')).not.toContainText('innerHTML')
})
test('invalid patch has an explicit recovery path', async ({ page }) => {
  await page.goto('examples/opencode.ai/index.html')
  await page.selectOption('#patch', 'invalid')
  await expect(page.locator('#parse-error')).toBeVisible()
  await page.selectOption('#patch', 'empty')
  await expect(page.locator('#parse-error')).toBeHidden()
  await expect(page.locator('#summary')).toContainText('+2 additions')
})
