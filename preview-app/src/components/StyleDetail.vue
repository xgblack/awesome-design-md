<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Icon from './Icon.vue'
import { labelFor } from '../data/facets.ts'
import { documentUrl } from '../documents.ts'
import { copyText, fetchDocument, renderDocument } from '../lib/documents.ts'
import type { StyleEntry } from '../types.ts'
const props = defineProps<{
  style: StyleEntry
  tab: 'preview' | 'spec'
  mode: 'read' | 'raw'
  favorite: boolean
  selected: boolean
  backHref: string
}>()
const emit = defineEmits<{
  favorite: [id: string]
  compare: [id: string]
  tab: [tab: 'preview' | 'spec']
  mode: [mode: 'read' | 'raw']
}>()
const source = ref<string | null>(null)
const loading = ref(false)
const loadError = ref('')
const actionMessage = ref('')
const actionFailed = ref(false)
const busyAction = ref('')
const controller = new AbortController()
let pending: Promise<string | undefined> | undefined
const rendered = computed(() => renderDocument(source.value ?? ''))

function load(): Promise<string | undefined> {
  if (source.value !== null) return Promise.resolve(source.value)
  if (pending) return pending
  loading.value = true
  loadError.value = ''
  pending = (async () => {
    try {
      const url = documentUrl(props.style.id)
      if (!url) throw new Error('当前构建未包含这份规范，请更新构建资源。')
      source.value = await fetchDocument(url, controller.signal)
      return source.value
    } catch (error) {
      if (!controller.signal.aborted)
        loadError.value =
          error instanceof Error ? error.message : '无法读取规范，请检查连接后重试。'
      return undefined
    }
  })().finally(() => {
    loading.value = false
    pending = undefined
  })
  return pending
}
watch(
  () => props.tab,
  (tab) => {
    if (tab === 'spec') void load()
  },
  { immediate: true },
)
onBeforeUnmount(() => controller.abort())

async function getSource(action: 'copy' | 'download') {
  busyAction.value = action
  actionMessage.value = ''
  const text = await load()
  if (text === undefined) {
    actionFailed.value = true
    actionMessage.value = '未获取到规范，操作未完成。请重新加载规范。'
    emit('tab', 'spec')
  } else if (action === 'copy') {
    const success = await copyText(text, navigator.clipboard)
    actionFailed.value = !success
    actionMessage.value = success
      ? '已复制完整原文，包含源文件元数据。'
      : '复制失败：浏览器未允许剪贴板访问。可下载原文，或切到源码视图手动复制。'
  } else {
    try {
      const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${props.style.id}-DESIGN.md`
      anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
      actionFailed.value = false
      actionMessage.value = '已交给浏览器下载，请查看下载列表。'
    } catch {
      actionFailed.value = true
      actionMessage.value = '无法创建下载文件。可切到源码视图手动复制。'
    }
  }
  busyAction.value = ''
}
</script>
<template>
  <main id="main" class="detail-page page-container" tabindex="-1">
    <a :href="backHref" class="back-link"><Icon name="back" :size="16" />返回风格图库</a>
    <div class="page-heading detail-heading">
      <div>
        <div class="eyebrow">DESIGN LANGUAGE / {{ labelFor('category', style.category) }}</div>
        <h1 tabindex="-1">{{ style.name }}</h1>
        <p>{{ style.summary }}</p>
      </div>
      <div class="heading-actions">
        <button
          class="button"
          :class="{ 'is-active': favorite }"
          :aria-pressed="favorite"
          @click="emit('favorite', style.id)"
        >
          <Icon name="bookmark" :size="17" />{{ favorite ? '已收藏' : '收藏风格' }}</button
        ><button
          class="button"
          :class="{ 'is-active': selected }"
          :aria-pressed="selected"
          @click="emit('compare', style.id)"
        >
          <Icon :name="selected ? 'check' : 'compare'" :size="17" />{{
            selected ? '已加入对照' : '加入规范对照'
          }}
        </button>
      </div>
    </div>
    <div class="detail-layout">
      <section class="document-workspace" aria-label="风格内容">
        <div class="workspace-toolbar">
          <div class="segmented" aria-label="内容视图">
            <button
              :class="{ active: tab === 'preview' }"
              :aria-pressed="tab === 'preview'"
              @click="emit('tab', 'preview')"
            >
              页面预览</button
            ><button
              :class="{ active: tab === 'spec' }"
              :aria-pressed="tab === 'spec'"
              @click="emit('tab', 'spec')"
            >
              设计规范
            </button>
          </div>
          <div
            v-if="tab === 'preview'"
            class="device-controls"
            title="示例待制作，暂不支持视口切换"
          >
            <button disabled><Icon name="desktop" :size="17" /><span>桌面</span></button
            ><button disabled><Icon name="phone" :size="17" /><span>手机</span></button>
          </div>
          <div v-else class="segmented reader-switch" aria-label="规范显示方式">
            <button
              :class="{ active: mode === 'read' }"
              :aria-pressed="mode === 'read'"
              @click="emit('mode', 'read')"
            >
              阅读</button
            ><button
              :class="{ active: mode === 'raw' }"
              :aria-pressed="mode === 'raw'"
              @click="emit('mode', 'raw')"
            >
              源码
            </button>
          </div>
        </div>
        <p
          v-if="actionMessage"
          class="inline-notice action-notice"
          :class="{ error: actionFailed }"
          :role="actionFailed ? 'alert' : 'status'"
        >
          {{ actionMessage }}
        </p>
        <div v-if="tab === 'preview'" class="pending-preview">
          <div class="pending-preview-icon"><Icon name="doc" :size="32" /></div>
          <span class="eyebrow">A DIRECTION, NOT A SCREENSHOT</span>
          <h2>规范已收录，示例待制作</h2>
          <p>还没有可以展示的真实页面。<br />先从原始规范，了解 {{ style.name }} 的设计语言。</p>
          <button class="button primary" @click="emit('tab', 'spec')">
            阅读设计规范<Icon name="arrow" :size="17" /></button
          ><span class="subtle-note">页面预览与桌面 / 手机视口将在后续开放</span>
        </div>
        <template v-else>
          <div class="source-toolbar">
            <span
              ><Icon name="doc" :size="16" /><span>{{ style.id }}/DESIGN.md</span></span
            >
            <div>
              <button
                class="small-button"
                :disabled="Boolean(busyAction)"
                @click="getSource('copy')"
              >
                <Icon name="copy" :size="16" />{{
                  busyAction === 'copy' ? '复制中…' : '复制全文'
                }}</button
              ><button
                class="small-button"
                :disabled="Boolean(busyAction)"
                @click="getSource('download')"
              >
                <Icon name="download" :size="16" />下载
              </button>
            </div>
          </div>
          <div v-if="loading" class="source-skeleton" role="status" aria-label="正在加载规范">
            <span v-for="n in 9" :key="n" />
            <p>正在读取完整规范…</p>
          </div>
          <div v-else-if="loadError" class="empty-state source-error" role="alert">
            <Icon name="warning" :size="34" />
            <h2>这份规范暂时未能读取</h2>
            <p>{{ loadError }}</p>
            <div class="inline-actions">
              <button class="button primary" @click="load()">重新加载</button
              ><a class="button" :href="backHref">返回图库</a>
            </div>
          </div>
          <template v-else-if="source !== null"
            ><div v-if="mode === 'read'" class="document-reader">
              <details v-if="rendered.frontmatter" class="frontmatter">
                <summary>
                  源文件元数据
                  <span>{{
                    style.metadata === 'invalid' ? 'YAML 格式异常 · 原文保留' : '展开查看 YAML'
                  }}</span>
                </summary>
                <pre>{{ rendered.frontmatter }}</pre>
              </details>
              <div class="markdown-body" v-html="rendered.body" />
            </div>
            <div v-else class="raw-reader">
              <p>以下为完整源文件，未经改写。可选择文本或下载保存。</p>
              <pre tabindex="0" aria-label="DESIGN.md 完整源码">{{ source }}</pre>
            </div></template
          >
        </template>
      </section>
      <aside class="detail-rail" aria-label="规范信息">
        <section>
          <div class="rail-label">
            <h2>风格特征</h2>
            <span class="pending-label"><span class="status-dot" />示例待制作</span>
          </div>
          <div class="tag-list">
            <span v-for="mood in style.moods" :key="mood" class="tag">{{
              labelFor('moods', mood)
            }}</span
            ><span v-if="style.tone" class="tag">{{ labelFor('tones', style.tone) }}</span>
          </div>
          <p>{{ style.summary }}</p>
        </section>
        <section>
          <h2>原文色彩摘录</h2>
          <div class="palette-list">
            <div v-for="color in style.palette" :key="color">
              <span :style="{ backgroundColor: color }" /><code>{{ color }}</code>
            </div>
          </div>
          <p class="rail-note">按色值在原文中的出现顺序摘录，不代表完整色板或角色映射。</p>
        </section>
        <section>
          <h2>参考使用场景</h2>
          <div class="tag-list">
            <span v-for="scene in style.scenarios" :key="scene" class="tag">{{
              labelFor('scenarios', scene)
            }}</span>
          </div>
          <dl class="spec-facts">
            <div>
              <dt>信息密度</dt>
              <dd>{{ labelFor('density', style.density) }}</dd>
            </div>
            <div>
              <dt>规范长度</dt>
              <dd>{{ style.lineCount.toLocaleString() }} 行</dd>
            </div>
            <div>
              <dt>预览状态</dt>
              <dd>尚未制作</dd>
            </div>
          </dl>
          <p class="rail-note">场景与标签为人工整理的参考建议，不表示对应页面已实现。</p>
        </section>
        <section>
          <h2>原始规范</h2>
          <p class="source-path">{{ style.sourcePath }}</p>
          <p v-if="style.metadata !== 'valid'" class="metadata-note">
            <Icon name="info" :size="15" />{{
              style.metadata === 'invalid'
                ? '源文件 YAML 格式异常，全文仍可读取。'
                : '源文件未使用 YAML 头部，不影响阅读。'
            }}
          </p>
          <div class="rail-actions">
            <button class="button" :disabled="Boolean(busyAction)" @click="getSource('copy')">
              <Icon name="copy" :size="16" />复制 DESIGN.md</button
            ><button class="button" :disabled="Boolean(busyAction)" @click="getSource('download')">
              <Icon name="download" :size="16" />下载原文
            </button>
          </div>
        </section>
        <p class="rail-disclaimer">
          本项目是独立的设计语言索引，非品牌官方页面。未来的示例仅是一种参考实现，不保证其他生成结果完全相同。
        </p>
      </aside>
    </div>
  </main>
</template>
