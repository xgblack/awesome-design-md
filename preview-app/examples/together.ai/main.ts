import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const models = [
  { name: 'Draft', type: 'text', context: '32k', batch: true, rate: 0.4 },
  { name: 'Observe', type: 'vision', context: '16k', batch: true, rate: 0.8 },
  { name: 'Listen', type: 'audio', context: '8k', batch: false, rate: 1.2 },
  { name: 'Expand', type: 'text', context: '64k', batch: false, rate: 0.6 },
]
function render() {
  const result = models.filter(
    (m) =>
      ($<HTMLSelectElement>('#type').value === 'all' ||
        m.type === $<HTMLSelectElement>('#type').value) &&
      (!$<HTMLInputElement>('#batch').checked || m.batch),
  )
  $('#rows').innerHTML = result
    .map(
      (m) =>
        `<tr><td>${m.name}</td><td>${m.type.toUpperCase()}</td><td>${m.context}</td><td>${m.batch ? 'Yes' : 'No'}</td><td>$${m.rate.toFixed(2)}</td></tr>`,
    )
    .join('')
  $('#count').textContent = result.length + ' 项演示工作负载 · 固定费率，不是服务报价'
}
$('#type').addEventListener('change', render)
$('#batch').addEventListener('change', render)
$('#form').addEventListener('submit', (e) => {
  e.preventDefault()
  const value = $<HTMLInputElement>('#tokens').value
  const tokens = Number(value)
  if (
    !value ||
    !Number.isFinite(tokens) ||
    !Number.isInteger(tokens) ||
    tokens < 0 ||
    tokens > 100000000
  ) {
    $('#cost').textContent = '请输入 0–100,000,000 范围内的整数 token 数。'
    return
  }
  const key = $<HTMLSelectElement>('#workload').value
  const model = models.find(
    (m) =>
      m.name.toLowerCase() ===
      (key === 'voice' ? 'listen' : key === 'vision' ? 'observe' : 'draft'),
  )!
  const batch = $<HTMLInputElement>('#batch-price').checked
  if (batch && !model.batch) {
    $('#cost').textContent = 'Listen 不支持批量演示费率，请关闭批量选项。'
    return
  }
  const rate = model.rate * (batch ? 0.5 : 1)
  $('#cost').textContent =
    `${tokens.toLocaleString()} tokens ÷ 1,000,000\n× $${rate.toFixed(2)} / 1M\n= $${((tokens / 1000000) * rate).toFixed(4)}（演示）`
})
render()

void announceReady('together.ai')
