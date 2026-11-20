import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource/saira-condensed/800.css'
import '@fontsource-variable/jetbrains-mono'
document.querySelectorAll<HTMLButtonElement>('[data-topic]').forEach(
  (b) =>
    (b.onclick = () => {
      let count = 0
      document.querySelectorAll<HTMLElement>('[data-story]').forEach((x) => {
        x.hidden = b.dataset.topic !== 'all' && x.dataset.story !== b.dataset.topic
        if (!x.hidden) count++
      })
      $('#stream-status').textContent = `${count} 条固定报道，按时间顺序排列。`
      document
        .querySelectorAll('[data-topic]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
document.querySelectorAll<HTMLButtonElement>('[data-expand]').forEach(
  (b) =>
    (b.onclick = () => {
      const target = $('#story-' + b.dataset.expand)
      target.hidden = !target.hidden
      b.setAttribute('aria-expanded', String(!target.hidden))
      const topic = b.dataset.expand === '0' ? '器材' : b.dataset.expand === '1' ? '现场' : '设计'
      b.textContent =
        (target.hidden ? '展开' : '收起') + topic + '笔记 ' + (target.hidden ? '＋' : '−')
    }),
)

void announceReady('theverge')
