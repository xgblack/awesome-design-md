import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/manrope/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const courses = [
  {
    id: 'docs',
    title: '文档基础',
    track: 'data',
    level: 'intro',
    desc: '字段、类型与一份清楚的数据记录。',
    pre: '',
  },
  {
    id: 'model',
    title: '从记录到模型',
    track: 'data',
    level: 'next',
    desc: '让数据关系与真实任务保持一致。',
    pre: 'docs',
  },
  {
    id: 'find',
    title: '找到正确的记录',
    track: 'query',
    level: 'intro',
    desc: '用条件缩小范围，而不是猜测结果。',
    pre: '',
  },
  {
    id: 'aggregate',
    title: '把记录变成观察',
    track: 'query',
    level: 'next',
    desc: '理解分组、计数与平均值的边界。',
    pre: 'find',
  },
  {
    id: 'backup',
    title: '备份与恢复的第一课',
    track: 'ops',
    level: 'intro',
    desc: '备份的意义，要在恢复时得到证明。',
    pre: '',
  },
  {
    id: 'access',
    title: '访问边界',
    track: 'ops',
    level: 'next',
    desc: '职责、最小权限与可追溯的操作。',
    pre: 'backup',
  },
]
let path: string[] = []
function render() {
  const list = courses.filter(
    (c) =>
      ($<HTMLSelectElement>('#track').value === 'all' ||
        c.track === $<HTMLSelectElement>('#track').value) &&
      ($<HTMLSelectElement>('#level').value === 'all' ||
        c.level === $<HTMLSelectElement>('#level').value),
  )
  $('#empty').hidden = !!list.length
  $('#cards').replaceChildren(
    ...list.map((c) => {
      const card = document.createElement('article')
      card.className = 'course'
      card.dataset.track = c.track
      card.innerHTML = `<span class="tag">${c.track === 'data' ? 'DATA MODELING' : c.track === 'query' ? 'QUERY' : 'OPERATIONS'} · ${c.level === 'intro' ? '入门' : '进阶'}</span><h3>${c.title}</h3><p>${c.desc}</p>`
      const button = document.createElement('button')
      button.textContent = path.includes(c.id) ? '已在路径中 ✓' : '加入路径 +'
      button.dataset.course = c.id
      button.addEventListener('click', () => {
        if (path.includes(c.id)) {
          $('#path-message').textContent = '这门课程已经在路径中，不会重复添加。'
          return
        }
        if (c.pre && !path.includes(c.pre)) {
          $('#path-message').textContent =
            '请先加入先修课程：' + courses.find((x) => x.id === c.pre)!.title
          return
        }
        path.push(c.id)
        $('#path-message').textContent = '已加入 ' + c.title + '。这只是学习规划，不是完成记录。'
        render()
      })
      card.append(button)
      return card
    }),
  )
  $('#path-list').replaceChildren(
    ...path.map((id) => {
      const li = document.createElement('li')
      li.textContent = courses.find((c) => c.id === id)!.title
      return li
    }),
  )
}
$('#track').addEventListener('change', render)
$('#level').addEventListener('change', render)
$('#clear').addEventListener('click', () => {
  path = []
  $('#path-message').textContent = '路径已清空。'
  render()
})
render()

void announceReady('mongodb')
