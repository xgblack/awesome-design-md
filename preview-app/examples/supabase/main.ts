import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const initial = [
  { id: 1, name: 'api-service', environment: 'production', status: 'healthy' },
  { id: 2, name: 'docs-site', environment: 'preview', status: 'building' },
  { id: 3, name: 'mobile-backend', environment: 'development', status: 'healthy' },
]
let data = initial.map((r) => ({ ...r }))
let selected = 1
function select(id: number) {
  selected = id
  const r = data.find((x) => x.id === id)!
  $<HTMLInputElement>('#name').value = r.name
  $<HTMLInputElement>('#location').value = r.environment
  render()
}
function render() {
  const q = $<HTMLInputElement>('#search').value.trim().toLowerCase()
  const environment = $<HTMLSelectElement>('#query').value
  const result = data.filter(
    (r) =>
      (!q || (r.name + ' ' + r.environment).includes(q)) &&
      (environment === 'all' || r.environment === environment),
  )
  $('#empty').hidden = !!result.length
  $('#rows').replaceChildren(
    ...result.map((r) => {
      const b = document.createElement('button')
      b.className = 'row' + (selected === r.id ? ' active' : '')
      b.dataset.record = String(r.id)
      b.innerHTML = '<span></span><span></span><small></small>'
      b.children[0].textContent = r.name
      b.children[1].textContent = r.environment
      b.children[2].textContent = r.status
      b.addEventListener('click', () => select(r.id))
      return b
    }),
  )
}
$('#search').addEventListener('input', render)
$('#query').addEventListener('change', render)
$('#edit').addEventListener('submit', (e) => {
  e.preventDefault()
  const name = $<HTMLInputElement>('#name').value.trim()
  const environment = $<HTMLInputElement>('#location').value.trim()
  if (!name || !environment) {
    $('#feedback').textContent = '项目名称和环境不能为空。'
    return
  }
  if (!['production', 'preview', 'development'].includes(environment)) {
    $('#feedback').textContent = '环境仅支持 production / preview / development。'
    return
  }
  if (data.some((r) => r.id !== selected && r.name === name)) {
    $('#feedback').textContent = '项目名称已存在，请使用不同名称。'
    return
  }
  const r = data.find((x) => x.id === selected)!
  const old = r.environment
  r.name = name
  r.environment = environment
  $('#feedback').textContent = '本地项目记录已更新。'
  $('#stream').textContent =
    `postgres_changes / public.projects\nUPDATE id=${r.id}\nname: ${r.name}\nenvironment: ${old} → ${environment}\n仅本地事件流，未连接云数据库`
  render()
})
$('#reset').addEventListener('click', () => {
  data = initial.map((r) => ({ ...r }))
  $<HTMLInputElement>('#search').value = ''
  $<HTMLSelectElement>('#query').value = 'all'
  $('#stream').textContent = '已恢复初始项目数据。'
  $('#feedback').textContent = ''
  select(1)
})
select(1)

void announceReady('supabase')
