import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/jetbrains-mono'
let active = 'fields'
function render() {
  const title = ($('#title') as HTMLInputElement).value.trim(),
    date = ($('#date') as HTMLInputElement).value,
    author = ($('#author') as HTMLInputElement).value.trim()
  $('#error').textContent = !title
    ? '标题是必填项，请先写一个清楚的名字。'
    : !date
      ? '日期是必填项。'
      : ''
  $('#json-output').textContent = JSON.stringify(
    { _type: 'exhibition', title, date, author: { name: author || null }, demo_only: true },
    null,
    2,
  )
  $('#preview-title').textContent = title || '待填写标题'
  $('#preview-date').textContent = date || '日期待填写'
  $('#preview-author').textContent = author ? '策展 / ' + author : '作者未关联'
}
for (const id of ['title', 'date', 'author']) $('#' + id).addEventListener('input', render)
document.querySelectorAll<HTMLButtonElement>('[data-field]').forEach(
  (b) =>
    (b.onclick = () => {
      $('#path').textContent = 'exhibition.' + b.dataset.field
      document
        .querySelectorAll('[data-field]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      $('#' + b.dataset.field).focus()
    }),
)
document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(
  (b) =>
    (b.onclick = () => {
      active = b.dataset.tab!
      document
        .querySelectorAll('[data-tab]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      for (const id of ['fields', 'json', 'preview'])
        $('#' + id).classList.toggle('active', id === active)
    }),
)
$('#reset').onclick = () => {
  ;($('#title') as HTMLInputElement).value = '风经过的地方'
  ;($('#date') as HTMLInputElement).value = '2026-11-28'
  ;($('#author') as HTMLInputElement).value = '林夏'
  render()
}
$('#fields').onsubmit = (e) => e.preventDefault()
$('#fields').classList.add('active')
render()

void announceReady('sanity')
