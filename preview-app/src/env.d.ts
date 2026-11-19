/// <reference types="vite/client" />
declare module 'virtual:style-catalog' {
  const catalog: import('./types').StyleEntry[]
  export default catalog
}
