<script setup lang="ts">
import { facets } from '../data/facets.ts'
import { toggleFacet } from '../lib/catalog.ts'
import type { Filters } from '../types.ts'
const props = defineProps<{ filters: Filters; mobile?: boolean }>()
const emit = defineEmits<{ change: [filters: Filters] }>()
const toggle = (key: 'moods' | 'tones' | 'scenarios' | 'colors', value: string) =>
  emit('change', toggleFacet(props.filters, key, value))
</script>
<template>
  <div class="filter-fields">
    <fieldset>
      <legend>视觉气质</legend>
      <label v-for="[id, label] in facets.moods" :key="id" class="check-row"
        ><input
          type="checkbox"
          :checked="filters.moods.includes(id)"
          @change="toggle('moods', id)"
        /><span>{{ label }}</span></label
      >
    </fieldset>
    <fieldset>
      <legend>明暗特征</legend>
      <div class="tone-options">
        <button
          v-for="[id, label] in facets.tones"
          :key="id"
          class="tone-button"
          :class="{ chosen: filters.tones.includes(id) }"
          :aria-pressed="filters.tones.includes(id)"
          type="button"
          @click="toggle('tones', id)"
        >
          <span :class="`tone-dot ${id}`" />{{ label }}
        </button>
      </div>
    </fieldset>
    <fieldset>
      <legend>使用场景 <span class="legend-note">参考建议</span></legend>
      <label v-for="[id, label] in facets.scenarios" :key="id" class="check-row"
        ><input
          type="checkbox"
          :checked="filters.scenarios.includes(id)"
          @change="toggle('scenarios', id)"
        /><span>{{ label }}</span></label
      >
    </fieldset>
    <div class="select-field">
      <label :for="`density-${mobile ? 'mobile' : 'desktop'}`">信息密度</label
      ><select
        :id="`density-${mobile ? 'mobile' : 'desktop'}`"
        :value="filters.density"
        @change="
          emit('change', { ...filters, density: ($event.target as HTMLSelectElement).value })
        "
      >
        <option value="">不限密度</option>
        <option v-for="[id, label] in facets.density" :key="id" :value="id">{{ label }}</option>
      </select>
    </div>
    <details class="more-filters" :open="filters.colors.length > 0 || Boolean(filters.category)">
      <summary>更多筛选<span aria-hidden="true">+</span></summary>
      <fieldset>
        <legend>色彩特征</legend>
        <label v-for="[id, label] in facets.colors" :key="id" class="check-row"
          ><input
            type="checkbox"
            :checked="filters.colors.includes(id)"
            @change="toggle('colors', id)"
          /><span>{{ label }}</span></label
        >
      </fieldset>
      <div class="select-field">
        <label :for="`category-${mobile ? 'mobile' : 'desktop'}`">领域分类</label
        ><select
          :id="`category-${mobile ? 'mobile' : 'desktop'}`"
          :value="filters.category"
          @change="
            emit('change', { ...filters, category: ($event.target as HTMLSelectElement).value })
          "
        >
          <option value="">全部分类</option>
          <option v-for="[id, label] in facets.category" :key="id" :value="id">{{ label }}</option>
        </select>
      </div>
    </details>
    <p class="filter-note">
      先收集设计线索，<br />再找到适合你的规范。<br /><span>标签依据原文人工整理。</span>
    </p>
  </div>
</template>
