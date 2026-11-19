// Vite emits the original Markdown as static assets, without hand-maintained copies.
const urls = import.meta.glob<string>('../../design-md/*/DESIGN.md', {
  query: '?url',
  import: 'default',
  eager: true,
})
export function documentUrl(id: string): string | undefined {
  return urls[`../../design-md/${id}/DESIGN.md`]
}
