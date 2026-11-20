import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const rates: Record<string, number> = { CNY: 1, JPY: 20, EUR: 0.13 }
function convert() {
  const raw = ($('#amount') as HTMLInputElement).value.trim(),
    n = Number(raw)
  if (!/^\d+(\.\d{1,2})?$/.test(raw) || !Number.isFinite(n) || n <= 0 || n > 10000000) {
    $('#error').textContent = '金额需大于 0，不超过 1,000 万，最多两位小数。'
    $('#converted').textContent = '—'
    return
  }
  const from = ($('#from') as HTMLSelectElement).value,
    to = ($('#to') as HTMLSelectElement).value
  $('#fee').textContent = (n * 0.005).toFixed(2) + ' ' + from
  $('#converted').textContent =
    (((n * 0.995) / rates[from]) * rates[to]).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    ' ' +
    to
  $('#rate').textContent =
    `固定演示：1 ${from} = ${(rates[to] / rates[from]).toFixed(4)} ${to} · 扣除 0.50% 示例费用`
  $('#error').textContent = ''
}
$('#calculator').onsubmit = (e) => {
  e.preventDefault()
  convert()
}
$('#swap').onclick = () => {
  const a = $<HTMLSelectElement>('#from'),
    b = $<HTMLSelectElement>('#to')
  ;[a.value, b.value] = [b.value, a.value]
  convert()
}
$('#from').addEventListener('change', convert)
$('#to').addEventListener('change', convert)
function budget() {
  const values = ['stay', 'food', 'transport'].map((id) =>
    Number(($('#' + id) as HTMLInputElement).value),
  )
  if (values.some((n) => !Number.isFinite(n) || n < 0 || n > 1000000)) {
    $('#trip-message').textContent = '费用需为有效的非负金额，且不超过 100 万。'
    $('#trip-total').textContent = '—'
    return
  }
  const total = values.reduce((a, b) => a + b, 0)
  $('#trip-total').textContent = '¥' + total.toLocaleString()
  $('#trip-message').textContent =
    total > 3000
      ? `超出参考上限 ¥${(total - 3000).toLocaleString()}，可以重新安排。`
      : `距离参考上限还留有 ¥${(3000 - total).toLocaleString()}。`
}
for (const id of ['stay', 'food', 'transport']) $('#' + id).addEventListener('input', budget)
$('#destination').addEventListener('change', () => {
  const kyoto = ($('#destination') as HTMLSelectElement).value === 'kyoto'
  $('#trip-name').textContent = kyoto ? '京都 / 三天的慢行' : '里斯本 / 三天的街巷'
  const v = kyoto ? [1200, 600, 300] : [1500, 700, 250]
  ;['stay', 'food', 'transport'].forEach(
    (id, i) => (($('#' + id) as HTMLInputElement).value = String(v[i])),
  )
  budget()
})
convert()
budget()

void announceReady('wise')
