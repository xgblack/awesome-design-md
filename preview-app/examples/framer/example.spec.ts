import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/framer/index.html')
})
test('网站案例分类与详情打开', async ({ page }) => {
  await page.getByRole('button', { name: 'Editorial', exact: true }).click()
  await expect(page.locator('[data-work]:visible')).toHaveCount(2)
  await page.locator('[data-title="OFF HOURS"]').click()
  await expect(page.locator('#work-title')).toContainText('Website study')
  await page.keyboard.press('Escape')
  await expect(page.locator('#work')).toBeHidden()
})
test('网站内容布局与项目顺序实际改变，空标题可恢复', async ({ page }) => {
  await page.locator('#title').fill('Build a clearer digital home.')
  await page.locator('#layout').selectOption('statement')
  await expect(page.locator('#site-title')).toHaveText('Build a clearer digital home.')
  await expect(page.locator('#site-hero')).toHaveClass('site-hero statement')
  await page.locator('#project-order').selectOption('name')
  await expect(page.locator('.site-project h4').first()).toHaveText('Common Ground')
  await page.locator('#title').fill('')
  await expect(page.locator('#hint')).toContainText('标题为空')
  await page.locator('#reset').click()
  await expect(page.locator('#site-title')).toHaveText('Design for what comes next.')
})
