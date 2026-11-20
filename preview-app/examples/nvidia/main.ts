import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const filter = () => {
  const use = $<HTMLSelectElement>('#use').value,
    c = $<HTMLSelectElement>('#connection').value
  let n = 0
  document.querySelectorAll<HTMLElement>('.resources article').forEach((x) => {
    x.hidden = !(
      (use === 'all' || x.dataset.use === use) &&
      (c === 'all' || x.dataset.connection === c)
    )
    if (!x.hidden) n++
  })
  $('#filter-status').textContent = n ? `${n} 套概念套件` : '没有适配的演示套件，请清除条件。'
}
$('#use').onchange = filter
$('#connection').onchange = filter
$('#reset').onclick = () => {
  $<HTMLSelectElement>('#use').value = 'all'
  $<HTMLSelectElement>('#connection').value = 'all'
  filter()
}
const selected: string[] = []
function renderComparison() {
  const data: Record<string, [string, string, string, string]> = {
    'Edge Eight': ['8 GB', 'Ethernet / USB-C', '开放PCB + 散热器', '固定观察点'],
    'Field Four': ['4 GB', 'Wi-Fi / USB-C', '双天线被动散热机箱', '移动采集'],
    'Studio Twelve': ['12 GB', 'Wi-Fi / HDMI', '竖置散热机箱', '展览装置'],
  }
  $('#compare-list').replaceChildren(
    ...selected.map((name) => {
      const card = document.createElement('div'),
        h = document.createElement('strong'),
        dl = document.createElement('dl'),
        remove = document.createElement('button')
      h.textContent = name
      dl.className = 'compare-fields'
      ;['概念内存', '接口', '结构', '部署方向'].forEach((key, i) => {
        const row = document.createElement('div'),
          dt = document.createElement('dt'),
          dd = document.createElement('dd')
        dt.textContent = key
        dd.textContent = data[name][i]
        row.append(dt, dd)
        dl.append(row)
      })
      remove.textContent = '移除套件'
      remove.onclick = () => {
        selected.splice(selected.indexOf(name), 1)
        renderComparison()
        $('#compare-status').textContent = '已移除，可继续选择。'
      }
      card.append(h, dl, remove)
      return card
    }),
  )
  if (!selected.length) $('#compare-list').textContent = '还没有选择套件。'
}
document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(
  (b) =>
    (b.onclick = () => {
      const name = b.dataset.add!
      if (selected.includes(name)) {
        $('#compare-status').textContent = '这个套件已在对比中，不重复添加。'
        return
      }
      if (selected.length === 2) {
        $('#compare-status').textContent = '最多比较两套，请先清空再选择。'
        return
      }
      selected.push(name)
      $('#compare-status').textContent = `已选择 ${selected.length} 套概念套件。`
      renderComparison()
    }),
)
$('#clear-comparison').onclick = () => {
  selected.length = 0
  $('#compare-list').textContent = '还没有选择套件。'
  $('#compare-status').textContent = '对比已清空。'
}
void announceReady('nvidia')
