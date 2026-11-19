import { test } from 'vite-plus/test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCatalog } from '../scripts/catalog.ts'
import { curation } from '../src/data/curation.ts'
import { facets } from '../src/data/facets.ts'
import { emptyFilters, filterCatalog, removeFilter, toggleFacet } from '../src/lib/catalog.ts'

const sourceRoot = fileURLToPath(new URL('../../design-md', import.meta.url))
const catalog = await buildCatalog(sourceRoot)

test('every actual DESIGN.md is collected, including Slack and malformed / absent frontmatter', async () => {
  const dirs = await readdir(sourceRoot, { withFileTypes: true })
  const actual: string[] = []
  for (const dir of dirs.filter((item) => item.isDirectory())) {
    try {
      await readFile(join(sourceRoot, dir.name, 'DESIGN.md'))
      actual.push(dir.name)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }
  assert.deepEqual(catalog.map((s) => s.id).sort(), actual.sort())
  assert.equal(new Set(catalog.map((s) => s.id)).size, actual.length)
  assert.ok(catalog.some((s) => s.id === 'slack'))
  for (const id of ['elevenlabs', 'raycast', 'supabase'])
    assert.equal(catalog.find((s) => s.id === id)?.metadata, 'invalid')
  for (const id of ['kraken', 'tesla', 'lovable'])
    assert.equal(catalog.find((s) => s.id === id)?.metadata, 'missing')
  assert.ok(catalog.every((s) => s.preview === 'pending'))
})

test('curated tags and colors are valid, and stale curated IDs are not silently published', () => {
  assert.deepEqual(
    Object.keys(curation).filter((id) => !catalog.some((s) => s.id === id)),
    [],
  )
  for (const style of catalog) {
    for (const [key, value] of [
      ['moods', style.moods],
      ['tones', [style.tone]],
      ['scenarios', style.scenarios],
      ['colors', style.colors],
      ['density', [style.density]],
      ['category', [style.category]],
    ] as const) {
      for (const tag of value.filter(Boolean))
        assert.ok(
          facets[key].some(([id]) => id === tag),
          `${style.id}: unknown ${key}/${tag}`,
        )
    }
    assert.ok(style.palette.every((color) => /^#[A-F0-9]{6}$/.test(color)))
  }
  assert.equal(catalog.find((s) => s.id === 'cursor')?.tone, 'light')
  assert.equal(catalog.find((s) => s.id === 'kraken')?.tone, 'light')
})

test('new / edited / renamed upstream documents are reflected without requiring a README or metadata', async () => {
  const root = await mkdtemp(join(tmpdir(), 'atlas-catalog-test-'))
  await mkdir(join(root, 'new-style'))
  await writeFile(join(root, 'new-style', 'DESIGN.md'), '# A new document\n#123456', 'utf8')
  const first = await buildCatalog(root)
  assert.equal(first.length, 1)
  assert.equal(first[0].id, 'new-style')
  assert.equal(first[0].curated, false)
  assert.deepEqual(first[0].moods, [])
  assert.equal(filterCatalog(first, emptyFilters()).length, 1)
  assert.equal(filterCatalog(first, { ...emptyFilters(), moods: ['minimal'] }).length, 0)
  await writeFile(join(root, 'new-style', 'DESIGN.md'), '# Updated\n#ABCDEF\nextra line', 'utf8')
  assert.deepEqual((await buildCatalog(root))[0].palette, ['#ABCDEF'])
  await rename(join(root, 'new-style'), join(root, 'renamed-style'))
  assert.deepEqual(
    (await buildCatalog(root)).map((s) => s.id),
    ['renamed-style'],
  )
  // Keep the small fixture in OS temp; do not recursively delete user-owned paths.
})

test('keyword matching trims, ignores case, matches Chinese labels, and combines search terms', () => {
  assert.deepEqual(
    filterCatalog(catalog, { ...emptyFilters(), q: '  CuRSoR  ' }).map((s) => s.id),
    ['cursor'],
  )
  assert.ok(
    filterCatalog(catalog, { ...emptyFilters(), q: '极简' }).some((s) => s.id === 'linear.app'),
  )
  assert.deepEqual(
    filterCatalog(catalog, { ...emptyFilters(), q: 'Cursor 奶油' }).map((s) => s.id),
    ['cursor'],
  )
  assert.equal(filterCatalog(catalog, { ...emptyFilters(), q: 'Cursor 复古' }).length, 0)
})

test('same facet is OR, different facets are AND, and filtering never mutates selections', () => {
  const filters = { ...emptyFilters(), moods: ['minimal', 'retro'], tones: ['light'] }
  const result = filterCatalog(catalog, filters)
  assert.ok(result.some((s) => s.id === 'cursor'))
  assert.ok(!result.some((s) => s.id === 'linear.app'))
  assert.ok(!result.some((s) => s.id === 'dell-1996'))
  assert.ok(
    result.every(
      (s) => s.tone === 'light' && (s.moods.includes('minimal') || s.moods.includes('retro')),
    ),
  )
  const both = filterCatalog(catalog, { ...emptyFilters(), moods: ['minimal', 'retro'] })
  assert.ok(both.some((s) => s.id === 'cursor') && both.some((s) => s.id === 'dell-1996'))
  const toggled = toggleFacet(filters, 'moods', 'minimal')
  assert.deepEqual(filters.moods, ['minimal', 'retro'])
  assert.deepEqual(toggled.moods, ['retro'])
  assert.deepEqual(removeFilter(filters, 'tones', 'light').tones, [])
})

test('pending samples never appear as available; favorites and no-result states retain constraints', () => {
  assert.equal(filterCatalog(catalog, { ...emptyFilters(), status: 'ready' }).length, 0)
  assert.equal(
    filterCatalog(catalog, { ...emptyFilters(), status: 'pending' }).length,
    catalog.length,
  )
  assert.deepEqual(
    filterCatalog(catalog, emptyFilters(), ['cursor']).map((s) => s.id),
    ['cursor'],
  )
  assert.equal(filterCatalog(catalog, { ...emptyFilters(), tones: ['dark'] }, ['cursor']).length, 0)
})

test('name sorting really orders results, without treating filesystem timestamps as updates', () => {
  const az = filterCatalog(catalog, { ...emptyFilters(), sort: 'az' })
  const za = filterCatalog(catalog, { ...emptyFilters(), sort: 'za' })
  assert.deepEqual(
    az.map((s) => s.id),
    za.map((s) => s.id).reverse(),
  )
  assert.equal(filterCatalog(catalog, emptyFilters())[0].id, 'linear.app')
})
