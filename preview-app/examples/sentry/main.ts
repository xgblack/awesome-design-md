import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const frames = [
  {
    name: 'loadImage',
    file: 'gallery.ts:24',
    app: true,
    code: 'async function loadImage(path) {\n  const image = await getFixture(path)\n  if (!image) throw new Error("MissingResource")\n  return image\n}',
  },
  {
    name: 'renderGallery',
    file: 'page.ts:12',
    app: true,
    code: 'function renderGallery() {\n  return loadImage("missing-cover.webp")\n  // 教学预设：此资源路径不存在\n}',
  },
  {
    name: 'dispatchCallback',
    file: 'vendor/runtime.js:89',
    app: false,
    code: '// Third-party frame fixture\n// Not executed in this example.\ndispatch(callback)',
  },
]
let event = 'none'
let selected = 0
function render() {
  const error = event === 'error'
  $('#issue-type').textContent = error
    ? 'SIMULATED / MISSING RESOURCE'
    : event === 'success'
      ? 'SIMULATED / SUCCESS'
      : 'READY / NO EVENT'
  $('#issue-title').textContent = error
    ? 'MissingResource: cover not found'
    : event === 'success'
      ? '成功样例：资源已存在。'
      : '等待一次受控演练。'
  $('#issue-copy').textContent = error
    ? '预置教学事件。检查应用帧中的资源路径，理解错误如何向上传递。'
    : event === 'success'
      ? '成功 fixture 没有异常栈。没有加载远程资源或真实监控数据。'
      : '按钮只选择预置教学事件，不制造应用自身崩溃。'
  $('#frames').replaceChildren()
  if (!error) {
    const p = document.createElement('p')
    p.textContent = '当前没有异常栈。'
    $('#frames').append(p)
    $('#source').textContent = 'Select a simulated error event to inspect a frame.'
    $('#file-name').textContent = 'No frame selected'
    return
  }
  const shown = frames.filter((f) => !$<HTMLInputElement>('#app-only').checked || f.app)
  shown.forEach((f) => {
    const index = frames.indexOf(f)
    const b = document.createElement('button')
    b.className = 'frame' + (index === selected ? ' selected' : '')
    b.dataset.frame = String(index)
    b.innerHTML = `<b>${f.name}</b><small>${f.file} / ${f.app ? 'APP' : 'VENDOR'}</small>`
    b.addEventListener('click', () => {
      selected = index
      render()
    })
    $('#frames').append(b)
  })
  if (!shown.includes(frames[selected])) selected = 0
  $('#file-name').textContent = frames[selected].file
  $('#source').textContent = frames[selected].code
}
$('#trigger').addEventListener('click', () => {
  event = 'error'
  selected = 0
  render()
})
$('#success').addEventListener('click', () => {
  event = 'success'
  render()
})
$('#app-only').addEventListener('change', render)
$('#reset').addEventListener('click', () => {
  event = 'none'
  render()
})
render()

void announceReady('sentry')
