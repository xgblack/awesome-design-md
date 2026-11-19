<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import catalog from 'virtual:style-catalog'
import Icon from './components/Icon.vue'
import FilterPanel from './components/FilterPanel.vue'
import SpecCover from './components/SpecCover.vue'
import StyleCard from './components/StyleCard.vue'
import StyleDetail from './components/StyleDetail.vue'
import {
  activeFilters,
  cloneFilters,
  emptyFilters,
  filterCatalog,
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
const candidates = computed(() => route.value.compare.map((id) => byId.get(id)!).filter(Boolean))
const scopeCount = computed(() =>
  route.value.page === 'favorites' ? favorites.value.length : catalog.length,
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
    notify('最多对照 3 份规范，请先移除一个候选。', true)
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
    document.title = `${route.value.page === 'style' ? (currentStyle.value?.name ?? '规范未找到') : route.value.page === 'compare' ? '规范对照' : route.value.page === 'favorites' ? '我的收藏' : '发现风格'} — Design Atlas`
  },
  { immediate: true },
)
onMounted(() => {
  window.addEventListener('hashchange', syncRoute)
  window.addEventListener('popstate', syncRoute)
  window.addEventListener('storage', onStorage)
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
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
      <FilterPanel :filters="route.filters" @change="updateFilters" />
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
          ><Icon name="compare" :size="17" /><span>规范对照</span
          ><span v-if="candidates.length" class="button-count">{{ candidates.length }}</span></a
        ><button class="button mobile-filter-trigger" @click="openFilters">
          <Icon name="sliders" :size="18" />筛选<span v-if="chips.length">{{ chips.length }}</span>
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
            @click="updateFilters({ ...route.filters, status: value })"
          >
            {{ label }}<span>{{ value === 'ready' ? 0 : scopeCount }}</span>
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
          <Icon name="info" :size="16" /><span
            >当前展示规范封面，真实页面示例将在后续逐步制作。</span
          >
        </div>
        <span class="result-count" role="status" aria-live="polite"
          >{{ filtered.length }} 个结果</span
        >
      </div>
      <div v-if="chips.length" class="active-filters" aria-label="已选筛选条件">
        <button
          v-for="chip in chips"
          :key="`${chip.key}-${chip.value}`"
          @click="updateFilters(removeFilter(route.filters, chip.key, chip.value))"
          :aria-label="`移除筛选 ${chip.label}`"
        >
          {{ chip.label }}<Icon name="close" :size="13" /></button
        ><button class="clear-filters" @click="updateFilters(emptyFilters())">清空条件</button>
      </div>
      <div v-if="filtered.length" class="gallery-grid">
        <StyleCard
          v-for="style in filtered.slice(0, limit)"
          :key="style.id"
          :style="style"
          :number="styleNumber(style.id)"
          :href="detailHref(style.id)"
          :source-href="detailHref(style.id, 'spec')"
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
              ? '真实页面，还在路上。'
              : route.page === 'favorites' && !favorites.length
                ? '你的灵感收藏夹，从这里开始。'
                : '暂时没有匹配的风格'
          }}
        </h2>
        <p>
          {{
            route.filters.status === 'ready'
              ? '所有规范都已收录，示例页面尚未制作。\n你可以先阅读原始规范，或收藏喜欢的方向。'
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
    :favorite="favorites.includes(currentStyle.id)"
    :selected="route.compare.includes(currentStyle.id)"
    :back-href="backHref"
    @favorite="toggleFavorite"
    @compare="toggleCompare"
    @tab="navigate({ tab: $event })"
    @mode="navigate({ mode: $event })"
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
        <h1 tabindex="-1">同样的内容，不同的表达。</h1>
        <p>先并排梳理设计线索，找到更合适的方向。</p>
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
        <strong>目前是规范对照，不是页面视觉对比。</strong>
        <p>
          示例页面尚未制作。这里比较的是原文线索与人工整理的标签，不能代替真实布局、字体和交互的比较。
        </p>
      </div>
      <span class="tag">{{ candidates.length }} / 3 份</span>
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
            :aria-label="`从规范对照移除 ${style.name}`"
            @click="toggleCompare(style.id)"
          >
            <Icon name="close" :size="18" />
          </button>
        </div>
        <SpecCover :style="style" :number="styleNumber(style.id)" compact />
        <div class="comparison-content">
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
          <div class="comparison-pending">
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
      <p>从图库卡片加入候选，或在这里直接选择。<br />一次可以对照 2–3 份规范。</p>
      <button class="button primary" @click="openCandidates">
        选择设计规范<Icon name="plus" :size="17" />
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
    <p>基于 awesome-design-md · {{ catalog.length }} 份规范 · 非品牌官方页面</p>
  </footer>

  <div v-if="candidates.length && isGallery" class="comparison-tray" aria-label="规范对照候选">
    <div class="tray-heading">
      <Icon name="compare" :size="20" /><strong>规范对照</strong
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
      >比较规范<Icon name="arrow" :size="16"
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
        <FilterPanel :filters="draftFilters" mobile @change="draftFilters = $event" />
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
        <span>仅比较规范信息，示例页面待制作。</span
        ><button class="button primary" @click="candidateDialog?.close()">
          完成选择<Icon name="check" :size="16" />
        </button>
      </div>
    </div>
  </dialog>
</template>
