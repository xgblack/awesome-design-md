import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/webflow/index.html')
})
test('模板、布局与手机预览改变真实网站结构', async ({ page }) => {
  await page.locator('#template').selectOption('journal')
  await expect(page.locator('#web-brand')).toHaveText('Ridge Journal')
  await expect(page.locator('#web-projects')).toContainText('Material matters')
  await page.locator('#layout').selectOption('centered')
  await expect(page.locator('#website')).toHaveClass(/centered/)
  await page.locator('[data-device="mobile"]').click()
  await expect(page.locator('#website')).toHaveClass(/mobile/)
  await page.locator('#title').fill('')
  await expect(page.locator('#export')).toBeDisabled()
})
test('标题安全呈现且导出完整网站，不执行用户输入', async ({ page }) => {
  await page.locator('#title').fill('<script>window.injected=1</script>')
  await expect(page.locator('#web-title')).toHaveText('<script>window.injected=1</script>')
  const d = page.waitForEvent('download')
  await page.locator('#export').click()
  const download = await d
  expect(download.suggestedFilename()).toBe('structure-website.html')
  const fs = await import('node:fs/promises')
  const text = await fs.readFile((await download.path())!, 'utf8')
  expect(text).toContain('&lt;script&gt;')
  expect(text).not.toContain('<script>')
  expect(text).toContain('id="work"')
  expect(text).toContain('<footer>')
})
