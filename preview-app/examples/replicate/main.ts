import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const works = [
  { id: 'fold', name: 'Folded silence.', kind: 'shape', desc: '从一张纸的折线，寻找图形的节奏。' },
  {
    id: 'orbit',
    name: 'A different orbit.',
    kind: 'shape',
    desc: '让圆与圆的关系，形成一段不对称的对话。',
  },
  {
    id: 'grain',
    name: 'Warm interruptions.',
    kind: 'texture',
    desc: '细密纹理与硬边形状之间，留下一点温度。',
  },
  {
    id: 'ink',
    name: 'Botanical rhythm.',
    kind: 'texture',
    desc: '重复的墨线，像植物叶脉慢慢展开。',
  },
]
const recipes: Record<string, { model: string; prompt: string }> = {
  fold: {
    model: 'oddments/paperfold',
    prompt: 'A quiet geometric study made from folded cream paper and one sharp orange edge.',
  },
  orbit: {
    model: 'oddments/orbital-vector',
    prompt:
      'Overlapping black and cream circles in an asymmetric orbit, with a single warm accent.',
  },
  grain: {
    model: 'oddments/grain-field',
    prompt: 'A close field of fine warm grain interrupted by a bold orange geometric form.',
  },
  ink: {
    model: 'oddments/organic-lines',
    prompt: 'Repeated botanical ink lines form a calm leaf-like rhythm on a muted paper field.',
  },
}
let current = 'fold'
let lang = 'python'
function code() {
  const w = works.find((x) => x.id === current)!
  $('#work-title').textContent = w.name
  $('#work-description').textContent = w.desc
  const r = recipes[w.id]
  $('#work-model').textContent = 'MODEL / ' + r.model + ' · 虚构示例'
  $('#work-prompt').textContent = r.prompt
  const body = { model: r.model, input: { prompt: r.prompt, seed: 19, output_format: 'svg' } }
  $('#code').textContent =
    lang === 'python'
      ? 'prediction = ' +
        JSON.stringify(body, null, 2) +
        '\n# Prepared request body only.\n# Fictional model; no inference call.'
      : [
          'curl https://api.oddments.example/v1/predictions',
          '  -H "Content-Type: application/json"',
          '  -d ' + JSON.stringify(JSON.stringify(body)),
        ].join(' ' + String.fromCharCode(92) + '\n') +
        '\n# Example-only endpoint; no request is sent.'
  $('#feedback').textContent = ''
  document
    .querySelectorAll<HTMLButtonElement>('[data-lang]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)))
}
function render() {
  const q = $<HTMLInputElement>('#search').value.toLowerCase()
  const kind = $<HTMLSelectElement>('#kind').value
  const list = works.filter(
    (w) => (kind === 'all' || kind === w.kind) && (w.name + w.desc).toLowerCase().includes(q),
  )
  $('#empty').hidden = !!list.length
  $('#gallery').replaceChildren(
    ...list.map((w) => {
      const b = document.createElement('button')
      b.className = 'work'
      b.dataset.work = w.id
      b.setAttribute('aria-pressed', String(current === w.id))
      b.innerHTML = `<div class="art ${w.id}" role="img" aria-label="原创图形实验：${w.name}"></div><div class="work-footer"><b>${w.name}</b><small>${w.kind.toUpperCase()} ↗</small></div>`
      b.addEventListener('click', () => {
        current = w.id
        render()
        code()
        $('#recipe').scrollIntoView({ block: 'start', behavior: 'smooth' })
      })
      return b
    }),
  )
}
$('#search').addEventListener('input', render)
$('#kind').addEventListener('change', render)
document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) =>
  b.addEventListener('click', () => {
    lang = b.dataset.lang!
    code()
  }),
)
$('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#code').textContent ?? '')
    $('#feedback').textContent = '已复制当前配方。'
  } catch {
    $('#feedback').textContent = '无法复制，请选中配方手动复制。'
  }
})
render()
code()

void announceReady('replicate')
