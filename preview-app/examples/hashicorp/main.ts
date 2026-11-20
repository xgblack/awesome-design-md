import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const products = {
  terrain: {
    color: '#8964ec',
    symbol: '▱',
    category: 'INFRASTRUCTURE AS CODE',
    title: 'Build a reproducible foundation.',
    copy: '声明你需要的资源，把变更变成可审阅的计划。',
    resources: [
      {
        level: 'intro',
        title: '从意图到计划',
        body: '先写出资源的期望状态，再把差异作为计划审阅。计划不是执行；确认变更边界后才进入真实操作。此资料仅教学。',
      },
      {
        level: 'advanced',
        title: '让状态成为团队语言',
        body: '共享状态要有明确的所有权和并发保护。避免以本地文件副本代替协作边界；失败时先核对实际资源而非重复执行。',
      },
    ],
  },
  vault: {
    color: '#ffd45a',
    symbol: '◇',
    category: 'IDENTITY AND SECRETS',
    title: 'Trust should have a lifetime.',
    copy: '理解短期身份、最小权限与凭据轮换。',
    resources: [
      {
        level: 'intro',
        title: '短期凭据为什么更可靠',
        body: '将凭据的有效期与任务时长联系起来。最小权限限制可以做什么，短期令牌限制可以做多久。不要在前端存入真实密钥。',
      },
    ],
  },
  mesh: {
    color: '#41c5dd',
    symbol: '⌁',
    category: 'SERVICE NETWORKING',
    title: 'Give every connection a purpose.',
    copy: '从服务发现到授权连接，让网络边界可理解。',
    resources: [
      {
        level: 'intro',
        title: '发现一个服务',
        body: '服务发现解决的是地址与身份的映射，而不是自动授予访问权限。对连接进行授权仍然是独立职责。',
      },
      {
        level: 'advanced',
        title: '故障路径与重试边界',
        body: '重试必须建立在可重复安全的操作上。记录请求身份，区分连接失败与服务处理失败，不以无限重试掩盖故障。',
      },
    ],
  },
}
let product: keyof typeof products = 'terrain'
let currentButton: HTMLButtonElement | null = null
function render() {
  const p = products[product]
  document.documentElement.style.setProperty('--product', p.color)
  $('#product-symbol').textContent = p.symbol
  $('#category').textContent = p.category
  $('#product-title').textContent = p.title
  $('#product-copy').textContent = p.copy
  document
    .querySelectorAll<HTMLButtonElement>('[data-product]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.product === product)))
  const resources = p.resources.filter(
    (r) =>
      $<HTMLSelectElement>('#level').value === 'all' ||
      r.level === $<HTMLSelectElement>('#level').value,
  )
  $('#empty').hidden = !!resources.length
  $('#resources').replaceChildren(
    ...resources.map((r) => {
      const b = document.createElement('button')
      b.className = 'resource'
      b.innerHTML = `<small>${r.level === 'intro' ? 'GET STARTED' : 'DEEP DIVE'}</small><span>${r.title}</span><span>↗</span>`
      b.addEventListener('click', () => {
        currentButton = b
        $('#read-title').textContent = r.title
        $('#read-body').textContent = r.body
        $('#reading').hidden = false
        $('#reading').focus()
      })
      return b
    }),
  )
  $('#reading').hidden = true
}
document.querySelectorAll<HTMLButtonElement>('[data-product]').forEach((b) =>
  b.addEventListener('click', () => {
    product = b.dataset.product as keyof typeof products
    render()
  }),
)
$('#level').addEventListener('change', render)
$('#close').addEventListener('click', () => {
  $('#reading').hidden = true
  currentButton?.focus()
})
render()

void announceReady('hashicorp')
