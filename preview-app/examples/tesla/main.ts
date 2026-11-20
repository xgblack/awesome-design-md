import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const scenes = {
  s: {
    pearl: new URL('./assets/scene-s-pearl.svg', import.meta.url).href,
    graphite: new URL('./assets/scene-s-graphite.svg', import.meta.url).href,
    red: new URL('./assets/scene-s-red.svg', import.meta.url).href,
  },
  x: {
    pearl: new URL('./assets/scene-x-pearl.svg', import.meta.url).href,
    graphite: new URL('./assets/scene-x-graphite.svg', import.meta.url).href,
    red: new URL('./assets/scene-x-red.svg', import.meta.url).href,
  },
}
const cars = {
  s: {
    pearl: new URL('./assets/s-pearl.svg', import.meta.url).href,
    graphite: new URL('./assets/s-graphite.svg', import.meta.url).href,
    red: new URL('./assets/s-red.svg', import.meta.url).href,
  },
  x: {
    pearl: new URL('./assets/x-pearl.svg', import.meta.url).href,
    graphite: new URL('./assets/x-graphite.svg', import.meta.url).href,
    red: new URL('./assets/x-red.svg', import.meta.url).href,
  },
}
const mobileScenes = {
  s: {
    pearl: new URL('./assets/mobile-s-pearl.svg', import.meta.url).href,
    graphite: new URL('./assets/mobile-s-graphite.svg', import.meta.url).href,
    red: new URL('./assets/mobile-s-red.svg', import.meta.url).href,
  },
  x: {
    pearl: new URL('./assets/mobile-x-pearl.svg', import.meta.url).href,
    graphite: new URL('./assets/mobile-x-graphite.svg', import.meta.url).href,
    red: new URL('./assets/mobile-x-red.svg', import.meta.url).href,
  },
}
let model: 's' | 'x' = 's',
  paint: 'pearl' | 'graphite' | 'red' = 'pearl'
const paints = { pearl: '珍珠白', graphite: '石墨灰', red: '暮光红' }
function update() {
  $('#mobile-scene').setAttribute('srcset', mobileScenes[model][paint])
  const name = model === 's' ? 'Still S' : 'Still X'
  $('#scene-image').setAttribute('src', scenes[model][paint])
  $('#scene-image').setAttribute('alt', name + ' ' + paints[paint] + ' 原创电动车环境渲染')
  $('#car-image').setAttribute('src', cars[model][paint])
  $('#car-image').setAttribute('alt', name + ' ' + paints[paint] + ' 电动车独立产品渲染')
  $('#model-name').textContent = name
  $('#model-line').textContent = model === 's' ? '把日常，开向更远。' : '更多空间，同样从容。'
  $('#paint-note').textContent = name + ' / ' + paints[paint]
  $('#seats').textContent = model === 's' ? '2 + 2' : '5 SEATS'
  $('#body-style').textContent = model === 's' ? '低风阻双门概念' : '高车顶跨界概念'
}
$('#model-select').onchange = () => {
  model = $<HTMLSelectElement>('#model-select').value as 's' | 'x'
  update()
}
document.querySelectorAll<HTMLButtonElement>('[data-paint]').forEach(
  (b) =>
    (b.onclick = () => {
      paint = b.dataset.paint! as typeof paint
      document
        .querySelectorAll('[data-paint]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      update()
    }),
)
const date = $<HTMLInputElement>('#visit-date')
const today = new Date()
const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
date.min = minDate
$('#visit-form').onsubmit = (e) => {
  e.preventDefault()
  const guests = $<HTMLSelectElement>('#visit-guests').value
  if (!date.value || date.value < minDate || !guests) {
    $('#visit-result').textContent = '请选择今天或之后的意向日期及同行人数。'
    if (!date.value || date.value < minDate) date.focus()
    else $('#visit-guests').focus()
    return
  }
  $('#visit-result').textContent =
    `意向草稿：${model === 's' ? 'Still S' : 'Still X'} / ${date.value} / ${guests} 人 / ${$<HTMLSelectElement>('#visit-topic').value}。仅本页保存，未发送预约。`
  $('#edit-visit').hidden = false
}
$('#edit-visit').onclick = () => {
  $('#visit-result').textContent = '已进入编辑，修改后请重新保存意向草稿。'
  date.focus()
}

void announceReady('tesla')
