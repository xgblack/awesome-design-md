import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const palette = $<HTMLDialogElement>('#palette')
let trigger: HTMLElement | null = null
let selected = 0
const all = [
  { id: 'upper', name: 'Convert to uppercase', type: 'TEXT' },
  { id: 'unique', name: 'Remove duplicate lines', type: 'TEXT' },
  { id: 'hex', name: 'Inspect HEX color', type: 'COLOR' },
]
let visible = all
function render() {
  const q = $<HTMLInputElement>('#search').value.trim().toLowerCase()
  visible = all.filter(
    (c) =>
      (c.type === 'TEXT'
        ? $<HTMLInputElement>('#text-extension').checked
        : $<HTMLInputElement>('#color-extension').checked) && c.name.toLowerCase().includes(q),
  )
  selected = Math.min(selected, Math.max(0, visible.length - 1))
  $('#commands').replaceChildren()
  if (!visible.length) {
    const p = document.createElement('p')
    p.textContent = 'No commands found. 清空搜索或启用扩展。'
    $('#commands').append(p)
  }
  visible.forEach((c, i) => {
    const b = document.createElement('button')
    b.className = 'command'
    b.setAttribute('role', 'option')
    b.setAttribute('aria-selected', String(i === selected))
    b.innerHTML = `<span>${c.name}</span><small>${c.type}</small>`
    b.addEventListener('click', () => {
      selected = i
      render()
      $<HTMLTextAreaElement>('#input').focus()
    })
    $('#commands').append(b)
  })
  $('#input-label').textContent =
    visible[selected]?.id === 'hex' ? 'HEX 颜色，例如 #ff6633' : '要转换的文字'
  $<HTMLButtonElement>('#execute').disabled = !visible.length
}
function open(button: HTMLElement) {
  trigger = button
  palette.showModal()
  render()
  $<HTMLInputElement>('#search').focus()
}
$('#open').addEventListener('click', () => open($('#open')))
$('#open-header').addEventListener('click', () => open($('#open-header')))
$('#close').addEventListener('click', () => palette.close())
palette.addEventListener('close', () => trigger?.focus())
$('#search').addEventListener('input', () => {
  selected = 0
  render()
})
$('#search').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    selected =
      (selected + (e.key === 'ArrowDown' ? 1 : -1) + Math.max(visible.length, 1)) %
      Math.max(visible.length, 1)
    render()
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    $<HTMLTextAreaElement>('#input').focus()
  }
})
function execute() {
  const command = visible[selected]
  if (!command) return
  const text = $<HTMLTextAreaElement>('#input').value
  if (!text.trim()) {
    $('#result').textContent = '请先输入内容。'
    return
  }
  if (command.id === 'hex') {
    const match = text.trim().match(/^#?([0-9a-f]{6})$/i)
    if (!match) {
      $('#result').textContent = '请输入六位 HEX，例如 #ff6633。'
      return
    }
    const hex = match[1]
    $('#result').textContent =
      'RGB(' + [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ') + ')'
  } else
    $('#result').textContent =
      command.id === 'upper'
        ? text.toUpperCase()
        : [
            ...new Set(
              text
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
            ),
          ].join('\n')
}
$('#execute').addEventListener('click', execute)
;['text-extension', 'color-extension'].forEach((id) =>
  $('#' + id).addEventListener('change', () => {
    $('#extension-status').textContent =
      [
        $<HTMLInputElement>('#text-extension').checked,
        $<HTMLInputElement>('#color-extension').checked,
      ].filter(Boolean).length + ' 个扩展已启用。'
    render()
  }),
)
render()

void announceReady('raycast')
