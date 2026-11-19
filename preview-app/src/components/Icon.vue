<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })
const paths: Record<string, string[]> = {
  search: ['M21 21l-4.5-4.5', 'M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z'],
  arrow: ['M5 12h14m-6-6 6 6-6 6'],
  back: ['M19 12H5m6-6-6 6 6 6'],
  external: ['M14 3h7v7m0-7L10 14', 'M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5'],
  bookmark: ['M6 3h12v18l-6-4-6 4V3Z'],
  compare: ['M4 4h6v16H4V4Zm10 0h6v16h-6V4Z'],
  plus: ['M12 5v14M5 12h14'],
  check: ['m5 12 4 4L19 6'],
  close: ['m6 6 12 12M6 18 18 6'],
  sliders: ['M4 7h7m6 0h3M4 17h3m6 0h7', 'M11 4v6m6-6v6M7 14v6m6-6v6'],
  doc: ['M6 3h8l5 5v13H6V3Z', 'M14 3v6h5M9 13h7M9 17h5'],
  copy: ['M9 9h12v12H9V9Z', 'M15 5V3H3v12h2'],
  download: ['M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4'],
  info: ['M12 11v6m0-10v.01', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z'],
  warning: ['m12 3 10 18H2L12 3Z', 'M12 9v5m0 3v.01'],
  desktop: ['M3 3h18v14H3V3Zm9 14v4m-4 0h8'],
  phone: ['M7 2h10v20H7V2Zm4 16h2'],
  grid: ['M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z'],
  code: ['m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16'],
}
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="icon"
  >
    <path v-for="(path, i) in paths[name] ?? paths.doc" :key="i" :d="path" />
  </svg>
</template>
