import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseDocument } from 'yaml'
import { curation } from '../src/data/curation.ts'
import type { StyleEntry } from '../src/types.ts'

export function inspectSource(
  source: string,
): Pick<StyleEntry, 'metadata' | 'palette' | 'lineCount'> {
  const frontmatter = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  let metadata: StyleEntry['metadata'] = 'missing'
  if (frontmatter) {
    // A malformed header affects only its label, never collection membership.
    const document = parseDocument(frontmatter[1], { uniqueKeys: true })
    metadata = document.errors.length ? 'invalid' : 'valid'
  }
  // Literal excerpts, not an inferred design palette or theme classification.
  const palette = [
    ...new Set((source.match(/#[\da-f]{6}\b/gi) ?? []).map((color) => color.toUpperCase())),
  ].slice(0, 5)
  return { metadata, palette, lineCount: source.split('\n').length }
}

export async function buildCatalog(sourceRoot: string): Promise<StyleEntry[]> {
  const directories = await readdir(sourceRoot, { withFileTypes: true })
  const entries = await Promise.all(
    directories
      .filter((dir) => dir.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(async (dir) => {
        let source: string
        try {
          source = await readFile(join(sourceRoot, dir.name, 'DESIGN.md'), 'utf8')
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
          throw error
        }
        const extra = curation[dir.name]
        return {
          id: dir.name,
          name: extra?.name ?? dir.name,
          summary: extra?.summary ?? '设计规范已收录，中文介绍与筛选标签待整理。',
          moods: extra?.moods ?? [],
          tone: extra?.tone ?? '',
          scenarios: extra?.scenarios ?? [],
          density: extra?.density ?? '',
          colors: extra?.colors ?? [],
          category: extra?.category ?? '',
          curated: Boolean(extra),
          preview: 'pending' as const,
          sourcePath: `design-md/${dir.name}/DESIGN.md`,
          ...inspectSource(source),
        } satisfies StyleEntry
      }),
  )
  return entries.filter((entry): entry is StyleEntry => entry !== null)
}
