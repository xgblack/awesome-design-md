import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/jetbrains-mono'
const seed: Record<string, { title: string; label: string; description: string; phone: string }> = {
  workspace: {
    title: 'Your work, connected.',
    label: 'Design system refresh',
    description: '把设计规范、项目进展与团队知识，放在同一处。',
    phone: 'Keep work moving.',
  },
  portal: {
    title: 'A clearer client handoff.',
    label: 'Website delivery review',
    description: '让客户看见交付物、反馈与下一步，不必在链接之间来回寻找。',
    phone: 'Closer to the next step.',
  },
}
let component = 'card'
let labels = { card: 'Design system refresh', button: 'Open project ↗' }
function draw() {
  document
    .querySelectorAll('[data-card-label]')
    .forEach((e) => (e.textContent = labels.card || 'Project title'))
  document
    .querySelectorAll('[data-button-label]')
    .forEach((e) => (e.textContent = labels.button || 'Button label'))
  const v = ($('#variant') as HTMLSelectElement).value
  const names: Record<string, string> = {
    default: '准备开始',
    active: '进行中',
    complete: '已完成',
  }
  document.querySelectorAll<HTMLElement>('[data-state-label]').forEach((e) => {
    e.textContent = names[v]
    e.style.background = v === 'complete' ? '#c8e6cd' : v === 'active' ? '#f4d9aa' : '#e7d6f5'
  })
  $('#component-path').textContent =
    'Workspace / ' + (component === 'card' ? 'Project card' : 'Primary button')
  $('#error').textContent = labels[component as 'card' | 'button'].trim()
    ? ''
    : '组件文字不能为空；画板显示占位提示，不会保存空文字。'
}
document.querySelectorAll<HTMLButtonElement>('[data-component]').forEach(
  (b) =>
    (b.onclick = () => {
      component = b.dataset.component!
      document
        .querySelectorAll('[data-component]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      ;($('#component-text') as HTMLInputElement).value = labels[component as 'card' | 'button']
      draw()
    }),
)
$('#component-text').addEventListener('input', () => {
  labels[component as 'card' | 'button'] = ($('#component-text') as HTMLInputElement).value
  draw()
})
$('#variant').addEventListener('change', draw)
$('#template').addEventListener('change', () => {
  const s = seed[($('#template') as HTMLSelectElement).value]
  $('#file-name').textContent =
    ($('#template') as HTMLSelectElement).value === 'portal'
      ? 'Atlas / Client portal exploration'
      : 'Atlas / Workspace exploration'
  $('#frame-heading').textContent = s.title
  $('#frame-description').textContent = s.description
  $('#phone-heading').textContent = s.phone
  labels = { card: s.label, button: 'Open project ↗' }
  ;($('#component-text') as HTMLInputElement).value = labels[component as 'card' | 'button']
  draw()
})
$('#reset-design').onclick = () => {
  labels = {
    card: seed[($('#template') as HTMLSelectElement).value].label,
    button: 'Open project ↗',
  }
  ;($('#component-text') as HTMLInputElement).value = labels[component as 'card' | 'button']
  ;($('#variant') as HTMLSelectElement).value = 'default'
  draw()
}
$('#comment-form').onsubmit = (e) => {
  e.preventDefault()
  const input = $<HTMLInputElement>('#comment')
  if (!input.value.trim()) {
    $('#comment-error').textContent = '请先写下具体反馈。'
    return
  }
  const p = document.createElement('p')
  p.textContent = '我的本地评论 / ' + input.value.trim()
  $('#comments').append(p)
  input.value = ''
  $('#comment-error').textContent = ''
}
draw()
void announceReady('figma')
