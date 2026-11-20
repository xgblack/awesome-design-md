import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const models = {
  text: {
    command: 'local-loom run loom-text',
    note: '文本模型 · 演示容量 1.2 GB · 适合摘要与整理。此信息不对应真实可下载模型。',
  },
  code: {
    command: 'local-loom run loom-code',
    note: '代码模型 · 演示容量 2.4 GB · 适合阅读与解释代码，不执行代码。',
  },
  vision: {
    command: 'local-loom run loom-vision',
    note: '图像模型 · 演示容量 3.1 GB · 只使用预置图像说明，不上传图片。',
  },
}
const samples = {
  summary: {
    model: 'text',
    prompt: '总结这份会议记录：团队先完成文档搜索，再安排发布复核；周五检查遗漏事项。',
    response: '固定摘要：\n1. 先完成文档搜索。\n2. 随后安排发布复核。\n3. 周五检查遗漏事项。',
  },
  explain: {
    model: 'code',
    prompt: '解释函数：const unique = (items) => [...new Set(items)]',
    response:
      '固定说明：Set 按首次出现的顺序保留唯一值；展开运算符将其转回数组。函数不修改原数组。',
  },
  describe: {
    model: 'vision',
    prompt: '描述预置图像说明：一张白色桌面上放着笔记本与一杯茶。',
    response:
      '固定图像说明：白色桌面上，一本笔记本与茶杯并排放置。此处没有接收图片或运行视觉模型。',
  },
}
function model() {
  const m = models[$<HTMLSelectElement>('#model').value as keyof typeof models]
  $('#command').textContent = m.command
  $('#model-note').textContent = m.note
  $('#feedback').textContent = ''
}
function preset() {
  const s = samples[$<HTMLSelectElement>('#sample').value as keyof typeof samples]
  $<HTMLTextAreaElement>('#input').value = s.prompt
  $<HTMLSelectElement>('#model').value = s.model
  model()
  $('#output').textContent = '配方已就绪。点击查看预置响应。'
  $('#count').textContent = '等待请求'
  $<HTMLButtonElement>('#copy-result').disabled = true
}
$('#model').addEventListener('change', model)
$('#sample').addEventListener('change', preset)
$('#run').addEventListener('click', () => {
  const prompt = $<HTMLTextAreaElement>('#input').value.trim()
  const match = Object.values(samples).find((s) => s.prompt === prompt)
  if (!prompt) {
    $('#feedback').textContent = '请求不能为空，请选择配方或填写内容。'
    return
  }
  if (!match) {
    $('#feedback').textContent = '没有此请求的预置响应。本页不运行真实模型，请选择上方任务配方。'
    return
  }
  if (match.model !== $<HTMLSelectElement>('#model').value) {
    $('#feedback').textContent = '当前模型与任务配方不匹配。请切换为适合该任务的模型。'
    return
  }
  $('#output').textContent = match.response
  $('#count').textContent = '预置响应'
  $('#feedback').textContent = '已显示固定样本，未进行推理。'
  $<HTMLButtonElement>('#copy-result').disabled = false
})
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    $('#feedback').textContent = '已复制。'
  } catch {
    $('#feedback').textContent = '复制不可用，请选中文字后手动复制。'
  }
}
$('#copy-command').addEventListener('click', () => void copy($('#command').textContent ?? ''))
$('#copy-result').addEventListener('click', () => void copy($('#output').textContent ?? ''))
preset()

void announceReady('ollama')
