import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/linear.app/index.html')
})
test('过滤负责人及阻塞，无结果可恢复', async ({ page }) => {
  await page.locator('#owner').selectOption('许')
  await page.locator('#blocked').check()
  await expect(page.locator('#empty')).toBeVisible()
  await page.getByRole('button', { name: '清除筛选' }).click()
  await expect(page.locator('.issue')).toHaveCount(4)
})
test('状态保存联动发行计数；放弃不写入', async ({ page }) => {
  await page.locator('[data-id="VEC-142"]').click()
  await page.locator('#state').selectOption('已完成')
  await page.getByRole('button', { name: '放弃修改' }).click()
  await expect(page.locator('#count')).toContainText('1 / 4')
  await page.locator('[data-id="VEC-142"]').click()
  await page.locator('#state').selectOption('已完成')
  await page.getByRole('button', { name: '保存状态' }).click()
  await expect(page.locator('#count')).toContainText('2 / 4')
})
