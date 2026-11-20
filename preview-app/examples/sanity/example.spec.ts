import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/sanity/index.html')
})
test('标题联动JSON与文章；空标题明确校验', async ({ page }) => {
  await page.locator('#title').fill('河流与回声')
  if (await page.locator('[data-tab="json"]').isVisible())
    await page.locator('[data-tab="json"]').click()
  await expect(page.locator('#json-output')).toContainText('河流与回声')
  if (await page.locator('[data-tab="fields"]').isVisible())
    await page.locator('[data-tab="fields"]').click()
  await page.locator('#title').fill('')
  await expect(page.locator('#error')).toContainText('必填')
})
test('字段路径可定位并恢复种子', async ({ page }) => {
  await page.locator('[data-field="author"]').click()
  await expect(page.locator('#path')).toHaveText('exhibition.author')
  await page.locator('#author').fill('周安')
  await page.getByRole('button', { name: '恢复示例' }).click()
  await expect(page.locator('#author')).toHaveValue('林夏')
})
