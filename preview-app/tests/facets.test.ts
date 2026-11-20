import { test } from 'vite-plus/test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { buildCatalog, validateExample } from '../scripts/catalog.ts'
import {
  emptyFilters,
  filterCatalog,
  facetCounts,
  valuesFor,
  activeFilters,
  removeFilter,
} from '../src/lib/catalog.ts'
import { parseRoute, routeHref } from '../src/lib/route.ts'
import { facets, multiKeys, singleKeys } from '../src/data/facets.ts'
import type { StyleEntry, ExampleInfo } from '../src/types.ts'
const source = (await buildCatalog(fileURLToPath(new URL('../../design-md', import.meta.url))))[0]
const example: ExampleInfo = {
  title: 'Paper lab',
  description: 'Local demonstration',
  status: 'ready',
  features: {
    moods: ['editorial'],
    tones: ['dark'],
    temperature: ['cool'],
    typography: ['mono'],
    scenarios: ['tool'],
    backgrounds: ['gradient'],
    chroma: ['muted'],
  },
  interactions: ['filter', 'edit'],
  viewports: ['desktop', 'mobile'],
  notes: ['Original local UI; no remote operations.'],
  references: [
    { source: 'index.html main', reason: 'Monospace document workspace', kind: 'observation' },
  ],
  assets: [],
}
const a: StyleEntry = {
  ...source,
  id: 'a',
  name: 'Alpha',
  category: 'auto',
  preview: 'ready',
  referenceFeatures: {
    moods: ['minimal', 'editorial'],
    tones: ['light'],
    temperature: ['warm'],
    chroma: ['mono'],
    typography: ['serif'],
    backgrounds: ['solid'],
    scenarios: ['commerce'],
  },
  example,
}
const b: StyleEntry = {
  ...source,
  id: 'b',
  name: 'Beta',
  preview: 'pending',
  referenceFeatures: {
    moods: ['minimal'],
    tones: ['light'],
    temperature: ['cool'],
    backgrounds: ['gradient'],
    typography: ['sans'],
  },
  example: undefined,
}
const c: StyleEntry = {
  ...source,
  id: 'c',
  name: 'Gamma',
  preview: 'pending',
  referenceFeatures: {},
  example: undefined,
}
const catalog = [a, b, c]
test('reference/example bases never fill each other, and actual capabilities require an accepted example', () => {
  assert.deepEqual(
    filterCatalog(catalog, { ...emptyFilters(), temperature: ['warm'] }).map((s) => s.id),
    ['a'],
  )
  assert.equal(
    filterCatalog(catalog, { ...emptyFilters(), basis: 'example', temperature: ['warm'] }).length,
    0,
  )
  assert.deepEqual(
    filterCatalog(catalog, {
      ...emptyFilters(),
      basis: 'example',
      temperature: ['cool'],
      scenarios: ['tool'],
    }).map((s) => s.id),
    ['a'],
  )
  assert.equal(
    filterCatalog(catalog, { ...emptyFilters(), basis: 'example', status: 'pending' }).length,
    0,
  )
  assert.deepEqual(
    filterCatalog(catalog, {
      ...emptyFilters(),
      interactions: ['edit'],
      viewports: ['mobile'],
    }).map((s) => s.id),
    ['a'],
  )
  assert.deepEqual(valuesFor(a, 'category', 'example'), ['auto'])
  assert.deepEqual(valuesFor({ ...b, example }, 'interactions', 'reference'), [])
})
test('same-axis OR, cross-axis AND, keyword and favorites combine without changing the features', () => {
  assert.deepEqual(
    filterCatalog(
      catalog,
      { ...emptyFilters(), moods: ['editorial', 'minimal'], typography: ['serif'] },
      ['a', 'b'],
    ).map((s) => s.id),
    ['a'],
  )
  assert.equal(
    filterCatalog(catalog, { ...emptyFilters(), q: 'Beta', typography: ['serif'] }).length,
    0,
  )
  assert.deepEqual(a.referenceFeatures.moods, ['minimal', 'editorial'])
})
test('unknown values remain visible by default, but never match explicit facets or example mode', () => {
  assert.equal(filterCatalog(catalog, emptyFilters()).length, 3)
  assert.deepEqual(valuesFor(c, 'motion', 'reference'), [])
  assert.equal(filterCatalog([c], { ...emptyFilters(), motion: ['static'] }).length, 0)
  assert.equal(filterCatalog([c], { ...emptyFilters(), basis: 'example' }).length, 0)
})
test('facet counts remove only their own dimension and keep all other constraints and duplicate memberships', () => {
  const f = { ...emptyFilters(), moods: ['editorial'], tones: ['light'] }
  const counts = facetCounts(catalog, f, 'moods')
  assert.equal(counts.minimal, 2)
  assert.equal(counts.editorial, 1)
  assert.equal(filterCatalog(catalog, f).length, 1)
  assert.equal(facetCounts(catalog, f, 'moods', ['a']).minimal, 1)
  assert.equal(facetCounts(catalog, { ...f, typography: ['serif'] }, 'moods').minimal, 1)
  assert.equal(facetCounts(catalog, { ...emptyFilters(), basis: 'example' }, 'status').pending, 0)
})
test('legacy colors keep one OR group; new axes are independent, including with example basis', () => {
  assert.deepEqual(
    filterCatalog(catalog, { ...emptyFilters(), colors: ['warm', 'gradient'] }).map((s) => s.id),
    ['a', 'b'],
  )
  assert.equal(
    filterCatalog(catalog, { ...emptyFilters(), temperature: ['warm'], backgrounds: ['gradient'] })
      .length,
    0,
  )
  assert.deepEqual(
    filterCatalog(catalog, {
      ...emptyFilters(),
      basis: 'example',
      colors: ['warm', 'gradient'],
    }).map((s) => s.id),
    ['a'],
  )
  const route = parseRoute('#/discover?colors=warm,gradient', ['a', 'b', 'c'])
  assert.deepEqual(route.filters.colors, ['warm', 'gradient'])
  assert.ok(route.notices.some((n) => n.includes('旧版')))
  assert.deepEqual(parseRoute(routeHref(route), ['a', 'b', 'c']).filters, route.filters)
})
test('every dimension plus basis, device and comparison mode survives a URL round-trip', () => {
  const route = parseRoute('#/compare', ['a', 'b', 'c'])
  for (const key of multiKeys) if (key !== 'colors') route.filters[key] = [facets[key][0][0]]
  for (const key of singleKeys) route.filters[key] = facets[key][0][0]
  route.filters.basis = 'example'
  route.filters.status = 'ready'
  route.viewport = 'mobile'
  route.compareMode = 'notes'
  route.compare = ['a', 'b']
  assert.deepEqual(parseRoute(routeHref(route), ['a', 'b', 'c']), route)
  const invalid = parseRoute(
    '#/discover?basis=official&layouts=wrong,split&headingScale=unknown&viewport=tablet',
    ['a'],
  )
  assert.equal(invalid.filters.basis, 'reference')
  assert.deepEqual(invalid.filters.layouts, ['split'])
  assert.equal(invalid.viewport, 'desktop')
  assert.ok(invalid.notices.length)
})
test('advanced selections are represented and removable even when their UI group is collapsed', () => {
  const f = {
    ...emptyFilters(),
    typography: ['serif'],
    headingWeight: 'light',
    viewports: ['mobile'],
  }
  assert.ok(activeFilters(f).some((chip) => chip.label === '衬线'))
  assert.deepEqual(removeFilter(f, 'typography', 'serif').typography, [])
  assert.equal(removeFilter(f, 'headingWeight', 'light').headingWeight, '')
  assert.deepEqual(f.typography, ['serif'])
})
test('invalid metadata is diagnosed, not silently coerced to a valid label or ready state', () => {
  assert.throws(
    () => validateExample({ ...example, features: { moods: ['official-minimal'] } }),
    /未知/,
  )
  assert.throws(
    () => validateExample({ ...example, viewports: ['real-device-certified'] }),
    /viewports/,
  )
  assert.throws(() => validateExample({ ...example, status: 'live' }), /状态/)
  assert.equal(validateExample(example).features.tones?.[0], 'dark')
})
