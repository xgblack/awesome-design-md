import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const find = () => {
  const query = $<HTMLInputElement>('#query').value.trim().toLowerCase(),
    platform = $<HTMLSelectElement>('#platform').value,
    genre = $<HTMLSelectElement>('#genre').value
  let count = 0
  document.querySelectorAll<HTMLElement>('[data-title]').forEach((card) => {
    card.hidden = !(
      card.dataset.title!.toLowerCase().includes(query) &&
      (platform === 'all' || card.dataset.platform === platform) &&
      (genre === 'all' || card.dataset.genre === genre)
    )
    if (!card.hidden) count++
  })
  $('#find-status').textContent = count
    ? `${count} 个原创游戏档案`
    : '没有匹配的游戏，条件已保留，可清空条件重新查找。'
}
$('#query').oninput = find
$('#platform').onchange = find
$('#genre').onchange = find
$('#reset-games').onclick = () => {
  $<HTMLInputElement>('#query').value = ''
  $<HTMLSelectElement>('#platform').value = 'all'
  $<HTMLSelectElement>('#genre').value = 'all'
  find()
}
$('#vote').onsubmit = (e) => {
  e.preventDefault()
  const selected = document.querySelector<HTMLInputElement>('input[name=vote]:checked')
  if (!selected) {
    $('#vote-status').textContent = '请先选择一项，再提交本机模拟投票。'
    document.querySelector<HTMLInputElement>('input[name=vote]')?.focus()
    return
  }
  $('#vote-status').textContent = `本机选择：${selected.value}。这是 1 张本机模拟票，不是社区票数。`
  $('#undo').hidden = false
  document
    .querySelectorAll<HTMLInputElement>('input[name=vote]')
    .forEach((x) => (x.disabled = true))
}
$('#undo').onclick = () => {
  $<HTMLFormElement>('#vote').reset()
  document
    .querySelectorAll<HTMLInputElement>('input[name=vote]')
    .forEach((x) => (x.disabled = false))
  $('#undo').hidden = true
  $('#vote-status').textContent = '投票已撤回。无社区统计。'
}
void announceReady('nintendo-2001')
