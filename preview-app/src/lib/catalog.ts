import { facetTitles, facets, labelFor, multiKeys, singleKeys, visualKeys } from '../data/facets.ts'
import { featuredIds } from '../data/curation.ts'
import type { FacetKey } from '../data/facets.ts'
import type { Filters, MultiFacetKey, StyleEntry } from '../types.ts'
export { isFacetValue } from '../data/facets.ts'
export function emptyFilters(): Filters {
  return {
    q: '',
    basis: 'reference',
    status: 'all',
    sort: 'featured',
    ...Object.fromEntries(multiKeys.map((key) => [key, []])),
    ...Object.fromEntries(singleKeys.map((key) => [key, ''])),
  } as Filters
}
export function cloneFilters(filters: Filters): Filters {
  const next = { ...filters }
  for (const key of multiKeys) next[key] = [...filters[key]]
  return next
}
const normalize = (text: string) =>
  text.normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ')
export function valuesFor(style: StyleEntry, key: FacetKey, basis: Filters['basis']): string[] {
  if (key === 'category') return style.category ? [style.category] : []
  if (key === 'status') return [style.preview]
  if (key === 'interactions' || key === 'viewports')
    return style.preview === 'ready' ? (style.example?.[key] ?? []) : []
  const features = basis === 'example' ? style.example?.features : style.referenceFeatures
  if (key === 'colors')
    return (facets.colors.map(([id]) => id) as string[]).filter((id) => {
      if (id === 'mono') return features?.chroma?.includes('mono')
      if (id === 'warm' || id === 'cool') return features?.temperature?.includes(id)
      if (id === 'vivid') return features?.chroma?.includes('vivid')
      return features?.backgrounds?.includes('gradient')
    })
  return features?.[key] ?? []
}
export function filterCatalog(
  catalog: StyleEntry[],
  filters: Filters,
  favorites?: string[],
): StyleEntry[] {
  const terms = normalize(filters.q).split(' ').filter(Boolean)
  return catalog
    .filter((style) => {
      if (favorites && !favorites.includes(style.id)) return false
      if (filters.basis === 'example' && style.preview !== 'ready') return false
      if (filters.status !== 'all' && style.preview !== filters.status) return false
      const search = normalize(
        [
          style.name,
          style.id,
          style.summary,
          style.example?.title ?? '',
          ...[...visualKeys, 'category', 'interactions', 'viewports' as const].flatMap((key) =>
            valuesFor(style, key as FacetKey, filters.basis).map((value) =>
              labelFor(key as FacetKey, value),
            ),
          ),
        ].join(' '),
      )
      if (!terms.every((term) => search.includes(term))) return false
      return (
        multiKeys.every(
          (key) =>
            !filters[key].length ||
            filters[key].some((value) => valuesFor(style, key, filters.basis).includes(value)),
        ) &&
        singleKeys.every(
          (key) => !filters[key] || valuesFor(style, key, filters.basis).includes(filters[key]),
        )
      )
    })
    .sort((a, b) => {
      if (filters.sort === 'featured') {
        const rank = (id: string) =>
          featuredIds.includes(id) ? featuredIds.indexOf(id) : featuredIds.length
        const delta = rank(a.id) - rank(b.id)
        if (delta) return delta
      }
      return (
        a.name.localeCompare(b.name, 'en', { numeric: true }) * (filters.sort === 'za' ? -1 : 1)
      )
    })
}
/** Disjunctive facet counts: ignore only this dimension, never add per-tag totals. */
export function facetCounts(
  catalog: StyleEntry[],
  filters: Filters,
  key: FacetKey,
  favorites?: string[],
): Record<string, number> {
  const scoped = cloneFilters(filters)
  if (key === 'status') scoped.status = 'all'
  else if ((singleKeys as string[]).includes(key)) Object.assign(scoped, { [key]: '' })
  else Object.assign(scoped, { [key]: [] })
  const rows = filterCatalog(catalog, scoped, favorites)
  return Object.fromEntries(
    facets[key].map(([id]) => [
      id,
      rows.filter((style) => valuesFor(style, key, filters.basis).includes(id)).length,
    ]),
  )
}
export function activeFilters(filters: Filters): { key: string; value: string; label: string }[] {
  const chips: { key: string; value: string; label: string }[] = [
    {
      key: 'basis',
      value: filters.basis,
      label: filters.basis === 'reference' ? '按规范特点' : '按示例页面 · 仅已有示例',
    },
  ]
  if (filters.q.trim())
    chips.push({ key: 'q', value: filters.q, label: `搜索：${filters.q.trim()}` })
  for (const key of multiKeys)
    for (const value of filters[key])
      chips.push({
        key,
        value,
        label: `${key === 'colors' ? '旧版色彩或：' : ''}${labelFor(key, value)}`,
      })
  for (const key of singleKeys)
    if (filters[key])
      chips.push({
        key,
        value: filters[key],
        label: `${facetTitles[key]}：${labelFor(key, filters[key])}`,
      })
  if (filters.status !== 'all')
    chips.push({ key: 'status', value: filters.status, label: labelFor('status', filters.status) })
  return chips
}
export function removeFilter(filters: Filters, key: string, value: string): Filters {
  const next = cloneFilters(filters)
  if (key === 'basis') next.basis = 'reference'
  else if (key === 'status') next.status = 'all'
  else if (key === 'q') next.q = ''
  else if ((singleKeys as string[]).includes(key)) Object.assign(next, { [key]: '' })
  else if ((multiKeys as string[]).includes(key)) {
    const field = key as MultiFacetKey
    next[field] = next[field].filter((item) => item !== value)
  }
  return next
}
export function toggleFacet(filters: Filters, key: MultiFacetKey, value: string): Filters {
  const next = cloneFilters(filters)
  next[key] = next[key].includes(value)
    ? next[key].filter((item) => item !== value)
    : [...next[key], value]
  return next
}
