import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false })
markdown.validateLink = (url) => /^https?:\/\//i.test(url)
const defaultLinkOpen =
  markdown.renderer.rules.link_open ??
  ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))
markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
  tokens[index].attrSet('target', '_blank')
  tokens[index].attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpen(tokens, index, options, env, self)
}
// Do not contact remote images referenced by source documents.
markdown.renderer.rules.image = (tokens, index) =>
  `<span class="source-image">[图片：${markdown.utils.escapeHtml(tokens[index].content || '原文插图')}]</span>`

export function renderDocument(text: string): { frontmatter: string; body: string } {
  const header = text.match(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)?.[0] ?? ''
  return { frontmatter: header, body: markdown.render(text.slice(header.length)) }
}

export async function fetchDocument(
  url: string,
  signal?: AbortSignal,
  request: typeof fetch = fetch,
): Promise<string> {
  const response = await request(url, { signal })
  if (!response.ok) throw new Error(`规范请求失败（HTTP ${response.status}）。`)
  if (response.headers.get('content-type')?.includes('text/html'))
    throw new Error('服务器返回了网页而非规范文件，请检查部署资源路径。')
  // Retain a potential UTF-8 BOM so copy/download do not silently alter the source.
  const text = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }).decode(
    await response.arrayBuffer(),
  )
  if (!text.trim() || /^\s*<!doctype html/i.test(text))
    throw new Error('规范内容为空或不是有效的文档资源。')
  return text
}

export async function copyText(
  text: string,
  clipboard: Pick<Clipboard, 'writeText'> | undefined,
): Promise<boolean> {
  try {
    if (!clipboard) return false
    await clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
