import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
let trips = 44,
  distance = 8
function render() {
  const selected = [...document.querySelectorAll<HTMLInputElement>('.options input:checked')].map(
    (x) => x.value,
  )
  const data = [
    { id: 'bus', name: '公交', cost: trips * 2, formula: `${trips} 次 × 2 元` },
    {
      id: 'bike',
      name: '骑行',
      cost: trips * distance * 0.15,
      formula: `${trips} 次 × ${distance} 公里 × 0.15 元`,
    },
    {
      id: 'mixed',
      name: '混合通勤',
      cost: Math.ceil(trips / 2) * 2 + Math.floor(trips / 2) * distance * 0.15,
      formula: `${Math.ceil(trips / 2)} 次公交 + ${Math.floor(trips / 2)} 次骑行`,
    },
  ].filter((x) => selected.includes(x.id))
  $('#results').innerHTML = data
    .map(
      (x) =>
        `<div class="result-row"><span>${x.name}<small>${x.formula}</small></span><strong>¥${x.cost.toFixed(2)}</strong></div>`,
    )
    .join('')
  $('#summary').textContent = !data.length
    ? '请至少选择一种通勤方式。'
    : `${trips} 次单程，${distance} 公里/次。${data.length > 1 ? `所选方案相差 ¥${(Math.max(...data.map((x) => x.cost)) - Math.min(...data.map((x) => x.cost))).toFixed(2)}。` : ''}以上均按公开演示假设计算。`
}
$('#cost-form').onsubmit = (e) => {
  e.preventDefault()
  const t = ($('#trips') as HTMLInputElement).value,
    d = ($('#distance') as HTMLInputElement).value
  if (!/^\d+$/.test(t) || Number(t) > 1000 || !/^\d+(\.\d{1,2})?$/.test(d) || Number(d) > 500) {
    $('#error').textContent = '次数需为 0–1000 的整数；里程需为 0–500，最多两位小数。'
    return
  }
  trips = Number(t)
  distance = Number(d)
  $('#error').textContent = ''
  render()
}
document.querySelectorAll('.options input').forEach((i) => i.addEventListener('change', render))
render()

void announceReady('nerdwallet')
