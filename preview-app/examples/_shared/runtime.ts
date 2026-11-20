/** Non-visual readiness protocol. Every example owns its document and interaction state. */
export async function announceReady(slug: string) {
  document.documentElement.dataset.example = slug
  try {
    await document.fonts.ready
    await Promise.all(
      [...document.images]
        .filter(
          (img) => Boolean(img.currentSrc || img.getAttribute('src')) && img.loading !== 'lazy',
        )
        .map(async (img) => {
          if (!img.complete)
            await new Promise<void>((resolve, reject) => {
              img.addEventListener('load', () => resolve(), { once: true })
              img.addEventListener(
                'error',
                () => reject(new Error(`图片未能载入：${img.alt || img.src}`)),
                { once: true },
              )
            })
          if (img.naturalWidth === 0) throw new Error(`图片未能载入：${img.alt || img.src}`)
        }),
    )
    document.documentElement.dataset.ready = 'true'
    if (window.parent !== window)
      window.parent.postMessage(
        {
          type: 'atlas:ready',
          slug,
          instance: new URL(window.location.href).searchParams.get('atlas-instance'),
        },
        window.location.origin,
      )
  } catch (error) {
    document.documentElement.dataset.ready = 'error'
    if (window.parent !== window)
      window.parent.postMessage(
        {
          type: 'atlas:error',
          instance: new URL(window.location.href).searchParams.get('atlas-instance'),
          slug,
          message: error instanceof Error ? error.message : '示例资源加载失败',
        },
        window.location.origin,
      )
  }
}
