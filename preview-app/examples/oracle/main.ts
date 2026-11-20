import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const modes: Record<string, { title: string; copy: string; steps: string[]; diagram: string }> = {
  connect: {
    title: '让事务、分析和治理，共用清晰的数据基础。',
    copy: '企业数据平台需要的不只是存放记录。接入方式、数据类型与治理策略需要一起设计，才能支撑持续变化的业务。',
    steps: ['整理业务源与数据依赖', '定义字段类型与访问范围', '建立跨系统的来源追踪'],
    diagram: '统一数据平台',
  },
  search: {
    title: '把一个业务问题，变成可核对的查询。',
    copy: '从事务到分析，理解工作负载的差异。让查询结果保留时间、范围与来源，而不是只有一个孤立的数字。',
    steps: ['选择适合的事务或分析工作负载', '明确查询范围与时间口径', '核对结果与数据来源'],
    diagram: '事务与分析视图',
  },
}
const docs = [
  {
    title: '业务数据接入模式',
    tag: 'Integration / 01',
    copy: '从批量导入到事件同步，先理解数据变化频率、依赖关系与一致性要求。此页不执行真实导入。',
  },
  {
    title: '数据治理与访问策略',
    tag: 'Governance / 02',
    copy: '把数据分类、使用目的与访问范围记录清楚。演示资料不是法规或安全合规认证。',
  },
  {
    title: '事务与分析查询',
    tag: 'Workloads / 03',
    copy: '高频事务与聚合分析关注不同的工作负载特征。理解问题的范围，再选择适合的查询方式。',
  },
]
function mode(id: string) {
  const m = modes[id]
  $('#approach-title').textContent = m.title
  $('#approach-copy').textContent = m.copy
  $('#approach-steps').innerHTML = m.steps.map((x) => '<li>' + x + '</li>').join('')
  $('#diagram-title').textContent = m.diagram
}
document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll('[data-mode]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      mode(b.dataset.mode!)
    }),
)
function search() {
  const q = ($('#query') as HTMLInputElement).value.trim()
  const shown = docs.map((d, i) => ({ ...d, i })).filter((d) => (d.title + d.copy).includes(q))
  $('#documents').innerHTML = shown
    .map(
      (d) =>
        `<article class="document-row"><span>${d.tag}</span><div><h3>${d.title}</h3><p>${d.copy.slice(0, 38)}…</p></div><button data-doc="${d.i}">阅读 ↗</button></article>`,
    )
    .join('')
  $('#empty').hidden = shown.length > 0
  document.querySelectorAll<HTMLButtonElement>('[data-doc]').forEach(
    (b) =>
      (b.onclick = () => {
        const d = docs[Number(b.dataset.doc)]
        $('#doc-title').textContent = d.title
        $('#doc-copy').textContent = d.copy
        ;($('#document') as HTMLDialogElement).showModal()
      }),
  )
}
$('#query').addEventListener('input', search)
$('#clear').onclick = () => {
  ;($('#query') as HTMLInputElement).value = ''
  search()
}
$('#close').onclick = () => ($('#document') as HTMLDialogElement).close()
mode('connect')
search()
void announceReady('oracle')
