import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const productImages: Record<string, string> = {
  tarp: new URL('./assets/tarp.svg', import.meta.url).href,
  tent: new URL('./assets/tent.svg', import.meta.url).href,
  pack: new URL('./assets/pack.svg', import.meta.url).href,
  mug: new URL('./assets/mug.svg', import.meta.url).href,
}
const deals = [
  {
    id: 0,
    name: '折叠天幕 / 周末轻装',
    cat: 'camp',
    price: 129,
    heat: 86,
    expired: false,
    shape: 'tarp',
    desc: '原创天幕概念，聚酯面料、双杆结构。固定演示价格，非真实优惠。',
  },
  {
    id: 1,
    name: '不锈钢旅行杯 / 路上的热饮',
    cat: 'daily',
    price: 39,
    heat: 64,
    expired: false,
    shape: 'mug',
    desc: '原创旅行杯概念，容量350 ml。此数值仅为界面示例。',
  },
  {
    id: 2,
    name: '日行背包 / 把重量留轻',
    cat: 'walk',
    price: 169,
    heat: 42,
    expired: true,
    shape: 'pack',
    desc: '这条虚构情报已过期，仍可阅读，不可领取。',
  },
  {
    id: 3,
    name: '双人帐篷 / 第一晚在山里',
    cat: 'camp',
    price: 259,
    heat: 73,
    expired: false,
    shape: 'tent',
    desc: '双人帐篷概念。规格、价格和库存均不构成实际承诺。',
  },
]
const votes = new Map<number, number>()
let cat = 'all'
function render() {
  const q = $<HTMLInputElement>('#deal-search').value.trim(),
    valid = $<HTMLInputElement>('#valid-only').checked
  const filtered = deals
    .filter((d) => (cat === 'all' || d.cat === cat) && d.name.includes(q) && (!valid || !d.expired))
    .sort((a, b) =>
      $<HTMLSelectElement>('#deal-sort').value === 'price'
        ? a.price - b.price
        : b.heat + (votes.get(b.id) || 0) - (a.heat + (votes.get(a.id) || 0)),
    )
  $('#deals').innerHTML = filtered
    .map(
      (d) =>
        `<article class="deal"><div class="product-photo"><img src="${productImages[d.shape]}" alt="${d.name}原创商品渲染"></div><div><h2>${d.name}</h2><span class="expiry ${d.expired ? 'expired' : ''}">${d.expired ? '已过期 / 可阅读' : '演示有效期内'}</span><p>来自：本地虚构补给情报 · 不提供真实商家服务</p><strong class="price">¥ ${d.price}</strong><div class="deal-foot"><div class="vote"><button data-vote="${d.id},-1" aria-label="降温 ${d.id}" aria-pressed="${votes.get(d.id) === -1}">−</button><output>${d.heat + (votes.get(d.id) || 0)}°</output><button data-vote="${d.id},1" aria-label="升温 ${d.id}" aria-pressed="${votes.get(d.id) === 1}">＋</button></div><button class="details" data-detail="${d.id}">${d.expired ? '阅读过期详情' : '查看本地详情'}</button></div></div></article>`,
    )
    .join('')
  $('#deal-status').textContent = filtered.length
    ? `${filtered.length} 条演示情报。热度是固定样例加本机单票，不是社区统计。`
    : '没有匹配情报，请清除条件。'
  document.querySelectorAll<HTMLButtonElement>('[data-vote]').forEach(
    (b) =>
      (b.onclick = () => {
        const [id, value] = b.dataset.vote!.split(',').map(Number)
        votes.set(id, votes.get(id) === value ? 0 : value)
        render()
      }),
  )
  document.querySelectorAll<HTMLButtonElement>('[data-detail]').forEach(
    (b) =>
      (b.onclick = () => {
        const d = deals[Number(b.dataset.detail)]
        $('#deal-name').textContent = d.name
        $('#deal-description').textContent = d.desc
        $<HTMLDialogElement>('#deal-detail').showModal()
      }),
  )
}
document.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach(
  (b) =>
    (b.onclick = () => {
      cat = b.dataset.cat!
      document
        .querySelectorAll('[data-cat]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      render()
    }),
)
$('#deal-search').oninput = render
$('#valid-only').onchange = render
$('#deal-sort').onchange = render
$('#deal-close').onclick = () => $<HTMLDialogElement>('#deal-detail').close()
render()
void announceReady('mydealz')
