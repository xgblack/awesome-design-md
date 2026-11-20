<script setup lang="ts">
import { ref, watch } from 'vue'
import SpecCover from './SpecCover.vue'
import { thumbnailUrl } from '../examples.ts'
import type { StyleEntry } from '../types.ts'
const props = defineProps<{ style: StyleEntry; number?: number; compact?: boolean }>()
const failed = ref(false)
watch(
  () => props.style.id,
  () => {
    failed.value = false
  },
)
</script>
<template>
  <div v-if="style.preview === 'ready'" class="example-cover" :class="{ compact }">
    <img
      v-if="thumbnailUrl(style.id) && !failed"
      :src="thumbnailUrl(style.id)"
      :alt="`${style.name} 风格 · ${style.example?.title} 实际页面截图`"
      loading="lazy"
      width="720"
      height="450"
      @error="failed = true"
    />
    <div v-else class="cover-error" role="status">
      <strong>截图暂时未能载入</strong><span>打开详情仍可尝试实际页面；这不是待制作状态。</span>
    </div>
    <span class="real-cover-label">实际页面截图</span>
  </div>
  <SpecCover v-else :style="style" :number="number" :compact="compact" />
</template>
