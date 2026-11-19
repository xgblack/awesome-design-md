/// <reference types="vite/client" />
declare module 'virtual:style-catalog' {
  const catalog: import('./types').StyleEntry[]
  export default catalog
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, unknown>
  export default component
}
