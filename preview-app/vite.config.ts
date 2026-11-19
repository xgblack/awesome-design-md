import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { buildCatalog } from './scripts/catalog.ts'

const sourceRoot = fileURLToPath(new URL('../design-md', import.meta.url))
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    {
      name: 'design-document-catalog',
      resolveId(id) {
        if (id === 'virtual:style-catalog') return '\0virtual:style-catalog'
      },
      async load(id) {
        if (id !== '\0virtual:style-catalog') return
        const catalog = await buildCatalog(sourceRoot)
        for (const entry of catalog) this.addWatchFile(`${sourceRoot}/${entry.id}/DESIGN.md`)
        return `export default ${JSON.stringify(catalog)}`
      },
      configureServer(server) {
        server.watcher.add(sourceRoot)
        server.watcher.on('all', (_event, path) => {
          if (!path.startsWith(sourceRoot)) return
          const module = server.moduleGraph.getModuleById('\0virtual:style-catalog')
          if (module) server.moduleGraph.invalidateModule(module)
          server.ws.send({ type: 'full-reload' })
        })
      },
    },
  ],
  server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
  build: { assetsInlineLimit: 0 },
})
