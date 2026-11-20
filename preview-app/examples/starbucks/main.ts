import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
type Recipe = { id: number; size: string; milk: string; shots: number }
let shots = 1
let nextId = 1
let editing: number | null = null
let focusRecipeAfterClose = false
const items: Recipe[] = []
const tray = $<HTMLDialogElement>('#tray')
const cupImages: Record<string, string> = {
  中杯: new URL('./assets/cup-small.svg', import.meta.url).href,
  大杯: new URL('./assets/cup-large.svg', import.meta.url).href,
}
const milkNotes: Record<string, string> = {
  燕麦奶: '谷物与烘烤香气的创作想象；并非实际配料或过敏原说明。',
  鲜牛奶: '柔和奶香与绵密奶泡的创作想象；并非实际配料或过敏原说明。',
  椰奶: '轻盈椰香与浓缩对比的创作想象；并非实际配料或过敏原说明。',
}
const describe = (recipe: Pick<Recipe, 'size' | 'milk' | 'shots'>) =>
  `${recipe.size} · ${recipe.milk || '未选奶基'} · ${recipe.shots} 份浓缩`
const readRecipe = () => ({
  size: $<HTMLInputElement>('input[name=size]:checked').value,
  milk: $<HTMLSelectElement>('#milk').value,
  shots,
})
const update = () => {
  const recipe = readRecipe()
  $('#shots').textContent = String(shots)
  $<HTMLButtonElement>('#minus').disabled = shots === 1
  $<HTMLButtonElement>('#plus').disabled = shots === 3
  $('#summary').textContent = describe(recipe)
  $<HTMLImageElement>('#drink-image').src = cupImages[recipe.size]
  $<HTMLImageElement>('#drink-image').alt =
    `原创${recipe.size} ${recipe.size === '中杯' ? '320' : '450'} ml 陶杯与拉花概念渲染`
  $('#visual-size').textContent = `${recipe.size} / ${recipe.size === '中杯' ? '320' : '450'} ml`
  $('#visual-milk').textContent = recipe.milk
    ? `${recipe.milk}风味概念 / ${shots} 份浓缩`
    : '陶杯与饮品均为原创视觉概念'
  $('#milk-note').textContent = milkNotes[recipe.milk] || '选择一种奶基，查看本页的风味创作说明。'
  document
    .querySelectorAll<HTMLElement>('#shot-dots i')
    .forEach((dot, i) => dot.classList.toggle('active', i < shots))
  if (recipe.milk) $('#milk').removeAttribute('aria-invalid')
}
const exitEdit = () => {
  editing = null
  $('#edit-notice').hidden = true
  $('#cancel-edit').hidden = true
  $('#save-recipe').textContent = '加入试配盘'
}
const renderTray = () => {
  $('#tray-count').textContent = String(items.length)
  $<HTMLButtonElement>('#tray-clear').disabled = items.length === 0
  if (!items.length) {
    $('#tray-items').textContent = '试配盘还是空的。'
    return
  }
  $('#tray-items').replaceChildren(
    ...items.map((recipe, position) => {
      const row = document.createElement('article')
      const text = document.createElement('p')
      text.textContent = `试配 ${position + 1} / ${describe(recipe)}`
      const edit = document.createElement('button')
      edit.textContent = '修改'
      edit.dataset.editRecipe = String(recipe.id)
      edit.setAttribute('aria-label', `修改试配 ${position + 1}`)
      edit.onclick = () => {
        editing = recipe.id
        $<HTMLInputElement>(`input[name=size][value="${recipe.size}"]`).checked = true
        $<HTMLSelectElement>('#milk').value = recipe.milk
        shots = recipe.shots
        update()
        $('#edit-notice').textContent =
          `正在修改试配 ${position + 1}；保存会替换原配方，不会新增一杯。`
        $('#edit-notice').hidden = false
        $('#cancel-edit').hidden = false
        $('#save-recipe').textContent = '保存配方修改'
        $('#status').textContent = '调整后保存，或取消修改保留原配方。'
        focusRecipeAfterClose = true
        tray.close()
      }
      const remove = document.createElement('button')
      remove.textContent = '移除'
      remove.dataset.removeRecipe = String(recipe.id)
      remove.setAttribute('aria-label', `移除试配 ${position + 1}`)
      remove.onclick = () => {
        const index = items.findIndex((item) => item.id === recipe.id)
        if (index < 0) return
        items.splice(index, 1)
        if (editing === recipe.id) exitEdit()
        renderTray()
        $('#tray-status').textContent = '已移除这一杯；其他配方保持不变。'
        const buttons = document.querySelectorAll<HTMLButtonElement>('[data-remove-recipe]')
        ;(buttons[Math.min(position, buttons.length - 1)] || $('#tray-close')).focus()
      }
      row.append(text, edit, remove)
      return row
    }),
  )
}
$('#minus').onclick = () => {
  shots = Math.max(1, shots - 1)
  update()
}
$('#plus').onclick = () => {
  shots = Math.min(3, shots + 1)
  update()
}
document.querySelectorAll<HTMLInputElement>('input[name=size]').forEach((input) => {
  input.onchange = update
})
$('#milk').onchange = update
$('#recipe').onsubmit = (event) => {
  event.preventDefault()
  const recipe = readRecipe()
  if (!recipe.milk) {
    $('#status').textContent = '请选择奶基，再加入试配盘。'
    $('#milk').setAttribute('aria-invalid', 'true')
    $('#milk').focus()
    return
  }
  if (editing !== null) {
    const index = items.findIndex((item) => item.id === editing)
    if (index < 0) {
      $('#status').textContent = '这杯已从试配盘移除，请取消修改后重新添加。'
      return
    }
    items[index] = { id: editing, ...recipe }
    $('#status').textContent = '已更新原配方，试配盘杯数没有增加。'
    exitEdit()
  } else {
    items.push({ id: nextId++, ...recipe })
    $('#status').textContent = '已加入本次试配盘，可查看、修改或移除单杯。'
  }
  renderTray()
}
$('#cancel-edit').onclick = () => {
  exitEdit()
  $('#status').textContent = '已取消修改，试配盘中的原配方未改变。'
}
$('#tray-open').onclick = () => {
  $('#tray-status').textContent = ''
  tray.showModal()
}
$('#tray-close').onclick = () => tray.close()
tray.onclose = () => {
  if (focusRecipeAfterClose) {
    focusRecipeAfterClose = false
    $('#recipe-title').focus({ preventScroll: true })
    $('#recipe').scrollIntoView({ block: 'start', behavior: 'instant' })
  } else $('#tray-open').focus({ preventScroll: true })
}
$('#tray-clear').onclick = () => {
  items.length = 0
  exitEdit()
  renderTray()
  $('#tray-status').textContent = '本次试配盘已清空。'
  $('#tray-close').focus()
}
update()
void announceReady('starbucks')
