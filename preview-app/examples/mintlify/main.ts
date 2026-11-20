import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const code: Record<string, string> = {
  curl: 'curl https://demo.invalid/readings/nimbus-demo-01 \\\n  -H "Authorization: Bearer DEMO_TOKEN"',
  python:
    'import requests\n\nresponse = requests.get(\n    "https://demo.invalid/readings/nimbus-demo-01",\n    headers={"Authorization": "Bearer DEMO_TOKEN"}\n)\nprint(response.json())',
}
let language = 'curl'
function renderCode() {
  $('#code').textContent = code[language]
  document
    .querySelectorAll<HTMLButtonElement>('[data-language]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.language === language)))
  $('#copied').textContent = ''
}
document.querySelectorAll<HTMLButtonElement>('[data-language]').forEach((b) =>
  b.addEventListener('click', () => {
    language = b.dataset.language!
    renderCode()
  }),
)
$('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(code[language])
    $('#copied').textContent = '已复制当前语言请求。'
  } catch {
    $('#copied').textContent = '无法复制，请选中代码手动复制。'
  }
})
$('#search').addEventListener('input', () => {
  const q = $<HTMLInputElement>('#search').value.trim().toLowerCase()
  let count = 0
  document.querySelectorAll<HTMLElement>('[data-doc]').forEach((s) => {
    const show = !q || (s.dataset.doc + ' ' + s.textContent).toLowerCase().includes(q)
    s.hidden = !show
    if (show) count++
  })
  $('#search-info').textContent = count
    ? count + ' 个匹配章节'
    : '没有匹配章节，请更换关键词；当前搜索已保留。'
})
renderCode()

void announceReady('mintlify')
