import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

import '@fontsource-variable/cormorant-garamond/index.css'
const events = {
  welcome: {
    name: 'reader.joined',
    subject: 'A place for your next thought.',
    body: '欢迎来到这张小小的编辑桌。我们把读过的句子与沿途的观察，慢慢整理成一封值得打开的信。',
    action: '阅读本地入门说明：每周一则原创笔记。没有订阅或账户被创建。',
  },
  dispatch: {
    name: 'specimen.dispatched',
    subject: 'A little something is on its way.',
    body: '你选择的样本已经在这份虚构记录中标记为准备完成。这里不是物流通知，也没有真实包裹被寄出。',
    action: '演示清单：纸张样本 01 / 包装说明 02。所有内容只供本地预览。',
  },
  reminder: {
    name: 'reading.reminder',
    subject: 'Leave a little time for the unfinished.',
    body: '那篇还没读完的文章，或许值得一个不被打扰的下午。提醒不必催促，它也可以是一份邀请。',
    action: '本地提醒示例：周末阅读时段。没有创建日程或发送通知。',
  },
}
let current: keyof typeof events = 'welcome'
let stage = -1
let paused = false
let failed = false
let timer: ReturnType<typeof setInterval> | undefined
function letter() {
  const e = events[current]
  $('#subject').textContent = e.subject
  $('#body').textContent = e.body
  $('#letter-action').textContent = e.action
  $('#code').textContent = JSON.stringify(
    { event: e.name, to: 'DEMO_ADDRESS', template: current, delivery: 'preview_only' },
    null,
    2,
  )
}
function stop() {
  clearInterval(timer)
  $<HTMLButtonElement>('#pause').disabled = true
  $<HTMLButtonElement>('#start').disabled = false
  $<HTMLSelectElement>('#event').disabled = false
}
function reset() {
  stop()
  stage = -1
  failed = false
  paused = false
  $('#status').textContent = '等待开始。'
  $('#log').textContent = 'No delivery attempted.'
  $('#start').textContent = '开始回放'
  document.querySelectorAll('[data-stage]').forEach((s) => s.classList.remove('complete'))
}
$('#start').addEventListener('click', () => {
  stop()
  if (!paused || failed || stage === 2) {
    stage = -1
    $('#log').textContent = '[local] Begin fixture replay.'
    failed = false
  }
  paused = false
  $<HTMLButtonElement>('#start').disabled = true
  $<HTMLButtonElement>('#pause').disabled = false
  $<HTMLSelectElement>('#event').disabled = true
  $('#status').textContent = '本地教学回放中。'
  timer = setInterval(() => {
    stage++
    document
      .querySelectorAll('[data-stage]')
      .forEach((s) => s.classList.toggle('complete', Number(s.getAttribute('data-stage')) <= stage))
    if (stage === 1 && $<HTMLInputElement>('#failure').checked) {
      failed = true
      $('#status').textContent = '校验失败：演示字段缺失。没有投递；取消失败条件后重试。'
      $('#log').textContent += '\n[validate] Fixture error; stop.'
      stop()
      $('#start').textContent = '重试回放'
      return
    }
    $('#log').textContent +=
      '\n[' + ['prepare', 'validate', 'preview'][stage] + '] Local fixture reviewed.'
    if (stage === 2) {
      $('#status').textContent = '模拟交付演练完成。未发送任何邮件。'
      stop()
      $('#start').textContent = '再次回放'
    }
  }, 450)
})
$('#pause').addEventListener('click', () => {
  paused = true
  stop()
  $('#status').textContent = '回放已暂停，可继续或重置。'
  $('#start').textContent = '继续回放'
})
$('#reset').addEventListener('click', reset)
$('#event').addEventListener('change', () => {
  current = $<HTMLSelectElement>('#event').value as typeof current
  reset()
  letter()
})
window.addEventListener('pagehide', () => clearInterval(timer))
letter()

void announceReady('resend')
