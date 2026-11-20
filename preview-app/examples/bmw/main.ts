import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const filter = () => {
  const range = Number($<HTMLSelectElement>('#range').value),
    seats = Number($<HTMLSelectElement>('#seats').value)
  let count = 0
  document.querySelectorAll<HTMLElement>('[data-range]').forEach((card) => {
    card.hidden =
      Number(card.dataset.range) < range || (seats > 0 && Number(card.dataset.seats) !== seats)
    if (!card.hidden) count++
  })
  $('#model-status').textContent = count
    ? `${count} 款概念车型，非实际测试数据。`
    : '没有匹配的车型，请重置条件。'
}
$('#range').onchange = filter
$('#seats').onchange = filter
$('#reset-models').onclick = () => {
  $<HTMLSelectElement>('#range').value = '0'
  $<HTMLSelectElement>('#seats').value = '0'
  filter()
}
const images: Record<string, string> = {
  'city-silver-18': new URL('./assets/city-silver-18.webp', import.meta.url).href,
  'city-silver-20': new URL('./assets/city-silver-20.webp', import.meta.url).href,
  'city-blue-18': new URL('./assets/city-blue-18.webp', import.meta.url).href,
  'city-blue-20': new URL('./assets/city-blue-20.webp', import.meta.url).href,
  'tour-silver-18': new URL('./assets/tour-silver-18.webp', import.meta.url).href,
  'tour-silver-20': new URL('./assets/tour-silver-20.webp', import.meta.url).href,
  'tour-blue-18': new URL('./assets/tour-blue-18.webp', import.meta.url).href,
  'tour-blue-20': new URL('./assets/tour-blue-20.webp', import.meta.url).href,
  'space-silver-18': new URL('./assets/space-silver-18.webp', import.meta.url).href,
  'space-silver-20': new URL('./assets/space-silver-20.webp', import.meta.url).href,
  'space-blue-18': new URL('./assets/space-blue-18.webp', import.meta.url).href,
  'space-blue-20': new URL('./assets/space-blue-20.webp', import.meta.url).href,
}
const models: Record<string, { name: string; range: number }> = {
  city: { name: 'Polar E City', range: 420 },
  tour: { name: 'Polar E Tour', range: 560 },
  space: { name: 'Polar E Space', range: 480 },
}
function configure() {
  const model = $<HTMLSelectElement>('#model').value,
    paint = $<HTMLSelectElement>('#paint').value,
    wheels = $<HTMLSelectElement>('#wheels'),
    blue = paint === 'blue'
  const changed = blue && wheels.value === '20'
  wheels.options[1].disabled = blue
  if (changed) wheels.value = '18'
  const size = wheels.value,
    m = models[model],
    paintName = blue ? '深湾蓝' : '海雾银'
  const img = $<HTMLImageElement>('#configured-car')
  img.src = images[model + '-' + paint + '-' + size]
  img.alt = `${m.name} / ${paintName} / ${size}英寸轮毂原创概念图`
  $('#configuration').textContent =
    `${m.name} · ${paintName} · ${size}英寸${size === '18' ? '轻量' : '运动'} · ${m.range - (size === '20' ? 35 : 0)} km概念续航${blue ? '。20英寸运动轮毂与深湾蓝套件不兼容，已禁用。' : ''}${changed ? ' 原20英寸选择已明确恢复到18英寸。' : ''}`
}
for (const id of ['model', 'paint', 'wheels']) $('#' + id).onchange = configure
document.querySelectorAll<HTMLAnchorElement>('[data-configure-model]').forEach(
  (a) =>
    (a.onclick = () => {
      $<HTMLSelectElement>('#model').value = a.dataset.configureModel!
      configure()
    }),
)
$('#configure form').onsubmit = (e) => e.preventDefault()
filter()
configure()

void announceReady('bmw')
