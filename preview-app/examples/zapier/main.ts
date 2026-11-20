import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
type Event = { id: string; name: string; topic: string; guests: number }
const events: Event[] = [
  { id: 'complete', name: '林夏', topic: '社区花园', guests: 2 },
  { id: 'missing', name: '', topic: '共享阅读', guests: 1 },
  { id: 'large', name: '周安', topic: '邻里修理', guests: 5 },
]
let step = 0
function rows() {
  const field = ($('#mapping') as HTMLSelectElement).value,
    limit = Number(($('#limit') as HTMLSelectElement).value)
  const allowed = events.filter(
    (x) => field && String(x[field as 'name' | 'topic']).trim() && x.guests <= limit,
  )
  $('#count').textContent = `${allowed.length} / ${events.length} 条符合条件`
  $('#rows').innerHTML =
    allowed
      .map(
        (x) =>
          `<tr><td>${x[field as 'name' | 'topic']}</td><td>${x.topic}</td><td>${x.guests}</td><td>通过 · 本地示例</td></tr>`,
      )
      .join('') || '<tr><td colspan="4">没有符合当前映射与人数条件的样本。</td></tr>'
}
function reset() {
  step = 0
  $('#log').replaceChildren()
  $('#error').textContent = ''
  $('#result').hidden = true
  $('#next').textContent = '下一步：读取样本 →'
  ;($('#next') as HTMLButtonElement).disabled = false
  rows()
}
for (const id of ['event', 'mapping', 'limit']) $('#' + id).addEventListener('change', reset)
$('#restart').onclick = reset
$('#next').onclick = () => {
  const event = events.find((x) => x.id === ($('#event') as HTMLSelectElement).value)!,
    field = ($('#mapping') as HTMLSelectElement).value,
    limit = Number(($('#limit') as HTMLSelectElement).value)
  if (!field) {
    $('#error').textContent = '缺少姓名字段映射，流程未执行。'
    return
  }
  const append = (text: string, detail: string) => {
    const li = document.createElement('li')
    li.textContent = text
    const small = document.createElement('small')
    small.textContent = detail
    li.append(small)
    $('#log').append(li)
  }
  if (step === 0) {
    append('1 / 已读取固定报名样本', event.topic + ' · ' + event.guests + ' 人')
    step = 1
    $('#next').textContent = '下一步：映射字段 →'
  } else if (step === 1) {
    const name = String(event[field as 'name' | 'topic']).trim()
    if (!name) {
      $('#error').textContent = '映射后的姓名为空，流程已停止；请更换样本或字段。'
      ;($('#next') as HTMLButtonElement).disabled = true
      return
    }
    append('2 / 已形成名单姓名', field + ' → ' + name)
    step = 2
    $('#next').textContent = '下一步：检查人数 →'
  } else if (step === 2) {
    if (event.guests > limit) {
      append('3 / 已拦截：人数超出条件', event.guests + ' 人 > ' + limit + ' 人')
      $('#error').textContent = '没有生成提醒草稿。可以调整人数条件后重新演练。'
      ;($('#next') as HTMLButtonElement).disabled = true
      return
    }
    append('3 / 人数条件通过', event.guests + ' 人 ≤ ' + limit + ' 人')
    step = 3
    $('#next').textContent = '下一步：形成草稿 →'
  } else {
    append('4 / 已生成本地草稿', '没有外部调用或发送行为')
    $('#draft').textContent =
      String(event[field as 'name' | 'topic']) +
      '，你的「' +
      event.topic +
      '」演示报名共 ' +
      event.guests +
      ' 人。请带上愿意分享的好奇心。'
    $('#result').hidden = false
    ;($('#next') as HTMLButtonElement).disabled = true
    $('#next').textContent = '本地演练完成'
    step = 4
  }
}
reset()

void announceReady('zapier')
