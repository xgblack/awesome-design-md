import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource-variable/cormorant-garamond'
const images = {
  silver: new URL('./assets/luma-silver.svg', import.meta.url).href,
  gold: new URL('./assets/luma-gold.svg', import.meta.url).href,
  black: new URL('./assets/luma-black.svg', import.meta.url).href,
}
const materials: Record<string, [string, string]> = {
  silver: ['Silver', '冷银金属，映出柔和的日常光线。'],
  gold: ['Gold', '暖金表面，让精巧硬件也成为日常首饰。'],
  black: ['Midnight', '深色金属，把内圈细节安静地留给自己。'],
}
document.querySelectorAll<HTMLButtonElement>('[data-finish]').forEach(
  (b) =>
    (b.onclick = () => {
      const k = b.dataset.finish! as keyof typeof images
      $('#ring-image').setAttribute('src', images[k])
      $('#ring-image').setAttribute('alt', materials[k][0] + ' 智能指环原创渲染')
      $('#finish-name').textContent = materials[k][0]
      $('#finish-note').textContent = materials[k][1]
      document
        .querySelectorAll('[data-finish]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
$('#ring-size').onchange = () => {
  $('#size-note').textContent =
    `当前为 Size ${$<HTMLSelectElement>('#ring-size').value} 概念，非实际佩戴建议。`
}
const records = [
  {
    sleep: '23:20 – 07:10',
    feel: '醒来舒展',
    entry: '昨天早点放下了手机。清晨醒来时，窗边的光刚刚好。',
  },
  {
    sleep: '00:05 – 07:20',
    feel: '想慢一点',
    entry: '昨晚读书读得晚了一些。今天把午后的行程留得松一点。',
  },
  {
    sleep: '22:55 – 07:00',
    feel: '精神平静',
    entry: '和朋友吃了一顿很慢的晚饭。熟悉的聊天，让一天收得很轻。',
  },
]
let day = 0
const notes = new Map<number, string>()
function display() {
  const r = records[day]
  $('#record-date').textContent = `2026年11月${16 + day}日 · 固定演示记录`
  $('#sleep-window').textContent = r.sleep
  $('#feeling').textContent = r.feel
  $('#entry').textContent = notes.get(day) || r.entry
  $<HTMLTextAreaElement>('#note').value = notes.get(day) || ''
  $('#note-status').textContent = notes.has(day)
    ? '显示当次自述，刷新后清空。'
    : '最多240字，仅当前页面保存，刷新后清空。'
}
document.querySelectorAll<HTMLButtonElement>('[data-day]').forEach(
  (b) =>
    (b.onclick = () => {
      day = Number(b.dataset.day)
      document
        .querySelectorAll('[data-day]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      display()
    }),
)
$('#note-form').onsubmit = (e) => {
  e.preventDefault()
  const note = $<HTMLTextAreaElement>('#note').value.trim()
  if (!note) {
    $('#note-status').textContent = '请先写下一句话，再保存自述。'
    $('#note').focus()
    return
  }
  notes.set(day, note)
  display()
  $('#note-status').textContent = '已保存当次自述，仅当前页面内存；刷新后清空。'
}

void announceReady('oura')
