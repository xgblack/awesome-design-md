import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/zapier/index.html')
})
test('映射缺失报错，人数条件改变名单', async ({ page }) => {
  await page.locator('#mapping').selectOption('')
  await page.locator('#next').click()
  await expect(page.locator('#error')).toContainText('缺少姓名字段映射')
  await page.locator('#mapping').selectOption('name')
  await page.locator('#limit').selectOption('6')
  await expect(page.locator('#count')).toHaveText('2 / 3 条符合条件')
})
test('逐步演练产生草稿，超限样本被拦截', async ({ page }) => {
  for (let i = 0; i < 4; i++) await page.locator('#next').click()
  await expect(page.locator('#draft')).toContainText('林夏')
  await page.locator('#event').selectOption('large')
  for (let i = 0; i < 3; i++) await page.locator('#next').click()
  await expect(page.locator('#error')).toContainText('没有生成提醒草稿')
  await expect(page.locator('#result')).toBeHidden()
})
