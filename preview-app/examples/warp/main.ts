import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const lessons = {
  network: {
    title: '服务为什么没有响应？',
    task: '先查看目录，再读取 status 文件。你不需要猜测；每一条线索都可以验证。',
    files: 'status  note.txt',
    status: 'service: running\\nport: 4300\\nexpected: 4400',
    note: '端口映射需要核对。',
    hints: [
      '试试 ls：目录中有一份 status。',
      '输入 cat status，比较 port 与 expected。',
      '服务运行在 4300，但期望端口是 4400。',
    ],
  },
  files: {
    title: '配置线索来自哪里？',
    task: '查看目录并读取 note.txt，追踪开发配置说明的来源。',
    files: 'note.txt  status',
    status: 'directory: /demo\\nfiles: 2',
    note: 'Config notes: /demo/config/README. 此路径为虚构开发环境，不可访问宿主文件。',
    hints: [
      '先用 ls 查看目录。',
      '输入 cat note.txt。',
      '配置说明指向 /demo/config/README；无需执行真实 cd。',
    ],
  },
}
let lesson: keyof typeof lessons = 'network'
let hint = 0
function append(text: string, kind = '') {
  const p = document.createElement('p')
  p.textContent = text.replaceAll('\\n', '\n')
  p.className = kind
  $('#output').append(p)
  $('#output').scrollTop = $('#output').scrollHeight
}
$('#command-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const input = $<HTMLInputElement>('#command')
  const cmd = input.value.trim()
  if (!cmd) return
  append('› ' + cmd, 'echo')
  const l = lessons[lesson]
  const result: Record<string, string> = {
    help: '允许：help · ls · cat status · cat note.txt · clear',
    ls: l.files,
    'cat status': l.status,
    'cat note.txt': l.note,
  }
  if (cmd === 'clear') $('#output').replaceChildren()
  else
    append(
      result[cmd] ??
        '未知命令。仅允许 help / ls / cat status / cat note.txt / clear；未执行宿主命令。',
    )
  input.value = ''
})
$('#hint').addEventListener('click', () => {
  $('#hint-text').textContent = lessons[lesson].hints[Math.min(hint++, 2)]
})
$('#lesson').addEventListener('change', () => {
  lesson = $<HTMLSelectElement>('#lesson').value as keyof typeof lessons
  hint = 0
  $('#task-title').textContent = lessons[lesson].title
  $('#task').textContent = lessons[lesson].task
  $('#hint-text').textContent = ''
  $('#output').replaceChildren()
  append('已选择新练习，输入 help 开始。')
})
$('#reset').addEventListener('click', () => {
  $('#output').replaceChildren()
  append('输出已重置；当前练习保持不变。')
  $<HTMLInputElement>('#command').value = ''
})

$('#agent-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const text = $<HTMLInputElement>('#agent-question').value.trim()
  if (!text) {
    $('#agent-response').textContent = '先写出要核对的开发问题。'
    return
  }
  const selected = /配置|来源|文件/.test(text)
    ? 'files'
    : /服务|端口|响应/.test(text)
      ? 'network'
      : null
  if (!selected) {
    $('#agent-response').textContent =
      '没有此问题的预置指引。请询问服务端口或配置来源；没有调用模型或执行命令。'
    return
  }
  if (selected !== lesson) {
    $<HTMLSelectElement>('#lesson').value = selected
    $('#lesson').dispatchEvent(new Event('change'))
  }
  $('#agent-response').textContent =
    '预置指引：' +
    lessons[selected].task +
    ' 建议先运行 ls，再读取对应文件；所有操作仍在本地白名单中。'
})
void announceReady('warp')
