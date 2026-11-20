import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const data = [
  { page: '/docs', type: 'page_view', ms: 42 },
  { page: '/docs', type: 'search', ms: 87 },
  { page: '/dashboard', type: 'page_view', ms: 53 },
  { page: '/dashboard', type: 'export', ms: 125 },
  { page: '/api', type: 'request', ms: 66 },
  { page: '/api', type: 'error', ms: 480 },
]
const queries: Record<string, string> = {
  all: 'SELECT * FROM events;',
  avg: 'SELECT page, count() FROM events GROUP BY page;',
  hot: "SELECT * FROM events WHERE type = 'error';",
}
function render(mode: string) {
  const rows =
    mode === 'avg'
      ? ['/docs', '/dashboard', '/api'].map(
          (page) =>
            `<tr><td>${page}</td><td>count()</td><td>${data.filter((r) => r.page === page).length}</td></tr>`,
        )
      : (mode === 'hot' ? data.filter((r) => r.type === 'error') : data).map(
          (r) => `<tr><td>${r.page}</td><td>${r.type}</td><td>${r.ms}</td></tr>`,
        )
  $('#rows').innerHTML = rows.join('')
  $('#count').textContent = rows.length + (mode === 'avg' ? ' 组结果' : ' 条事件')
  $('#head').innerHTML =
    `<tr><th>页面</th><th>${mode === 'avg' ? '聚合' : '事件类型'}</th><th>${mode === 'avg' ? '事件数' : '耗时 ms'}</th></tr>`
  $('#explain').textContent =
    mode === 'avg'
      ? '每个页面两条事件，count()由固定原始记录实际计算。'
      : mode === 'hot'
        ? '仅 /api 的 error 事件符合条件；480 ms 是固定样本，不是服务性能承诺。'
        : '六条固定产品事件，无真实用户行为采集。'
}
$('#template').addEventListener('change', () => {
  $<HTMLTextAreaElement>('#query').value = queries[$<HTMLSelectElement>('#template').value]
  $('#error').textContent = ''
})
$('#run').addEventListener('click', () => {
  const text = $<HTMLTextAreaElement>('#query').value.trim()
  const mode = Object.keys(queries).find((k) => queries[k] === text)
  if (!mode) {
    $('#error').textContent = '不支持此语句。请选择预设查询；没有执行任何 SQL。'
    return
  }
  $('#error').textContent = ''
  render(mode)
})
render('all')

void announceReady('clickhouse')
