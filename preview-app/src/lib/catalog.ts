import { facets, labelFor } from '../data/facets.ts'
import { featuredIds } from '../data/curation.ts'
import type { Filters, StyleEntry } from '../types.ts'

export const emptyFilters = (): Filters => ({
  q: '',
  moods: [],
  tones: [],
  scenarios: [],
  colors: [],
  density: '',
  category: '',
  status: 'all',
  sort: 'featured',
})
export const cloneFilters = (filters: Filters): Filters => ({
  ...filters,
  moods: [...filters.moods],
  tones: [...filters.tones],
  scenarios: [...filters.scenarios],
  colors: [...filters.colors],
})
const normalize = (text: string) =>
  text.normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ')

export function filterCatalog(
  catalog: StyleEntry[],
  filters: Filters,
  favorites?: string[],
): StyleEntry[] {
  const terms = normalize(filters.q).split(' ').filter(Boolean)
  return catalog
    .filter((style) => {
      if (favorites && !favorites.includes(style.id)) return false
      if (filters.status === 'ready') return false // Real sample pages have not been made yet.
      const search = normalize(
        [
          style.name,
          style.id,
          style.summary,
          ...style.moods.map((value) => labelFor('moods', value)),
          labelFor('tones', style.tone),
          ...style.scenarios.map((value) => labelFor('scenarios', value)),
          ...style.colors.map((value) => labelFor('colors', value)),
          labelFor('category', style.category),
        ].join(' '),
      )
      return (
        terms.every((term) => search.includes(term)) &&
        (!filters.moods.length || filters.moods.some((value) => style.moods.includes(value))) &&
        (!filters.tones.length || filters.tones.includes(style.tone)) &&
        (!filters.scenarios.length ||
          filters.scenarios.some((value) => style.scenarios.includes(value))) &&
        (!filters.colors.length || filters.colors.some((value) => style.colors.includes(value))) &&
        (!filters.density || filters.density === style.density) &&
        (!filters.category || filters.category === style.category)
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

export function activeFilters(filters: Filters): { key: string; value: string; label: string }[] {
  const chips: { key: string; value: string; label: string }[] = []
  if (filters.q.trim())
    chips.push({ key: 'q', value: filters.q, label: `搜索：${filters.q.trim()}` })
  for (const key of ['moods', 'tones', 'scenarios', 'colors'] as const) {
    for (const value of filters[key]) chips.push({ key, value, label: labelFor(key, value) })
  }
  for (const key of ['density', 'category'] as const) {
    if (filters[key]) chips.push({ key, value: filters[key], label: labelFor(key, filters[key]) })
  }
  return chips
}

export function removeFilter(filters: Filters, key: string, value: string): Filters {
  const next = cloneFilters(filters)
  if (key === 'q' || key === 'density' || key === 'category') next[key] = ''
  else if (key === 'moods' || key === 'tones' || key === 'scenarios' || key === 'colors')
    next[key] = next[key].filter((item) => item !== value)
  return next
}

export function toggleFacet(
  filters: Filters,
  key: 'moods' | 'tones' | 'scenarios' | 'colors',
  value: string,
): Filters {
  const next = cloneFilters(filters)
  next[key] = next[key].includes(value)
    ? next[key].filter((item) => item !== value)
    : [...next[key], value]
  return next
}

export const isFacetValue = (key: keyof typeof facets, value: string) =>
  facets[key].some(([id]) => id === value)
