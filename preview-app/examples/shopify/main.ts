import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
type Product = {
  id: string
  title: string
  series: string
  stock: number
  published: boolean
  image: string
  finish: string
}
const products: Product[] = [
  {
    id: 'bowl',
    title: 'Shallow bowl',
    series: 'table',
    stock: 12,
    published: true,
    image: new URL('./assets/bowl-object.svg', import.meta.url).href,
    finish: '餐桌 / 亚光釉',
  },
  {
    id: 'cup',
    title: 'Morning cup',
    series: 'ritual',
    stock: 8,
    published: true,
    image: new URL('./assets/cup-object.svg', import.meta.url).href,
    finish: '日常 / 石灰釉',
  },
  {
    id: 'vase',
    title: 'Long neck',
    series: 'table',
    stock: 5,
    published: false,
    image: new URL('./assets/vase-object.svg', import.meta.url).href,
    finish: '餐桌 / 原土色',
  },
]
let current = products[0]
const editor = $<HTMLDialogElement>('#editor')
function edit(p: Product) {
  current = p
  $<HTMLInputElement>('#product-title').value = p.title
  $<HTMLInputElement>('#product-stock').value = String(p.stock)
  $<HTMLInputElement>('#product-published').checked = p.published
  $('#edit-status').textContent = '仅当前页面内存，未更新真实商店。'
  editor.showModal()
}
function render() {
  const series = $<HTMLSelectElement>('#series').value,
    items = products.filter((p) => series === 'all' || series === p.series)
  $('#objects').replaceChildren(
    ...items.map((p) => {
      const a = document.createElement('article')
      if (p.published) {
        const img = document.createElement('img')
        img.src = p.image
        img.alt = p.title + ' 原创陶器渲染'
        a.append(img)
      } else {
        const placeholder = document.createElement('div')
        placeholder.className = 'unpublished'
        placeholder.textContent = '尚未上架 / 编辑商品草稿，让这件作品出现在你的店铺中。'
        a.append(placeholder)
      }
      const h = document.createElement('h3')
      h.textContent = p.title
      const detail = document.createElement('p')
      detail.textContent =
        p.finish + ' / ' + (p.published ? '已上架' : '草稿') + ' / 概念库存 ' + p.stock
      const b = document.createElement('button')
      b.textContent = '编辑上架与库存 ↗'
      b.dataset.editProduct = p.id
      b.onclick = () => edit(p)
      a.append(h, detail, b)
      return a
    }),
  )
  $('#filter-note').textContent =
    `${items.length} 件器物 / ${items.filter((p) => p.published).length} 件本次已上架。没有真实购买入口。`
  $('#inventory-rows').replaceChildren(
    ...products.map((p) => {
      const tr = document.createElement('tr')
      for (const value of [p.title, p.published ? '已上架' : '草稿', String(p.stock)]) {
        const td = document.createElement('td')
        td.textContent = value
        tr.append(td)
      }
      const td = document.createElement('td'),
        b = document.createElement('button')
      b.textContent = '编辑'
      b.dataset.inventoryEdit = p.id
      b.onclick = () => edit(p)
      td.append(b)
      tr.append(td)
      return tr
    }),
  )
}
const stageText: Record<string, string> = {
  make: '制作，是商家的起点。切换到上架，试着整理一件作品的信息。',
  publish: '上架阶段：编辑商品和库存后，下方小店会同步更新；不是一张静态后台截图。',
  fulfil: '履约阶段：检查固定订单草稿的物件与保护包装，不创建订单、不发货。',
}
document.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach(
  (b) =>
    (b.onclick = () => {
      const key = b.dataset.stage!
      for (const s of ['make', 'publish', 'fulfil']) $('#stage-' + s).hidden = s !== key
      $('#stage-note').textContent = stageText[key]
      document
        .querySelectorAll('[data-stage]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
$('#series').onchange = render
$('#edit-close').onclick = () => editor.close()
$('#product-form').onsubmit = (e) => {
  e.preventDefault()
  const title = $<HTMLInputElement>('#product-title').value.trim(),
    stockValue = $<HTMLInputElement>('#product-stock').value,
    stock = Number(stockValue)
  if (!title) {
    $('#edit-status').textContent = '请填写商品名称，再保存草稿。'
    $('#product-title').focus()
    return
  }
  if (stockValue.trim() === '' || !Number.isInteger(stock) || stock < 0 || stock > 50) {
    $('#edit-status').textContent = '概念库存需为0–50之间的整数。'
    $('#product-stock').focus()
    return
  }
  current.title = title
  current.stock = stock
  current.published = $<HTMLInputElement>('#product-published').checked
  render()
  $('#edit-status').textContent = '已保存当前商品草稿，小店与库存表已同步。刷新后清空。'
}
$('#pack-form').onsubmit = (e) => {
  e.preventDefault()
  if (!$<HTMLInputElement>('#pack-check').checked || !$<HTMLInputElement>('#wrap-check').checked) {
    $('#pack-status').textContent = '请先完成两项打包检查，再标记履约。'
    return
  }
  $('#pack-status').textContent = '固定订单草稿已标记为本地履约完成；未生成运单或实际发货。'
}
render()

void announceReady('shopify')
