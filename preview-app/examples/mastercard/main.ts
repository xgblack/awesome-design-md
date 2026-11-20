import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/manrope'
const businesses: Record<
  string,
  { name: string; accept: string; verify: string; settle: string; reconcile: string }
> = {
  shop: {
    name: '线上品牌商户',
    accept: '购物车 → 受理线上付款',
    verify: '核对订单与付款身份',
    settle: '按订单结算给商户',
    reconcile: '把订单、费用与结算汇总',
  },
  travel: {
    name: '旅行服务平台',
    accept: '行程预订 → 受理旅客付款',
    verify: '核对预订人和跨境风险',
    settle: '按履约节点结算给服务商',
    reconcile: '按币种整理供应商账目',
  },
  procurement: {
    name: '企业采购团队',
    accept: '采购请求 → 受理企业付款',
    verify: '核对采购授权与费用限额',
    settle: '按合同结算给供应商',
    reconcile: '把采购单、发票与结算对应',
  },
}
const names: Record<string, string> = {
  accept: '受理',
  verify: '验证',
  settle: '结算',
  reconcile: '对账',
}
let selected = new Set(['accept', 'verify', 'settle'])
function render() {
  const b = businesses[$<HTMLSelectElement>('#business').value]
  $('#list').innerHTML = Object.entries(names)
    .map(
      ([id, label], i) =>
        `<article class="experience"><span>0${i + 1} / ${label}</span><div><h3>${label}业务环节</h3><p>${id === 'reconcile' ? '可选扩展' : '完整路径所需'}</p></div><p>${b[id as 'accept' | 'verify' | 'settle' | 'reconcile']}</p><button data-capability="${id}" aria-pressed="${selected.has(id)}">${selected.has(id) ? '已包含 −' : '加入 ＋'}</button></article>`,
    )
    .join('')
  $('#itinerary').textContent =
    [...selected].map((id) => names[id]).join(' → ') || '尚未配置任何环节'
  const missing = ['accept', 'verify', 'settle'].filter((id) => !selected.has(id))
  $('#requirements').textContent = missing.length
    ? '完整路径仍需：' + missing.map((id) => names[id]).join('、')
    : '三个基础环节齐全，可核对本地路径。'
  $<HTMLButtonElement>('#make-summary').disabled = !!missing.length
  $('#solution-summary').hidden = true
  document.querySelectorAll<HTMLButtonElement>('[data-capability]').forEach(
    (el) =>
      (el.onclick = () => {
        const id = el.dataset.capability!
        if (selected.has(id)) selected.delete(id)
        else selected.add(id)
        $('#notice').textContent = ''
        render()
      }),
  )
}
$('#business').addEventListener('change', () => {
  selected = new Set(['accept', 'verify', 'settle'])
  $('#notice').textContent = '场景已改变，路径恢复为该场景的基础环节。'
  render()
})
$('#make-summary').onclick = () => {
  const b = businesses[$<HTMLSelectElement>('#business').value]
  $('#solution-summary').textContent =
    b.name +
    '：' +
    [...selected].map((id) => b[id as 'accept' | 'verify' | 'settle' | 'reconcile']).join(' → ') +
    '。这是能力说明，不会创建支付、验证身份或移动资金。'
  $('#solution-summary').hidden = false
}
const stories: Record<string, [string, string]> = {
  lin: [
    '从工作室到线上商店',
    '林夏经营一间虚构的独立设计工作室。开始接线上订单后，她先梳理了付款受理、身份核对与订单结算三个环节，避免把“收款成功”误当成全部流程结束。这是一段原创示例故事，不是客户证言。',
  ],
  yuan: [
    '让订单与交付相连',
    '袁舟的虚构陶艺品牌把每笔订单对应到制作与交付。支付路径规划帮助团队理解核对、结算和对账之间的区别。此处不处理真实款项，也不宣称任何真实网络能力。',
  ],
}
document.querySelectorAll<HTMLButtonElement>('[data-story]').forEach(
  (el) =>
    (el.onclick = () => {
      const story = stories[el.dataset.story!]
      $('#story-title').textContent = story[0]
      $('#story-copy').textContent = story[1]
      $<HTMLDialogElement>('#story').showModal()
    }),
)
$('#close').onclick = () => $<HTMLDialogElement>('#story').close()
render()

void announceReady('mastercard')
