import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const examples = {
  empty: {
    title: '当结果为空时',
    file: 'search',
    reason: '空集合仍然读取首项会造成未定义访问。先判断长度，让失败路径成为明确状态。',
    before: 'export function firstResult(items: string[]) {\n  return items[0].toUpperCase()\n}',
    after:
      'export function firstResult(items: string[]) {\n  if (items.length === 0) return "暂无结果"\n  return items[0].toUpperCase()\n}',
    test: 'it("handles an empty result", () => {\n  expect(firstResult([])).toBe("暂无结果")\n})',
  },
  price: {
    title: '保留金额精度',
    file: 'price',
    reason: '不要让字符串拼接代替数值格式。显示前校验金额，再以固定小数位呈现。',
    before: 'export function formatPrice(amount: number) {\n  return "¥" + amount\n}',
    after:
      'export function formatPrice(amount: number) {\n  if (!Number.isFinite(amount)) return "—"\n  return "¥" + amount.toFixed(2)\n}',
    test: 'it("keeps two decimal places", () => {\n  expect(formatPrice(8)).toBe("¥8.00")\n})',
  },
}
let choice: keyof typeof examples = 'empty'
let file = 'main'
let after = false
let timer: ReturnType<typeof setInterval> | undefined
function update() {
  const e = examples[choice]
  $('#filename').textContent = e.file + (file === 'test' ? '.test.ts' : '.ts')
  $('#source').textContent = file === 'test' ? e.test : after ? e.after : e.before
  $('#chat-title').textContent = e.title
  $('#context').textContent = e.reason
  document.querySelectorAll<HTMLButtonElement>('[data-file]').forEach((b) => {
    b.classList.toggle('selected', b.dataset.file === file)
    b.textContent = '▧ ' + e.file + (b.dataset.file === 'test' ? '.test.ts' : '.ts')
  })
  $('#before').setAttribute('aria-pressed', String(!after))
  $('#after').setAttribute('aria-pressed', String(after))
}
function timeline(stage: number) {
  document.querySelectorAll<HTMLElement>('.agent-timeline li').forEach((li, i) => {
    li.classList.toggle('reached', i <= stage)
    if (i === stage) li.setAttribute('aria-current', 'step')
    else li.removeAttribute('aria-current')
  })
}
function stop() {
  clearInterval(timer)
  $<HTMLButtonElement>('#start').disabled = false
  $<HTMLButtonElement>('#cancel').disabled = true
}
$('#case').addEventListener('change', () => {
  stop()
  choice = $<HTMLSelectElement>('#case').value as keyof typeof examples
  after = false
  file = 'main'
  timeline(-1)
  $('#phase').textContent = 'Ready to inspect'
  $('#terminal').textContent = '已切换固定样例，等待回放。'
  update()
})
document.querySelectorAll<HTMLButtonElement>('[data-file]').forEach((b) =>
  b.addEventListener('click', () => {
    file = b.dataset.file!
    update()
  }),
)
$('#before').addEventListener('click', () => {
  after = false
  update()
})
$('#after').addEventListener('click', () => {
  after = true
  update()
})
$('#start').addEventListener('click', () => {
  stop()
  after = false
  update()
  $<HTMLButtonElement>('#start').disabled = true
  $<HTMLButtonElement>('#cancel').disabled = false
  let n = 0
  const phases = [
    'Thinking through fixture',
    'Grepping known files',
    'Reading boundary',
    'Editing fixture patch',
    'Replay complete',
  ]
  $('#phase').textContent = phases[0]
  timeline(0)
  timer = setInterval(() => {
    n++
    $('#phase').textContent = phases[Math.min(n, 4)]
    timeline(n)
    $('#terminal').textContent =
      n < 4 ? '回放步骤 ' + n + ' / 4 · 未执行真实测试' : '示例断言：通过（预置演示，不是运行结果）'
    if (n === 4) {
      after = true
      update()
      stop()
    }
  }, 500)
})
$('#cancel').addEventListener('click', () => {
  stop()
  $('#phase').textContent = 'Replay cancelled'
  $('#terminal').textContent = '回放已取消；文件内容没有写入。'
})
document.querySelectorAll<HTMLButtonElement>('[data-pane]').forEach((b) =>
  b.addEventListener('click', () => {
    $('.editor-grid').classList.add('mobile-switched')
    document
      .querySelectorAll('.pane')
      .forEach((p) => p.classList.toggle('mobile-active', p.id === b.dataset.pane))
    document
      .querySelectorAll<HTMLButtonElement>('[data-pane]')
      .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
  }),
)
window.addEventListener('pagehide', () => clearInterval(timer))
update()
timeline(-1)

void announceReady('cursor')
