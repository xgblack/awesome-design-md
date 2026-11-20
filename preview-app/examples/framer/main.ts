import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll('[data-filter]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      document
        .querySelectorAll<HTMLElement>('[data-work]')
        .forEach(
          (x) => (x.hidden = b.dataset.filter !== 'all' && x.dataset.work !== b.dataset.filter),
        )
    }),
)
document.querySelectorAll<HTMLButtonElement>('[data-work]').forEach(
  (b) =>
    (b.onclick = () => {
      $('#work-title').textContent = b.dataset.title! + ' / Website study'
      ;($('#work') as HTMLDialogElement).showModal()
    }),
)
$('#close').onclick = () => ($('#work') as HTMLDialogElement).close()
const projects = [
  { name: 'Field Objects', category: 'Independent product studio', year: 2026 },
  { name: 'Common Ground', category: 'Editorial & digital experience', year: 2025 },
]
function update() {
  const text = ($('#title') as HTMLTextAreaElement).value,
    name = ($('#site-name') as HTMLInputElement).value
  $('#site-title').textContent = text.trim() || 'Your next website'
  $('#site-brand').textContent = name.trim() || 'Your studio'
  $('#site-hero').className = 'site-hero ' + ($('#layout') as HTMLSelectElement).value
  $('#hint').textContent = !text.trim()
    ? '标题为空：预览显示引导文字，不创建空白首屏。'
    : text.length > 45
      ? '标题较长，已调整字号；网站文字会自然换行。'
      : '本地可视化网站预览，没有发布或托管操作。'
  $('#site-title').style.fontSize = text.length > 45 ? '29px' : ''
  const rows = [...projects]
  if (($('#project-order') as HTMLSelectElement).value === 'name')
    rows.sort((a, b) => a.name.localeCompare(b.name))
  $('#site-projects').innerHTML = rows
    .map(
      (p) =>
        `<article class="site-project"><span>${p.category}</span><h4>${p.name}</h4><small>Selected work / ${p.year} ↗</small></article>`,
    )
    .join('')
}
for (const id of ['title', 'site-name', 'layout', 'project-order'])
  $('#' + id).addEventListener('input', update)
$('#site-controls').onsubmit = (e) => e.preventDefault()
$('#reset').onclick = () => {
  ;($('#title') as HTMLTextAreaElement).value = 'Design for what comes next.'
  ;($('#site-name') as HTMLInputElement).value = 'Lin Studio'
  ;($('#layout') as HTMLSelectElement).value = 'editorial'
  ;($('#project-order') as HTMLSelectElement).value = 'recent'
  update()
}
update()
void announceReady('framer')
