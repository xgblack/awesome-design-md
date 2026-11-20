import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const filter = () => {
  const q = $<HTMLInputElement>('#search').value.trim().toLowerCase()
  const year = $<HTMLSelectElement>('#year').value
  let count = 0
  document.querySelectorAll<HTMLElement>('[data-name]').forEach((article) => {
    article.hidden =
      !article.dataset.name!.toLowerCase().includes(q) ||
      (year !== 'all' && article.dataset.year !== year)
    if (!article.hidden) count++
  })
  $('#search-status').textContent = count
    ? `${count} 件馆藏`
    : '没有找到匹配馆藏，请调整搜索或年份。'
}
$('#filters').onsubmit = (event) => event.preventDefault()
$('#search').oninput = filter
$('#year').onchange = filter
$('#reset-search').onclick = () => {
  $<HTMLInputElement>('#search').value = ''
  $<HTMLSelectElement>('#year').value = 'all'
  filter()
  $('#search').focus()
}
$('#config').onsubmit = (event) => {
  event.preventDefault()
  const cpu = $<HTMLSelectElement>('#cpu').value
  const ram = Number($<HTMLSelectElement>('#ram').value)
  const slot = $<HTMLSelectElement>('#slot').value
  $('#ram').removeAttribute('aria-invalid')
  $('#slot').removeAttribute('aria-invalid')
  if (cpu === '486' && ram > 16) {
    $('#config-result').textContent =
      '兼容提示：本馆虚构 BA-94 主板最多支持 16 MB，请降低内存。不是所有 486 主板的通用限制。'
    $('#ram').setAttribute('aria-invalid', 'true')
    $('#ram').focus()
    return
  }
  if (cpu === '486' && slot === 'pci') {
    $('#config-result').textContent =
      '兼容提示：本馆虚构 BA-94 没有 PCI 插槽，请选择 ISA 卡或 BA-96 主板。'
    $('#slot').setAttribute('aria-invalid', 'true')
    $('#slot').focus()
    return
  }
  $('#config-result').textContent =
    `配置单：${cpu === '486' ? '486 DX2' : 'Pentium 90'} + ${ram} MB RAM + ${slot.toUpperCase()} 卡。仅本次演示，不下单。`
}
void announceReady('dell-1996')
