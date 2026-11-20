import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const channels: Record<
  string,
  { title: string; message: string; answer: string; heading: string; copy: string }
> = {
  garden: {
    title: '# 工程交付 / 本周迭代',
    message: '项目引导的新接口已经就绪。请客户端同学确认空项目的返回结构。',
    answer: '已核对字段。空项目也会返回完整状态，今晚补上端到端用例。',
    heading: '重要的细节，不必在消息里失联。',
    copy: '让工程决定、相关文档与后续动作留在同一个频道。',
  },
  film: {
    title: '# 设计评审 / 引导体验',
    message: '第一次打开工作区时，是否应该先给一个可以操作的示例？原型已更新。',
    answer: '建议保留跳过入口；让熟练用户可以直接创建空项目。',
    heading: '好的反馈，需要完整的上下文。',
    copy: '把原型、讨论和设计决定放在一起，不必反复寻找链接。',
  },
  repair: {
    title: '# 发布准备 / 版本 2.8',
    message: '周四发布前，请各模块负责人更新回归结果和未解决项。',
    answer: '登录和导入已经检查，迁移说明还需要产品确认。',
    heading: '从一条讨论，到一次从容发布。',
    copy: '准备清单、变更说明与发布回顾，都有自己的位置。',
  },
}
let current = 'garden'
const drafts: Record<string, string[]> = { garden: [], film: [], repair: [] }
function render() {
  const a = channels[current]
  $('#topic-title').textContent = a.title
  $('#message').textContent = a.message
  $('#answer').textContent = a.answer
  $('#activity-name').textContent = a.heading
  $('#activity-copy').textContent = a.copy
  $('#replies').replaceChildren()
  drafts[current].forEach((text) => {
    const p = document.createElement('p')
    p.className = 'reply'
    p.textContent = '我的本地回复 / ' + text
    $('#replies').append(p)
  })
  $('#undo').hidden = !drafts[current].length
}
document.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach(
  (b) =>
    (b.onclick = () => {
      current = b.dataset.kind!
      document
        .querySelectorAll('[data-kind]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      ;($('#reply') as HTMLTextAreaElement).value = ''
      $('#error').textContent = ''
      render()
    }),
)
$('#reply-form').onsubmit = (e) => {
  e.preventDefault()
  const input = $<HTMLTextAreaElement>('#reply')
  if (!input.value.trim()) {
    $('#error').textContent = '请先写下你的回复。'
    return
  }
  drafts[current].push(input.value.trim())
  input.value = ''
  $('#error').textContent = ''
  render()
}
$('#undo').onclick = () => {
  drafts[current].pop()
  render()
}
render()
void announceReady('slack')
