import { test, expect } from '@playwright/test'
test('wired: 专题过滤与独立导读，全部专题恢复', async ({ page }) => {
  await page.goto('examples/wired/index.html')
  await page.locator('[data-section=materials]').click()
  await expect(page.locator('[data-section-story]:visible')).toHaveCount(1)
  await expect(page.locator('#section-status')).toHaveText('1 篇专题导读')
  await page.locator('[data-section-story=materials] summary').click()
  await expect(page.locator('[data-section-story=materials] details')).toContainText(
    '不提供具体器物修复教学',
  )
  await expect(page.locator('[data-section-story=materials] details p')).toBeVisible()
  await page.locator('[data-section=all]').click()
  await expect(page.locator('[data-section-story]:visible')).toHaveCount(3)
  await expect(page.locator('[data-section=all]')).toHaveAttribute('aria-pressed', 'true')
})
test('wired: 完整长文返回归焦、继续位置和刷新边界', async ({ page }) => {
  await page.goto('examples/wired/index.html')
  await page.locator('#cover-read').click()
  await expect(page.locator('#article')).toBeVisible()
  await expect(page.locator('#topics')).toBeHidden()
  await expect(page.locator('.prose')).toContainText('让维护进入设计')
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }))
  const readingLayout = await page.evaluate(() => {
    const toolbar = document.querySelector('#back-magazine')!.getBoundingClientRect()
    const prose = document.querySelector('.prose')!.getBoundingClientRect()
    return {
      left: toolbar.left,
      right: toolbar.right,
      proseLeft: prose.left,
      proseRight: prose.right,
    }
  })
  expect(readingLayout.left).toBeLessThanOrEqual(readingLayout.proseLeft)
  expect(readingLayout.right).toBeGreaterThanOrEqual(readingLayout.proseRight)
  await page.locator('#back-magazine').click()
  await expect(page.locator('#magazine')).toBeVisible()
  await expect(page.locator('#cover-read')).toBeFocused()
  await expect(page.locator('#open-article')).toHaveText('继续阅读本期长文')
  await page.locator('#open-article').click()
  await expect(page.locator('#article')).toBeVisible()
  await expect(page.locator('.prose')).toContainText('社区可以共享什么')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(700)
  await page.locator('#article-close').click()
  await expect(page.locator('#magazine')).toBeVisible()
  await page.reload()
  await expect(page.locator('#article')).toBeHidden()
  await expect(page.locator('#open-article')).toHaveText('阅读本期长文')
})
