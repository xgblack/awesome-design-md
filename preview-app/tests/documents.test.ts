import { test } from 'vite-plus/test'
import assert from 'node:assert/strict'
import { copyText, fetchDocument, renderDocument } from '../src/lib/documents.ts'

test('safe reading preserves the original source and displays frontmatter separately', () => {
  const source = '---\nname: test\n---\n# A heading\n正文 **加粗**'
  const rendered = renderDocument(source)
  assert.equal(rendered.frontmatter, '---\nname: test\n---\n')
  assert.ok(rendered.body.includes('<h1>A heading</h1>'))
  assert.ok(rendered.body.includes('<strong>加粗</strong>'))
  assert.equal(source, '---\nname: test\n---\n# A heading\n正文 **加粗**')
})
test('untrusted HTML, scripts, protocols and remote images cannot execute or make image requests', () => {
  const rendered = renderDocument(
    '<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[jump](javascript:alert(1))\n\n![external](https://example.com/tracker.png)\n\n[safe](https://example.com)',
  ).body
  assert.ok(!rendered.includes('<script>'))
  assert.ok(!rendered.includes('<img'))
  assert.ok(!rendered.includes('href="javascript:'))
  assert.ok(!rendered.includes('https://example.com/tracker.png'))
  assert.ok(rendered.includes('[图片：external]'))
  assert.ok(rendered.includes('&lt;script&gt;'))
  assert.ok(rendered.includes('rel="noopener noreferrer"'))
})
test('document fetch returns exact decoded bytes including BOM, CRLF, and non-ASCII text', async () => {
  const source = '\uFEFF# 标题\r\n完整原文\r\n'
  const request = (async () =>
    new Response(new TextEncoder().encode(source), {
      headers: { 'content-type': 'text/markdown' },
    })) as typeof fetch
  assert.equal(await fetchDocument('/document.md', undefined, request), source)
})
test('missing, failed, empty or HTML fallback resources are explicit failures', async () => {
  for (const response of [
    new Response('missing', { status: 404 }),
    new Response('', { status: 200 }),
    new Response('<html>app</html>', { headers: { 'content-type': 'text/html' } }),
    new Response('<!doctype html><html>fallback</html>'),
  ]) {
    await assert.rejects(
      fetchDocument('/document.md', undefined, (async () => response) as typeof fetch),
    )
  }
  await assert.rejects(
    fetchDocument('/document.md', undefined, (async () => {
      throw new TypeError('offline')
    }) as typeof fetch),
    /offline/,
  )
})
test('clipboard errors do not return false success, and successful copy uses the complete original', async () => {
  const original = '---\nname: original\n---\n最后一行'
  let copied = ''
  assert.equal(
    await copyText(original, {
      writeText: async (text) => {
        copied = text
      },
    }),
    true,
  )
  assert.equal(copied, original)
  assert.equal(
    await copyText(original, {
      writeText: async () => {
        throw Error('denied')
      },
    }),
    false,
  )
  assert.equal(await copyText(original, undefined), false)
})
