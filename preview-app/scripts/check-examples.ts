import { readdir, readFile, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, resolve } from 'node:path'
import { buildCatalog, validateExample } from './catalog.ts'
import { curation } from '../src/data/curation.ts'
import { isFacetValue } from '../src/data/facets.ts'
const root = fileURLToPath(new URL('../', import.meta.url)),
  examples = join(root, 'examples')
const catalog = await buildCatalog(resolve(root, '../design-md'), examples)
let errors = 0,
  ready = 0,
  draft = 0
const fail = (message: string) => {
  errors++
  console.error(message)
}
const dirs = (await readdir(examples, { withFileTypes: true })).filter(
  (dir) => dir.isDirectory() && !dir.name.startsWith('_'),
)
for (const dir of dirs) {
  if (!catalog.some((entry) => entry.id === dir.name)) fail(`Orphan example: ${dir.name}`)
  try {
    const info = validateExample(
      JSON.parse(await readFile(join(examples, dir.name, 'example.json'), 'utf8')),
    )
    for (const file of ['index.html', 'style.css', 'main.ts', 'example.spec.ts'])
      await access(join(examples, dir.name, file))
    const html = await readFile(join(examples, dir.name, 'index.html'), 'utf8'),
      main = await readFile(join(examples, dir.name, 'main.ts'), 'utf8')
    if (!html.includes('name="viewport"')) fail(`${dir.name}: missing viewport meta`)
    if (!main.includes('announceReady')) fail(`${dir.name}: missing readiness protocol`)
    if (
      /(?:src|href)=["']https?:\/\//.test(html) ||
      /@import\s+(?:url\()?["']https?:/.test(
        await readFile(join(examples, dir.name, 'style.css'), 'utf8'),
      )
    )
      fail(`${dir.name}: remote runtime asset`)
    for (const asset of info.assets) {
      const path = resolve(examples, dir.name, asset.file)
      if (!path.startsWith(examples + '/')) fail(`${dir.name}: asset outside examples`)
      else await access(path)
    }
    if (info.status === 'ready') {
      ready++
      await access(join(examples, dir.name, 'thumbnail.webp'))
      if (!info.interactions.length) fail(`${dir.name}: no declared core capability`)
      if (!['desktop', 'mobile'].every((value) => info.viewports.includes(value)))
        fail(`${dir.name}: missing verified viewport`)
    } else draft++
  } catch (error) {
    fail(`${dir.name}: ${error instanceof Error ? error.message : String(error)}`)
  }
}
for (const entry of catalog) {
  if (entry.exampleError) fail(entry.exampleError)
  const extra = curation[entry.id]
  if (extra) {
    if (!isFacetValue('category', extra.category))
      fail(`${entry.id}: unknown category/${extra.category}`)
    for (const [key, values] of Object.entries(extra.referenceFeatures))
      for (const value of values ?? [])
        if (!isFacetValue(key as Parameters<typeof isFacetValue>[0], value))
          fail(`${entry.id}: unknown reference ${key}/${value}`)
  }
}
const missing = catalog
  .filter((entry) => !dirs.some((dir) => dir.name === entry.id))
  .map((entry) => entry.id)
console.log(
  `${catalog.length} source documents; ${dirs.length} example directories; ${ready} ready; ${draft} draft; ${missing.length} missing; ${errors} errors.`,
)
if (missing.length) console.log('Pending source IDs:', missing.join(', '))
if (errors) process.exitCode = 1
