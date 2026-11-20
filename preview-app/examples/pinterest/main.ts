import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const saved = new Set<string>()
let topic = 'all',
  onlySaved = false,
  current = ''
const refresh = () => {
  const q = $<HTMLInputElement>('#pin-search').value.trim()
  let n = 0
  document.querySelectorAll<HTMLElement>('[data-pin]').forEach((x) => {
    x.hidden = !(
      (topic === 'all' || x.dataset.topic === topic) &&
      x.dataset.title!.includes(q) &&
      (!onlySaved || saved.has(x.dataset.pin!))
    )
    if (!x.hidden) n++
  })
  $('#pin-status').textContent = `${n} 张室内摄影 · ${onlySaved ? '本次清单' : '本次灵感墙'}`
  $('#pin-empty').hidden = n > 0
  $('#saved-count').textContent = String(saved.size)
}
$('#pin-search').oninput = refresh
document.querySelectorAll<HTMLButtonElement>('[data-topic-filter]').forEach(
  (b) =>
    (b.onclick = () => {
      topic = b.dataset.topicFilter!
      document
        .querySelectorAll('[data-topic-filter]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      refresh()
    }),
)
$('#only-saved').onclick = () => {
  onlySaved = !onlySaved
  $('#only-saved').setAttribute('aria-pressed', String(onlySaved))
  refresh()
}
const detail = $<HTMLDialogElement>('#pin-detail')
document.querySelectorAll<HTMLButtonElement>('[data-pin]').forEach(
  (b) =>
    (b.onclick = () => {
      current = b.dataset.pin!
      $('#pin-image').setAttribute('src', b.querySelector('img')!.getAttribute('src')!)
      $('#pin-title').textContent = b.dataset.title!
      $('#pin-image').setAttribute('alt', b.querySelector('img')!.alt)
      $('#save-pin').textContent = saved.has(current) ? '从本次清单移除' : '收录到本次清单'
      $('#save-note').textContent = '清单只在当前页面中保留。'
      detail.showModal()
    }),
)
$('#pin-close').onclick = () => detail.close()
$('#save-pin').onclick = () => {
  if (saved.has(current)) saved.delete(current)
  else saved.add(current)
  $('#save-pin').textContent = saved.has(current) ? '从本次清单移除' : '收录到本次清单'
  $('#save-note').textContent = saved.has(current) ? '已收录，不会重复添加。' : '已从本次清单移除。'
  refresh()
}
void announceReady('pinterest')
