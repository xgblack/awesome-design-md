import { fileURLToPath } from 'node:url'
import { defineConfig, lazyPlugins, type Plugin } from 'vite-plus'
import vue from '@vitejs/plugin-vue'
import { buildCatalog } from './scripts/catalog.ts'

const sourceRoot = fileURLToPath(new URL('../design-md', import.meta.url))
export default defineConfig({
  fmt: { printWidth: 100, semi: false, singleQuote: true },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  base: './',
  plugins: lazyPlugins(async () => [
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
    } satisfies Plugin,
  ]),
  server: { host: '127.0.0.1', fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
  preview: { host: '127.0.0.1' },
  build: { assetsInlineLimit: 0 },
})
