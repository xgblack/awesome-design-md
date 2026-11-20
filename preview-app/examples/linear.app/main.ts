import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
type Issue = { id: string; title: string; owner: string; state: string; copy: string }
const issues: Issue[] = [
  {
    id: 'VEC-142',
    title: '修复键盘导航中的焦点跳转',
    owner: '林',
    state: '已阻塞',
    copy: '等待筛选面板的可访问性复核。范围：键盘上下选择以及 Escape 关闭。',
  },
  {
    id: 'VEC-139',
    title: '完善首次使用的项目引导',
    owner: '许',
    state: '进行中',
    copy: '让第一次打开项目的人理解下一步，不增加多余弹窗。',
  },
  {
    id: 'VEC-136',
    title: '补齐发布说明与迁移示例',
    owner: '林',
    state: '进行中',
    copy: '包含配置变更和旧版本升级注意事项。',
  },
  {
    id: 'VEC-128',
    title: '减少长列表重复请求',
    owner: '许',
    state: '已完成',
    copy: '本条为固定演示任务，并不代表真实基准测试。',
  },
]
let current: Issue | undefined
function render() {
  const shown = issues
    .filter(
      (x) =>
        ($('#owner') as HTMLSelectElement).value === 'all' ||
        x.owner === ($('#owner') as HTMLSelectElement).value,
    )
    .filter((x) => !($('#blocked') as HTMLInputElement).checked || x.state === '已阻塞')
  $('#rows').innerHTML = shown
    .map(
      (x) =>
        `<button class="issue" data-id="${x.id}"><small>${x.id}</small><span>${x.title}</span><span class="owner">${x.owner}</span><span class="status">${x.state}</span></button>`,
    )
    .join('')
  $('#empty').hidden = shown.length > 0
  const n = issues.filter((x) => x.state === '已完成').length
  $('#count').textContent = `${n} / ${issues.length} 项已完成 · 固定发行清单`
  $('#progress').style.width = `${(n / issues.length) * 100}%`
  document.querySelectorAll<HTMLButtonElement>('[data-id]').forEach(
    (b) =>
      (b.onclick = () => {
        current = issues.find((x) => x.id === b.dataset.id)!
        $('#issue-id').textContent = current.id
        $('#issue-title').textContent = current.title
        $('#issue-copy').textContent = current.copy
        ;($('#state') as HTMLSelectElement).value = current.state
        ;($('#detail') as HTMLDialogElement).showModal()
      }),
  )
}
$('#owner').addEventListener('change', render)
$('#blocked').addEventListener('change', render)
$('#clear').onclick = () => {
  ;($('#owner') as HTMLSelectElement).value = 'all'
  ;($('#blocked') as HTMLInputElement).checked = false
  render()
}
$('#cancel').onclick = () => ($('#detail') as HTMLDialogElement).close()
$('#issue-form').onsubmit = (e) => {
  e.preventDefault()
  if (current) current.state = ($('#state') as HTMLSelectElement).value
  ;($('#detail') as HTMLDialogElement).close()
  render()
}
render()

void announceReady('linear.app')
