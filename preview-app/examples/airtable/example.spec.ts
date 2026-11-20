import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/airtable/index.html')
})
test('看板切换展示空分组并可恢复表格', async ({ page }) => {
  await page.getByRole('button', { name: '看板', exact: true }).click()
  await expect(page.locator('.kanban')).toContainText('暂无场景')
  await page.getByRole('button', { name: '表格', exact: true }).click()
  await expect(page.locator('tbody tr')).toHaveCount(3)
})
test('场景打开关联演员，缺少关联有说明', async ({ page }) => {
  await page.getByRole('button', { name: '雨后码头 ↗' }).click()
  await expect(page.locator('#detail')).toContainText('林夏、周安')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: '回家路上 ↗' }).click()
  await expect(page.locator('#detail')).toContainText('缺少场地确认')
})
