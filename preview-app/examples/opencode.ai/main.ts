import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const patches = {
  empty: {
    file: 'src/search.ts',
    lines: [
      ['context', ' function first(items) {'],
      ['remove', '-  return items[0].name'],
      ['add', '+  if (!items.length) return "暂无结果"'],
      ['add', '+  return items[0].name'],
      ['context', ' }'],
    ],
  },
  escape: {
    file: 'src/render.ts',
    lines: [
      ['context', ' function show(value) {'],
      ['remove', '-  target.innerHTML = value'],
      ['add', '+  target.textContent = value'],
      ['context', ' }'],
    ],
  },
}
function render() {
  const value = $<HTMLSelectElement>('#patch').value
  const invalid = value === 'invalid'
  $('#agent-task').textContent = invalid
    ? 'Task: inspect an invalid patch. Parsing stopped before a change could be applied.'
    : value === 'empty'
      ? 'Task: handle an empty search result. Review the boundary check before accepting the patch.'
      : 'Task: render user text safely. Review textContent in place of HTML interpretation.'
  $('#parse-error').hidden = !invalid
  $('#diff-output').hidden = invalid
  if (invalid) {
    $('#parse-error').textContent = '无法解析：缺少 @@ hunk 标记。此文件未被执行或应用。'
    $('#stats').textContent = '解析失败'
    $('#summary').textContent = '0 可读变更'
    $('#file').textContent = 'broken.patch'
    return
  }
  const p = patches[value as keyof typeof patches]
  $('#file').textContent = p.file
  const adds = p.lines.filter((x) => x[0] === 'add').length
  const removes = p.lines.filter((x) => x[0] === 'remove').length
  $('#summary').textContent = `+${adds} additions / −${removes} deletion`
  const mode = $<HTMLSelectElement>('#lines').value
  const rows = p.lines.filter((x) => mode === 'all' || x[0] === mode)
  $('#stats').textContent = `${rows.length} 行`
  $('#diff-output').replaceChildren(
    ...rows.map(([kind, text]) => {
      const line = document.createElement('span')
      line.className = 'line ' + kind
      line.textContent = text
      return line
    }),
  )
}
$('#patch').addEventListener('change', render)
$('#lines').addEventListener('change', render)
$('#file').addEventListener('click', () => {
  $('#diff-output').focus()
})
$('#diff-output').tabIndex = 0
render()

void announceReady('opencode.ai')
