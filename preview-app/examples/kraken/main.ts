import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/ibm-plex-sans'
const data = [
  {
    id: 'btc',
    name: 'Bitcoin',
    ticker: 'BTC',
    category: 'network',
    label: '网络资产',
    price: 60000,
    glyph: '₿',
    purpose: '点对点价值转移',
    supply: '约 2,100 万枚上限',
    risk: '价格波动、保管与协议风险',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    ticker: 'ETH',
    category: 'network',
    label: '网络资产',
    price: 3000,
    glyph: 'Ξ',
    purpose: '智能合约网络',
    supply: '供给随发行与销毁变化',
    risk: '价格波动、智能合约与网络风险',
  },
  {
    id: 'usdc',
    name: 'USDC',
    ticker: 'USDC',
    category: 'stable',
    label: '稳定币',
    price: 1,
    glyph: '$',
    purpose: '目标锚定美元',
    supply: '随发行/赎回变化',
    risk: '发行方、储备与脱锚风险',
  },
  {
    id: 'sol',
    name: 'Solana',
    ticker: 'SOL',
    category: 'network',
    label: '网络资产',
    price: 120,
    glyph: '≋',
    purpose: '智能合约网络',
    supply: '随协议发行变化',
    risk: '价格波动、网络与保管风险',
  },
]
let selected: string[] = []
function render() {
  const q = $<HTMLInputElement>('#search').value.toLowerCase().trim(),
    cat = $<HTMLSelectElement>('#category').value
  const rows = data.filter(
    (x) =>
      (x.name + ' ' + x.ticker).toLowerCase().includes(q) && (cat === 'all' || x.category === cat),
  )
  $('#rows').innerHTML = rows
    .map(
      (x) =>
        `<article class="collection-row"><div class="glyph">${x.glyph}</div><div><h3>${x.name}</h3><small>${x.ticker} / ${x.label}</small></div><p>$${x.price.toLocaleString('en-US')}<br><small>固定样本价格</small></p><p>${x.purpose}</p><button data-select="${x.id}" aria-pressed="${selected.includes(x.id)}">${selected.includes(x.id) ? '✓ 已观察' : '＋ 观察'}</button></article>`,
    )
    .join('')
  $('#empty').hidden = !!rows.length
  $('#selection').textContent = selected.length
    ? selected.map((id) => data.find((x) => x.id === id)!.name).join(' / ')
    : '还没有选择资产'
  $<HTMLButtonElement>('#compare').disabled = selected.length !== 2
  document.querySelectorAll<HTMLButtonElement>('[data-select]').forEach(
    (b) =>
      (b.onclick = () => {
        const id = b.dataset.select!
        if (selected.includes(id)) selected = selected.filter((x) => x !== id)
        else if (selected.length >= 2) {
          $('#notice').textContent = '最多观察两项。请先移除一项，再选择新的资产。'
          return
        } else selected.push(id)
        $('#notice').textContent = ''
        render()
      }),
  )
}
$('#search').addEventListener('input', render)
$('#category').addEventListener('change', render)
$('#clear').onclick = () => {
  $<HTMLInputElement>('#search').value = ''
  $<HTMLSelectElement>('#category').value = 'all'
  render()
}
$('#compare').onclick = () => {
  $('#comparison-body').innerHTML = selected
    .map((id) => {
      const x = data.find((x) => x.id === id)!
      return `<section><h3>${x.name} / ${x.ticker}</h3><p>固定样本价格：$${x.price.toLocaleString('en-US')}</p><p>用途：${x.purpose}</p><p>供给概要：${x.supply}</p><p>风险：${x.risk}</p><small>仅供界面与资料比较，不构成投资建议。</small></section>`
    })
    .join('')
  $<HTMLDialogElement>('#comparison').showModal()
}
$('#close').onclick = () => $<HTMLDialogElement>('#comparison').close()
render()

void announceReady('kraken')
