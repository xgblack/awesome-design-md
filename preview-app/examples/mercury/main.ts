import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const studios: Record<
  string,
  { name: string; rows: { name: string; type: string; amount: number }[] }
> = {
  design: {
    name: '栖木设计工作室',
    rows: [
      { name: '品牌项目 / 第二阶段', type: 'oneoff', amount: 48000 },
      { name: '空间租赁 / 十一月', type: 'recurring', amount: -6500 },
      { name: '字体与工具订阅', type: 'recurring', amount: -1200 },
      { name: '样册印刷', type: 'oneoff', amount: -3800 },
    ],
  },
  film: {
    name: '远山影像工作室',
    rows: [
      { name: '短片后期 / 结项', type: 'oneoff', amount: 62000 },
      { name: '器材仓储', type: 'recurring', amount: -3800 },
      { name: '剪辑软件订阅', type: 'recurring', amount: -1500 },
      { name: '外景器材租借', type: 'oneoff', amount: -8600 },
    ],
  },
}
let current = 'design'
function render() {
  const s = studios[current],
    f = ($('#filter') as HTMLSelectElement).value
  const rows = s.rows.filter((x) => f === 'all' || x.type === f)
  $('#studio-name').textContent = s.name
  $('#total').textContent = '¥' + rows.reduce((n, r) => n + r.amount, 0).toLocaleString()
  $('#records').innerHTML = rows
    .map(
      (r) =>
        `<div class="record"><span>${r.name}</span><span>${r.type === 'oneoff' ? '一次性项目' : '经常性项目'}</span><b>${r.amount >= 0 ? '+' : '−'}¥${Math.abs(r.amount).toLocaleString()}</b></div>`,
    )
    .join('')
  $('#empty').hidden = rows.length > 0
}
document.querySelectorAll<HTMLButtonElement>('[data-studio]').forEach(
  (b) =>
    (b.onclick = () => {
      current = b.dataset.studio!
      document
        .querySelectorAll('[data-studio]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      render()
    }),
)
$('#filter').addEventListener('change', render)
$('#clear').onclick = () => {
  ;($('#filter') as HTMLSelectElement).value = 'all'
  render()
}
render()

void announceReady('mercury')
