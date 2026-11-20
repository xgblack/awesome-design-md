import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const art = {
  racing: new URL('./assets/rally-card.webp', import.meta.url).href,
  arena: new URL('./assets/arena-card.webp', import.meta.url).href,
  tactics: new URL('./assets/tactics-card.webp', import.meta.url).href,
}
const events = [
  {
    id: 0,
    title: 'Neon Rally / Tern × North',
    category: 'sprint',
    time: '20:00',
    start: 1200,
    end: 1245,
    note: '竞速游戏 · 45 分钟 · 霓虹港湾小组赛',
    image: art.racing,
  },
  {
    id: 1,
    title: 'Neon Rally / Clay × Motion',
    category: 'sprint',
    time: '20:15',
    start: 1215,
    end: 1260,
    note: '竞速游戏 · 45 分钟 · 山城环线小组赛',
    image: art.racing,
  },
  {
    id: 2,
    title: 'Orbit Arena / North × Atlas',
    category: 'endurance',
    time: '21:30',
    start: 1290,
    end: 1350,
    note: '团队对抗 · 60 分钟 · 轨道竞技场',
    image: art.arena,
  },
  {
    id: 3,
    title: 'Vector Tactics / Tern × Clay',
    category: 'endurance',
    time: '23:30',
    start: 1410,
    end: 1470,
    note: '团队对抗 · 60 分钟 · 战术决赛夜',
    image: art.tactics,
  },
]
let category = 'all'
const list = new Set<number>()
function render() {
  const q = $<HTMLInputElement>('#event-search').value.trim().toLowerCase(),
    result = events.filter(
      (e) =>
        (category === 'all' || category === e.category) &&
        (e.title + ' ' + e.note).toLowerCase().includes(q),
    )
  $('#event-list').innerHTML = result
    .map(
      (e) =>
        `<article class="event"><time>${e.time}</time><img class="event-thumb" src="${e.image}" alt="${e.category === 'sprint' ? '竞速' : '对抗'}游戏封面"><div><h3>${e.title}</h3><p>${e.note}</p></div><button data-add-event="${e.id}">${list.has(e.id) ? '已加入' : '＋ 清单'}</button></article>`,
    )
    .join('')
  $('#event-status').textContent = result.length
    ? `${result.length} 场固定演示赛程`
    : '没有匹配场次，搜索条件已保留，可清空搜索或选择全部。'
  $('#list-count').textContent = `${list.size} 场`
  $('#list').innerHTML = list.size
    ? [...list]
        .map(
          (id) =>
            `<p>${events[id].time} · ${events[id].title}<button data-remove-event="${id}">移除</button></p>`,
        )
        .join('')
    : '还没加入场次。选一个你想看的夜晚。'
  document.querySelectorAll<HTMLButtonElement>('[data-add-event]').forEach(
    (b) =>
      (b.onclick = () => {
        const id = Number(b.dataset.addEvent)
        if (list.has(id)) {
          $('#list-status').textContent = '这个场次已经在清单中，不重复添加。'
          return
        }
        if (
          [...list].some(
            (x) =>
              Math.max(events[x].start, events[id].start) < Math.min(events[x].end, events[id].end),
          )
        ) {
          $('#list-status').textContent = '撞场了：这两个场次的时间有重叠，请先移除已有场次。'
          return
        }
        list.add(id)
        $('#list-status').textContent = '已加入本次观赛清单，没有订票。'
        render()
      }),
  )
  document.querySelectorAll<HTMLButtonElement>('[data-remove-event]').forEach(
    (b) =>
      (b.onclick = () => {
        list.delete(Number(b.dataset.removeEvent))
        $('#list-status').textContent = '场次已移除。'
        render()
      }),
  )
  document
    .querySelectorAll<HTMLButtonElement>('[data-category]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.category === category)))
}
$('#event-search').oninput = render
document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(
  (b) =>
    (b.onclick = () => {
      category = b.dataset.category!
      render()
    }),
)
$('#clear-list').onclick = () => {
  list.clear()
  $('#list-status').textContent = '清单已清空。'
  render()
}
render()

void announceReady('1win')
