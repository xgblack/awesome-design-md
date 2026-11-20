import { emptyFilters } from './catalog.ts'
import { isFacetValue, multiKeys, singleKeys } from '../data/facets.ts'
import type { AtlasRoute, Filters } from '../types.ts'
export function parseRoute(hash: string, validIds: string[]): AtlasRoute {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  const params = new URLSearchParams(query)
  const route: AtlasRoute = {
    page: 'discover',
    id: '',
    tab: 'preview',
    mode: 'read',
    viewport: 'desktop',
    compareMode: 'pages',
    filters: emptyFilters(),
    compare: [],
    notices: [],
  }
  const invalid = () => {
    if (!route.notices.includes('链接中的部分参数无效，已忽略。'))
      route.notices.push('链接中的部分参数无效，已忽略。')
  }
  if (path?.startsWith('/style/')) {
    route.page = 'style'
    try {
      route.id = decodeURIComponent(path.slice(7))
    } catch {
      route.page = 'not-found'
    }
  } else if (path === '/favorites') route.page = 'favorites'
  else if (path === '/compare') route.page = 'compare'
  else if (path && path !== '/' && path !== '/discover') route.page = 'not-found'
  const q = params.get('q') ?? ''
  route.filters.q = q.slice(0, 200)
  if (q.length > 200) invalid()
  for (const key of multiKeys) {
    const requested = [
      ...new Set(
        params
          .getAll(key)
          .flatMap((value) => value.split(','))
          .filter(Boolean),
      ),
    ]
    route.filters[key] = requested.filter((value) => isFacetValue(key, value))
    if (requested.length !== route.filters[key].length) invalid()
  }
  for (const key of singleKeys) {
    const value = params.get(key)
    if (value && isFacetValue(key, value)) route.filters[key] = value
    else if (value) invalid()
  }
  for (const [key, values] of [
    ['status', ['all', 'ready', 'pending']],
    ['sort', ['featured', 'az', 'za']],
    ['basis', ['reference', 'example']],
  ] as const) {
    const value = params.get(key)
    if (value && (values as readonly string[]).includes(value))
      Object.assign(route.filters, { [key]: value })
    else if (value) invalid()
  }
  for (const [key, values] of [
    ['tab', ['preview', 'spec']],
    ['mode', ['read', 'raw']],
    ['viewport', ['desktop', 'mobile']],
    ['compareMode', ['pages', 'notes']],
  ] as const) {
    const value = params.get(key)
    if (value && (values as readonly string[]).includes(value))
      Object.assign(route, { [key]: value })
    else if (value) invalid()
  }
  const ids = [
    ...new Set(
      params
        .getAll('compare')
        .flatMap((value) => value.split(','))
        .filter(Boolean),
    ),
  ]
  route.compare = ids.filter((id) => validIds.includes(id)).slice(0, 3)
  if (ids.some((id) => !validIds.includes(id)))
    route.notices.push('部分对照候选已不存在；其余候选已保留。')
  if (ids.length > 3) route.notices.push('一次最多对照 3 份规范，已保留前 3 份有效候选。')
  const known = [
    'q',
    'basis',
    ...multiKeys,
    ...singleKeys,
    'status',
    'sort',
    'compare',
    'tab',
    'mode',
    'viewport',
    'compareMode',
  ]
  if ([...params.keys()].some((key) => !known.includes(key))) invalid()
  if (route.filters.colors.length)
    route.notices.push('此链接保留旧版色彩条件：同组为“或”。可移除后使用独立配色维度。')
  return route
}
export function routeHref(route: AtlasRoute, update: Partial<AtlasRoute> = {}): string {
  const next = { ...route, ...update },
    params = new URLSearchParams(),
    defaults = emptyFilters()
  for (const key of Object.keys(defaults) as (keyof Filters)[]) {
    const value = next.filters[key]
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','))
    } else if (value && value !== defaults[key]) params.set(key, value)
  }
  if (next.compare.length) params.set('compare', next.compare.join(','))
  if (next.page === 'style') {
    if (next.tab !== 'preview') params.set('tab', next.tab)
    if (next.mode !== 'read') params.set('mode', next.mode)
  }
  if (next.viewport !== 'desktop') params.set('viewport', next.viewport)
  if (next.compareMode !== 'pages') params.set('compareMode', next.compareMode)
  const path = next.page === 'style' ? `/style/${encodeURIComponent(next.id)}` : `/${next.page}`
  return `#${path}${params.size ? `?${params}` : ''}`
}
