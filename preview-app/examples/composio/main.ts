import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const recipes = {
  digest: {
    input: {
      ticket: 'BUG-014',
      request: 'Route a failed payment report',
      scopes: ['tickets:read', 'labels:write'],
    },
    steps: [
      'tickets.get({id:"BUG-014"})',
      'scope.check("labels:write")',
      'tickets.label({team:"payments"})',
    ],
    output: { ticket: 'BUG-014', team: 'payments', label: 'needs-triage', source: 'local_fixture' },
  },
  checklist: {
    input: {
      question: 'What is the rollback policy?',
      scopes: ['knowledge:read'],
      collection: 'engineering-runbooks',
    },
    steps: [
      'knowledge.search({query:"rollback"})',
      'scope.check("knowledge:read")',
      'knowledge.read({document:"runbook-03"})',
    ],
    output: {
      document: 'runbook-03',
      answer:
        'Verify the previous release, preserve logs, then follow the approved rollback checklist.',
      source: 'local_fixture',
    },
  },
}
let key: keyof typeof recipes = 'digest'
let step = 0
let failed = false
function render() {
  const r = recipes[key]
  $('#input').textContent = JSON.stringify(r.input, null, 2)
  $('#steps').innerHTML = r.steps
    .map(
      (s, i) =>
        `<li class="${i < step ? 'done' : ''}"><span>${s}</span><span>${i < step ? '✓' : '○'}</span></li>`,
    )
    .join('')
  $('#progress').textContent = step + ' / 3'
  $('#state').textContent = failed ? 'DENIED' : step === 3 ? 'COMPLETE' : 'WAITING'
  $('#result').textContent = failed
    ? '工具scope校验失败。未发送工具调用、未生成输出；取消权限失败注入后重置重试。'
    : step === 3
      ? JSON.stringify(r.output, null, 2)
      : '完成三个工具边界步骤后，固定输出将在这里出现。'
  $('#result').style.whiteSpace = 'pre-wrap'
  $<HTMLButtonElement>('#next').disabled = failed || step === 3
}
function reset() {
  step = 0
  failed = false
  $('#trace').textContent = 'Ready. Tool connections are local fixtures.'
  render()
}
$('#next').addEventListener('click', () => {
  if (step === 1 && $<HTMLInputElement>('#inject').checked) {
    failed = true
    $('#trace').textContent += '\n[denied] required scope missing'
    render()
    return
  }
  step++
  $('#trace').textContent += '\n[fixture ' + step + '] ' + recipes[key].steps[step - 1]
  render()
})
$('#reset').addEventListener('click', reset)
$('#recipe').addEventListener('change', () => {
  key = $<HTMLSelectElement>('#recipe').value as typeof key
  reset()
})
reset()

void announceReady('composio')
