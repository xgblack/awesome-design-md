import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import graphiteSun from './assets/glasses-graphite-sun.webp'
import graphiteClear from './assets/glasses-graphite-clear.webp'
import sandSun from './assets/glasses-sand-sun.webp'
import sandClear from './assets/glasses-sand-clear.webp'
import graphiteSide from './assets/glasses-graphite-side.webp'
import sandSide from './assets/glasses-sand-side.webp'
import graphiteDetail from './assets/glasses-graphite-detail.webp'
import sandDetail from './assets/glasses-sand-detail.webp'
const files: Record<string, string> = {
  'graphite-sun': graphiteSun,
  'graphite-clear': graphiteClear,
  'sand-sun': sandSun,
  'sand-clear': sandClear,
  'graphite-side': graphiteSide,
  'sand-side': sandSide,
  'graphite-detail': graphiteDetail,
  'sand-detail': sandDetail,
}
let color = 'graphite',
  view = 'front'
const lens = () => document.querySelector<HTMLInputElement>('input[name=lens]:checked')!.value
function render() {
  const fit = $<HTMLSelectElement>('#fit').value,
    invalid = color === 'sand' && fit === 'sport'
  const img = $<HTMLImageElement>('#glasses')
  img.src = files[color + '-' + (view === 'front' ? lens() : view)]
  img.alt =
    'Vista ' +
    (color === 'graphite' ? '石墨黑' : '暖沙色') +
    '智能眼镜 / ' +
    (view === 'front'
      ? lens() === 'sun'
        ? '日光色镜片正面'
        : '透亮色镜片正面'
      : view === 'side'
        ? '镜腿侧面'
        : '传感器细节')
  $('#compatibility').textContent = invalid
    ? '暖沙色细镜腿不支持运动鼻托。请改选标准鼻托或石墨黑镜框。'
    : '当前配置兼容。运动鼻托仅适配石墨框，是本地示例假设。'
  $<HTMLButtonElement>('#summary').disabled = invalid
  document
    .querySelectorAll<HTMLButtonElement>('[data-color]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.color === color)))
  document
    .querySelectorAll<HTMLButtonElement>('[data-view]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)))
}
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(
  (b) =>
    (b.onclick = () => {
      view = b.dataset.view!
      render()
    }),
)
document.querySelectorAll<HTMLButtonElement>('[data-color]').forEach(
  (b) =>
    (b.onclick = () => {
      color = b.dataset.color!
      render()
    }),
)
document.querySelectorAll<HTMLInputElement>('input[name=lens]').forEach(
  (x) =>
    (x.onchange = () => {
      view = 'front'
      render()
    }),
)
$('#fit').addEventListener('change', render)
$('#summary').onclick = () => {
  if ($<HTMLButtonElement>('#summary').disabled) return
  $('#result-copy').textContent =
    `Vista 智能眼镜 / ${color === 'graphite' ? '石墨黑' : '暖沙色'}镜框 / ${lens() === 'sun' ? '日光色' : '透亮色'}镜片 / ${$<HTMLSelectElement>('#fit').value === 'standard' ? '标准' : '运动'}鼻托。原创概念配置，未生成订单。`
  $<HTMLDialogElement>('#result').showModal()
}
$('#close').onclick = () => $<HTMLDialogElement>('#result').close()
render()

void announceReady('meta')
