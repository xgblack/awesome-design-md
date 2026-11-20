import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/jetbrains-mono'
const assets = [
  { code: 'BTC', name: 'Bitcoin', price: 68400, change: '+2.40%', volume: 780 },
  { code: 'ETH', name: 'Ethereum', price: 3240, change: '−0.80%', volume: 310 },
  { code: 'SOL', name: 'Solana', price: 145.8, change: '+1.20%', volume: 88 },
  { code: 'ADA', name: 'Cardano', price: 0.48, change: '−1.10%', volume: 51 },
]
function render() {
  const q = ($('#search') as HTMLInputElement).value.toLowerCase()
  const shown = assets.filter((x) => (x.name + x.code).toLowerCase().includes(q))
  const sort = ($('#sort') as HTMLSelectElement).value
  if (sort === 'price') shown.sort((a, b) => b.price - a.price)
  if (sort === 'name') shown.sort((a, b) => a.name.localeCompare(b.name))
  $('#rows').innerHTML = shown
    .map(
      (a) =>
        `<tr><td><strong>${a.code}</strong><small>${a.name}</small></td><td>${a.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td>${a.change}</td><td>${a.volume}</td><td><button data-asset="${a.code}">读资料 ↗</button></td></tr>`,
    )
    .join('')
  $('#empty').hidden = shown.length > 0
  document.querySelectorAll<HTMLButtonElement>('[data-asset]').forEach(
    (b) =>
      (b.onclick = () => {
        $('#asset-title').textContent = b.dataset.asset + ' / 资产样本'
        ;($('#asset') as HTMLDialogElement).showModal()
      }),
  )
}
$('#search').addEventListener('input', render)
$('#sort').addEventListener('change', render)
$('#clear').onclick = () => {
  ;($('#search') as HTMLInputElement).value = ''
  render()
}
$('#open-calc').onclick = () => ($('#calculator') as HTMLDialogElement).showModal()
$('#close').onclick = () => ($('#calculator') as HTMLDialogElement).close()
$('#asset-close').onclick = () => ($('#asset') as HTMLDialogElement).close()
$('#calc-form').onsubmit = (e) => {
  e.preventDefault()
  const raw = ($('#amount') as HTMLInputElement).value.trim()
  const n = Number(raw)
  if (!/^\d+(\.\d{1,2})?$/.test(raw) || !Number.isFinite(n) || n <= 0 || n > 100000000) {
    $('#error').textContent = '请输入大于 0、不超过 1 亿且最多两位小数的金额。'
    $('#result').textContent = ''
    return
  }
  $('#error').textContent = ''
  $('#result').textContent = `${(n / 68400).toFixed(8)} BTC（样本）`
}
render()

void announceReady('binance')
