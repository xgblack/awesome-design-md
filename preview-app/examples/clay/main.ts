import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/manrope'
const companies = [
  {
    id: 'nori',
    name: 'Nori Cloud',
    industry: 'software',
    label: '软件与服务',
    size: 46,
    contact: '林乔 · 运营负责人',
    tool: 'HubSpot / Notion',
    signal: '正在建立伙伴渠道',
  },
  {
    id: 'field',
    name: 'Field Studio',
    industry: 'studio',
    label: '设计工作室',
    size: 18,
    contact: '陈安 · 创始人',
    tool: 'Figma / Airtable',
    signal: '资料未收录',
  },
  {
    id: 'morrow',
    name: 'Morrow Goods',
    industry: 'commerce',
    label: '消费与电商',
    size: 64,
    contact: '许意 · 增长负责人',
    tool: 'Shopify / Klaviyo',
    signal: '准备拓展海外店铺',
  },
  {
    id: 'bloom',
    name: 'Bloom Data',
    industry: 'software',
    label: '软件与服务',
    size: 22,
    contact: '资料未收录',
    tool: 'Linear / Salesforce',
    signal: '正在招聘解决方案工程师',
  },
  {
    id: 'paper',
    name: 'Paper Supply',
    industry: 'commerce',
    label: '消费与电商',
    size: 12,
    contact: '白禾 · 经营负责人',
    tool: '资料未收录',
    signal: '资料未收录',
  },
  {
    id: 'north',
    name: 'Northline',
    industry: 'studio',
    label: '设计工作室',
    size: 38,
    contact: '周远 · 项目负责人',
    tool: 'Figma / Slack',
    signal: '新增品牌策略服务',
  },
]
const labels: Record<string, string> = { contact: '联系人', tool: '团队工具', signal: '需求信号' }
let enriched = false
const fields = () =>
  Array.from(document.querySelectorAll<HTMLInputElement>('input[name="field"]:checked')).map(
    (x) => x.value,
  )
function matches() {
  const industry = $<HTMLSelectElement>('#industry').value,
    size = $<HTMLSelectElement>('#size').value
  return companies.filter(
    (c) =>
      (industry === 'all' || c.industry === industry) &&
      (size === 'all' || (size === 'small' ? c.size <= 30 : c.size > 30)),
  )
}
function render() {
  const rows = matches(),
    selected = fields()
  $('#companies').innerHTML =
    rows
      .map(
        (c) =>
          `<tr><td><strong>${c.name}</strong><small>${c.size} 人</small></td><td>${c.label}</td><td>${enriched ? selected.map((f) => `<span class="research-value">${labels[f]}：${c[f as 'contact' | 'tool' | 'signal']}</span>`).join('') : '<small>等待资料补全</small>'}</td></tr>`,
      )
      .join('') || '<tr><td colspan="3">没有匹配企业。试试放宽行业或规模。</td></tr>'
  $('#count').textContent = `${rows.length} 家企业 / ${enriched ? '已补全' : '待研究'}`
  $<HTMLButtonElement>('#enrich').disabled = !rows.length || !selected.length
  $<HTMLButtonElement>('#download').disabled = !rows.length || !enriched
  $('#error').textContent = !rows.length
    ? '当前条件没有匹配企业。'
    : !selected.length
      ? '至少选择一个补全字段。'
      : enriched
        ? '已核对本地资料；缺失字段明确显示“资料未收录”。'
        : ''
}
for (const selector of ['#industry', '#size', 'input[name="field"]'])
  document.querySelectorAll(selector).forEach((el) =>
    el.addEventListener('change', () => {
      enriched = false
      render()
    }),
  )
$('#enrich').onclick = () => {
  enriched = true
  render()
}
$('#download').onclick = () => {
  if (!enriched) return
  const keys = fields()
  const cell = (v: string) => '"' + v.replaceAll('"', '""') + '"'
  const csv = [
    ['公司', '人数', ...keys.map((k) => labels[k])],
    ...matches().map((c) => [
      c.name,
      String(c.size),
      ...keys.map((k) => c[k as 'contact' | 'tool' | 'signal']),
    ]),
  ]
    .map((row) => row.map(cell).join(','))
    .join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'moss-research.csv'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
render()

void announceReady('clay')
