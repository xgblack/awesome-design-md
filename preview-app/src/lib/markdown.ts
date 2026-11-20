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
// Source documents remain readable without fetching their remote images.
markdown.renderer.rules.image = (tokens, index) =>
  `<span class="source-image">[图片：${markdown.utils.escapeHtml(tokens[index].content || '原文插图')}]</span>`

export function renderDocument(text: string): { frontmatter: string; body: string } {
  const header = text.match(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)?.[0] ?? ''
  return { frontmatter: header, body: markdown.render(text.slice(header.length)) }
}
