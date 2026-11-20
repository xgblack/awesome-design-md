import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const frames = [
  {
    src: new URL('../_shared/photos/car.webp', import.meta.url).href,
    alt: '四门汽车侧后方许可摄影，非封闭赛道实拍',
    caption: 'GT / 车身观察 · 许可道路摄影，仅作文化参考',
  },
  {
    src: new URL('../_shared/photos/sportscar.webp', import.meta.url).href,
    alt: '室内停放的双门跑车许可摄影',
    caption: 'COUPÉ / 整备车库 · 许可静态摄影参考',
  },
  {
    src: new URL('./assets/closed-course.svg', import.meta.url).href,
    alt: '原创封闭场地概念图，不构成驾驶教学',
    caption: 'COUPÉ / 封闭场地 · 本项目原创概念图，非实拍',
  },
]
let current = 0
let active = [0, 1, 2]
let trigger: HTMLButtonElement | null = null
const viewer = $<HTMLDialogElement>('#photo-viewer')
const updateGallery = () => {
  const frame = frames[current]
  $<HTMLImageElement>('#gallery-image').src = frame.src
  $<HTMLImageElement>('#gallery-image').alt = frame.alt
  $('#gallery-caption').textContent =
    `${active.indexOf(current) + 1} / ${active.length} · ${frame.caption}`
  $<HTMLButtonElement>('#gallery-prev').disabled = active.length < 2
  $<HTMLButtonElement>('#gallery-next').disabled = active.length < 2
}
const filter = () => {
  const model = $<HTMLSelectElement>('#model').value
  const track = $<HTMLSelectElement>('#track').value
  active = []
  document.querySelectorAll<HTMLElement>('.stories article').forEach((article, i) => {
    article.hidden =
      (model !== 'all' && article.dataset.model !== model) ||
      (track !== 'all' && article.dataset.track !== track)
    if (!article.hidden) active.push(i)
  })
  $('#track-status').textContent = `${active.length} 篇固定文化档案`
  $('#archive-empty').hidden = active.length > 0
}
$('#model').onchange = filter
$('#track').onchange = filter
$('#reset-filters').onclick = () => {
  $<HTMLSelectElement>('#model').value = 'all'
  $<HTMLSelectElement>('#track').value = 'all'
  filter()
  $('#model').focus()
}
document.querySelectorAll<HTMLButtonElement>('[data-gallery]').forEach((button) => {
  button.onclick = () => {
    trigger = button
    current = Number(button.dataset.gallery)
    updateGallery()
    viewer.showModal()
  }
})
const step = (offset: number) => {
  current = active[(active.indexOf(current) + offset + active.length) % active.length]
  updateGallery()
}
$('#gallery-next').onclick = () => step(1)
$('#gallery-prev').onclick = () => step(-1)
$('#viewer-close').onclick = () => viewer.close()
viewer.onclose = () => trigger?.focus({ preventScroll: true })
void announceReady('bmw-m')
