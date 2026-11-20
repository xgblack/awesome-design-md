import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource-variable/manrope'
const assets = {
  sun: {
    family: new URL('./assets/brik-sun-family.svg', import.meta.url).href,
    studio: new URL('./assets/brik-sun-studio.svg', import.meta.url).href,
    cargo: new URL('./assets/brik-sun-cargo.svg', import.meta.url).href,
  },
  chalk: {
    family: new URL('./assets/brik-chalk-family.svg', import.meta.url).href,
    studio: new URL('./assets/brik-chalk-studio.svg', import.meta.url).href,
    cargo: new URL('./assets/brik-chalk-cargo.svg', import.meta.url).href,
  },
  blue: {
    family: new URL('./assets/brik-blue-family.svg', import.meta.url).href,
    studio: new URL('./assets/brik-blue-studio.svg', import.meta.url).href,
    cargo: new URL('./assets/brik-blue-cargo.svg', import.meta.url).href,
  },
}
const modules = {
  family: {
    name: '家庭同行',
    seats: '6座概念',
    layout: '三排座椅',
    desc: '为朋友、孩子和计划之外的同行者，留好座位。',
  },
  studio: {
    name: '移动工坊',
    seats: '2座概念',
    layout: '侧向货架',
    desc: '把手工具、作品和材料，变成一间会移动的小工坊。',
  },
  cargo: {
    name: '街区配送',
    seats: '2座概念',
    layout: '箱件装载区',
    desc: '为最后一段街区运输，留出方正而直接的装载空间。',
  },
}
let mode: keyof typeof modules = 'family',
  color: keyof typeof assets = 'sun'
const colorNames = { sun: '阳光黄', chalk: '粉笔白', blue: '海港蓝' }
function configure() {
  const m = modules[mode],
    rack = $<HTMLInputElement>('#rack')
  rack.disabled = mode !== 'studio'
  if (rack.disabled) rack.checked = false
  $('#config-image').setAttribute('src', assets[color][mode])
  $('#config-image').setAttribute('alt', colorNames[color] + m.name + '模块车原创渲染')
  $('#config-caption').textContent = m.layout + ' / ' + m.seats
  $('#seat-count').textContent = m.seats
  $('#layout-label').textContent = m.layout + (rack.checked ? ' + 固定工具架' : '')
  $('#summary').textContent = colorNames[color] + ' / ' + m.name
  $('#compatibility').textContent =
    mode === 'studio'
      ? rack.checked
        ? '已加入固定工具架，仅为车内配置概念。'
        : '移动工坊允许附加固定工具架。'
      : m.name + '保留' + (mode === 'family' ? '座椅通道' : '箱件装载区') + '，不兼容固定工具架。'
}
document.querySelectorAll<HTMLInputElement>('input[name=module]').forEach(
  (r) =>
    (r.onchange = () => {
      mode = r.value as typeof mode
      configure()
    }),
)
document.querySelectorAll<HTMLButtonElement>('[data-color]').forEach(
  (b) =>
    (b.onclick = () => {
      color = b.dataset.color as typeof color
      document
        .querySelectorAll('[data-color]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      configure()
    }),
)
$('#rack').onchange = configure
function range() {
  const use = $<HTMLSelectElement>('#use-case').value
  const list = (Object.keys(modules) as (keyof typeof modules)[]).filter(
    (k) => use === 'all' || use === k,
  )
  $('#range-cards').replaceChildren(
    ...list.map((k) => {
      const m = modules[k],
        a = document.createElement('article')
      a.innerHTML = `<img alt="BRIK ${m.name}四轮模块车概念"><h3>BRIK / ${m.name}</h3><p>${m.desc}</p><button type="button">探索这套布局 ↗</button>`
      a.querySelector('img')!.src =
        assets[k === 'family' ? 'sun' : k === 'studio' ? 'chalk' : 'blue'][k]
      a.querySelector('button')!.onclick = () => {
        mode = k
        document
          .querySelectorAll<HTMLInputElement>('input[name=module]')
          .forEach((r) => (r.checked = r.value === k))
        configure()
        $('#configure').scrollIntoView({ behavior: 'smooth' })
      }
      return a
    }),
  )
  $('#range-status').textContent = `${list.length} 种内部布局概念，均为四轮模块车。`
}
$('#use-case').onchange = range
range()
configure()

void announceReady('renault')
