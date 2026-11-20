import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/manrope'
const groups = ['用户观察', '待验证假设', '下一步实验']
const notes = [
  { id: 1, text: '新用户常在创建第一个项目之前离开。', group: 0, voted: false },
  { id: 2, text: '引导里放一个可直接操作的示例项目。', group: 1, voted: false },
  { id: 3, text: '邀请五位新用户试用两种引导方式。', group: 2, voted: false },
  { id: 4, text: '访谈中，用户更想先看见自己的工作成果。', group: 0, voted: false },
]
let dragging = 0
function render() {
  const used = notes.filter((n) => n.voted).length
  $('#votes').textContent = `已投 ${used} / 3 票 · ${3 - used} 票可用`
  $('#groups').innerHTML = groups
    .map(
      (g, i) =>
        `<section class="group" data-group="${i}"><h3>${g}</h3>${notes
          .filter((n) => n.group === i)
          .map(
            (n) =>
              `<article class="note" draggable="true" data-id="${n.id}"><p>${n.text}</p><label>移至<select data-move="${n.id}" aria-label="移动建议 ${n.id}">${groups.map((name, index) => `<option value="${index}" ${index === i ? 'selected' : ''}>${name}</option>`).join('')}</select></label><button class="vote" data-vote="${n.id}" aria-pressed="${n.voted}" ${!n.voted && used >= 3 ? 'disabled' : ''}>${n.voted ? '✓ 已投票 · 撤回' : '＋ 投一票'}</button></article>`,
          )
          .join(
            '',
          )}${!notes.some((n) => n.group === i) ? '<p>把相关建议移到这里。</p>' : ''}</section>`,
    )
    .join('')
  document.querySelectorAll<HTMLSelectElement>('[data-move]').forEach(
    (s) =>
      (s.onchange = () => {
        notes.find((n) => n.id === Number(s.dataset.move))!.group = Number(s.value)
        render()
      }),
  )
  document.querySelectorAll<HTMLButtonElement>('[data-vote]').forEach(
    (b) =>
      (b.onclick = () => {
        const n = notes.find((n) => n.id === Number(b.dataset.vote))!
        n.voted = !n.voted
        render()
      }),
  )
  document.querySelectorAll<HTMLElement>('.note').forEach(
    (n) =>
      (n.ondragstart = () => {
        dragging = Number(n.dataset.id)
      }),
  )
  document.querySelectorAll<HTMLElement>('[data-group]').forEach((g) => {
    g.ondragover = (e) => e.preventDefault()
    g.ondrop = (e) => {
      e.preventDefault()
      const note = notes.find((n) => n.id === dragging)
      if (note) note.group = Number(g.dataset.group)
      render()
    }
  })
}
render()

void announceReady('miro')
