<script setup lang="ts">
import Icon from './Icon.vue'
import ExampleCover from './ExampleCover.vue'
import { valuesFor } from '../lib/catalog.ts'
import { labelFor } from '../data/facets.ts'
import type { StyleEntry } from '../types.ts'
defineProps<{
  style: StyleEntry
  basis: 'reference' | 'example'
  number: number
  href: string
  sourceHref: string
  favorite: boolean
  selected: boolean
}>()
defineEmits<{ favorite: [id: string]; compare: [id: string] }>()
</script>
<template>
  <article class="style-card" :class="{ selected }" :data-style="style.id">
    <a :href="href" class="cover-link" :aria-label="`查看 ${style.name} 详情`"
      ><ExampleCover :style="style" :number="number"
    /></a>
    <div class="card-content">
      <div class="card-title-row">
        <h2>
          <a :href="href">{{ style.name }}<Icon name="external" :size="13" /></a>
        </h2>
        <div class="card-actions">
          <button
            class="icon-button favorite-button"
            :class="{ active: favorite }"
            :aria-label="`${favorite ? '取消收藏' : '收藏'} ${style.name}`"
            :aria-pressed="favorite"
            @click="$emit('favorite', style.id)"
          >
            <Icon name="bookmark" :size="18" /></button
          ><button
            class="icon-button candidate-button"
            :class="{ active: selected }"
            :aria-label="`${selected ? '从风格对照移除' : '加入风格对照'} ${style.name}`"
            :aria-pressed="selected"
            @click="$emit('compare', style.id)"
          >
            <Icon :name="selected ? 'check' : 'plus'" :size="19" />
          </button>
        </div>
      </div>
      <p class="card-summary">{{ style.summary }}</p>
      <div class="card-tags">
        <span v-if="valuesFor(style, 'moods', basis)[0]" class="tag">{{
          labelFor('moods', valuesFor(style, 'moods', basis)[0])
        }}</span
        ><span v-if="valuesFor(style, 'tones', basis)[0]" class="tag">{{
          labelFor('tones', valuesFor(style, 'tones', basis)[0])
        }}</span
        ><span v-if="!style.curated" class="tag">资料待整理</span>
      </div>
      <div class="card-foot">
        <span class="pending-label" :class="{ 'ready-label': style.preview === 'ready' }"
          ><span class="status-dot" />{{
            style.preview === 'ready' ? '已有示例' : '示例待制作'
          }}</span
        ><a :href="sourceHref">阅读规范<Icon name="arrow" :size="15" /></a>
      </div>
    </div>
  </article>
</template>
