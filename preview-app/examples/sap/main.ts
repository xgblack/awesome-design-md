import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/source-sans-3'
const modules: Record<
  string,
  { title: string; copy: string; scope: string; items: string[]; flow: string[] }
> = {
  procurement: {
    title: '把采购需求，连接到清楚的交付。',
    copy: '从请购、供应商到收货，为团队建立可核对的采购协作流程。',
    scope: '适合需要梳理采购申请、供应商主数据与审批角色的团队。',
    items: ['供应商主数据样表', '采购申请与审批流程', '收货与订单匹配规则'],
    flow: ['请购与授权', '采购与收货', '对账与结算'],
  },
  inventory: {
    title: '让库存的每一次变化，都有来处。',
    copy: '梳理仓库、物料与出入库，先把业务中的数量和责任说清楚。',
    scope: '适合需要统一物料编码、仓位管理与盘点流程的团队。',
    items: ['物料与仓位主数据样表', '出入库业务流程', '盘点与差异处理规则'],
    flow: ['物料与仓位', '出库与入库', '盘点与核对'],
  },
  finance: {
    title: '让财务与业务，说同一种语言。',
    copy: '在账套、科目与业务凭证之间，建立一致的核对口径。',
    scope: '适合需要定义账套、会计科目与月结责任分工的团队。',
    items: ['账套与科目结构样表', '凭证来源与核对流程', '月结职责与权限说明'],
    flow: ['账套与科目', '业务与凭证', '月结与核对'],
  },
}
let service = 'procurement'
const checked = new Set<number>()
let items: string[] = []
function updateProgress() {
  $('#progress').textContent = `已确认 ${checked.size} / ${items.length} 项实施资料`
  $<HTMLButtonElement>('#download').disabled = checked.size !== items.length
}
function render() {
  const s = modules[service],
    enterprise = $<HTMLSelectElement>('#scale').value === 'enterprise'
  items = [...s.items, ...(enterprise ? ['跨部门流程与数据责任人', '多账套数据迁移边界'] : [])]
  $('#service-title').textContent = s.title
  $('#service-copy').textContent = s.copy
  $('#scope').textContent = s.scope
  document
    .querySelectorAll('.service-visual div span')
    .forEach((el, i) => (el.textContent = s.flow[i]))
  $('#list-title').textContent =
    (service === 'procurement' ? '采购管理' : service === 'inventory' ? '库存运营' : '财务协同') +
    ' / ' +
    (enterprise ? '多部门实施' : '单团队实施')
  $('#items').innerHTML = items
    .map((item, i) => `<label><input type="checkbox" data-item="${i}">${item}</label>`)
    .join('')
  document.querySelectorAll<HTMLInputElement>('[data-item]').forEach(
    (input) =>
      (input.onchange = () => {
        if (input.checked) checked.add(Number(input.dataset.item))
        else checked.delete(Number(input.dataset.item))
        updateProgress()
      }),
  )
  updateProgress()
}
document.querySelectorAll<HTMLButtonElement>('[data-service]').forEach(
  (b) =>
    (b.onclick = () => {
      service = b.dataset.service!
      checked.clear()
      document
        .querySelectorAll('[data-service]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      render()
    }),
)
$('#scale').addEventListener('change', () => {
  checked.clear()
  render()
})
$('#download').onclick = () => {
  if (checked.size !== items.length) return
  const text =
    '# ' +
    $('#list-title').textContent +
    '\n\n' +
    items.map((i) => '- [x] ' + i).join('\n') +
    '\n\n本地演示准备单，不代表正式实施或数据已验证。'
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'forma-implementation.md'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
render()

void announceReady('sap')
