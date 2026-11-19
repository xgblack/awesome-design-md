import { fileURLToPath } from 'node:url'
import { buildCatalog } from './catalog.ts'
import { curation } from '../src/data/curation.ts'
const catalog = await buildCatalog(fileURLToPath(new URL('../../design-md', import.meta.url)))
const orphans = Object.keys(curation).filter((id) => !catalog.some((entry) => entry.id === id))
console.log(
  `${catalog.length} documents; ${catalog.filter((s) => s.curated).length} curated; ${catalog.filter((s) => s.metadata === 'invalid').length} invalid YAML; ${catalog.filter((s) => s.metadata === 'missing').length} without YAML.`,
)
if (orphans.length) {
  console.error('Curated IDs without source:', orphans.join(', '))
  process.exitCode = 1
}
const pending = catalog.filter((s) => !s.curated).map((s) => s.id)
if (pending.length) console.log('New documents awaiting curation:', pending.join(', '))
