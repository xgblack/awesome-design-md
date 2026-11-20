<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { exampleUrl } from '../examples.ts'
import type { StyleEntry } from '../types.ts'
const props = defineProps<{
  style: StyleEntry
  viewport: 'desktop' | 'mobile'
  compact?: boolean
}>()
const container = ref<HTMLElement | null>(null)
const instance = crypto.randomUUID()
const host = ref<HTMLElement | null>(null),
  frame = ref<HTMLIFrameElement | null>(null)
const status = ref<'loading' | 'ready' | 'error'>('loading'),
  error = ref(''),
  generation = ref(0),
  scale = ref(1),
  expanded = ref(false)
let observer: ResizeObserver | undefined, timer: ReturnType<typeof setTimeout> | undefined
const width = computed(() => (props.viewport === 'desktop' ? 1440 : 390)),
  height = computed(() => (props.viewport === 'desktop' ? 900 : 844))
const directUrl = computed(() => exampleUrl(props.style.id))
const token = computed(() => `${instance}.${generation.value}`)
const src = computed(() => `${directUrl.value}?atlas-instance=${encodeURIComponent(token.value)}`)
function resize() {
  const available = host.value?.clientWidth ?? width.value
  scale.value = Math.min(1, available / width.value)
}
function begin() {
  status.value = 'loading'
  error.value = ''
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (status.value === 'loading') {
      status.value = 'error'
      error.value = '未收到此示例的就绪信号。页面或资源可能未找到，请重试或独立打开检查。'
    }
  }, 15000)
}
function retry() {
  generation.value++
  begin()
}
function message(event: MessageEvent) {
  if (
    event.origin !== window.location.origin ||
    event.source !== frame.value?.contentWindow ||
    event.data?.slug !== props.style.id ||
    event.data?.instance !== token.value
  )
    return
  if (event.data.type === 'atlas:ready') {
    status.value = 'ready'
    clearTimeout(timer)
  } else if (event.data.type === 'atlas:error') {
    status.value = 'error'
    error.value = typeof event.data.message === 'string' ? event.data.message : '示例资源加载失败。'
    clearTimeout(timer)
  }
}
watch(
  () => [props.style.id, props.viewport],
  () => {
    generation.value++
    begin()
    void nextTick(resize)
  },
)
watch(expanded, async (value) => {
  begin()
  await nextTick()
  if (value && container.value instanceof HTMLDialogElement) container.value.showModal()
  observer?.disconnect()
  if (host.value) observer?.observe(host.value)
  resize()
  if (!value) container.value?.querySelector<HTMLButtonElement>('button')?.focus()
})
onMounted(() => {
  window.addEventListener('message', message)
  observer = new ResizeObserver(resize)
  if (host.value) observer.observe(host.value)
  resize()
  begin()
})
onBeforeUnmount(() => {
  window.removeEventListener('message', message)
  observer?.disconnect()
  clearTimeout(timer)
})
</script>
<template>
  <component
    :is="expanded ? 'dialog' : 'section'"
    ref="container"
    @cancel.prevent="expanded = false"
    class="example-preview"
    :class="{ 'preview-expanded': expanded }"
    :aria-label="`${style.name} 实际页面预览`"
  >
    <div class="preview-caption">
      <span
        >{{ style.example?.title
        }}<small>{{ width }} × {{ height }} · {{ Math.round(scale * 100) }}%</small></span
      >
      <div>
        <button class="text-button" @click="expanded = !expanded">
          {{ expanded ? '缩回' : '放大' }}</button
        ><a class="text-button" :href="directUrl" target="_blank" rel="noopener">独立打开 ↗</a>
      </div>
    </div>
    <div
      ref="host"
      class="preview-host"
      :class="{ 'phone-preview': viewport === 'mobile' }"
      :style="{ height: `${height * scale}px` }"
    >
      <iframe
        v-if="style.preview === 'ready'"
        :key="`${style.id}-${generation}`"
        ref="frame"
        :src="src"
        :title="`${style.name} — ${style.example?.title}`"
        :width="width"
        :height="height"
        :style="{ width: `${width}px`, height: `${height}px`, transform: `scale(${scale})` }"
        @error="
          status = 'error';
          error = '无法载入示例文档，请检查本地服务。'
        "
      />
      <div v-if="style.preview !== 'ready'" class="preview-state">
        <h2>示例尚未通过制作验收</h2>
        <p>{{ style.exampleError || '原始规范仍可正常阅读。' }}</p>
      </div>
      <div
        v-else-if="status !== 'ready'"
        class="preview-state"
        :role="status === 'error' ? 'alert' : 'status'"
      >
        <template v-if="status === 'loading'"
          ><div class="preview-skeleton"><span /><span /><span /></div>
          <p>正在载入独立示例…</p></template
        ><template v-else
          ><h2>这个预览未能就绪</h2>
          <p>{{ error }}</p>
          <button class="button" @click="retry">重新加载</button
          ><a class="text-button" :href="directUrl" target="_blank" rel="noopener"
            >独立打开检查</a
          ></template
        >
      </div>
    </div>
    <p class="preview-footnote">
      {{ style.example?.description }} · 本地独立演示，浏览器模拟视口，非真机验证。
    </p>
  </component>
</template>
