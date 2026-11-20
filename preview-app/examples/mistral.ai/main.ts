import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const records = [
  {
    type: 'text',
    id: 'small',
    title: 'Frontier Small',
    desc: '用于摘要与短文档整理的开放文本模型样本。',
    context: '32K fixture',
    response: '发布前先复核文档，再验证构建，最后整理变更说明。',
  },
  {
    type: 'code',
    id: 'code',
    title: 'Frontier Code',
    desc: '用于代码阅读与解释的开放代码模型样本，不执行代码。',
    context: '64K fixture',
    response: '这段函数将迭代值去重并保留原顺序；边界行为应在调用前通过测试确认。',
  },
  {
    type: 'text',
    id: 'large',
    title: 'Frontier Large',
    desc: '用于长材料梳理的文本模型样本；示意上下文不代表真实性能。',
    context: '128K fixture',
    response: '材料强调三件事：明确来源、保留版本，以及把结论和原文放在同一视野内。',
  },
]
let lang: 'python' | 'js' = 'python'
let selected = 'small'
function snippet() {
  const prompt =
    selected === 'code'
      ? 'Explain a small deduplication function.'
      : 'Summarize the release notes in three clear steps.'
  if (lang === 'python')
    return (
      'from frontier import Client\n\nclient = Client(api_key="YOUR_API_KEY")\nresponse = client.chat.complete(\n    model="frontier-' +
      selected +
      '",\n    messages=[{"role": "user",\n               "content": "' +
      prompt +
      '"}]\n)\n# Fictional SDK; no request is made here.'
    )
  return (
    'curl https://api.frontier.example/v1/chat/completions \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'' +
    JSON.stringify(
      { model: 'frontier-' + selected, messages: [{ role: 'user', content: prompt }] },
      null,
      2,
    ) +
    "'\n# Example-only endpoint; do not execute."
  )
}
function code() {
  $('#code').textContent = snippet()
  $('#response').textContent = records.find((r) => r.id === selected)!.response
  document
    .querySelectorAll<HTMLButtonElement>('[data-lang]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)))
  $('#copied').textContent = '虚构 API / SDK 示意；本页不执行请求。'
}
function select(id: string) {
  selected = id
  $<HTMLSelectElement>('#model').value = id
  code()
}
function render() {
  const type = $<HTMLSelectElement>('#terrain').value
  const list = records.filter((r) => type === 'all' || r.type === type)
  $('#records').replaceChildren(
    ...list.map((r) => {
      const a = document.createElement('article')
      a.className = 'record'
      a.innerHTML = `<small>${r.type.toUpperCase()} / OPEN</small><div><h3>${r.title}</h3><button class="model-choice" data-model="${r.id}">查看调用配方 ↗</button></div><p>${r.desc}</p><b>${r.context}</b>`
      a.querySelector('button')!.addEventListener('click', () => {
        select(r.id)
        $('#recipe').scrollIntoView({ block: 'start', behavior: 'smooth' })
      })
      return a
    }),
  )
  $('#empty').hidden = !!list.length
}
$('#terrain').addEventListener('change', render)
$('#model').addEventListener('change', () => select($<HTMLSelectElement>('#model').value))
document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) =>
  b.addEventListener('click', () => {
    lang = b.dataset.lang as typeof lang
    code()
  }),
)
$('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(snippet())
    $('#copied').textContent = '已复制当前模型与语言配方。'
  } catch {
    $('#copied').textContent = '无法复制，请选中代码手动复制。'
  }
})
render()
code()

void announceReady('mistral.ai')
