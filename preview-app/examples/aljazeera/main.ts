import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource-variable/roboto'
const setIssue = (issue: string) => {
  let n = 0
  document.querySelectorAll<HTMLElement>('[data-issue-story]').forEach((a) => {
    a.hidden = issue !== 'all' && a.dataset.issueStory !== issue
    if (!a.hidden) n++
  })
  $('#issue-status').textContent = `显示${issue === 'all' ? '全部 ' : ''}${n} 篇专题稿件`
  document
    .querySelectorAll<HTMLButtonElement>('[data-issue]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.issue === issue)))
}
document
  .querySelectorAll<HTMLButtonElement>('[data-issue]')
  .forEach((b) => (b.onclick = () => setIssue(b.dataset.issue!)))
$('#all-topics').onclick = () => setIssue('all')
const updates = [
  ['09:00', '步道开放', '志愿者在桥下集合，介绍这次虚构开放日的观察路线。'],
  ['10:30', '听见不同的需要', '长椅、坡道与指示系统，成为参与者最关心的三个问题。'],
  ['14:00', '把草图摊在长桌上', '不同年龄的参与者，把自己的日常路线画进同一张图。'],
  ['17:00', '开放之后，才是开始', '维护、照明与长期使用，需要比开放日更持久的讨论。'],
]
let n = 0
$('#next-update').onclick = () => {
  if (n === updates.length) return
  const u = updates[n++],
    li = document.createElement('li')
  li.innerHTML = `<time>${u[0]}</time><h3>${u[1]}</h3><p>${u[2]}</p>`
  $('#updates').append(li)
  $('#replay-status').textContent = `${n} / 4 条更新已展开`
  $('#next-update').toggleAttribute('disabled', n === updates.length)
}
$('#restart').onclick = () => {
  n = 0
  $('#updates').replaceChildren()
  $('#next-update').removeAttribute('disabled')
  $('#replay-status').textContent = '0 / 4 条更新已展开'
}
void announceReady('aljazeera')

function closeReport() {
  $('#full-report').hidden = true
  $('#read-report').focus()
  $('#read-report').scrollIntoView({ block: 'center' })
}
$('#read-report').onclick = () => {
  $('#full-report').hidden = false
  $('#full-report').scrollIntoView({ block: 'start' })
  $('#close-report').focus()
}
$('#close-report').onclick = closeReport
$('#close-report-bottom').onclick = closeReport
