import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const mails = [
  {
    id: 'design',
    sender: '林夏 · Field Studio',
    subject: '周四的产品评审，材料准备好了',
    preview: '三份原型，一份需要一起决定的清单。',
    body: '嗨，乔：\n\n这周的原型已经整理好了。重点是新用户的第一步，我们准备了三种引导方式。\n\n周四下午的评审，你可以带上那份访谈摘录吗？我们希望先核对真实问题，再决定界面。\n\n林夏',
    priority: true,
  },
  {
    id: 'invoice',
    sender: '周远 · Nori Cloud',
    subject: '11 月项目结项资料',
    preview: '请核对里程碑与最终交付物。',
    body: '你好，\n\n结项清单中有两项待核对：交互标注和图标源文件。请在周五前把确认结果回复给我。\n\n附件在本演示中不提供下载，不包含真实财务信息。',
    priority: true,
  },
  {
    id: 'digest',
    sender: 'Orbit Journal',
    subject: '本周阅读：留一点空白',
    preview: '关于专注、节奏与好对话的三篇文章。',
    body: '这一期，我们讨论如何把注意力留给重要的事。\n\n你可以归档这封演示邮件，也可以写下阅读感受。这里没有真实邮件或订阅。',
    priority: false,
  },
]
let view = 'priority',
  selected = 'design',
  archived = new Set<string>(),
  lastArchive = '',
  drafts: Record<string, string> = {}
function render() {
  const rows = mails.filter((m) =>
    view === 'archive' ? archived.has(m.id) : !archived.has(m.id) && (view === 'all' || m.priority),
  )
  if (!rows.some((m) => m.id === selected)) selected = rows[0]?.id || ''
  document
    .querySelectorAll<HTMLButtonElement>('[data-filter]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === view)))
  $('#mail-list').innerHTML =
    rows
      .map(
        (m) =>
          `<button class="mail-item" data-mail="${m.id}" aria-pressed="${m.id === selected}"><span>${m.sender}</span><strong>${m.subject}</strong><small>${m.preview}</small></button>`,
      )
      .join('') || '<p class="mail-empty">这里暂时没有邮件。切换“全部”或撤销上次归档。</p>'
  document.querySelectorAll<HTMLButtonElement>('[data-mail]').forEach(
    (b) =>
      (b.onclick = () => {
        selected = b.dataset.mail!
        $('#mail-status').textContent = ''
        render()
      }),
  )
  const m = mails.find((x) => x.id === selected)
  $('#mail-sender').textContent = m?.sender || 'Inbox zero'
  $('#mail-subject').textContent = m?.subject || '少一点噪声，多一点从容。'
  $('#mail-body').textContent = m?.body || '当前视图没有待处理的本地样本。'
  $<HTMLInputElement>('#reply').value = drafts[selected] || ''
  $<HTMLTextAreaElement>('#reply').disabled = !m
  $<HTMLButtonElement>('#reply-form button').disabled = !m
  $<HTMLButtonElement>('#archive').disabled = !m || archived.has(selected)
  $<HTMLButtonElement>('#undo').disabled = !lastArchive
}
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(
  (b) =>
    (b.onclick = () => {
      view = b.dataset.filter!
      $('#mail-status').textContent = ''
      render()
    }),
)
$('#archive').onclick = () => {
  if (!selected) return
  lastArchive = selected
  archived.add(selected)
  render()
  $('#mail-status').textContent = '邮件已归档，可撤销。'
}
$('#undo').onclick = () => {
  archived.delete(lastArchive)
  selected = lastArchive
  lastArchive = ''
  view = 'all'
  render()
  $('#mail-status').textContent = '已撤销归档。'
}
$('#reply-form').onsubmit = (e) => {
  e.preventDefault()
  const value = $<HTMLTextAreaElement>('#reply').value.trim()
  if (!value) {
    $('#mail-status').textContent = '先写下回复，再保存草稿。'
    $('#reply').focus()
    return
  }
  drafts[selected] = value
  $('#mail-status').textContent = '草稿已保存在本页内存，没有发送。'
}
const dialog = $<HTMLDialogElement>('#command-dialog')
function openCommands() {
  dialog.showModal()
}
$('#commands').onclick = openCommands
$('#close').onclick = () => dialog.close()
dialog.addEventListener('close', () => $('#commands').focus())
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (dialog.open) dialog.close()
    else openCommands()
  }
})
document.querySelectorAll<HTMLButtonElement>('[data-command]').forEach(
  (b) =>
    (b.onclick = () => {
      view = b.dataset.command!
      render()
      dialog.close()
      $('#focus').scrollIntoView({ behavior: 'smooth' })
    }),
)
render()

void announceReady('superhuman')
