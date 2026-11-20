import { test, expect } from '@playwright/test'
test('project edits propagate to table and Realtime fixture', async ({ page }) => {
  await page.goto('examples/supabase/index.html')
  await page.fill('#location', 'preview')
  await page.click('#edit button')
  await expect(page.locator('.row').first()).toContainText('preview')
  await expect(page.locator('#stream')).toContainText('production → preview')
})
test('environment and unique project names are checked', async ({ page }) => {
  await page.goto('examples/supabase/index.html')
  await page.fill('#name', 'docs-site')
  await page.click('#edit button')
  await expect(page.locator('#feedback')).toContainText('项目名称已存在')
  await page.fill('#name', 'api-service')
  await page.fill('#location', 'unknown')
  await page.click('#edit button')
  await expect(page.locator('#feedback')).toContainText('仅支持')
  await page.selectOption('#query', 'production')
  await expect(page.locator('.row')).toHaveCount(1)
})

test('project labels remain literal and contained at maximum length', async ({ page }) => {
  await page.goto('examples/supabase/index.html')
  await page.fill('#name', 'p'.repeat(24))
  await page.locator('#edit button').click()
  await expect(page.locator('.row').first()).toContainText('p'.repeat(24))
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => innerWidth),
  )
})
