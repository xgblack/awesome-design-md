import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/source-sans-3/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource-variable/cormorant-garamond/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const materials = {
  rfc: {
    title: 'RFC-014 / 发布工作流',
    source: [
      '团队计划将发布复核拆为文档检查、构建验证与变更说明三个步骤。每一步都保留负责人和完成依据，避免把“已经发布”当作唯一结果。',
      '当构建验证未通过时，流程停在复核环节，不生成成功公告。已经完成的文档检查记录仍保留，便于修复后继续。以上为原创虚构工程材料。',
    ],
    summary:
      'RFC 提议以三个可核对步骤组织发布复核。构建失败会停止后续公告，但不抹掉已完成步骤的证据。',
    questions:
      '谁负责复核每个阶段？构建失败后怎样确认可以继续？这些问题需要在具体团队流程中进一步明确。',
  },
  policy: {
    title: 'POL-006 / 团队知识库约定',
    source: [
      '团队知识条目应附带来源、维护人和最近复核日期。读者需要能回到原始讨论，不应只看到没有上下文的结论。',
      '过时内容需明确标识或更新，不用另一份相互矛盾的条目覆盖。知识助手给出的摘要必须保留引用；没有材料时不编造答案。以上为原创虚构政策。',
    ],
    summary:
      '团队以来源、维护人和复核日期确保知识可追溯。摘要保留引用，发现过时记录时明确更新，而不是增加矛盾副本。',
    questions: '复核频率如何按文档风险决定？当多个来源相互矛盾时，应由谁作出最终解释？',
  },
}
let task = 'summary'
let key: keyof typeof materials | 'none' = 'rfc'
function render() {
  document
    .querySelectorAll<HTMLButtonElement>('[data-task]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.task === task)))
  if (key === 'none') {
    $('#summary-title').textContent = '先选择一份材料。'
    $('#summary-text').textContent = '没有材料时，不会给出没有依据的结论。'
    $('#source-title').textContent = '等待材料'
    $('#source-text').replaceChildren()
    $('#citations').replaceChildren()
    return
  }
  const m = materials[key]
  $('#summary-title').textContent = task === 'summary' ? '让结论回到证据。' : '把问题留在边上。'
  $('#summary-text').textContent = task === 'summary' ? m.summary : m.questions
  $('#source-title').textContent = m.title
  $('#source-text').replaceChildren(
    ...m.source.map((text, i) => {
      const p = document.createElement('p')
      p.id = 'paragraph-' + i
      p.textContent = text
      return p
    }),
  )
  $('#citations').replaceChildren(
    ...m.source.map((_, i) => {
      const b = document.createElement('button')
      b.textContent = '[' + (i + 1) + '] 原文第 ' + (i + 1) + ' 段'
      b.addEventListener('click', () => {
        document
          .querySelectorAll('#source-text p')
          .forEach((p) => p.classList.toggle('highlight', p.id === 'paragraph-' + i))
        $('#paragraph-' + i).scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      })
      return b
    }),
  )
}
$('#material').addEventListener('change', () => {
  key = $<HTMLSelectElement>('#material').value as typeof key
  render()
})
document.querySelectorAll<HTMLButtonElement>('[data-task]').forEach((b) =>
  b.addEventListener('click', () => {
    task = b.dataset.task!
    render()
  }),
)
render()

void announceReady('claude')
