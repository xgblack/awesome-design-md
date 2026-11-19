import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseRoute, routeHref } from '../src/lib/route.ts'
import { emptyFilters } from '../src/lib/catalog.ts'
import { favoritesKey, readFavorites, saveFavorites } from '../src/lib/favorites.ts'

const ids = ['cursor', 'linear.app', 'apple', 'slack']
test('URL restores detail, view mode, combined filters, sort and unique comparison candidates', () => {
  const route = parseRoute('#/style/cursor', ids)
  route.filters = {
    ...emptyFilters(),
    q: '极简 & Cursor',
    moods: ['minimal', 'tech'],
    tones: ['light'],
    density: 'airy',
    sort: 'az',
  }
  route.compare = ['cursor', 'apple']
  route.tab = 'spec'
  route.mode = 'raw'
  assert.deepEqual(parseRoute(routeHref(route), ids), route)
  assert.equal(parseRoute('#/favorites?q=slack', ids).page, 'favorites')
})
test('invalid links do not crash, guess a substitute style, or accept unbounded selections', () => {
  const route = parseRoute(
    '#/compare?moods=unknown,minimal&sort=nonsense&compare=cursor,missing,apple,slack,linear.app',
    ids,
  )
  assert.deepEqual(route.filters.moods, ['minimal'])
  assert.equal(route.filters.sort, 'featured')
  assert.deepEqual(route.compare, ['cursor', 'apple', 'slack'])
  assert.equal(route.notices.length, 3)
  assert.equal(parseRoute('#/style/%E0%A4', ids).page, 'not-found')
  assert.equal(parseRoute('#/wrong-route', ids).page, 'not-found')
  assert.equal(parseRoute('#/style/no-such-style', ids).id, 'no-such-style')
  assert.equal(parseRoute(`#/discover?q=${'x'.repeat(300)}`, ids).filters.q.length, 200)
})
test('encoded document IDs and repeated filter parameters round-trip without path traversal', () => {
  const route = parseRoute(
    '#/style/linear.app?tones=dark&tones=light,dark&compare=apple,apple',
    ids,
  )
  assert.equal(route.id, 'linear.app')
  assert.deepEqual(route.filters.tones, ['dark', 'light'])
  assert.deepEqual(route.compare, ['apple'])
  const malicious = parseRoute('#/style/..%2F..%2Fetc%2Fpasswd', ids)
  assert.ok(!ids.includes(malicious.id))
})
test('favorites persist uniquely and ignore source IDs that no longer exist', () => {
  const data = new Map<string, string>()
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
  }
  assert.equal(saveFavorites(storage, ['cursor', 'apple']), '')
  assert.deepEqual(readFavorites(storage, ids), { ids: ['cursor', 'apple'], warning: '' })
  data.set(favoritesKey, '["cursor","cursor","deleted"]')
  assert.deepEqual(readFavorites(storage, ids).ids, ['cursor'])
})
test('blocked, corrupt or quota-exhausted storage is reported rather than claimed to be persistent', () => {
  assert.ok(readFavorites(null, ids).warning)
  assert.ok(
    readFavorites(
      {
        getItem() {
          throw Error('denied')
        },
        setItem() {},
      },
      ids,
    ).warning,
  )
  assert.ok(readFavorites({ getItem: () => '{not-json}', setItem() {} }, ids).warning)
  assert.ok(readFavorites({ getItem: () => '[42]', setItem() {} }, ids).warning)
  assert.ok(
    saveFavorites(
      {
        getItem: () => null,
        setItem() {
          throw Error('quota')
        },
      },
      ['cursor'],
    ).includes('当前页面'),
  )
})
