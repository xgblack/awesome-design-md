import { test, expect } from '@playwright/test'
test('gallery, basis, URL restoration and document reader stay connected', async ({ page }) => {
  await page.goto('#/discover?q=cursor')
  await expect(page.locator('.style-card')).toHaveCount(1)
  await expect(page.locator('.style-card img')).toBeVisible()
  await expect(page.locator('.card-foot')).toContainText('已有示例')
  await page.getByRole('link', { name: '查看 Cursor 详情' }).click()
  await expect(page.locator('.preview-state')).toHaveCount(0)
  await expect(page.locator('.example-preview iframe')).toHaveAttribute('width', '1440')
  await page.getByRole('button', { name: '手机', exact: true }).click()
  await expect(page).toHaveURL(/viewport=mobile/)
  await expect(page.locator('.example-preview iframe')).toHaveAttribute('width', '390')
  await expect
    .poll(() =>
      page
        .locator('.example-preview iframe')
        .evaluate((el) => (el as HTMLIFrameElement).contentWindow?.innerWidth),
    )
    .toBe(390)
  await page.getByRole('button', { name: '桌面', exact: true }).click()
  await expect(page.locator('.example-preview iframe')).toHaveAttribute('width', '1440')
  await expect(page.getByRole('button', { name: '桌面', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: '设计规范', exact: true }).click()
  await expect(page.locator('.markdown-body')).toBeVisible()
  await page.getByRole('button', { name: '源码', exact: true }).click()
  await expect(page.locator('.raw-reader pre')).toContainText('Cursor')
  await page.goBack()
  await expect(page.locator('.markdown-body')).toBeVisible()
})
test('basis applies directly on desktop and remains a cancellable draft on phones', async ({
  page,
}, info) => {
  await page.goto('#/discover?q=cursor')
  if (info.project.name === 'desktop') {
    await page.getByRole('radio', { name: '按示例页面', exact: true }).check()
    await expect(page).toHaveURL(/basis=example/)
    await expect(page.locator('.style-card')).toHaveCount(1)
    await page.goBack()
    await expect(page.getByRole('radio', { name: '按规范特点', exact: true })).toBeChecked()
    return
  }
  const original = page.url()
  await page.getByRole('button', { name: /^筛选/ }).click()
  const dialog = page.getByRole('dialog', { name: '筛选风格' })
  await dialog.getByRole('radio', { name: '按示例页面', exact: true }).check()
  await dialog.getByRole('button', { name: '关闭筛选', exact: true }).click()
  expect(page.url()).toBe(original)
  await page.getByRole('button', { name: /^筛选/ }).click()
  await expect(dialog.getByRole('radio', { name: '按规范特点', exact: true })).toBeChecked()
  await dialog.getByRole('radio', { name: '按示例页面', exact: true }).check()
  await dialog.getByRole('button', { name: /查看 .* 个结果/ }).click()
  await expect(page).toHaveURL(/basis=example/)
  await expect(page.locator('.style-card')).toHaveCount(1)
  await expect(page.locator('.basis-chip')).toContainText('按示例页面')
})
test('comparison mounts three documents on desktop but only the chosen one on a phone', async ({
  page,
}, info) => {
  await page.goto('#/compare?compare=cursor,airbnb,dell-1996')
  await expect(page.locator('.example-preview iframe')).toHaveCount(
    info.project.name === 'mobile' ? 1 : 3,
  )
  if (info.project.name === 'mobile') {
    await page
      .locator('.comparison-mobile-tabs')
      .getByRole('button', { name: 'Airbnb', exact: true })
      .click()
    await expect(page.locator('.example-preview iframe')).toHaveCount(1)
    await expect(page.locator('.example-preview iframe')).toHaveAttribute('title', /Airbnb/)
  }
  await page.getByRole('button', { name: '规范信息对照', exact: true }).click()
  await expect(page.locator('.example-preview iframe')).toHaveCount(0)
  await expect(page.locator('.comparison-content:visible').first()).toContainText('原文色彩摘录')
})
test('a 404 fallback cannot masquerade as a ready example; spoofed messages are ignored and retry recovers', async ({
  page,
}) => {
  await page.route('**/examples/cursor/index.html*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><h1>Unrelated fallback document</h1>',
    }),
  )
  await page.goto('#/style/cursor')
  await page.evaluate(() => {
    const token = new URL(document.querySelector('iframe')!.src).searchParams.get('atlas-instance')
    window.postMessage({ type: 'atlas:ready', slug: 'cursor', instance: token }, location.origin)
  })
  await expect(page.getByText('正在载入独立示例…')).toBeVisible()
  await expect(page.getByRole('heading', { name: '这个预览未能就绪' })).toBeVisible({
    timeout: 18000,
  })
  await page.unroute('**/examples/cursor/index.html*')
  await page.getByRole('button', { name: '重新加载', exact: true }).click()
  await expect(page.locator('.preview-state')).toHaveCount(0)
  await expect(
    page.frameLocator('iframe').getByRole('heading', { name: /A little more clarity/ }),
  ).toBeVisible()
})
test('missing screenshot has an explicit image-error state while the accepted page remains available', async ({
  page,
}) => {
  await page.route(/\/thumbnail(?:-[\w-]+)?\.webp(?:\?|$)/, (route) =>
    route.request().resourceType() === 'image' ? route.abort() : route.continue(),
  )
  await page.goto('#/discover?q=cursor')
  await expect(page.getByText('截图暂时未能载入')).toBeVisible()
  await page.getByRole('link', { name: '查看 Cursor 详情' }).click()
  await expect(page.locator('.preview-state')).toHaveCount(0)
})
test('a broken example image reports its own failure and retry restores the real document', async ({
  page,
}) => {
  const brokenImage = async (route: import('@playwright/test').Route) => {
    const request = route.request()
    if (request.resourceType() === 'image' && request.frame().url().includes('/examples/airbnb/'))
      await route.abort()
    else await route.continue()
  }
  await page.route('**/*', brokenImage)
  await page.goto('#/style/airbnb')
  await expect(page.getByRole('heading', { name: '这个预览未能就绪' })).toBeVisible()
  await expect(page.locator('.preview-state')).toContainText('图片未能载入')
  await page.unroute('**/*', brokenImage)
  await page.getByRole('button', { name: '重新加载', exact: true }).click()
  await expect(page.locator('.preview-state')).toHaveCount(0)
  await expect(page.frameLocator('iframe').locator('html')).toHaveAttribute('data-ready', 'true')
  await page.goto('#/style/cursor')
  await expect(page.locator('.preview-state')).toHaveCount(0)
})
test('enlarged preview has native modal keyboard closure and returns to the embedded view', async ({
  page,
}) => {
  await page.goto('#/style/cursor')
  await expect(page.locator('.preview-state')).toHaveCount(0)
  await page.getByRole('button', { name: '放大', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: '放大', exact: true })).toBeFocused()
})

test('source download preserves the full original document and favorites survive a reload', async ({
  page,
}) => {
  const { readFile } = await import('node:fs/promises')
  const { fileURLToPath } = await import('node:url')
  await page.goto('#/style/cursor?tab=spec')
  await expect(page.locator('.markdown-body')).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '下载原文', exact: true }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('cursor-DESIGN.md')
  const path = await download.path()
  expect(await readFile(path!, 'utf8')).toBe(
    await readFile(
      fileURLToPath(new URL('../../../design-md/cursor/DESIGN.md', import.meta.url)),
      'utf8',
    ),
  )
  await page.goto('#/discover?q=cursor')
  await page.getByRole('button', { name: '收藏 Cursor', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: '取消收藏 Cursor', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})
test('zero-result constraints remain visible and selected zero-count options remain removable', async ({
  page,
}, info) => {
  await page.goto('#/discover?q=NOT_A_REAL_STYLE_742&moods=minimal&typography=serif')
  await expect(page.locator('.result-count')).toContainText('0 个结果')
  await expect(page.getByRole('button', { name: '移除筛选 衬线', exact: true })).toBeVisible()
  const scope =
    info.project.name === 'mobile'
      ? page.getByRole('dialog', { name: '筛选风格' })
      : page.locator('.desktop-filters')
  if (info.project.name === 'mobile') await page.getByRole('button', { name: /^筛选/ }).click()
  await expect(scope.getByRole('checkbox', { name: /^极简克制/ })).toBeEnabled()
  await expect(scope.getByRole('checkbox', { name: /^极简克制/ })).toBeChecked()
  await expect(scope.getByRole('checkbox', { name: /^科技感/ })).toBeDisabled()
  if (info.project.name === 'mobile')
    await scope.getByRole('button', { name: '关闭筛选', exact: true }).click()
  await page.getByRole('button', { name: '移除筛选 衬线', exact: true }).click()
  await expect(page).not.toHaveURL(/typography=/)
  await expect(page).toHaveURL(/moods=minimal/)
})
