import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/notion/index.html')
})
test('看板与日历切换保留筛选', async ({ page }) => {
  await page.locator('#filter').selectOption('review')
  await page.getByRole('button', { name: '日历', exact: true }).click()
  await expect(page.locator('.article')).toHaveCount(1)
  await expect(page.locator('.article')).toContainText('沿着河岸')
})
test('属性修改取消不写入，保存后更新卡片', async ({ page }) => {
  await page.locator('[data-article="1"]').click()
  await page.locator('#stage').selectOption('done')
  await page.getByRole('button', { name: '取消', exact: true }).click()
  await expect(page.locator('[data-article="1"]')).toContainText('撰写中')
  await page.locator('[data-article="1"]').click()
  await page.locator('#stage').selectOption('done')
  await page.getByRole('button', { name: '保存修改' }).click()
  await expect(page.locator('[data-article="1"]')).toContainText('可出版')
})
