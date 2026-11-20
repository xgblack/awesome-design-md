import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/ibm-plex-sans'
const docs = [
  {
    id: 'ai',
    name: '让AI进入业务流程',
    topic: 'space',
    tag: '企业AI',
    copy: '从可验证的任务出发，理解模型、数据与人工审阅如何协作。',
  },
  {
    id: 'hybrid',
    name: '混合云迁移的第一步',
    topic: 'mobility',
    tag: '混合云',
    copy: '整理现有负载、依赖关系与部署边界，不把迁移误解为简单搬家。',
  },
  {
    id: 'governance',
    name: '为可信数据建立来路',
    topic: 'environment',
    tag: '数据治理',
    copy: '明确数据来源、访问范围和生命周期，建立可以核对的治理口径。',
  },
  {
    id: 'resilience',
    name: '跨环境的弹性与可观测',
    topic: 'mobility',
    tag: '混合云',
    copy: '把运行信号、故障边界与恢复方式放在同一个技术视角里。',
  },
]
let selected: string[] = []
function render() {
  const topic = ($('#topic') as HTMLSelectElement).value
  $('#resources-grid').innerHTML = docs
    .filter((d) => topic === 'all' || d.topic === topic)
    .map(
      (d) =>
        `<article class="resource"><span>${d.tag} / 原创技术简介</span><h3>${d.name}</h3><p>${d.copy}</p><label><input type="checkbox" data-doc="${d.id}" ${selected.includes(d.id) ? 'checked' : ''}>加入阅读包 ＋</label></article>`,
    )
    .join('')
  $('#selected').textContent = selected.length
    ? `${selected.length} 份 / ` +
      selected.map((id) => docs.find((d) => d.id === id)!.name).join('、')
    : '尚未选择资料'
  ;($('#download') as HTMLButtonElement).disabled = !selected.length
  document.querySelectorAll<HTMLInputElement>('[data-doc]').forEach(
    (i) =>
      (i.onchange = () => {
        selected = i.checked
          ? [...selected, i.dataset.doc!]
          : selected.filter((id) => id !== i.dataset.doc)
        render()
      }),
  )
}
$('#topic').addEventListener('change', render)
$('#download').onclick = () => {
  const nl = String.fromCharCode(10)
  const text =
    '# Enterprise Grid 阅读包' +
    nl +
    nl +
    selected
      .map((id) => {
        const d = docs.find((d) => d.id === id)!
        return '## ' + d.name + nl + d.tag + nl + nl + d.copy
      })
      .join(nl + nl) +
    nl +
    nl +
    '原创技术演示资料，非企业产品承诺。'
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'enterprise-grid-reading.md'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
render()
void announceReady('ibm')
