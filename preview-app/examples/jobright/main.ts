import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource-variable/manrope/index.css'

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const projects = [
  {
    id: 'designer',
    title: 'Product Designer',
    company: 'Outline Studio',
    skill: 'design',
    time: 'mid',
    place: 'remote',
    desc: '从研究与原型到设计系统，为一个更清晰的产品界面负责。',
    icon: 'O',
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    company: 'Northstar Labs',
    skill: 'development',
    time: 'mid',
    place: 'remote',
    desc: '围绕可访问性与组件开发，将设计语言带进真实产品。',
    icon: 'N',
  },
  {
    id: 'analyst',
    title: 'Data Analyst',
    company: 'Signal Works',
    skill: 'data',
    time: 'junior',
    place: 'onsite',
    desc: '用明确口径整理产品事件，为业务问题提供可核对的分析。',
    icon: 'S',
  },
  {
    id: 'junior-design',
    title: 'Junior UI Designer',
    company: 'Common Ground',
    skill: 'design',
    time: 'junior',
    place: 'onsite',
    desc: '从明确的产品需求开始，协助制作组件与响应式界面。',
    icon: 'C',
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    company: 'Meridian Tools',
    skill: 'development',
    time: 'junior',
    place: 'onsite',
    desc: '阅读接口、编写测试，在导师支持下完成后端开发任务。',
    icon: 'M',
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    company: 'Parallel Studio',
    skill: 'data',
    time: 'mid',
    place: 'remote',
    desc: '维护数据模型与质量检查，让分析数据保持一致。',
    icon: 'P',
  },
]
const names: Record<string, string> = {
  design: '设计',
  development: '开发',
  data: '数据',
  junior: '初级',
  mid: '中级',
  onsite: '现场',
  remote: '远程',
}
let saved: string[] = []
let trigger: HTMLElement | null = null
function close() {
  $('#details').hidden = true
  trigger?.focus()
}
function render() {
  const skill = $<HTMLSelectElement>('#skill').value
  const time = $<HTMLSelectElement>('#time').value
  const place = $<HTMLSelectElement>('#place').value
  const result = projects.filter(
    (p) =>
      (skill === 'all' || p.skill === skill) &&
      (time === 'all' || p.time === time) &&
      (place === 'all' || p.place === place) &&
      (!$<HTMLInputElement>('#saved').checked || saved.includes(p.id)),
  )
  $('#count').textContent = result.length + ' 个匹配岗位 · 规则筛选，非 AI 评分'
  $('#empty').hidden = !!result.length
  $('#list').replaceChildren(
    ...result.map((p) => {
      const row = document.createElement('article')
      row.className = 'project'
      row.innerHTML = `<span>${p.icon}</span><div><h3>${p.title}</h3><small>${p.company}<br>${names[p.skill]} / ${names[p.time]} / ${names[p.place]}</small></div><p>${p.desc}</p>`
      const actions = document.createElement('div')
      const detail = document.createElement('button')
      detail.textContent = '匹配理由 ↗'
      detail.dataset.detail = p.id
      detail.addEventListener('click', () => {
        trigger = detail
        $('#detail-title').textContent = p.title + ' / ' + p.company
        $('#reason').textContent =
          `技能：${names[p.skill]}；资历：${names[p.time]}；工作方式：${names[p.place]}。${skill === 'all' && time === 'all' && place === 'all' ? '你未限制条件，所有固定岗位均可浏览。' : '该岗位同时满足当前所有已选条件。'} 无隐藏评分，不推断兴趣，不提交简历或投递。`
        $('#details').hidden = false
        $('#details').focus()
      })
      const save = document.createElement('button')
      save.textContent = saved.includes(p.id) ? '已关注 ✓' : '关注 +'
      save.dataset.save = p.id
      save.setAttribute('aria-pressed', String(saved.includes(p.id)))
      save.addEventListener('click', () => {
        saved = saved.includes(p.id) ? saved.filter((x) => x !== p.id) : [...saved, p.id]
        render()
      })
      actions.append(detail, save)
      row.append(actions)
      return row
    }),
  )
}
;['skill', 'time', 'place', 'saved'].forEach((id) =>
  $('#' + id).addEventListener('change', () => {
    $('#details').hidden = true
    render()
  }),
)
$('#close').addEventListener('click', close)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#details').hidden) close()
})
render()

void announceReady('jobright')
