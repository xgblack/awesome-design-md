import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const tiers = [
  {
    id: 'standard',
    name: 'Standard',
    price: 0,
    limit: 200,
    spendRate: 0.002,
    copy: '从日常开始，按使用付费。',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 5,
    limit: 1000,
    spendRate: 0.001,
    copy: '为有规律的跨境消费留出空间。',
  },
  {
    id: 'metal',
    name: 'Metal',
    price: 12,
    limit: 3000,
    spendRate: 0.0005,
    copy: '更高模型换汇额度与更低服务费。',
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 25,
    limit: Infinity,
    spendRate: 0,
    copy: '在固定模型中不设换汇额度。',
  },
]
let chosen: string[] = [],
  spend = 800,
  exchange = 500,
  valid = true
const money = (n: number) => '$' + n.toFixed(2)
function fee(t: (typeof tiers)[number]) {
  const service = spend * t.spendRate,
    fx = Math.max(0, exchange - t.limit) * 0.01
  return { service, fx, total: t.price + service + fx }
}
function render() {
  $('#tiers').innerHTML = tiers
    .map((t) => {
      const f = fee(t)
      return `<article class="tier"><small>MOTION / FIXED DEMO MODEL</small><h3>${t.name}</h3><p>${t.copy}</p><strong>${money(t.price)}<small> / 月费</small></strong><div class="fee">消费服务费 ${valid ? money(f.service) : '—'}<br>超额度换汇费 ${valid ? money(f.fx) : '—'}<b>${valid ? money(f.total) : '—'} / 月合计</b></div><p>模型免费换汇额度：${t.limit === Infinity ? '不限' : money(t.limit)}</p><button data-tier="${t.id}" aria-pressed="${chosen.includes(t.id)}">${chosen.includes(t.id) ? '移出比较 −' : '加入比较 ＋'}</button></article>`
    })
    .join('')
  $('#selected').textContent = chosen.length
    ? chosen.map((id) => tiers.find((t) => t.id === id)!.name).join(' / ')
    : '选择两档，看看不同。'
  $<HTMLButtonElement>('#compare').disabled = chosen.length !== 2 || !valid
  document.querySelectorAll<HTMLButtonElement>('[data-tier]').forEach(
    (b) =>
      (b.onclick = () => {
        const id = b.dataset.tier!
        if (chosen.includes(id)) chosen = chosen.filter((x) => x !== id)
        else if (chosen.length >= 2) {
          $('#selected').textContent = '最多比较两档，请先移出一档。'
          return
        } else chosen.push(id)
        render()
      }),
  )
}
$('#recommend').onsubmit = (e) => {
  e.preventDefault()
  const a = $<HTMLInputElement>('#spend'),
    b = $<HTMLInputElement>('#exchange')
  spend = a.value.trim() === '' ? NaN : Number(a.value)
  exchange = b.value.trim() === '' ? NaN : Number(b.value)
  valid = [spend, exchange].every((n) => Number.isFinite(n) && n >= 0 && n <= 1000000)
  $('#recommendation').textContent = valid
    ? `已按消费 ${money(spend)} / 换汇 ${money(exchange)} 核对四档固定模型。不是产品推荐。`
    : '请填写 0 至 1,000,000 之间的有限金额。'
  render()
  if (!valid) (!Number.isFinite(spend) || spend < 0 || spend > 1000000 ? a : b).focus()
}
$('#compare').onclick = () => {
  $('#comparison-body').innerHTML = chosen
    .map((id) => {
      const t = tiers.find((t) => t.id === id)!,
        f = fee(t)
      return `<section><h3>${t.name}</h3><p>月费 ${money(t.price)}</p><p>免费换汇额度 ${t.limit === Infinity ? '不限' : money(t.limit)}</p><p>超额度部分 × 1%</p><p>消费服务费率 ${(t.spendRate * 100).toFixed(2)}%</p><p>模型月合计 ${money(f.total)}</p></section>`
    })
    .join('')
  $<HTMLDialogElement>('#comparison').showModal()
}
$('#close').onclick = () => $<HTMLDialogElement>('#comparison').close()
render()

void announceReady('revolut')
