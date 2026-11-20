import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
type Article = { id: number; title: string; stage: string; date: string }
const articles: Article[] = [
  { id: 1, title: '城市的第一杯咖啡', stage: 'draft', date: '2026-11-23' },
  { id: 2, title: '沿着河岸，走到秋天', stage: 'review', date: '2026-11-24' },
  { id: 3, title: '把旧物留给新生活', stage: 'done', date: '2026-11-25' },
]
const names: Record<string, string> = { draft: '撰写中', review: '待审阅', done: '可出版' }
let view = 'board',
  current = 1
function render() {
  const filter = ($('#filter') as HTMLSelectElement).value
  const shown = articles.filter((a) => filter === 'all' || a.stage === filter)
  const card = (a: Article) =>
    `<button class="article" data-article="${a.id}"><strong>${a.title}</strong><span class="stage">${names[a.stage]}</span> <span>${a.date.slice(5)}</span></button>`
  $('#articles').innerHTML =
    view === 'board'
      ? '<div class="columns">' +
        Object.keys(names)
          .map(
            (s) =>
              `<section class="column"><h3>${names[s]}</h3>${shown
                .filter((a) => a.stage === s)
                .map(card)
                .join('')}</section>`,
          )
          .join('') +
        '</div>'
      : '<div class="calendar-view">' +
        [23, 24, 25, 26, 27]
          .map(
            (d) =>
              `<section class="calendar-day"><h3>11 月 ${d} 日</h3>${shown
                .filter((a) => a.date === `2026-11-${d}`)
                .map(card)
                .join('')}</section>`,
          )
          .join('') +
        '</div>'
  $('#empty').hidden = shown.length > 0
  document.querySelectorAll<HTMLButtonElement>('[data-article]').forEach(
    (b) =>
      (b.onclick = () => {
        current = Number(b.dataset.article)
        $('#error').textContent = ''
        const a = articles.find((a) => a.id === current)!
        $('#edit-title').textContent = a.title
        ;($('#stage') as HTMLSelectElement).value = a.stage
        ;($('#date') as HTMLInputElement).value = a.date
        ;($('#editor') as HTMLDialogElement).showModal()
      }),
  )
}
for (const id of ['board', 'calendar'])
  $('#' + id).onclick = () => {
    view = id
    for (const x of ['board', 'calendar']) $('#' + x).setAttribute('aria-pressed', String(x === id))
    render()
  }
$('#filter').addEventListener('change', render)
$('#edit-form').onsubmit = (e) => {
  e.preventDefault()
  const d = ($('#date') as HTMLInputElement).value
  if (!d || d < '2026-11-23' || d > '2026-12-31') {
    $('#error').textContent = '请选择演示周期内的日期。'
    return
  }
  const a = articles.find((a) => a.id === current)!
  a.stage = ($('#stage') as HTMLSelectElement).value
  a.date = d
  ;($('#editor') as HTMLDialogElement).close()
  render()
}
$('#cancel').onclick = () => ($('#editor') as HTMLDialogElement).close()
$('#add').onclick = () => {
  articles.push({
    id: Date.now(),
    title: '一条新故事的起点',
    stage:
      ($('#filter') as HTMLSelectElement).value === 'all'
        ? 'draft'
        : ($('#filter') as HTMLSelectElement).value,
    date: '2026-11-27',
  })
  render()
}
render()

void announceReady('notion')
