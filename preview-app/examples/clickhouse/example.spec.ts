import { test, expect } from '@playwright/test'
test('grouping and error queries use actual fixed events', async ({ page }) => {
  await page.goto('examples/clickhouse/index.html')
  await page.selectOption('#template', 'avg')
  await page.click('#run')
  await expect(page.locator('#count')).toHaveText('3 组结果')
  await expect(page.locator('#rows')).toContainText('/dashboard')
  await page.selectOption('#template', 'hot')
  await page.click('#run')
  await expect(page.locator('#count')).toHaveText('1 条事件')
  await expect(page.locator('#rows')).toContainText('480')
})
test('unsupported SQL does not modify query result', async ({ page }) => {
  await page.goto('examples/clickhouse/index.html')
  await page.fill('#query', 'DROP TABLE events;')
  await page.click('#run')
  await expect(page.locator('#error')).toContainText('不支持此语句')
  await expect(page.locator('#count')).toHaveText('6 条事件')
})
