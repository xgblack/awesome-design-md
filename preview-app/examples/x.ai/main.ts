import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const entries = [
  {
    year: '2026',
    topic: 'reasoning',
    date: '19 NOV 2026',
    title: 'When a question needs another question.',
    desc: '关于不完整上下文的推理练习。',
    body: '这份原创草稿建议先识别缺失前提，再选择回答方式。它不声称任何模型已具备该能力；只有一组可阅读的教学问题。',
  },
  {
    year: '2026',
    topic: 'evaluation',
    date: '08 JUN 2026',
    title: 'What does a useful test reveal?',
    desc: '让观察有能力推翻假设，而不只是展示成功。',
    body: '一次验证必须在承诺不成立时呈现不同结果。固定演示可以帮助解释方法，但不能代替真实环境中的证据。',
  },
  {
    year: '2025',
    topic: 'reasoning',
    date: '12 DEC 2025',
    title: 'A boundary around the answer.',
    desc: '把已知、推测与未知分别写清楚。',
    body: '研究记录应区分观察与解释。这里的所有文字由本项目原创，不引用不存在的论文或发布消息。',
  },
]
function render() {
  const result = entries.filter(
    (e) =>
      ($<HTMLSelectElement>('#year').value === 'all' ||
        e.year === $<HTMLSelectElement>('#year').value) &&
      ($<HTMLSelectElement>('#topic').value === 'all' ||
        e.topic === $<HTMLSelectElement>('#topic').value),
  )
  $('#count').textContent = result.length + ' BULLETINS / ORIGINAL FICTIONAL NOTES'
  $('#empty').hidden = !!result.length
  $('#entries').innerHTML = result
    .map(
      (e) =>
        `<article class="entry"><span>${e.date}</span><div><h3>${e.title}</h3><p>${e.desc}</p></div><small>${e.topic.toUpperCase()}</small><details><summary>Read the note ↗</summary>${e.body}</details></article>`,
    )
    .join('')
}
$('#year').addEventListener('change', render)
$('#topic').addEventListener('change', render)
$('#compare-button').addEventListener('click', () => {
  const left = $<HTMLSelectElement>('#left').value
  const right = $<HTMLSelectElement>('#right').value
  if (left === right) {
    $('#diff').textContent = '请选择两个不同版本；相同草稿没有可比较的增删。'
    return
  }
  const forward = left === 'v1'
  $('#diff').innerHTML =
    `<p class="label">${forward ? 'DRAFT 01 → DRAFT 02' : 'DRAFT 02 → DRAFT 01'}</p><p>＝ 保留：研究记录应该区分观察与解释。</p><p>− 删除：${forward ? '每个问题都应立即得到一个答案。' : '缺少前提时，应先说明不确定性，再请求必要信息。'}</p><p>+ 新增：${forward ? '缺少前提时，应先说明不确定性，再请求必要信息。' : '每个问题都应立即得到一个答案。'}</p>`
})
render()

void announceReady('x.ai')
