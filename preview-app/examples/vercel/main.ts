import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const branches = {
  journal: {
    label: 'THE EVERYDAY JOURNAL',
    title: 'A thought worth keeping.',
    body: '把今天的一点观察，留给明天的自己。',
    surface: '#f7f5ee',
  },
  field: {
    label: 'FIELD NOTES / 06',
    title: 'The long way home.',
    body: '沿着河岸，记录那些没有赶上的日落。',
    surface: '#ecf2ed',
  },
}
let timer: ReturnType<typeof setInterval> | undefined
let step = -1
function preview() {
  const key = $<HTMLSelectElement>('#branch').value as keyof typeof branches
  const b = branches[key]
  $('#preview-label').textContent = b.label
  $('#preview-title').textContent = b.title
  $('#preview-body').textContent = b.body
  $('#page-preview').style.background = b.surface
  $('#preview-version').textContent = key
}
function stop() {
  clearInterval(timer)
  $<HTMLButtonElement>('#run').disabled = false
  $<HTMLButtonElement>('#cancel').disabled = true
  $<HTMLSelectElement>('#branch').disabled = false
}
$('#branch').addEventListener('change', preview)
$('#run').addEventListener('click', () => {
  stop()
  step = 0
  $('#log').textContent = '[prepare] Read local fixture.'
  $('#status').textContent = '正在回放：准备。'
  $<HTMLButtonElement>('#run').disabled = true
  $<HTMLButtonElement>('#cancel').disabled = false
  $<HTMLSelectElement>('#branch').disabled = true
  document
    .querySelectorAll('[data-stage]')
    .forEach((x) => x.classList.toggle('active', x.getAttribute('data-stage') === '0'))
  timer = setInterval(() => {
    step++
    document
      .querySelectorAll('[data-stage]')
      .forEach((x) => x.classList.toggle('active', x.getAttribute('data-stage') === String(step)))
    if (step === 1 && $<HTMLInputElement>('#fail').checked) {
      $('#log').textContent += '\n[build] Fixture failure: missing title.'
      $('#status').textContent = '模拟构建失败。取消失败条件后可以重试。'
      stop()
      return
    }
    $('#log').textContent +=
      step === 1
        ? '\n[build] Example build stage reviewed.'
        : '\n[preview] Local preview ready. No deployment created.'
    $('#status').textContent =
      step === 1 ? '正在回放：构建。' : '回放完成，当前页面预览可读。未产生部署。'
    if (step === 2) {
      preview()
      stop()
    }
  }, 500)
})
$('#cancel').addEventListener('click', () => {
  stop()
  $('#status').textContent = '回放已取消，没有创建部署。'
})
window.addEventListener('pagehide', () => clearInterval(timer))
preview()

void announceReady('vercel')
