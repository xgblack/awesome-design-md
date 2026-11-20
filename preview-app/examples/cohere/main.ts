import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/space-grotesk/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const documents = [
  {
    id: 'ENG-03',
    domain: 'engineering',
    title: '工程发布与回滚手册',
    keywords: '回滚 发布 版本 构建',
    excerpt:
      '当发布验证未通过时，先核对已批准的上一版本，保留失败构建与诊断日志，再按团队流程申请回滚。',
    source:
      'ENG-03 / 第 2 节：发布验证未通过时，负责人先核对上一已批准版本，再保留日志并申请复核。以上为原创教学语料，不可作为生产操作指令。',
  },
  {
    id: 'ENG-07',
    domain: 'engineering',
    title: '值班响应与交接约定',
    keywords: '值班 交接 告警 轮换',
    excerpt: '交接记录应包含当前告警、负责人和已有证据。未处理项需要由下一班确认接收。',
    source:
      'ENG-07 / 第 1 节：交接前列出未处理告警、负责人和日志链接；下一班逐项确认接收。所有人员与事件均为虚构。',
  },
  {
    id: 'HR-02',
    domain: 'people',
    title: '团队休假与交接政策',
    keywords: '休假 交接 申请',
    excerpt: '休假前填写演示申请并补充交接说明。此示例不收集个人信息，也不会提交任何申请。',
    source:
      'HR-02 / 第 3 节：休假安排需提供日期与交接说明，经负责人复核后进入团队日历。仅为虚构政策，不代表法律或雇佣建议。',
  },
  {
    id: 'ENG-11',
    domain: 'engineering',
    title: '搜索服务架构 RFC',
    keywords: '搜索 索引 架构 文档',
    excerpt: '文档更新触发索引任务，查询结果保留文档标识与版本，便于回到证据。',
    source:
      'ENG-11 / 第 4 节：每条检索记录必须保留 document_id 与 version，结果页应能显示对应原文段落。',
  },
]
function search() {
  const q = $<HTMLInputElement>('#query').value.trim()
  const domain = $<HTMLSelectElement>('#domain').value
  const found = q
    ? documents.filter(
        (d) =>
          (domain === 'all' || d.domain === domain) &&
          (d.title + d.keywords + d.excerpt).includes(q),
      )
    : []
  $('#result-count').textContent = !q
    ? '请先输入一个具体关键词。'
    : found.length
      ? `找到 ${found.length} 份固定企业材料。仅关键词匹配，未调用模型。`
      : '没有匹配资料。条件已保留；试试“回滚”“值班”或“休假”。'
  $('#results').replaceChildren(
    ...found.map((d) => {
      const a = document.createElement('article')
      a.className = 'result'
      const h = document.createElement('h3')
      h.textContent = d.title
      const p = document.createElement('p')
      p.textContent = d.excerpt
      const id = document.createElement('small')
      id.textContent = d.id + ' / ' + (d.domain === 'engineering' ? '工程' : '人事')
      const b = document.createElement('button')
      b.textContent = '展开原文证据 +'
      b.setAttribute('aria-expanded', 'false')
      const source = document.createElement('div')
      source.className = 'evidence'
      source.textContent = d.source
      source.hidden = true
      b.addEventListener('click', () => {
        source.hidden = !source.hidden
        b.setAttribute('aria-expanded', String(!source.hidden))
        b.textContent = source.hidden ? '展开原文证据 +' : '收起原文证据 −'
      })
      a.append(id, h, p, b, source)
      return a
    }),
  )
}
$('#search-form').addEventListener('submit', (e) => {
  e.preventDefault()
  search()
})
$('#domain').addEventListener('change', search)
document.querySelectorAll<HTMLButtonElement>('[data-query]').forEach((b) =>
  b.addEventListener('click', () => {
    $<HTMLInputElement>('#query').value = b.dataset.query!
    search()
  }),
)

void announceReady('cohere')
