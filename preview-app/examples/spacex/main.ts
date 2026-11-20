import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const content: Record<string, { title: string; text: string; data: [string, string][] }> = {
  mission: {
    title: 'ÉTUDE 07',
    text: '一项为地球观测而设想的固定任务：把一枚虚构光学载荷送入近地轨道，以季节而非速度理解地表变化。本页没有计划中的真实发射。',
    data: [
      ['任务状态', '原创设计研究'],
      ['载荷方向', '地球观测概念'],
      ['示例日期', '2026-11-20 · 固定档案'],
    ],
  },
  vehicle: {
    title: 'ASTER 02',
    text: '两级运载器的原创外观与功能分区：整流罩保护载荷，第二级承担轨道转移概念，一级包含返回结构。没有公开或暗示真实测试性能。',
    data: [
      ['级数', '两级构型概念'],
      ['一级', '可返回结构研究'],
      ['动力与运载量', '未验证，不提供实测值'],
    ],
  },
  payload: {
    title: 'A WIDER VIEW',
    text: '虚构载荷 GROUND 01 用于讲述地球观测的设计语境：山脉、河口与海岸在一年的不同时间显出不同纹理。页面中的地球照片不是该载荷回传。',
    data: [
      ['载荷代号', 'GROUND 01 · 虚构'],
      ['应用语境', '季节性地表观察'],
      ['影像身份', '许可参考图，非任务数据'],
    ],
  },
}
const brief = $<HTMLDialogElement>('#brief')
function select(k: string) {
  const c = content[k]
  $('#brief-title').textContent = c.title
  $('#brief-text').textContent = c.text
  $('#brief-data').replaceChildren(
    ...c.data.map(([label, value]) => {
      const d = document.createElement('div'),
        dt = document.createElement('dt'),
        dd = document.createElement('dd')
      dt.textContent = label
      dd.textContent = value
      d.append(dt, dd)
      return d
    }),
  )
  document
    .querySelectorAll<HTMLButtonElement>('[data-tab]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === k)))
}
document.querySelectorAll<HTMLButtonElement>('[data-brief]').forEach(
  (b) =>
    (b.onclick = () => {
      select(b.dataset.brief!)
      brief.showModal()
    }),
)
document
  .querySelectorAll<HTMLButtonElement>('[data-tab]')
  .forEach((b) => (b.onclick = () => select(b.dataset.tab!)))
$('#brief-close').onclick = () => brief.close()
select('mission')
const index = $<HTMLDialogElement>('#index')
$('#index-open').onclick = () => index.showModal()
$('#index-close').onclick = () => index.close()
index.querySelectorAll('a').forEach((a) => (a.onclick = () => index.close()))

void announceReady('spacex')
