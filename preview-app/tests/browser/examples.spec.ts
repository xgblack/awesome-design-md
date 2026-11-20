import { test, expect } from '@playwright/test'
import { readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../../examples/', import.meta.url))
const ids = readdirSync(root, { withFileTypes: true })
  .filter(
    (dir) =>
      dir.isDirectory() &&
      !dir.name.startsWith('_') &&
      existsSync(`${root}/${dir.name}/index.html`),
  )
  .map((dir) => dir.name)
for (const id of ids)
  test(`${id}: local resources, ready signal, readable viewport`, async ({ page }, info) => {
    const errors: string[] = [],
      external: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
    })
    page.on('request', (request) => {
      if (
        /^https?:/.test(request.url()) &&
        new URL(request.url()).origin !== new URL(info.project.use.baseURL!).origin
      )
        external.push(request.url())
    })
    await page.goto(`examples/${encodeURIComponent(id)}/index.html`)
    await expect(page.locator('html')).toHaveAttribute('data-example', id)
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
    await expect(page.locator('h1').first()).toBeVisible()
    await page.evaluate(async () => {
      await document.fonts.ready
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
        scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 15))
      }
      await Promise.all(
        [...document.images]
          .filter((img) => Boolean(img.currentSrc || img.getAttribute('src')))
          .map((img) => img.decode()),
      )
      scrollTo(0, 0)
    })
    expect(errors).toEqual([])
    expect(external).toEqual([])
    const overflow = () =>
      page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }))
    let dimensions = await overflow()
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1)
    if (info.project.name === 'mobile') {
      await page.setViewportSize({ width: 320, height: 844 })
      dimensions = await overflow()
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1)
    }
  })
