import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource-variable/source-sans-3'
const images = {
  air: new URL('./assets/tern-air.svg', import.meta.url).href,
  pocket: new URL('./assets/tern-pocket.svg', import.meta.url).href,
}
const tasks: Record<
  string,
  { name: string; tier: string; desc: string; form: string; mode: string; image: 'air' | 'pocket' }
> = {
  landscape: {
    name: 'Tern Air 04',
    tier: 'AIR SERIES',
    desc: '广阔视野与稳定云台，为山海旅程保留全景叙事。',
    form: '四旋翼无人机',
    mode: '宽幅影像概念',
    image: 'air',
  },
  portrait: {
    name: 'Tern Air 04 · Light',
    tier: 'AIR / TRAVEL CONFIGURATION',
    desc: '保留飞行器与遥控器，将配件控制在轻量旅程需要的范围。',
    form: '轻装四旋翼配置',
    mode: '旅行静帧与短片',
    image: 'air',
  },
  studio: {
    name: 'Tern Pocket',
    tier: 'POCKET SERIES',
    desc: '从桌面手作到室内访谈，用手持云台记录近距离故事。',
    form: '手持三轴稳定器',
    mode: '室内叙事影像',
    image: 'pocket',
  },
}
let task = 'landscape'
function update() {
  const t = tasks[task],
    bundle = $<HTMLSelectElement>('#bundle')
  bundle.options[1].disabled = task === 'studio'
  if (task === 'studio' && bundle.value === 'field') bundle.value = 'basic'
  $('#kit-tier').textContent = t.tier
  $('#kit-name').textContent = t.name
  $('#kit-desc').textContent = t.desc
  $('#form-factor').textContent = t.form
  $('#record-mode').textContent = t.mode
  $('#kit-image').setAttribute('src', images[t.image])
  $('#kit-image').setAttribute('alt', t.name + ' 器材原创渲染')
  const items =
    task === 'studio'
      ? ['Tern Pocket 稳定器概念 ×1', '保护壳 ×1', '腕带 ×1']
      : bundle.value === 'field'
        ? ['Tern Air 04 无人机概念 ×1', '遥控器概念 ×1', '备用电池概念 ×2', '防护箱 ×1']
        : ['Tern Air 04 无人机概念 ×1', '遥控器概念 ×1']
  $('#box-items').replaceChildren(
    ...items.map((text) => {
      const li = document.createElement('li')
      li.textContent = text
      return li
    }),
  )
  $('#kit-status').textContent =
    task === 'studio'
      ? '室内稳定器不兼容飞行器野外组合，已使用基础组合。'
      : bundle.value === 'field'
        ? '已加入备用电池和防护箱，仅为固定演示清单。'
        : `当前为${task === 'landscape' ? '山海旅行' : '轻装旅拍'}任务，可选择野外记录组合。`
}
document.querySelectorAll<HTMLButtonElement>('[data-task]').forEach(
  (b) =>
    (b.onclick = () => {
      task = b.dataset.task!
      document
        .querySelectorAll('[data-task]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      update()
    }),
)
$('#bundle').onchange = update
update()

void announceReady('dji')
