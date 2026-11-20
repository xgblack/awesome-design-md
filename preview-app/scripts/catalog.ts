import { readdir, readFile, access } from 'node:fs/promises'
import { join } from 'node:path'
import { parseDocument } from 'yaml'
import { curation } from '../src/data/curation.ts'
import { isFacetValue, visualKeys } from '../src/data/facets.ts'
import type { ExampleInfo, StyleEntry } from '../src/types.ts'
export function inspectSource(
  source: string,
): Pick<StyleEntry, 'metadata' | 'palette' | 'lineCount'> {
  const frontmatter = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  let metadata: StyleEntry['metadata'] = 'missing'
  if (frontmatter) {
    const document = parseDocument(frontmatter[1], { uniqueKeys: true })
    metadata = document.errors.length ? 'invalid' : 'valid'
  }
  const palette = [
    ...new Set((source.match(/#[\da-f]{6}\b/gi) ?? []).map((color) => color.toUpperCase())),
  ].slice(0, 5)
  return { metadata, palette, lineCount: source.split('\n').length }
}
export function validateExample(data: unknown): ExampleInfo {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('example.json 必须为对象')
  const obj = data as Record<string, unknown>
  if (typeof obj.title !== 'string' || !obj.title.trim() || typeof obj.description !== 'string')
    throw new Error('示例缺少题名或描述')
  if (obj.status !== 'draft' && obj.status !== 'ready')
    throw new Error('示例状态应为 draft / ready')
  if (!obj.features || typeof obj.features !== 'object' || Array.isArray(obj.features))
    throw new Error('缺少实际特征 features')
  for (const [key, value] of Object.entries(obj.features)) {
    if (
      !visualKeys.includes(key as (typeof visualKeys)[number]) ||
      !Array.isArray(value) ||
      value.some(
        (tag) => typeof tag !== 'string' || !isFacetValue(key as (typeof visualKeys)[number], tag),
      )
    )
      throw new Error(`未知或无效的示例特征：${key}`)
  }
  for (const key of ['interactions', 'viewports'] as const)
    if (
      !Array.isArray(obj[key]) ||
      (obj[key] as unknown[]).some((tag) => typeof tag !== 'string' || !isFacetValue(key, tag))
    )
      throw new Error(`无效的 ${key}`)
  if (!Array.isArray(obj.notes) || obj.notes.some((note) => typeof note !== 'string'))
    throw new Error('notes 应为文字数组')
  if (
    !Array.isArray(obj.references) ||
    obj.references.some(
      (ref) => !ref || typeof ref.source !== 'string' || typeof ref.reason !== 'string',
    )
  )
    throw new Error('缺少可读的标签/源文依据')
  if (
    !Array.isArray(obj.assets) ||
    obj.assets.some(
      (asset) =>
        !asset ||
        typeof asset.file !== 'string' ||
        typeof asset.source !== 'string' ||
        typeof asset.license !== 'string',
    )
  )
    throw new Error('缺少有效素材说明')
  return obj as unknown as ExampleInfo
}
export async function buildCatalog(
  sourceRoot: string,
  examplesRoot?: string,
): Promise<StyleEntry[]> {
  const dirs = await readdir(sourceRoot, { withFileTypes: true })
  const entries = await Promise.all(
    dirs
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
        const extra = curation[dir.name],
          features = extra?.referenceFeatures ?? {}
        let example: ExampleInfo | undefined, exampleError: string | undefined
        if (examplesRoot)
          try {
            const raw = await readFile(join(examplesRoot, dir.name, 'example.json'), 'utf8')
            example = validateExample(JSON.parse(raw))
            await access(join(examplesRoot, dir.name, 'index.html'))
            if (example.status === 'ready')
              await access(join(examplesRoot, dir.name, 'thumbnail.webp'))
          } catch (error) {
            if (example || (error as NodeJS.ErrnoException).code !== 'ENOENT')
              exampleError = `${dir.name}：${error instanceof Error ? error.message : String(error)}`
          }
        const preview = example?.status === 'ready' && !exampleError ? 'ready' : 'pending'
        const entry: StyleEntry = {
          id: dir.name,
          name: extra?.name ?? dir.name,
          summary: extra?.summary ?? '设计规范已收录，中文介绍与筛选标签待整理。',
          category: extra?.category ?? '',
          referenceFeatures: features,
          referenceEvidence: extra?.referenceEvidence ?? [],
          moods: features.moods ?? [],
          tone: features.tones?.[0] ?? '',
          scenarios: features.scenarios ?? [],
          density: features.density?.[0] ?? '',
          colors: [],
          curated: Boolean(extra),
          preview,
          sourcePath: `design-md/${dir.name}/DESIGN.md`,
          ...inspectSource(source),
        }
        if (example) entry.example = example
        if (exampleError) entry.exampleError = exampleError
        return entry
      }),
  )
  return entries.filter((entry): entry is StyleEntry => entry !== null)
}
