import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/manrope/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

type TemplateKey = 'portfolio' | 'product' | 'workspace'
const templates: Record<
  TemplateKey,
  {
    name: string
    match: string
    label: string
    kicker: string
    description: string
    sections: { title: string; text: string }[]
  }
> = {
  portfolio: {
    name: 'Studio Fieldwork',
    match: '作品集',
    label: 'PORTFOLIO',
    kicker: 'INDEPENDENT DESIGN / SELECTED WORK',
    description: 'Ideas made thoughtful. A small independent studio for useful digital things.',
    sections: [
      {
        title: 'Selected work',
        text: 'Wayfinder — a calmer travel journal. Outline — a reading companion for curious minds.',
      },
      {
        title: 'A little about me',
        text: 'I work between strategy, visual identity and digital experiences.',
      },
      {
        title: 'Let’s make something',
        text: 'Tell your next story here. This is a local prototype; no message will be sent.',
      },
    ],
  },
  product: {
    name: 'Softspace',
    match: '产品',
    label: 'PRODUCT LANDING',
    kicker: 'LESS FRICTION. MORE FLOW.',
    description: 'A shared space for the work that deserves your attention.',
    sections: [
      {
        title: 'Room to think',
        text: 'Keep decisions, references and next steps in one quiet project space.',
      },
      {
        title: 'Made for momentum',
        text: 'A clear project brief, an ordered timeline, and a place to leave useful feedback.',
      },
      {
        title: 'Start with one project',
        text: 'This preview has no sign-up or billing. Adapt the page, then export the HTML.',
      },
    ],
  },
  workspace: {
    name: 'Field Notes Workspace',
    match: '工作台',
    label: 'APP WORKSPACE',
    kicker: 'GOOD WORK, IN PROGRESS.',
    description: 'Three projects. One clear place to begin your day.',
    sections: [
      {
        title: 'Today’s focus',
        text: 'Design review · In progress. Research notes · Ready for feedback.',
      },
      {
        title: 'Project board',
        text: 'Discover → Design → Review. Organize your next step without losing the bigger picture.',
      },
      {
        title: 'Team notes',
        text: 'A static prototype of a team workspace. No accounts, servers or live collaboration.',
      },
    ],
  },
}
let current: TemplateKey = 'portfolio'
let sections: { title: string; text: string }[] = []
function prototype() {
  const t = templates[current]
  const root = $('#prototype')
  root.replaceChildren()
  root.dataset.kind = current
  const nav = document.createElement('div')
  nav.className = 'proto-nav'
  nav.textContent = $<HTMLInputElement>('#plan-title').value.trim() || 'Untitled'
  const label = document.createElement('span')
  label.textContent = t.label
  nav.append(label)
  const hero = document.createElement('header')
  const eyebrow = document.createElement('small')
  eyebrow.textContent = t.kicker
  const title = document.createElement('h2')
  title.textContent = $<HTMLInputElement>('#plan-title').value.trim() || 'Untitled'
  const p = document.createElement('p')
  p.textContent = t.description
  hero.append(eyebrow, title, p)
  const body = document.createElement('div')
  body.className = 'proto-sections'
  sections.forEach((s, i) => {
    const article = document.createElement('article')
    const n = document.createElement('small')
    n.textContent = '0' + (i + 1)
    const h = document.createElement('h3')
    h.textContent = s.title
    const detail = document.createElement('p')
    detail.textContent = s.text
    article.append(n, h, detail)
    body.append(article)
  })
  root.append(nav, hero, body)
}
function render() {
  prototype()
  $('#plan-items').replaceChildren(
    ...sections.map((s, i) => {
      const row = document.createElement('div')
      row.className = 'plan-row'
      const n = document.createElement('span')
      n.textContent = '0' + (i + 1)
      const p = document.createElement('p')
      p.textContent = s.title
      const up = document.createElement('button')
      up.textContent = '↑'
      up.setAttribute('aria-label', '上移第 ' + (i + 1) + ' 章')
      up.disabled = i === 0
      up.addEventListener('click', () => {
        ;[sections[i - 1], sections[i]] = [sections[i], sections[i - 1]]
        render()
        $('#plan-status').textContent = '章节顺序已更新，网页预览与导出同步。'
      })
      row.append(n, p, up)
      return row
    }),
  )
}
function show(key: TemplateKey) {
  current = key
  sections = templates[key].sections.map((s) => ({ ...s }))
  $<HTMLInputElement>('#plan-title').value = templates[key].name
  $('#plan').hidden = false
  $('#feedback').textContent = '预置原型已构建。可编辑名称、调整章节并导出 HTML。'
  $('#plan-status').textContent = ''
  render()
}
$('#prompt-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const text = $<HTMLTextAreaElement>('#prompt').value.trim()
  if (!text) {
    $('#feedback').textContent = '先描述一个网站想法，或选择模板。'
    return
  }
  const keys = (Object.keys(templates) as TemplateKey[]).filter((k) =>
    text.includes(templates[k].match),
  )
  if (keys.length !== 1) {
    $('#feedback').textContent = '此演示不调用 AI。请明确选择一种“作品集 / 产品 / 工作台”模板。'
    return
  }
  show(keys[0])
})
document.querySelectorAll<HTMLButtonElement>('[data-template]').forEach((b) =>
  b.addEventListener('click', () => {
    const key = b.dataset.template as TemplateKey
    $<HTMLTextAreaElement>('#prompt').value = '制作一个' + templates[key].match
    show(key)
  }),
)
$('#plan-title').addEventListener('input', prototype)
$('#download').addEventListener('click', () => {
  const title = $<HTMLInputElement>('#plan-title').value.trim()
  if (!title) {
    $('#plan-status').textContent = '网站名称不能为空。'
    $<HTMLInputElement>('#plan-title').focus()
    return
  }
  const titleNode = document.createElement('title')
  titleNode.textContent = title
  const css =
    '*{box-sizing:border-box}body{margin:0;background:#f7f4ed;color:#27251f;font:16px/1.7 system-ui,sans-serif}.prototype{max-width:1000px;margin:auto;padding:40px}.proto-nav{display:flex;justify-content:space-between;border-bottom:1px solid #ddd7cc;padding-bottom:22px}.proto-nav span,small{font-size:11px;letter-spacing:1px}.prototype header{padding:60px 0}h2{font-size:clamp(34px,7vw,64px);line-height:1.1}.proto-sections{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:24px}article{border-top:1px solid #ddd7cc;padding-top:20px}'
  const html =
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    titleNode.outerHTML +
    '<style>' +
    css +
    '</style></head><body>' +
    $('#prototype').outerHTML +
    '<footer style="padding:30px;text-align:center">Local template prototype · Built with Launchpaper · No online model was used.</footer></body></html>'
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'launchpaper-prototype.html'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  $('#plan-status').textContent = 'HTML 已导出；可以独立打开，未发布到网络。'
})

void announceReady('lovable')
