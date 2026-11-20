import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/mastercard/index.html')
})
test('业务场景改变能力说明，基础环节缺失不可完成', async ({ page }) => {
  await page.locator('#business').selectOption('travel')
  await expect(page.locator('#list')).toContainText('行程预订')
  await page.locator('[data-capability="verify"]').click()
  await expect(page.locator('#make-summary')).toBeDisabled()
  await expect(page.locator('#requirements')).toContainText('验证')
  await page.locator('[data-capability="verify"]').click()
  await page.locator('#make-summary').click()
  await expect(page.locator('#solution-summary')).toContainText('不会创建支付')
})
test('商户故事可读且归焦，附加对账真正进入摘要', async ({ page }) => {
  await page.locator('[data-story="lin"]').click()
  await expect(page.locator('#story-copy')).toContainText('原创示例')
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-story="lin"]')).toBeFocused()
  await page.locator('[data-capability="reconcile"]').click()
  await page.locator('#make-summary').click()
  await expect(page.locator('#solution-summary')).toContainText('费用与结算汇总')
})
