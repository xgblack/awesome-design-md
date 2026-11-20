import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
type State = { template: string; title: string; layout: string; color: string }
let state: State = {
    template: 'studio',
    title: 'Interfaces for better days.',
    layout: 'split',
    color: 'lime',
  },
  previous: State | undefined,
  device = 'desktop'
const templates: Record<
  string,
  { brand: string; eyebrow: string; title: string; copy: string; projects: [string, string][] }
> = {
  studio: {
    brand: 'Fieldwork',
    eyebrow: 'INDEPENDENT DIGITAL STUDIO',
    title: 'Interfaces for better days.',
    copy: '为有想法的团队，创造更清晰的数字产品。',
    projects: [
      ['Nori Cloud', '把复杂的云工具，整理成清楚的工作界面。'],
      ['Morrow Goods', '为独立品牌建立更有温度的线上商店。'],
    ],
  },
  journal: {
    brand: 'Ridge Journal',
    eyebrow: 'A JOURNAL OF DESIGN + EVERYDAY LIFE',
    title: 'Small stories. Wider horizons.',
    copy: '记录设计、日常与那些值得仔细观察的小事。',
    projects: [
      ['On noticing', '在匆忙的一天里，练习慢一点看。'],
      ['Material matters', '与创作者一起，理解材料和工作的关系。'],
    ],
  },
}
const palettes: Record<string, [string, string]> = {
  lime: ['#d7eb82', '#151b11'],
  pink: ['#f3b5cd', '#381a2b'],
  blue: ['#3669f5', '#ffffff'],
}
function draw() {
  const t = templates[state.template],
    p = $('#website')
  p.className = `website ${state.layout} ${device === 'mobile' ? 'mobile' : ''}`
  p.style.setProperty('--web-bg', palettes[state.color][0])
  p.style.setProperty('--web-fg', palettes[state.color][1])
  p.style.setProperty('--web-line', state.color === 'blue' ? '#ffffff55' : '#151b1133')
  $('#web-brand').textContent = t.brand
  $('#web-title').textContent = state.title.trim() || 'Your next website'
  $('#web-title').style.fontSize = state.title.length > 45 ? '27px' : ''
  $('#web-eyebrow').textContent = t.eyebrow
  $('#web-copy').textContent = t.copy
  $('#web-foot-name').textContent = t.brand + ' / 2026'
  $('#web-projects').innerHTML = t.projects
    .map(
      (project, i) =>
        `<article><small>0${i + 1} / SELECTED ${state.template === 'studio' ? 'PROJECT' : 'STORY'}</small><h3>${project[0]}</h3><p>${project[1]}</p></article>`,
    )
    .join('')
  $('#error').textContent = !state.title.trim()
    ? '标题为空时不能导出网站。'
    : '修改只在本页生效；导出不会托管或发布。'
  $<HTMLButtonElement>('#export').disabled = !state.title.trim()
  $<HTMLButtonElement>('#undo').disabled = !previous
}
function sync() {
  $<HTMLSelectElement>('#template').value = state.template
  $<HTMLInputElement>('#title').value = state.title
  $<HTMLSelectElement>('#layout').value = state.layout
  $<HTMLSelectElement>('#color').value = state.color
}
for (const id of ['title', 'layout', 'color'])
  $('#' + id).addEventListener('input', () => {
    previous = { ...state }
    state = {
      ...state,
      title: $<HTMLInputElement>('#title').value,
      layout: $<HTMLSelectElement>('#layout').value,
      color: $<HTMLSelectElement>('#color').value,
    }
    draw()
  })
$('#template').addEventListener('change', () => {
  previous = { ...state }
  state.template = $<HTMLSelectElement>('#template').value
  state.title = templates[state.template].title
  sync()
  draw()
})
document.querySelectorAll<HTMLButtonElement>('[data-device]').forEach(
  (b) =>
    (b.onclick = () => {
      device = b.dataset.device!
      document
        .querySelectorAll('[data-device]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      draw()
    }),
)
$('#undo').onclick = () => {
  if (!previous) return
  state = previous
  previous = undefined
  sync()
  draw()
}
$('#properties').onsubmit = (e) => e.preventDefault()
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )
$('#export').onclick = () => {
  if (!state.title.trim()) return
  const t = templates[state.template],
    title = escape(state.title.trim()),
    [bg, fg] = palettes[state.color]
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — ${t.brand}</title><style>*{box-sizing:border-box}body{margin:0;background:${bg};color:${fg};font-family:Arial,sans-serif}header,main,footer{padding:28px 7vw}header{display:flex;justify-content:space-between;border-bottom:1px solid}a{color:inherit}section{padding:40px 0}h1{font-size:clamp(40px,7vw,100px);line-height:1.04;letter-spacing:-.04em;overflow-wrap:anywhere;max-width:1000px}p{line-height:1.7}nav a{margin-left:18px}#work{display:grid;grid-template-columns:1fr 1fr;gap:30px;border-top:1px solid}#work article{padding:30px 0}footer{border-top:1px solid}main{text-align:${state.layout === 'centered' ? 'center' : 'left'}}@media(max-width:600px){header{display:block}nav{margin-top:20px}#work{grid-template-columns:1fr}}</style></head><body><header><strong>${t.brand}</strong><nav><a href="#work">Work</a><a href="#about">About</a></nav></header><main><section><small>${t.eyebrow}</small><h1>${title}</h1><p>${t.copy}</p><a href="#work">Explore selected work ↗</a></section><section id="work">${t.projects.map((p, i) => `<article><small>0${i + 1}</small><h2>${p[0]}</h2><p>${p[1]}</p></article>`).join('')}</section><section id="about"><h2>About ${t.brand}</h2><p>原创本地网站演示，不代表真实客户或机构。</p></section></main><footer>${t.brand} / 2026 · 静态导出，不涉及托管或发布。</footer></body></html>`
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'structure-website.html'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
draw()

void announceReady('webflow')
