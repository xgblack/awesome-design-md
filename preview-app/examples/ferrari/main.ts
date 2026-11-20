import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const images = {
  rosso: new URL('./assets/veloce-rosso.svg', import.meta.url).href,
  bianco: new URL('./assets/veloce-bianco.svg', import.meta.url).href,
  graphite: new URL('./assets/veloce-graphite.svg', import.meta.url).href,
}
const paintNames: Record<string, [string, string]> = {
  rosso: ['Rosso', '在暖黑舞台上，保留最直接的力量。'],
  bianco: ['Bianco', '明亮车身，让肩线和导流开口更清晰。'],
  graphite: ['Graphite', '冷灰反射，专注于雕塑般的车身体积。'],
}
document.querySelectorAll<HTMLButtonElement>('[data-paint]').forEach(
  (b) =>
    (b.onclick = () => {
      const k = b.dataset.paint! as keyof typeof images
      $('#hero-car').setAttribute('src', images[k])
      $('#paint-car').setAttribute('src', images[k])
      $('#paint-car').setAttribute('alt', paintNames[k][0] + ' 车型渲染')
      $('#paint-note').textContent = paintNames[k].join(' / ')
      document
        .querySelectorAll('[data-paint]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
const cars = [
  {
    name: '296 Studio',
    series: 'sport',
    year: '2026',
    color: 'rosso',
    desc: '短车头 / 双门 / 中置动力构型研究',
  },
  {
    name: 'Roma Forma',
    series: 'gt',
    year: '2024',
    color: 'bianco',
    desc: '双门旅行 / 宽肩线 / 暖白金属概念',
  },
  {
    name: 'Pista 02',
    series: 'sport',
    year: '2022',
    color: 'graphite',
    desc: '封闭场地灵感 / 导流开口 / 轻量化研究',
  },
]
function render() {
  const series = $<HTMLSelectElement>('#series').value,
    year = $<HTMLSelectElement>('#year').value,
    items = cars.filter(
      (c) => (series === 'all' || series === c.series) && (year === 'all' || year === c.year),
    )
  $('#cars').replaceChildren(
    ...items.map((c) => {
      const a = document.createElement('article')
      a.innerHTML = `<img alt="${c.name} 原创车款概念"><span>${c.year} / DESIGN ARCHIVE</span><h3>${c.name}</h3><p>${c.desc}</p>`
      a.querySelector('img')!.src = images[c.color as keyof typeof images]
      return a
    }),
  )
  $('#result-count').textContent = `${items.length} 份概念车款档案`
  $('#empty').hidden = items.length > 0
}
$('#series').onchange = render
$('#year').onchange = render
$('#reset').onclick = () => {
  $<HTMLSelectElement>('#series').value = 'all'
  $<HTMLSelectElement>('#year').value = 'all'
  render()
}
render()

void announceReady('ferrari')
