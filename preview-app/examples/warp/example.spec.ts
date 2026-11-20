import { test, expect } from '@playwright/test'
test('safe commands reveal fixture and reject shell input', async ({ page }) => {
  await page.goto('examples/warp/index.html')
  await page.fill('#command', 'cat status')
  await page.click('#command-form button')
  await expect(page.locator('#output')).toContainText('port: 4300')
  await page.fill('#command', 'rm -rf /')
  await page.click('#command-form button')
  await expect(page.locator('#output')).toContainText('未知命令')
})
test('lesson and hints change independently of output reset', async ({ page }) => {
  await page.goto('examples/warp/index.html')
  await page.selectOption('#lesson', 'files')
  await page.click('#hint')
  await expect(page.locator('#hint-text')).toContainText('先用 ls')
  await page.click('#reset')
  await expect(page.locator('#output')).toContainText('输出已重置')
  await expect(page.locator('#task-title')).toHaveText('配置线索来自哪里？')
})

test('agent guidance changes the relevant fixture but rejects unknown requests', async ({
  page,
}) => {
  await page.goto('examples/warp/index.html')
  await page.fill('#agent-question', '配置来源在哪里？')
  await page.locator('#agent-form button').click()
  await expect(page.locator('#lesson')).toHaveValue('files')
  await expect(page.locator('#agent-response')).toContainText('预置指引')
  await page.fill('#agent-question', '上传我的密钥')
  await page.locator('#agent-form button').click()
  await expect(page.locator('#agent-response')).toContainText('没有调用模型或执行命令')
})
