import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const names = ['COLLECT', 'VERIFY', 'SUMMARIZE']
let stage = -1
let selected = 0
let failed = false
let timer: ReturnType<typeof setInterval> | undefined
function detail() {
  document
    .querySelectorAll<HTMLButtonElement>('[data-node]')
    .forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.node) === selected)))
  $('#node-name').textContent = names[selected]
  const missing = $<HTMLSelectElement>('#scenario').value === 'missing'
  const input =
    selected === 0
      ? {
          ticket_id: 'BUG-014',
          source: missing ? null : 'ticket_investigation.fixture',
          evidence_items: missing ? 0 : 3,
        }
      : selected === 1
        ? {
            required: ['ticket_id', 'source', 'evidence_items'],
            source: missing ? null : 'ticket_investigation.fixture',
          }
        : { verified: stage >= 1 && !failed }
  const output =
    failed && selected === 1
      ? 'ERROR: required source missing'
      : stage >= selected && !(failed && selected >= 1)
        ? [
            '3 ticket evidence items collected',
            'Required fields verified',
            '工单 BUG-014 的失败发生在资源加载阶段；三条演示证据均保留来源。',
          ][selected]
        : 'No output yet. This node has not completed.'
  $('#parameters').textContent =
    'INPUT\n' + JSON.stringify(input, null, 2) + '\n\nOUTPUT\n' + output
  names.forEach(
    (_, i) =>
      ($('#node-state-' + i).textContent =
        failed && i === 1 ? 'ERROR' : stage >= i ? 'COMPLETE' : 'WAITING'),
  )
}
function stop() {
  clearInterval(timer)
  $<HTMLButtonElement>('#run').disabled = false
  $<HTMLButtonElement>('#cancel').disabled = true
  $<HTMLSelectElement>('#scenario').disabled = false
}
$('#run').addEventListener('click', () => {
  stop()
  stage = -1
  failed = false
  $('#log').textContent = '[replay] Begin fixed fixture.'
  $('#status').textContent = '本地脚本回放中；未调用 Agent。'
  $<HTMLButtonElement>('#run').disabled = true
  $<HTMLButtonElement>('#cancel').disabled = false
  $<HTMLSelectElement>('#scenario').disabled = true
  detail()
  timer = setInterval(() => {
    stage++
    if (stage === 1 && $<HTMLSelectElement>('#scenario').value === 'missing') {
      failed = true
      $('#status').textContent = '缺少来源材料，核对节点停止，摘要未生成。'
      $('#log').textContent += '\n[verify] ERROR required source missing'
      stop()
      selected = 1
      detail()
      return
    }
    $('#log').textContent += '\n[' + names[stage].toLowerCase() + '] fixed step complete'
    selected = stage
    detail()
    if (stage === 2) {
      $('#status').textContent = '回放完成。所有输出来自本地固定脚本。'
      stop()
    }
  }, 450)
})
$('#cancel').addEventListener('click', () => {
  stop()
  $('#status').textContent = '回放已取消，未完成节点保持无输出。'
})
$('#scenario').addEventListener('change', () => {
  stage = -1
  failed = false
  $('#status').textContent = '固定脚本已切换，等待回放。'
  $('#log').textContent = 'No steps have run.'
  detail()
})
document.querySelectorAll<HTMLButtonElement>('[data-node]').forEach((b) =>
  b.addEventListener('click', () => {
    selected = Number(b.dataset.node)
    detail()
  }),
)
$('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#recipe-text').textContent ?? '')
    $('#copied').textContent = '配方已复制。'
  } catch {
    $('#copied').textContent = '无法复制，请选中配方手动复制。'
  }
})
window.addEventListener('pagehide', () => clearInterval(timer))
detail()

void announceReady('voltagent')
