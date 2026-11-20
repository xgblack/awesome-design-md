import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/ibm-plex-sans/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

let n = 0
let saved = false
let lang = 'js'
const logs: { name: string; property: string }[] = []
function add(name: string, property: string) {
  n++
  logs.push({ name, property })
  $('#empty').hidden = true
  const li = document.createElement('li')
  li.textContent = '#' + n + ' ' + name
  const small = document.createElement('small')
  small.textContent = property + ' / source: local_demo'
  li.append(small)
  $('#events').prepend(li)
}
$('#view').addEventListener('click', () => {
  add('sample_viewed', 'book_id: slower-city')
  $('#shop-status').textContent = '样本已展开：这本册子记录三个街角的步行观察。'
})
$('#save').addEventListener('click', () => {
  saved = !saved
  add(saved ? 'reading_list_added' : 'reading_list_removed', 'book_id: slower-city')
  $('#save').textContent = saved ? '从清单移除' : '加入阅读清单'
  $('#shop-status').textContent = saved ? '已加入本次阅读清单。' : '已从本次阅读清单移除。'
})
$('#clear').addEventListener('click', () => {
  logs.length = 0
  n = 0
  $('#events').replaceChildren()
  $('#empty').hidden = false
})
function code() {
  $('#snippet').textContent =
    lang === 'js'
      ? `// Example only — no analytics SDK loaded.\ntrack("sample_viewed", {\n  book_id: "slower-city",\n  source: "local_demo"\n});`
      : `# Example only — not executed.\ntrack("sample_viewed", {\n  "book_id": "slower-city",\n  "source": "local_demo"\n})`
  document
    .querySelectorAll<HTMLButtonElement>('[data-lang]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)))
  $('#copied').textContent = ''
}
document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) =>
  b.addEventListener('click', () => {
    lang = b.dataset.lang!
    code()
  }),
)
$('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#snippet').textContent ?? '')
    $('#copied').textContent = '代码已复制。'
  } catch {
    $('#copied').textContent = '无法复制，请选中代码手动复制。'
  }
})
code()

void announceReady('posthog')
