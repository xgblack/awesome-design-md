import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/stripe/index.html')
})
test('票数单价重算，非法值保留原账本', async ({ page }) => {
  await page.locator('#quantity').fill('0')
  await page.getByRole('button', { name: '更新演示账本 →' }).click()
  await expect(page.locator('#error')).toContainText('1–1000')
  await page.locator('#quantity').fill('1')
  await page.locator('#price').fill('100')
  await page.getByRole('button', { name: '更新演示账本 →' }).click()
  await expect(page.locator('#net')).toHaveText('¥95.10')
})
test('退款事件联动账本与payload', async ({ page }) => {
  await page.getByRole('button', { name: '整单退款', exact: true }).click()
  await expect(page.locator('#net-label')).toHaveText('退款后剩余费用')
  await expect(page.locator('#net')).toHaveText('−¥13.60')
  await expect(page.locator('#payload')).toContainText('ticket.refunded')
})
