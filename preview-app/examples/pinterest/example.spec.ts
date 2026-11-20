import { test, expect } from '@playwright/test'
test('pinterest: 关键词与主题联合筛选', async ({ page }) => {
  await page.goto('examples/pinterest/index.html')
  await page.locator('#pin-search').fill('岛台')
  await expect(page.locator('[data-pin]:visible')).toHaveCount(2)
  await page.locator('[data-topic-filter=bedroom]').click()
  await expect(page.locator('[data-pin]:visible')).toHaveCount(0)
  await expect(page.locator('#pin-empty')).toBeVisible()
})
test('pinterest: 收录与移除不重复', async ({ page }) => {
  await page.goto('examples/pinterest/index.html')
  await page.locator('[data-pin="0"]').click()
  await page.locator('#save-pin').click()
  await expect(page.locator('#saved-count')).toHaveText('1')
  await page.locator('#save-pin').click()
  await expect(page.locator('#saved-count')).toHaveText('0')
  await page.keyboard.press('Escape')
  await expect(page.locator('#pin-detail')).toBeHidden()
})

test('pinterest: 厨房分类对应真实图像内容', async ({ page }) => {
  await page.goto('examples/pinterest/index.html')
  await page.locator('[data-topic-filter=kitchen]').click()
  await expect(page.locator('[data-pin]:visible')).toHaveCount(3)
  for (const img of await page.locator('[data-pin]:visible img').all())
    await expect(img).toHaveAttribute('alt', /厨房/)
})
