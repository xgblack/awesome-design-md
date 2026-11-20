import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
let day = 23
let hour = 14
let chosen = ''
const dates = $('#dates')
dates.innerHTML = Array.from({ length: 42 }, (_, i) => {
  const d = i - 5
  return d > 0 && d <= 30
    ? `<button ${d < 23 || d > 27 ? 'disabled' : ''} aria-pressed="${d === day}" data-day="${d}">${d}</button>`
    : '<span></span>'
}).join('')
function slots() {
  const offset = Number(($('#zone') as HTMLSelectElement).value)
  $('#chosen-day').textContent = `11 月 ${day} 日 · 可选时段`
  $('#slots').innerHTML = [14, 15, 16, 17]
    .map(
      (h, i) =>
        `<button data-hour="${h}" ${day === 24 && i === 1 ? 'disabled' : ''}>${String((h - 8 + offset + 24) % 24).padStart(2, '0')}:00${day === 24 && i === 1 ? ' 已占用' : ''}</button>`,
    )
    .join('')
  document.querySelectorAll<HTMLButtonElement>('[data-hour]').forEach(
    (b) =>
      (b.onclick = () => {
        hour = Number(b.dataset.hour)
        $('#error').textContent = ''
        chosen = `11 月 ${day} 日 ${b.textContent} · ${($('#zone') as HTMLSelectElement).selectedOptions[0].textContent}`
        $('#slot-summary').textContent = chosen
        $('#booking').hidden = false
        $('#draft').hidden = true
        $('#booking').scrollIntoView({ block: 'nearest' })
        $('#topic').focus()
      }),
  )
}
document.querySelectorAll<HTMLButtonElement>('[data-day]').forEach(
  (b) =>
    (b.onclick = () => {
      day = Number(b.dataset.day)
      document
        .querySelectorAll('[data-day]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      $('#booking').hidden = true
      $('#draft').hidden = true
      slots()
    }),
)
$('#zone').addEventListener('change', () => {
  $('#booking').hidden = true
  slots()
})
$('#back').onclick = () => {
  $('#booking').hidden = true
}
$('#booking').onsubmit = (e) => {
  e.preventDefault()
  const topic = ($('#topic') as HTMLInputElement).value.trim()
  if (!topic) {
    $('#error').textContent = '请先写下本次讨论主题。'
    $('#topic').focus()
    return
  }
  $('#error').textContent = ''
  $('#draft').replaceChildren()
  const title = document.createElement('h3')
  title.textContent = '预约草稿已生成'
  const p = document.createElement('p')
  p.textContent = `${chosen}（上海基准 ${hour}:00）｜${topic}`
  const note = document.createElement('p')
  note.textContent = '未发送邀请，也未占用日历。刷新即清空。'
  const cancel = document.createElement('button')
  cancel.textContent = '撤销草稿'
  cancel.onclick = () => {
    $('#draft').hidden = true
    $('#booking').hidden = true
  }
  $('#draft').append(title, p, note, cancel)
  $('#draft').hidden = false
  $('#booking').hidden = true
}
slots()

void announceReady('cal')
