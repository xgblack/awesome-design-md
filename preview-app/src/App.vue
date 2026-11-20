<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import catalog from 'virtual:style-catalog'
import Icon from './components/Icon.vue'
import FilterPanel from './components/FilterPanel.vue'
import ExampleCover from './components/ExampleCover.vue'
import ExamplePreview from './components/ExamplePreview.vue'
import StyleCard from './components/StyleCard.vue'
import StyleDetail from './components/StyleDetail.vue'
import {
  activeFilters,
  cloneFilters,
  emptyFilters,
  filterCatalog,
  facetCounts,
  removeFilter,
} from './lib/catalog.ts'
import { copyText } from './lib/documents.ts'
import { favoritesKey, readFavorites, saveFavorites } from './lib/favorites.ts'
import type { FavoriteStorage } from './lib/favorites.ts'
import { parseRoute, routeHref } from './lib/route.ts'
import { labelFor } from './data/facets.ts'
import type { AtlasRoute, Filters } from './types.ts'

const validIds = catalog.map((style) => style.id)
const byId = new Map(catalog.map((style) => [style.id, style]))
const route = ref(parseRoute(window.location.hash, validIds))
const galleryPage = ref<'discover' | 'favorites'>(
  route.value.page === 'favorites' ? 'favorites' : 'discover',
)
let storage: FavoriteStorage | null
try {
  storage = window.localStorage
} catch {
  storage = null
}
const saved = readFavorites(storage, validIds)
const favorites = ref(saved.ids)
const storageWarning = ref(saved.warning)
const toast = ref<{ text: string; error: boolean } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>
const limit = ref(24)
const searchInput = ref<HTMLInputElement | null>(null)
const filterDialog = ref<HTMLDialogElement | null>(null)
const candidateDialog = ref<HTMLDialogElement | null>(null)
const draftFilters = ref(emptyFilters())
const candidateQuery = ref('')
const activeCandidate = ref('')
let galleryScroll = 0
const narrowScreen = ref(window.matchMedia('(max-width: 760px)').matches)
const mediaQuery = window.matchMedia('(max-width: 760px)')
const onMedia = () => {
  narrowScreen.value = mediaQuery.matches
}
const favoriteScope = computed(() =>
  route.value.page === 'favorites' ? favorites.value : undefined,
)
const statusCounts = computed(() =>
  facetCounts(catalog, route.value.filters, 'status', favoriteScope.value),
)

const currentStyle = computed(() => byId.get(route.value.id))
const isGallery = computed(
  () => route.value.page === 'discover' || route.value.page === 'favorites',
)
const filtered = computed(() =>
  filterCatalog(
    catalog,
    route.value.filters,
    route.value.page === 'favorites' ? favorites.value : undefined,
  ),
)
const draftCount = computed(
  () =>
    filterCatalog(
      catalog,
      draftFilters.value,
      route.value.page === 'favorites' ? favorites.value : undefined,
    ).length,
)
const chips = computed(() => activeFilters(route.value.filters))
const filterCount = computed(
  () =>
    chips.value.filter((chip) => chip.key !== 'basis').length +
    (route.value.filters.basis === 'example' ? 1 : 0),
)
const candidates = computed(() => route.value.compare.map((id) => byId.get(id)!).filter(Boolean))
const scopeCount = computed(
  () =>
    filterCatalog(catalog, { ...route.value.filters, status: 'all' }, favoriteScope.value).length,
)
const candidateOptions = computed(() =>
  filterCatalog(catalog, { ...emptyFilters(), q: candidateQuery.value }),
)
const backHref = computed(() => href({ page: galleryPage.value, id: '' }))
const styleNumber = (id: string) => validIds.indexOf(id) + 1
const href = (patch: Partial<AtlasRoute> = {}) => routeHref(route.value, patch)
const detailHref = (id: string, tab: 'preview' | 'spec' = 'preview') =>
  href({ page: 'style', id, tab, mode: 'read' })

function applyRoute(next: AtlasRoute) {
  const previous = route.value
  const moved = previous.page !== next.page || previous.id !== next.id
  if (moved && isGallery.value) galleryScroll = window.scrollY
  route.value = next
  if (next.page === 'discover' || next.page === 'favorites') galleryPage.value = next.page
  if (moved)
    void nextTick(() => {
      window.scrollTo({ top: next.page === galleryPage.value ? galleryScroll : 0 })
      document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
    })
}
function navigate(patch: Partial<AtlasRoute>, replace = false) {
  const next = { ...route.value, ...patch, notices: [] }
  window.history[replace ? 'replaceState' : 'pushState'](null, '', routeHref(next))
  applyRoute(next)
}
function syncRoute() {
  applyRoute(parseRoute(window.location.hash, validIds))
}
function updateFilters(filters: Filters, replace = false) {
  navigate({ filters }, replace)
}
function notify(text: string, error = false) {
  clearTimeout(toastTimer)
  toast.value = { text, error }
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 7000)
}
function toggleFavorite(id: string) {
  const removing = favorites.value.includes(id)
  favorites.value = removing
    ? favorites.value.filter((value) => value !== id)
    : [...favorites.value, id]
  storageWarning.value = saveFavorites(storage, favorites.value)
  notify(
    storageWarning.value || (removing ? '已取消收藏。' : '已收藏，仅保存在当前浏览器。'),
    Boolean(storageWarning.value),
  )
}
function toggleCompare(id: string) {
  let compare = route.value.compare
  if (compare.includes(id)) compare = compare.filter((value) => value !== id)
  else if (compare.length >= 3) {
    notify('最多对照 3 种风格，请先移除一个候选。', true)
    return
  } else compare = [...compare, id]
  navigate({ compare })
}
function openFilters() {
  draftFilters.value = cloneFilters(route.value.filters)
  filterDialog.value?.showModal()
}
function applyFilters() {
  updateFilters(cloneFilters(draftFilters.value))
  filterDialog.value?.close()
}
function openCandidates() {
  candidateQuery.value = ''
  candidateDialog.value?.showModal()
}
async function share() {
  const success = await copyText(window.location.href, navigator.clipboard)
  notify(
    success ? '已复制链接，包含筛选条件和对照候选。' : '无法复制链接，请从浏览器地址栏手动复制。',
    !success,
  )
}
function onStorage(event: StorageEvent) {
  if (event.key !== favoritesKey) return
  const current = readFavorites(storage, validIds)
  favorites.value = current.ids
  storageWarning.value = current.warning
}
function onKeydown(event: KeyboardEvent) {
  const tag = (event.target as HTMLElement)?.tagName
  if (
    event.key === '/' &&
    isGallery.value &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) &&
    !document.querySelector('dialog[open]')
  ) {
    event.preventDefault()
    searchInput.value?.focus()
  }
}
function skipToMain() {
  document.getElementById('main')?.focus()
}
watch(
  () => JSON.stringify(route.value.filters),
  () => {
    limit.value = 24
  },
)
watch(
  () => route.value.page,
  () => {
    limit.value = 24
  },
)
watch(
  () => route.value.compare.join(','),
  () => {
    if (!route.value.compare.includes(activeCandidate.value))
      activeCandidate.value = route.value.compare[0] ?? ''
  },
  { immediate: true },
)
watch(
  () => `${route.value.page}/${route.value.id}`,
  () => {
    document.title = `${route.value.page === 'style' ? (currentStyle.value?.name ?? '规范未找到') : route.value.page === 'compare' ? '风格对照' : route.value.page === 'favorites' ? '我的收藏' : '发现风格'} — Design Atlas`
  },
  { immediate: true },
)
onMounted(() => {
  mediaQuery.addEventListener('change', onMedia)
  window.addEventListener('hashchange', syncRoute)
  window.addEventListener('popstate', syncRoute)
  window.addEventListener('storage', onStorage)
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  mediaQuery.removeEventListener('change', onMedia)
  window.removeEventListener('hashchange', syncRoute)
  window.removeEventListener('popstate', syncRoute)
  window.removeEventListener('storage', onStorage)
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(toastTimer)
})
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="skipToMain">跳到主要内容</a>
  <header class="site-header">
    <a
      class="brand"
      :href="href({ page: 'discover', filters: emptyFilters() })"
      aria-label="Design Atlas 首页"
      ><svg
        class="brand-symbol"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="10" height="10" rx="1.5" fill="currentColor" />
        <rect
          x="18"
          y="2"
          width="10"
          height="10"
          rx="1.5"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <rect
          x="2"
          y="18"
          width="10"
          height="10"
          rx="1.5"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <rect x="18" y="18" width="10" height="10" rx="1.5" class="logo-accent" /></svg
      ><span class="brand-name">design atlas<span class="brand-slash"> /</span></span
      ><span class="brand-descriptor">DESIGN.md 的视觉索引</span></a
    >
    <nav class="main-nav" aria-label="主导航">
      <a
        :href="href({ page: 'discover' })"
        :class="{ active: route.page === 'discover' }"
        :aria-current="route.page === 'discover' ? 'page' : undefined"
        ><Icon name="grid" :size="17" /><span>发现风格</span></a
      ><a
        :href="href({ page: 'favorites' })"
        :class="{ active: route.page === 'favorites' }"
        :aria-current="route.page === 'favorites' ? 'page' : undefined"
        ><Icon name="bookmark" :size="17" /><span>我的收藏</span
        ><span v-if="favorites.length" class="nav-count">{{ favorites.length }}</span></a
      ><span class="header-note">规范先行，灵感随后</span>
    </nav>
  </header>

  <div v-if="storageWarning" class="global-banner" role="status">
    <Icon name="warning" :size="17" />{{ storageWarning }}
  </div>
  <div v-if="route.notices.length" class="global-banner" role="status">
    <Icon name="info" :size="17" />
    <div>
      <p v-for="notice in route.notices" :key="notice">{{ notice }}</p>
    </div>
    <button class="icon-button" aria-label="关闭链接提示" @click="route.notices = []">
      <Icon name="close" :size="16" />
    </button>
  </div>

  <div v-if="isGallery" class="gallery-layout page-container">
    <aside class="desktop-filters" aria-label="风格筛选">
      <div class="filter-heading">
        <h2>筛选风格</h2>
        <button class="text-button muted" @click="updateFilters(emptyFilters())">重置</button>
      </div>
      <FilterPanel
        :filters="route.filters"
        :catalog="catalog"
        :favorites="favoriteScope"
        @change="updateFilters"
      />
    </aside>
    <main id="main" class="gallery-main" tabindex="-1">
      <div class="page-heading gallery-heading">
        <div>
          <div class="eyebrow">
            {{
              route.page === 'favorites'
                ? 'YOUR PERSONAL COLLECTION'
                : 'A LIBRARY OF DESIGN LANGUAGES'
            }}
          </div>
          <h1 tabindex="-1">
            {{ route.page === 'favorites' ? '把喜欢的风格，留在手边。' : '看见风格，再开始创造。' }}
          </h1>
          <p>
            {{
              route.page === 'favorites'
                ? '属于你的设计方向清单，仅保存在当前浏览器。'
                : '从设计规范出发，找到下一次创作的方向。'
            }}
          </p>
        </div>
        <span class="collection-count"
          >{{ catalog.length }} 份设计规范<Icon name="doc" :size="15"
        /></span>
      </div>
      <div class="search-row">
        <label class="search-box"
          ><Icon name="search" :size="20" /><input
            ref="searchInput"
            type="search"
            aria-label="搜索品牌、风格或关键词"
            placeholder="搜索品牌、风格或关键词，例如：极简、复古、Cursor"
            maxlength="200"
            :value="route.filters.q"
            @input="
              updateFilters(
                { ...route.filters, q: ($event.target as HTMLInputElement).value },
                true,
              )
            "
          /><kbd>/</kbd></label
        ><a class="button compare-entry" :href="href({ page: 'compare' })"
          ><Icon name="compare" :size="17" /><span>风格对照</span
          ><span v-if="candidates.length" class="button-count">{{ candidates.length }}</span></a
        ><button class="button mobile-filter-trigger" @click="openFilters">
          <Icon name="sliders" :size="18" />筛选<span v-if="filterCount">{{ filterCount }}</span>
        </button>
      </div>
      <div class="gallery-controls">
        <div class="status-tabs" aria-label="预览状态">
          <button
            v-for="[value, label] in [
              ['all', '全部风格'],
              ['ready', '已有预览'],
              ['pending', '待制作'],
            ] as const"
            :key="value"
            :class="{ active: route.filters.status === value }"
            :aria-pressed="route.filters.status === value"
            :disabled="value !== 'all' && !statusCounts[value] && route.filters.status !== value"
            @click="updateFilters({ ...route.filters, status: value })"
          >
            {{ label }}<span>{{ value === 'all' ? scopeCount : statusCounts[value] }}</span>
          </button>
        </div>
        <label class="sort-control"
          ><span>排序</span
          ><select
            aria-label="风格排序"
            :value="route.filters.sort"
            @change="
              updateFilters({
                ...route.filters,
                sort: ($event.target as HTMLSelectElement).value as Filters['sort'],
              })
            "
          >
            <option value="featured">推荐顺序</option>
            <option value="az">名称 A–Z</option>
            <option value="za">名称 Z–A</option>
          </select></label
        >
      </div>
      <div class="gallery-intro">
        <div>
          <Icon name="info" :size="16" /><span>{{
            route.filters.basis === 'example'
              ? '按实际示例特征筛选；仅已有示例，未知不补值。'
              : '按原规范的本地归纳筛选；不是上游官方标签。'
          }}</span>
        </div>
        <span class="result-count" role="status" aria-live="polite"
          >{{ filtered.length }} 个结果</span
        >
      </div>
      <div v-if="chips.length" class="active-filters" aria-label="已选筛选条件">
        <span class="basis-chip">{{
          route.filters.basis === 'example' ? '按示例页面 · 仅已有示例' : '按规范特点'
        }}</span>
        <button
          v-for="chip in chips.filter((chip) => chip.key !== 'basis')"
          :key="`${chip.key}-${chip.value}`"
          @click="updateFilters(removeFilter(route.filters, chip.key, chip.value))"
          :aria-label="`移除筛选 ${chip.label}`"
        >
          {{ chip.label }}<Icon name="close" :size="13" />
        </button>
        <button
          v-if="chips.length > 1 || route.filters.basis === 'example'"
          class="clear-filters"
          @click="updateFilters(emptyFilters())"
        >
          清空条件
        </button>
      </div>
      <div v-if="filtered.length" class="gallery-grid">
        <StyleCard
          v-for="style in filtered.slice(0, limit)"
          :key="style.id"
          :style="style"
          :number="styleNumber(style.id)"
          :href="detailHref(style.id)"
          :source-href="detailHref(style.id, 'spec')"
          :basis="route.filters.basis"
          :favorite="favorites.includes(style.id)"
          :selected="route.compare.includes(style.id)"
          @favorite="toggleFavorite"
          @compare="toggleCompare"
        />
      </div>
      <div v-else class="empty-state gallery-empty">
        <div class="empty-symbol">
          <Icon
            :name="
              route.filters.status === 'ready'
                ? 'doc'
                : route.page === 'favorites' && !favorites.length
                  ? 'bookmark'
                  : 'search'
            "
            :size="30"
          />
        </div>
        <span class="eyebrow">{{
          route.filters.status === 'ready'
            ? 'GOOD THINGS TAKE SHAPE'
            : route.page === 'favorites' && !favorites.length
              ? 'MAKE IT YOURS'
              : 'A DIFFERENT DIRECTION'
        }}</span>
        <h2>
          {{
            route.filters.status === 'ready'
              ? '没有符合条件的已完成示例。'
              : route.page === 'favorites' && !favorites.length
                ? '你的灵感收藏夹，从这里开始。'
                : '暂时没有匹配的风格'
          }}
        </h2>
        <p>
          {{
            route.filters.status === 'ready'
              ? '当前筛选没有匹配到已有示例。条件仍保留，可逐项移除或切回全部风格。'
              : route.page === 'favorites' && !favorites.length
                ? '在风格卡片上点击收藏，把喜欢的设计方向留在手边。'
                : '试着少选一个条件，或换个关键词。\n当前筛选已保留，不会自动放宽。'
          }}
        </p>
        <button
          v-if="route.filters.status === 'ready'"
          class="button primary"
          @click="updateFilters({ ...route.filters, status: 'all' })"
        >
          浏览全部规范<Icon name="arrow" :size="16" /></button
        ><a
          v-else-if="route.page === 'favorites' && !favorites.length"
          class="button primary"
          :href="href({ page: 'discover', filters: emptyFilters() })"
          >去发现风格<Icon name="arrow" :size="16" /></a
        ><button v-else class="button primary" @click="updateFilters(emptyFilters())">
          清空筛选条件
        </button>
      </div>
      <div v-if="filtered.length" class="load-more">
        <span>已浏览 {{ Math.min(limit, filtered.length) }} / {{ filtered.length }} 份规范</span
        ><button v-if="limit < filtered.length" class="button" @click="limit += 24">
          再看一些风格<Icon name="plus" :size="16" /></button
        ><span v-else class="end-mark">你已到达本次探索的末尾</span>
      </div>
    </main>
  </div>

  <StyleDetail
    v-else-if="route.page === 'style' && currentStyle"
    :key="currentStyle.id"
    :style="currentStyle"
    :tab="route.tab"
    :mode="route.mode"
    :viewport="route.viewport"
    :favorite="favorites.includes(currentStyle.id)"
    :selected="route.compare.includes(currentStyle.id)"
    :back-href="backHref"
    @favorite="toggleFavorite"
    @compare="toggleCompare"
    @tab="navigate({ tab: $event })"
    @mode="navigate({ mode: $event })"
    @viewport="navigate({ viewport: $event })"
  />

  <main
    v-else-if="route.page === 'compare'"
    id="main"
    class="compare-page page-container"
    tabindex="-1"
  >
    <a :href="backHref" class="back-link"><Icon name="back" :size="16" />返回风格图库</a>
    <div class="page-heading">
      <div>
        <div class="eyebrow">SIDE BY SIDE / DESIGN NOTES</div>
        <h1 tabindex="-1">不同的场景，同屏看设计语言。</h1>
        <p>统一视口比较真实布局与交互，也可切换规范线索。</p>
      </div>
      <div class="heading-actions">
        <button class="button" @click="share"><Icon name="copy" :size="16" />复制对照链接</button
        ><button class="button primary" @click="openCandidates">
          <Icon name="plus" :size="17" />{{ candidates.length ? '管理候选' : '添加候选' }}
        </button>
      </div>
    </div>
    <div class="compare-notice">
      <Icon name="info" :size="19" />
      <div>
        <strong>各自最佳场景，统一视口。</strong>
        <p>
          不同示例的内容与题材不同，因此是视觉语言参考，不是同内容 A/B
          测试。手机端一次只载入当前候选。
        </p>
      </div>
      <span class="tag">{{ candidates.length }} / 3 份</span>
    </div>
    <div v-if="candidates.length" class="comparison-toolbar">
      <div class="segmented" aria-label="对照方式">
        <button
          :class="{ active: route.compareMode === 'pages' }"
          :aria-pressed="route.compareMode === 'pages'"
          @click="navigate({ compareMode: 'pages' })"
        >
          页面视觉对比</button
        ><button
          :class="{ active: route.compareMode === 'notes' }"
          :aria-pressed="route.compareMode === 'notes'"
          @click="navigate({ compareMode: 'notes' })"
        >
          规范信息对照
        </button>
      </div>
      <div class="segmented" aria-label="对照视口">
        <button
          :class="{ active: route.viewport === 'desktop' }"
          :aria-pressed="route.viewport === 'desktop'"
          @click="navigate({ viewport: 'desktop' })"
        >
          桌面 1440</button
        ><button
          :class="{ active: route.viewport === 'mobile' }"
          :aria-pressed="route.viewport === 'mobile'"
          @click="navigate({ viewport: 'mobile' })"
        >
          手机 390
        </button>
      </div>
    </div>
    <div v-if="candidates.length" class="comparison-mobile-tabs" aria-label="切换对照候选">
      <button
        v-for="style in candidates"
        :key="style.id"
        :class="{ active: activeCandidate === style.id }"
        :aria-pressed="activeCandidate === style.id"
        @click="activeCandidate = style.id"
      >
        {{ style.name }}
      </button>
    </div>
    <div
      v-if="candidates.length"
      class="comparison-grid"
      :style="{ '--candidate-count': Math.max(2, candidates.length) }"
    >
      <article
        v-for="style in candidates"
        :key="style.id"
        class="comparison-card"
        :class="{ 'mobile-hidden': activeCandidate !== style.id }"
      >
        <div class="comparison-card-heading">
          <a :href="detailHref(style.id)">{{ style.name }}<Icon name="external" :size="15" /></a
          ><button
            class="icon-button"
            :aria-label="`从风格对照移除 ${style.name}`"
            @click="toggleCompare(style.id)"
          >
            <Icon name="close" :size="18" />
          </button>
        </div>
        <template v-if="route.compareMode === 'pages'"
          ><ExamplePreview
            v-if="!narrowScreen || activeCandidate === style.id"
            :style="style"
            :viewport="route.viewport"
            compact /></template
        ><ExampleCover v-else :style="style" :number="styleNumber(style.id)" compact />
        <div v-if="route.compareMode === 'notes'" class="comparison-content">
          <section>
            <h2>风格印象</h2>
            <p>{{ style.summary }}</p>
          </section>
          <section>
            <h2>视觉气质</h2>
            <div class="tag-list">
              <span v-for="mood in style.moods" :key="mood" class="tag">{{
                labelFor('moods', mood)
              }}</span>
            </div>
          </section>
          <section>
            <h2>明暗与信息密度</h2>
            <p>{{ labelFor('tones', style.tone) }} · {{ labelFor('density', style.density) }}</p>
          </section>
          <section>
            <h2>参考场景</h2>
            <p>
              {{
                style.scenarios.map((value) => labelFor('scenarios', value)).join(' / ') || '待整理'
              }}
            </p>
          </section>
          <section>
            <h2>原文色彩摘录</h2>
            <div class="comparison-palette">
              <span
                v-for="color in style.palette"
                :key="color"
                :style="{ backgroundColor: color }"
                :title="color"
              /><small>非完整色板</small>
            </div>
          </section>
          <div v-if="style.preview !== 'ready'" class="comparison-pending">
            <Icon name="doc" :size="18" /><span>真实页面预览待制作</span>
          </div>
          <a class="button" :href="detailHref(style.id, 'spec')"
            >阅读完整规范<Icon name="arrow" :size="16"
          /></a>
        </div>
      </article>
      <button v-if="candidates.length === 1" class="add-comparison" @click="openCandidates">
        <Icon name="plus" :size="30" /><strong>再找一个方向</strong
        ><span>添加候选，开始并排对照</span>
      </button>
    </div>
    <div v-else class="empty-state comparison-empty">
      <div class="empty-symbol"><Icon name="compare" :size="32" /></div>
      <h2>把几个方向，放在一起想。</h2>
      <p>从图库卡片加入候选，或在这里直接选择。<br />一次最多对照 3 种风格。</p>
      <button class="button primary" @click="openCandidates">
        选择设计风格<Icon name="plus" :size="17" />
      </button>
    </div>
  </main>

  <main v-else id="main" class="page-container not-found" tabindex="-1">
    <div class="empty-state">
      <div class="empty-symbol"><Icon name="doc" :size="34" /></div>
      <span class="eyebrow">DIRECTION NOT FOUND</span>
      <h1 tabindex="-1">没有找到这个设计方向</h1>
      <p>这份规范可能已被删除或重命名，也可能是链接有误。<br />不会将你悄悄带到另一个风格。</p>
      <a class="button primary" :href="href({ page: 'discover', id: '' })"
        >返回风格图库<Icon name="arrow" :size="17"
      /></a>
    </div>
  </main>

  <footer class="site-footer" :class="{ 'with-tray': candidates.length && isGallery }">
    <div>
      <span class="footer-brand">design atlas /</span><span>从一份规范，到一个新方向。</span>
    </div>
    <p>
      基于 awesome-design-md · {{ catalog.length }} 份规范 · 非品牌官方页面 ·
      <a href="licenses/README.md" target="_blank" rel="noopener">素材与字体来源</a>
    </p>
  </footer>

  <div v-if="candidates.length && isGallery" class="comparison-tray" aria-label="风格对照候选">
    <div class="tray-heading">
      <Icon name="compare" :size="20" /><strong>风格对照</strong
      ><span>{{ candidates.length }} / 3</span>
    </div>
    <div class="tray-candidates">
      <div v-for="style in candidates" :key="style.id">
        <span>{{ style.name }}</span
        ><button
          class="icon-button"
          :aria-label="`从候选移除 ${style.name}`"
          @click="toggleCompare(style.id)"
        >
          <Icon name="close" :size="14" />
        </button>
      </div>
    </div>
    <button class="text-button tray-clear" @click="navigate({ compare: [] })">清空</button
    ><a class="button primary" :href="href({ page: 'compare' })"
      >比较风格<Icon name="arrow" :size="16"
    /></a>
  </div>
  <div
    v-if="toast"
    class="toast"
    :class="{ error: toast.error }"
    :role="toast.error ? 'alert' : 'status'"
  >
    <Icon :name="toast.error ? 'warning' : 'check'" :size="18" /><span>{{ toast.text }}</span
    ><button class="icon-button" aria-label="关闭通知" @click="toast = null">
      <Icon name="close" :size="16" />
    </button>
  </div>

  <dialog
    ref="filterDialog"
    class="filter-dialog"
    aria-labelledby="filter-title"
    @click="$event.target === $event.currentTarget && filterDialog?.close()"
  >
    <div class="dialog-shell">
      <div class="dialog-heading">
        <div>
          <span class="eyebrow">NARROW YOUR DIRECTION</span>
          <h2 id="filter-title">筛选风格</h2>
        </div>
        <button class="icon-button" aria-label="关闭筛选" autofocus @click="filterDialog?.close()">
          <Icon name="close" />
        </button>
      </div>
      <div class="dialog-scroll">
        <FilterPanel
          :filters="draftFilters"
          :catalog="catalog"
          :favorites="favoriteScope"
          mobile
          @change="draftFilters = $event"
        />
      </div>
      <div class="dialog-footer">
        <button class="button" @click="draftFilters = emptyFilters()">重置条件</button
        ><button class="button primary" @click="applyFilters">
          查看 {{ draftCount }} 个结果<Icon name="arrow" :size="16" />
        </button>
      </div>
    </div>
  </dialog>
  <dialog
    ref="candidateDialog"
    class="candidate-dialog"
    aria-labelledby="candidate-title"
    @click="$event.target === $event.currentTarget && candidateDialog?.close()"
  >
    <div class="dialog-shell">
      <div class="dialog-heading">
        <div>
          <span class="eyebrow">UP TO THREE DIRECTIONS</span>
          <h2 id="candidate-title">选择对照候选 <small>{{ candidates.length }} / 3</small></h2>
        </div>
        <button class="icon-button" aria-label="关闭候选选择" @click="candidateDialog?.close()">
          <Icon name="close" />
        </button>
      </div>
      <label class="search-box candidate-search"
        ><Icon name="search" :size="18" /><input
          v-model="candidateQuery"
          type="search"
          placeholder="搜索名称或视觉特征"
          aria-label="搜索对照候选"
          maxlength="200"
          autofocus
      /></label>
      <div class="candidate-list dialog-scroll">
        <button
          v-for="style in candidateOptions"
          :key="style.id"
          class="candidate-row"
          :class="{ chosen: route.compare.includes(style.id) }"
          :aria-pressed="route.compare.includes(style.id)"
          :aria-label="`${route.compare.includes(style.id) ? '移除候选' : '选择候选'} ${style.name}`"
          @click="toggleCompare(style.id)"
        >
          <span class="candidate-initial">{{ style.name.slice(0, 1) }}</span
          ><span><strong>{{ style.name }}</strong><small>{{ style.summary }}</small></span
          ><Icon :name="route.compare.includes(style.id) ? 'check' : 'plus'" :size="18" />
        </button>
        <p v-if="!candidateOptions.length" class="dialog-no-results">
          没有匹配的规范，试试其他关键词。
        </p>
      </div>
      <div class="dialog-footer">
        <span>最多 3 项；页面与规范两种对照方式。</span
        ><button class="button primary" @click="candidateDialog?.close()">
          完成选择<Icon name="check" :size="16" />
        </button>
      </div>
    </div>
  </dialog>
</template>
