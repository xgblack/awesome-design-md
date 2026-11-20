import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const scenes = [
  {
    name: '雨后码头',
    day: '11 月 24 日',
    actor: '林夏、周安',
    status: '待拍摄',
    note: '上午 07:00–09:00 · 备选为室内咖啡馆',
  },
  {
    name: '旧书店',
    day: '11 月 23 日',
    actor: '林夏',
    status: '已完成',
    note: '下午 14:00–17:00 · 现场收声已归档',
  },
  {
    name: '回家路上',
    day: '待确定',
    actor: '未关联演员',
    status: '待拍摄',
    note: '缺少场地确认；日程暂未关联',
  },
]
let view = 'table'
function render() {
  const el = $('#records')
  if (view === 'table') {
    el.innerHTML =
      '<table><thead><tr><th>场景</th><th>拍摄日</th><th>演员</th><th>进度</th></tr></thead><tbody>' +
      scenes
        .map(
          (s, i) =>
            `<tr><td><button class="row-link" data-scene="${i}">${s.name} ↗</button></td><td>${s.day}</td><td>${s.actor}</td><td><span class="badge">${s.status}</span></td></tr>`,
        )
        .join('') +
      '</tbody></table>'
  } else {
    el.innerHTML =
      '<div class="kanban">' +
      ['待拍摄', '已完成', '待剪辑']
        .map(
          (status) =>
            `<section><h3>${status}</h3>${scenes.map((s, i) => (s.status === status ? `<button data-scene="${i}">${s.name}<br><small>${s.day}</small></button>` : '')).join('')}${!scenes.some((s) => s.status === status) ? '<small>暂无场景 · 完成拍摄后归入此组</small>' : ''}</section>`,
        )
        .join('') +
      '</div>'
  }
  document.querySelectorAll<HTMLButtonElement>('[data-scene]').forEach(
    (b) =>
      (b.onclick = () => {
        const s = scenes[Number(b.dataset.scene)]
        $('#scene-title').textContent = s.name
        $('#scene-info').innerHTML =
          `<dl><dt>关联演员</dt><dd>${s.actor}</dd><dt>拍摄日</dt><dd>${s.day}</dd></dl><p>${s.note}</p>`
        ;($('#detail') as HTMLDialogElement).showModal()
      }),
  )
}
for (const id of ['table', 'board'])
  $('#' + id).onclick = () => {
    view = id
    for (const other of ['table', 'board'])
      $('#' + other).setAttribute('aria-pressed', String(other === id))
    render()
  }
$('#close').onclick = () => ($('#detail') as HTMLDialogElement).close()
render()

void announceReady('airtable')
