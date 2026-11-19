<script setup lang="ts">
import type { StyleEntry } from '../types.ts'
defineProps<{ style: StyleEntry; number?: number; compact?: boolean }>()
</script>
<template>
  <div class="spec-cover" :class="{ compact }">
    <div class="cover-meta">
      <span>DESIGN NOTES</span><span>{{ String(number ?? 1).padStart(3, '0') }} / MD</span>
    </div>
    <div class="cover-title">{{ style.name }}</div>
    <div class="cover-bottom">
      <div class="cover-swatches" aria-label="原文色值摘录">
        <span
          v-for="color in style.palette.slice(0, 4)"
          :key="color"
          :style="{ backgroundColor: color }"
          :title="color"
        />
      </div>
      <span>规范封面 · 非页面截图</span>
    </div>
    <svg
      class="cover-paper"
      width="96"
      height="120"
      viewBox="0 0 96 120"
      fill="none"
      aria-hidden="true"
    >
      <path d="M16 9h45l22 22v79H16V9Z" stroke="currentColor" />
      <path d="M61 9v22h22M29 50h40M29 60h28M29 78h40M29 88h33" stroke="currentColor" />
      <path d="m36 103 7-10 7 10m4-10h12" stroke="currentColor" />
    </svg>
  </div>
</template>
