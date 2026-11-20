import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
let savedOnly = false
const saved = new Set<string>()
const refresh = () => {
  const guests = Number($<HTMLSelectElement>('#guests').value)
  const start = $<HTMLInputElement>('#checkin').value,
    end = $<HTMLInputElement>('#checkout').value
  if (!start || !end || end <= start) {
    $('#search-status').textContent = '退房日期必须晚于入住日期，请修改日期。'
    return
  }
  if (end > '2026-12-08' || start < '2026-12-01') {
    $('#search-status').textContent = '演示仅开放12月1日至8日，请调整日期。'
    return
  }
  let count = 0
  document.querySelectorAll<HTMLElement>('[data-stay]').forEach((x) => {
    x.hidden = Number(x.dataset.capacity) < guests || (savedOnly && !saved.has(x.dataset.stay!))
    if (!x.hidden) count++
  })
  $('#empty').hidden = count > 0
  $('#search-status').textContent = `${count} 处虚构驻留 · ${guests} 位 · ${start} 至 ${end}`
}
$('#searchbar').onsubmit = (e) => {
  e.preventDefault()
  refresh()
}
$('#saved').onclick = () => {
  savedOnly = true
  $('#saved').setAttribute('aria-pressed', 'true')
  $('#all').setAttribute('aria-pressed', 'false')
  refresh()
}
$('#all').onclick = () => {
  savedOnly = false
  $('#all').setAttribute('aria-pressed', 'true')
  $('#saved').setAttribute('aria-pressed', 'false')
  refresh()
}
document.querySelectorAll<HTMLButtonElement>('[data-heart]').forEach(
  (b) =>
    (b.onclick = () => {
      const id = b.dataset.heart!
      if (saved.has(id)) saved.delete(id)
      else saved.add(id)
      b.setAttribute('aria-pressed', String(saved.has(id)))
      b.textContent = saved.has(id) ? '♥' : '♡'
      refresh()
    }),
)
const stayDetails: Record<string, { text: string; facilities: string[] }> = {
  '0': {
    text: '森林边缘的一间独立小屋概念。适合两人安静阅读，早晨沿有标记的步道短距离散步；小屋摄影为环境参考。',
    facilities: [
      '空间构型：一间卧室 / 双人阅读角 / 简易备餐区',
      '周边节奏：抵达 → 林缘短走 → 回屋整理游记',
      '边界：无真实房源、交通接驳或步道安全承诺',
    ],
  },
  '1': {
    text: '以共享长桌为中心的四人驻留空间概念。适合朋友带着书与手作来住一段共同时间。室内照片不代表实际出租空间。',
    facilities: [
      '空间构型：两处休息区 / 共享长桌 / 图文书架',
      '周边节奏：一起备餐 → 各自阅读 → 傍晚分享',
      '边界：不提供实际住宿、餐饮或工作坊预约',
    ],
  },
  '2': {
    text: '湖岸旁的慢日常概念。为最多六位同行者保留公共起居空间，先看水面，再决定一天怎么过。摄影只显示周边环境。',
    facilities: [
      '空间构型：多人起居区 / 面水阅读座 / 公共桌',
      '周边节奏：湖岸步行 → 午后休息 → 日落记录',
      '边界：湖景不等于真实房源配置，不提供水上活动',
    ],
  },
  '3': {
    text: '山脊附近的两人驻留概念。轻装到达，给阅读和远望留出时间；高山图片仅为周边风景参考，不暗示房间位于拍摄处。',
    facilities: [
      '空间构型：两人休息区 / 窗边单椅 / 行李收纳',
      '周边节奏：整理行李 → 远望山脊 → 晚间阅读',
      '边界：无登山路线、观星条件或交通条件保证',
    ],
  },
}
const detail = $<HTMLDialogElement>('#stay-detail')
document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach(
  (b) =>
    (b.onclick = () => {
      const card = b.closest('article')!
      $('#detail-title').textContent = card.querySelector('h2')!.textContent
      const info = stayDetails[b.dataset.open!]
      $('#stay-description').textContent = info.text
      $('#stay-facilities').replaceChildren(
        ...info.facilities.map((text) => {
          const li = document.createElement('li')
          li.textContent = text
          return li
        }),
      )
      $('#detail-image').setAttribute('src', card.querySelector('img')!.getAttribute('src')!)
      $('#detail-image').setAttribute('alt', card.querySelector('img')!.alt)
      detail.showModal()
    }),
)
$('#detail-close').onclick = () => detail.close()
void announceReady('airbnb')
