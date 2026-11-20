import { test, expect } from '@playwright/test'
test('event changes both rendered letter and event code', async ({ page }) => {
  await page.goto('examples/resend/index.html')
  await page.selectOption('#event', 'dispatch')
  await expect(page.locator('#subject')).toHaveText('A little something is on its way.')
  await expect(page.locator('#code')).toContainText('specimen.dispatched')
})
test('replay failure does not claim mail sent and retry completes', async ({ page }) => {
  await page.goto('examples/resend/index.html')
  await page.check('#failure')
  await page.click('#start')
  await expect(page.locator('#status')).toContainText('校验失败')
  await page.uncheck('#failure')
  await page.click('#start')
  await expect(page.locator('#status')).toContainText('未发送任何邮件')
})
