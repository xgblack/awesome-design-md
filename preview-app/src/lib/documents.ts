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
