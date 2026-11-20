import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const plans: Record<string, { title: string; description: string; specs: [string, string][] }> = {
  mobile: {
    title: 'Everyday Mobile',
    description: '为移动中的地图、消息和轻量视频，理解流量与通话如何组合。',
    specs: [
      ['移动流量概念', '20 GB / 固定示例'],
      ['通话概念', '100 分钟 / 固定示例'],
      ['连接语境', '手机出行，不实际开通'],
    ],
  },
  family: {
    title: 'Together at Home',
    description: '多设备在线、视频通话与共享时间，从家庭Wi-Fi关系开始理解。',
    specs: [
      ['连接形式', '家庭Wi-Fi概念'],
      ['设备语境', '手机 / 平板 / 家庭路由'],
      ['覆盖与速度', '不查询、不提供保证'],
    ],
  },
  voice: {
    title: 'Start with a Call',
    description: '把号码、通话与文字消息讲清楚，让手机入门保留自己的节奏。',
    specs: [
      ['通话概念', '300 分钟 / 固定示例'],
      ['移动数据概念', '2 GB / 固定示例'],
      ['支持方向', '号码/套餐术语阅读'],
    ],
  },
}
function showPlan(key: string) {
  const p = plans[key]
  $('#plan-title').textContent = p.title
  $('#plan-description').textContent = p.description
  $('#plan-specs').replaceChildren(
    ...p.specs.map(([key, val]) => {
      const row = document.createElement('div'),
        dt = document.createElement('dt'),
        dd = document.createElement('dd')
      dt.textContent = key
      dd.textContent = val
      row.append(dt, dd)
      return row
    }),
  )
}
document.querySelectorAll<HTMLButtonElement>('[data-plan]').forEach(
  (b) =>
    (b.onclick = () => {
      showPlan(b.dataset.plan!)
      document
        .querySelectorAll('[data-plan]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
showPlan('mobile')
const points: Record<string, string> = {
  river:
    '<h3>河岸数字连接资料角</h3><p>资料主题：流量、通话与套餐术语 / 视频通话前的基本认识。</p><p>周二、周四14:00–17:00为固定虚构开放时间。仅供界面阅读，不办理SIM、套餐或网络业务。</p>',
  north:
    '<h3>北园家庭网络资料角</h3><p>资料主题：家庭路由、多设备连接与网络使用边界。</p><p>周六10:00–12:00为固定虚构开放时间。非实际客服、安装、覆盖或速率检测服务。</p>',
  hill: '<h3>山顶街区暂未设置演示通信资料</h3><p>可以切换河岸或北园浏览固定资料。这不是通信覆盖查询，也不表示该地区无网络。</p>',
}
function showPoint() {
  $('#point-result').innerHTML = points[$<HTMLSelectElement>('#neighbourhood').value]
}
$('#neighbourhood').onchange = showPoint
showPoint()
document.querySelectorAll<HTMLButtonElement>('[data-need]').forEach(
  (b) =>
    (b.onclick = () => {
      let n = 0
      document.querySelectorAll<HTMLElement>('[data-story-need]').forEach((x) => {
        x.hidden = b.dataset.need !== 'all' && x.dataset.storyNeed !== b.dataset.need
        if (!x.hidden) n++
      })
      $('#story-status').textContent = `${n} 篇虚构数字连接故事`
      document
        .querySelectorAll('[data-need]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
const person = $<HTMLDialogElement>('#person')
document.querySelectorAll<HTMLButtonElement>('[data-person]').forEach(
  (b) =>
    (b.onclick = () => {
      const learn = b.dataset.person === 'learn'
      $('#person-title').textContent = learn
        ? '一通可以自己接通的视频。'
        : '每个房间，都在同一个家里。'
      $('#person-text').textContent = learn
        ? '这是一份原创虚构手机入门故事。主人公从辨认通话按钮开始，理解手机流量与家庭Wi-Fi不是同一种连接，再把常用联系人整理到容易找到的位置。资料只解释连接任务，不操作账号、不读取通讯录，也不代办真实套餐。'
        : '这是一份原创虚构家庭网络故事。多台设备的连接需求并不相同：有人视频通话，有人读电子书。解释清楚每一步，从认识家庭路由与移动流量的区别开始，而不是许诺某个角落一定有信号。本页不检测家庭网络，也不提供真实安装、速率或覆盖结论。'
      person.showModal()
    }),
)
$('#person-close').onclick = () => person.close()

void announceReady('vodafone')
