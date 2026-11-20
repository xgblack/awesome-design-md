import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/jetbrains-mono'
let budget = 1000
const symbols = ['btc', 'eth', 'usdc'] as const,
  prices = { btc: 60000, eth: 3000, usdc: 1 }
const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
function values() {
  return symbols.map((k) => {
    const raw = $<HTMLInputElement>('#' + k).value
    return raw.trim() === '' ? NaN : Number(raw)
  })
}
function render() {
  const amounts = values(),
    valid = amounts.every((x) => Number.isFinite(x) && x >= 0 && x <= 1000000),
    remaining = budget - amounts.reduce((a, b) => a + b, 0)
  $('#income').textContent = money(budget)
  $('#balance').textContent = valid ? money(remaining) : '—'
  $('#message').textContent = !valid
    ? '金额须为 0 至 1,000,000 之间的有限数字。'
    : remaining < 0
      ? '配置超过可用资金，请减少金额。'
      : '金额 ÷ 固定样本价格 = 纸面资产数量。'
  $<HTMLButtonElement>('#confirm').disabled = !valid || remaining < 0
  $('#quantities').innerHTML = symbols
    .map(
      (k, i) =>
        `<div><span>${k.toUpperCase()} / 纸面数量</span><strong>${valid ? (amounts[i] / prices[k]).toFixed(k === 'usdc' ? 2 : 6) : '—'}</strong></div>`,
    )
    .join('')
  $('#confirmed').textContent = '只有纸面配置，不购买任何资产。'
}
symbols.forEach((k) => $('#' + k).addEventListener('input', render))
$('#preset').addEventListener('change', () => {
  const second = $<HTMLSelectElement>('#preset').value === 'b'
  budget = second ? 2000 : 1000
  ;[second ? 900 : 500, second ? 500 : 250, second ? 400 : 150].forEach(
    (v, i) => ($<HTMLInputElement>('#' + symbols[i]).value = String(v)),
  )
  render()
})
$('#confirm').onclick = () => {
  if (!$<HTMLButtonElement>('#confirm').disabled)
    $('#confirmed').textContent = '这份练习已确认，仅存在本页内存；没有发起交易。'
}
render()

void announceReady('coinbase')
