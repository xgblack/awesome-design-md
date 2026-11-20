<script setup lang="ts">
import { computed } from 'vue'
import { facets, facetTitles, facetDescriptions, singleKeys } from '../data/facets.ts'
import type { FacetKey } from '../data/facets.ts'
import { facetCounts, toggleFacet } from '../lib/catalog.ts'
import type { Filters, MultiFacetKey, StyleEntry } from '../types.ts'
const props = defineProps<{
  filters: Filters
  catalog: StyleEntry[]
  favorites?: string[]
  mobile?: boolean
}>()
const emit = defineEmits<{ change: [filters: Filters] }>()
const common: FacetKey[] = ['moods', 'tones', 'scenarios', 'layouts', 'density']
const advanced: { title: string; keys: FacetKey[] }[] = [
  { title: '配色与背景', keys: ['temperature', 'chroma', 'accentHues', 'backgrounds'] },
  { title: '字体与标题', keys: ['typography', 'headingScale', 'headingWeight'] },
  { title: '组件与层次', keys: ['geometry', 'layering'] },
  { title: '素材与动态', keys: ['visualMedia', 'motion'] },
  { title: '领域与示例能力', keys: ['category', 'interactions', 'status', 'viewports'] },
]
const groups = computed(() => [
  { title: '常用维度', keys: common, common: true },
  ...advanced.map((group) => ({ ...group, common: false })),
])
const counts = computed(
  () =>
    Object.fromEntries(
      Object.keys(facets).map((key) => [
        key,
        facetCounts(props.catalog, props.filters, key as FacetKey, props.favorites),
      ]),
    ) as Record<FacetKey, Record<string, number>>,
)
function selected(key: FacetKey, id: string) {
  const value = props.filters[key]
  return Array.isArray(value) ? value.includes(id) : value === id
}
function changed(key: FacetKey, id: string) {
  if (key === 'status')
    emit('change', {
      ...props.filters,
      status: (props.filters.status === id ? 'all' : id) as Filters['status'],
    })
  else if (singleKeys.includes(key as (typeof singleKeys)[number]))
    emit('change', { ...props.filters, [key]: props.filters[key] === id ? '' : id })
  else emit('change', toggleFacet(props.filters, key as MultiFacetKey, id))
}
function groupActive(keys: FacetKey[]) {
  return keys.some((key) => {
    const value = props.filters[key]
    return Array.isArray(value) ? value.length > 0 : Boolean(value && value !== 'all')
  })
}
</script>
<template>
  <div class="filter-fields">
    <fieldset class="filter-basis">
      <legend>筛选依据</legend>
      <label
        class="check-row"
        v-for="[id, label] in [
          ['reference', '按规范特点'],
          ['example', '按示例页面'],
        ] as const"
        :key="id"
      >
        <input
          type="radio"
          :name="`basis-${mobile ? 'mobile' : 'desktop'}`"
          :checked="filters.basis === id"
          @change="emit('change', { ...filters, basis: id })"
        /><span>{{ label }}</span>
      </label>
      <p class="filter-note">
        {{
          filters.basis === 'example'
            ? '仅已有示例；用实际页面特征，不以规范值补齐未知。'
            : '本地按原规范归纳，包含尚未制作的风格。'
        }}
      </p>
    </fieldset>
    <component
      v-for="group in groups"
      :key="group.title"
      :is="group.common ? 'div' : 'details'"
      class="facet-group"
      :open="group.common || groupActive(group.keys)"
    >
      <summary v-if="!group.common">
        {{ group.title
        }}<span v-if="groupActive(group.keys)" class="facet-active-dot" aria-label="含已选条件" />
      </summary>
      <fieldset v-for="key in group.keys" :key="key" class="facet-field">
        <legend>{{ facetTitles[key] }}</legend>
        <p class="facet-description">{{ facetDescriptions[key] }}</p>
        <select
          v-if="singleKeys.includes(key as (typeof singleKeys)[number]) || key === 'status'"
          :aria-label="facetTitles[key]"
          :value="filters[key]"
          @change="
            emit('change', { ...filters, [key]: ($event.target as HTMLSelectElement).value })
          "
        >
          <option :value="key === 'status' ? 'all' : ''">不限{{ facetTitles[key] }}</option>
          <option
            v-for="[id, label] in facets[key]"
            :key="id"
            :value="id"
            :disabled="!counts[key][id] && !selected(key, id)"
          >
            {{ label }} · {{ counts[key][id] }}
          </option>
        </select>
        <template v-else>
          <label
            v-for="[id, label] in facets[key]"
            :key="id"
            class="check-row"
            :class="{ 'facet-disabled': !counts[key][id] && !selected(key, id) }"
            :title="
              !counts[key][id] && !selected(key, id)
                ? '其他条件下没有匹配；可先移除一个条件。'
                : facetDescriptions[key]
            "
          >
            <input
              type="checkbox"
              :checked="selected(key, id)"
              :disabled="!counts[key][id] && !selected(key, id)"
              @change="changed(key, id)"
            /><span>{{ label }}</span><small class="facet-count">{{ counts[key][id] }}</small>
          </label>
        </template>
      </fieldset>
    </component>
    <fieldset v-if="filters.colors.length" class="legacy-filter">
      <legend>旧版色彩条件 · 或</legend>
      <p class="facet-description">保留旧链接语义。移除后可使用独立配色维度。</p>
      <label class="check-row" v-for="id in filters.colors" :key="id"
        ><input type="checkbox" checked @change="changed('colors', id)" /><span>{{
          facets.colors.find((item) => item[0] === id)?.[1]
        }}</span></label
      >
    </fieldset>
    <p class="filter-note">
      同一维度为“或”，跨维度为“且”。<br />数量忽略当前维度，保留其他条件。<br />未标注不等于没有；选择该维度时未知不匹配。
    </p>
  </div>
</template>
