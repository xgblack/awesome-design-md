import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => {
  await page.goto('examples/1win/index.html')
})
test('游戏海报横轨与关键词共同筛选，零结果保留条件', async ({ page }) => {
  await expect(page.locator('.game-rail img')).toHaveCount(4)
  await expect(
    page.locator('.event').filter({ hasText: 'Vector Tactics' }).locator('.event-thumb'),
  ).toHaveAttribute('src', /tactics-card/)
  await page.locator('.game-rail [data-category="sprint"]').first().click()
  await expect(page.locator('.event')).toHaveCount(2)
  await page.locator('#event-search').fill('North')
  await expect(page.locator('.event')).toHaveCount(1)
  await page.locator('#event-search').fill('不存在')
  await expect(page.locator('#event-status')).toContainText('没有匹配')
  await expect(page.locator('#event-search')).toHaveValue('不存在')
})
test('清单去重、不同开场时间重叠检测及移除恢复', async ({ page }) => {
  await page.locator('[data-add-event="0"]').click()
  await page.locator('[data-add-event="0"]').click()
  await expect(page.locator('#list-status')).toContainText('不重复')
  await page.locator('[data-add-event="1"]').click()
  await expect(page.locator('#list-status')).toContainText('时间有重叠')
  await expect(page.locator('#list-count')).toHaveText('1 场')
  await page.locator('[data-remove-event="0"]').click()
  await page.locator('[data-add-event="1"]').click()
  await page.locator('[data-add-event="2"]').click()
  await expect(page.locator('#list-count')).toHaveText('2 场')
  await page.locator('#clear-list').click()
  await expect(page.locator('#list-count')).toHaveText('0 场')
})
