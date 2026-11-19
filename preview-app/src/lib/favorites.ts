export const favoritesKey = 'design-atlas:favorites:v1'
export interface FavoriteStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}
export interface FavoritesState {
  ids: string[]
  warning: string
}
export const persistenceWarning = '浏览器无法保存收藏；本次操作仅在当前页面有效，刷新后可能丢失。'

export function readFavorites(storage: FavoriteStorage | null, validIds: string[]): FavoritesState {
  if (!storage) return { ids: [], warning: persistenceWarning }
  try {
    const raw = storage.getItem(favoritesKey)
    if (!raw) return { ids: [], warning: '' }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.some((id) => typeof id !== 'string'))
      throw new Error('invalid favorites')
    return {
      ids: [...new Set(parsed as string[])].filter((id) => validIds.includes(id)),
      warning: '',
    }
  } catch {
    return { ids: [], warning: '无法读取本机收藏。你仍可浏览规范，新收藏会尝试重新保存。' }
  }
}

export function saveFavorites(storage: FavoriteStorage | null, ids: string[]): string {
  try {
    if (!storage) throw new Error('storage unavailable')
    storage.setItem(favoritesKey, JSON.stringify(ids))
    return ''
  } catch {
    return persistenceWarning
  }
}
