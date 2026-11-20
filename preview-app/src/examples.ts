const thumbnails = import.meta.glob('../examples/*/thumbnail.webp', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>
export function thumbnailUrl(id: string) {
  return thumbnails[`../examples/${id}/thumbnail.webp`]
}
export function exampleUrl(id: string) {
  return new URL(
    `examples/${encodeURIComponent(id)}/index.html`,
    new URL(import.meta.env.BASE_URL, document.baseURI),
  ).href
}
