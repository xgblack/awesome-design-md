import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource/saira-condensed/800.css'
const shoeData: Record<string, [string, string]> = {
  'City Flow': [
    new URL('./assets/city-flow.svg', import.meta.url).href,
    '低帮网面、柔和曲面中底，为城市日常训练设计的原创鞋型。',
  ],
  'Trail Note': [
    new URL('./assets/trail-note.svg', import.meta.url).href,
    '高护踝、分层保护片与深齿外底，为自然路面设计的独立鞋型。',
  ],
  'After Hours': [
    new URL('./assets/after-hours.svg', import.meta.url).href,
    '修长楦型、深色织面与橙色推进中底，另一种城市步伐。',
  ],
}
let current = '',
  count = 0
const selected = new Set<string>()
function renderKit() {
  $('#kit-count').textContent = String(selected.size)
  $('#kit-items').replaceChildren(
    ...[...selected].map((item) => {
      const row = document.createElement('div'),
        text = document.createElement('span'),
        remove = document.createElement('button')
      text.textContent = item
      remove.textContent = '移除'
      remove.onclick = () => {
        selected.delete(item)
        count = selected.size
        renderKit()
      }
      row.append(text, remove)
      return row
    }),
  )
  if (!selected.size) $('#kit-items').textContent = '训练包还是空的。'
}
$('#kit-open').onclick = () => $<HTMLDialogElement>('#kit').showModal()
$('#kit-close').onclick = () => $<HTMLDialogElement>('#kit').close()
document.querySelectorAll<HTMLButtonElement>('[data-shoe]').forEach(
  (b) =>
    (b.onclick = () => {
      current = b.dataset.shoe!
      $('#shoe-name').textContent = current
      $('#shoe-image').setAttribute('src', shoeData[current][0])
      $('#shoe-image').setAttribute('alt', current + ' 原创跑鞋细节')
      $('#shoe-description').textContent = shoeData[current][1]
      $<HTMLSelectElement>('#size').value = ''
      $('#shoe-status').textContent = '尺码仅供本地演示，无库存承诺。'
      $<HTMLDialogElement>('#shoe-detail').showModal()
    }),
)
$('#shoe-close').onclick = () => $<HTMLDialogElement>('#shoe-detail').close()
$('#add-kit').onclick = () => {
  const size = $<HTMLSelectElement>('#size').value
  if (!size) {
    $('#shoe-status').textContent = '请先选择尺码，再加入训练包。'
    return
  }
  const item = `${current} / ${size}`
  if (selected.has(item)) {
    $('#shoe-status').textContent = '这双装备已在训练包中，不重复添加。'
    return
  }
  selected.add(item)
  count++
  $('#kit-count').textContent = String(count)
  renderKit()
  $('#shoe-status').textContent = '已加入本次训练包，没有下单。'
}
$('#clear-kit').onclick = () => {
  selected.clear()
  count = 0
  $('#kit-count').textContent = '0'
  $('#kit-items').textContent = '训练包还是空的。'
}
document.querySelectorAll<HTMLButtonElement>('[data-surface]').forEach(
  (b) =>
    (b.onclick = () => {
      const v = b.dataset.surface!
      let n = 0
      document.querySelectorAll<HTMLElement>('[data-surface-product]').forEach((x) => {
        x.hidden = v !== 'all' && x.dataset.surfaceProduct !== v
        if (!x.hidden) n++
      })
      $('#surface-status').textContent = `${n} 款原创概念装备`
      document
        .querySelectorAll('[data-surface]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
void announceReady('nike')
