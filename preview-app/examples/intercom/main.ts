import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const seed = [
  {
    name: '林夏 / Acorn Studio',
    title: '新成员为什么看不到项目？',
    message: '我邀请了一位设计师加入团队，但她的工作区里还是空白。应该检查哪里？',
    context:
      '项目成员与工作区成员是两种范围。管理员需确认邀请已接受，并在目标项目中分配可访问角色。此为固定帮助文章。',
  },
  {
    name: '周安 / Northline',
    title: '导出的文件包含哪些内容？',
    message: '我们准备给客户交付项目资料。Markdown导出会带上评论吗？',
    context:
      '本示例帮助规则：导出正文和附件索引，不包含未发布评论。真实产品功能请以实际服务说明为准。',
  },
  {
    name: '许言 / Paper Works',
    title: '如何找回误归档的文档？',
    message: '同事误把一份文档归档了，原来的链接还能打开吗？',
    context:
      '演示帮助文章：归档不是删除。管理员可从归档列表恢复文档，原项目关系保留。此页不操作真实文件。',
  },
]
let selected = 0
const replies: string[][] = [[], [], []]
function render() {
  $('#questions').innerHTML = seed
    .map(
      (q, i) =>
        `<button class="question" data-q="${i}" aria-pressed="${selected === i}"><strong>${q.name}</strong><span>${q.title}</span><small>今天 · 固定客户样本</small></button>`,
    )
    .join('')
  $('#person').textContent = seed[selected].name + ' / 客户支持'
  $('#messages').replaceChildren()
  for (const [i, text] of [seed[selected].message, ...replies[selected]].entries()) {
    const p = document.createElement('p')
    p.className = 'message' + (i ? ' reply' : '')
    p.textContent = text
    $('#messages').append(p)
  }
  $('#context').textContent = seed[selected].context
  document.querySelectorAll<HTMLButtonElement>('[data-q]').forEach(
    (b) =>
      (b.onclick = () => {
        selected = Number(b.dataset.q)
        ;($('#reply') as HTMLTextAreaElement).value = ''
        $('#error').textContent = ''
        render()
      }),
  )
}
$('#reply-form').onsubmit = (e) => {
  e.preventDefault()
  const input = $<HTMLTextAreaElement>('#reply')
  if (!input.value.trim()) {
    $('#error').textContent = '回复还没有内容，请先写下一句话。'
    input.focus()
    return
  }
  $('#error').textContent = ''
  replies[selected].push(input.value.trim())
  input.value = ''
  render()
}
$('#reset').onclick = () => {
  replies.forEach((r) => r.splice(0))
  $('#error').textContent = ''
  render()
}
render()
void announceReady('intercom')
