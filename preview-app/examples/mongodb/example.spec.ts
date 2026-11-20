import { test, expect } from '@playwright/test'
test('course filters narrow the actual catalog', async ({ page }) => {
  await page.goto('examples/mongodb/index.html')
  await page.selectOption('#track', 'query')
  await page.selectOption('#level', 'next')
  await expect(page.locator('.course')).toHaveCount(1)
  await expect(page.locator('.course')).toContainText('把记录变成观察')
})
test('prerequisite is required and duplicate is not added', async ({ page }) => {
  await page.goto('examples/mongodb/index.html')
  await page.click('[data-course=model]')
  await expect(page.locator('#path-message')).toContainText('请先加入先修课程')
  await page.click('[data-course=docs]')
  await page.click('[data-course=model]')
  await expect(page.locator('#path-list li')).toHaveCount(2)
  await page.click('#clear')
  await expect(page.locator('#path-list li')).toHaveCount(0)
})
