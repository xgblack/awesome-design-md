import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { access, mkdir, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
const root = fileURLToPath(new URL('../', import.meta.url))
const base = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:4173/'
const requested = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))
const dirs = (await readdir(join(root, 'examples'), { withFileTypes: true })).filter(
  (dir) =>
    dir.isDirectory() &&
    !dir.name.startsWith('_') &&
    (!requested.length || requested.includes(dir.name)),
)
const output = join(root, '.screenshots/examples')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
let failures = 0,
  captures = 0
try {
  for (const dir of dirs) {
    await access(join(root, 'examples', dir.name, 'index.html'))
    for (const [device, width, height] of [
      ['desktop', 1440, 900],
      ['mobile', 390, 844],
    ] as const) {
      const page = await browser.newPage({
        viewport: { width, height },
        reducedMotion: 'reduce',
        locale: 'zh-CN',
        timezoneId: 'Asia/Shanghai',
      })
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('response', (response) => {
        if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
      })
      try {
        await page.goto(new URL(`examples/${encodeURIComponent(dir.name)}/index.html`, base).href)
        await page.waitForSelector('html[data-ready="true"]', { timeout: 15_000 })
        await page.evaluate(async () => {
          await document.fonts.ready
          for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
            scrollTo(0, y)
            await new Promise((resolve) => setTimeout(resolve, 30))
          }
          await Promise.all(
            [...document.images]
              .filter((img) => Boolean(img.currentSrc || img.getAttribute('src')))
              .map((img) =>
                img.decode().catch(() => {
                  throw new Error(`Image decode failed: ${img.src}`)
                }),
              ),
          )
          scrollTo(0, 0)
        })
        if (errors.length) throw new Error(errors.join('; '))
        await page.screenshot({
          path: join(output, `${dir.name}-${device}.png`),
          fullPage: true,
          animations: 'disabled',
        })
        if (device === 'desktop') {
          const viewport = await page.screenshot({ animations: 'disabled' })
          await sharp(viewport)
            .resize(720, 450)
            .webp({ quality: 82 })
            .toFile(join(root, 'examples', dir.name, 'thumbnail.webp'))
        }
        captures++
      } catch (error) {
        failures++
        console.error(
          `${dir.name}/${device}: ${error instanceof Error ? error.message : String(error)}`,
        )
      } finally {
        await page.close()
      }
    }
    console.log(`Captured ${dir.name}`)
  }
} finally {
  await browser.close()
}
console.log(
  `${captures} full-page screenshots; ${dirs.length} pages attempted; ${failures} failures. Output: ${output}`,
)
if (failures) process.exitCode = 1
