import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource-variable/roboto'
const sessions = [
    { name: '潮汐邮差', time: '20:00' },
    { name: '回声果园', time: '20:00' },
    { name: '最后中继站', time: '21:00' },
  ],
  selected = new Set<number>()
const render = () => {
  $('#sessions').innerHTML = selected.size
    ? [...selected]
        .map(
          (i) =>
            `<p>${sessions[i].time} / ${sessions[i].name}<button data-remove-session="${i}">移除</button></p>`,
        )
        .join('')
    : '还没有选择作品。'
  document.querySelectorAll<HTMLButtonElement>('[data-remove-session]').forEach(
    (b) =>
      (b.onclick = () => {
        selected.delete(Number(b.dataset.removeSession))
        $('#session-status').textContent = '已从本次清单移除。'
        render()
      }),
  )
}
document.querySelectorAll<HTMLButtonElement>('[data-genre]').forEach(
  (b) =>
    (b.onclick = () => {
      let n = 0
      document.querySelectorAll<HTMLElement>('[data-genre-game]').forEach((x) => {
        x.hidden = b.dataset.genre !== 'all' && x.dataset.genreGame !== b.dataset.genre
        if (!x.hidden) n++
      })
      $('#genre-status').textContent = `${n} 款原创游戏概念`
      document
        .querySelectorAll('[data-genre]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
document.querySelectorAll<HTMLButtonElement>('[data-session]').forEach(
  (b) =>
    (b.onclick = () => {
      const i = Number(b.dataset.session)
      if (selected.has(i)) {
        $('#session-status').textContent = '这个作品已在清单中，不重复加入。'
        return
      }
      if ([...selected].some((x) => sessions[x].time === sessions[i].time)) {
        $('#session-status').textContent = '时间冲突：请先移除同一时间的作品。'
        return
      }
      selected.add(i)
      $('#session-status').textContent = '已加入本次试玩清单，没有实际占位或下载。'
      render()
    }),
)
$('#clear-sessions').onclick = () => {
  selected.clear()
  $('#session-status').textContent = '清单已清空。'
  render()
}
void announceReady('playstation')
