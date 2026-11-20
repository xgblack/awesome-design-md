import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
const speakerImages: Record<string, string> = {
  chalk: new URL('./assets/speaker-chalk.webp', import.meta.url).href,
  night: new URL('./assets/speaker-night.webp', import.meta.url).href,
  tide: new URL('./assets/speaker-tide.webp', import.meta.url).href,
}
const colors: Record<string, [string, string]> = {
  chalk: ['粉笔白', '为你的空间留白'],
  night: ['夜幕黑', '让声音静静浮现'],
  tide: ['潮汐蓝', '把海的颜色带回家'],
}
document.querySelectorAll<HTMLButtonElement>('[data-color]').forEach(
  (b) =>
    (b.onclick = () => {
      const key = b.dataset.color!
      $('#speaker').setAttribute('src', speakerImages[key])
      $('#speaker').setAttribute('alt', colors[key][0] + '桌面音响原创渲染')
      $('#color-name').textContent = colors[key].join(' · ')
      document
        .querySelectorAll('[data-color]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
const dialog = $<HTMLDialogElement>('#comparison')
$('#compare-open').onclick = () => dialog.showModal()
$('#compare-bottom').onclick = () => dialog.showModal()
$('#close').onclick = () => dialog.close()
const models: Record<string, { height: string; placement: string; image: string }> = {
  One: { height: '18 cm', placement: '书桌 / 客厅', image: speakerImages.chalk },
  Mini: {
    height: '12 cm',
    placement: '床头 / 书架',
    image: new URL('./assets/speaker-mini.webp', import.meta.url).href,
  },
  Studio: {
    height: '28 cm',
    placement: '大房间',
    image: new URL('./assets/speaker-studio.webp', import.meta.url).href,
  },
}
function compare() {
  const checked = [...document.querySelectorAll<HTMLInputElement>('.choice input:checked')]
  $('#compare-msg').textContent = checked.length
    ? `已选择 ${checked.length} 款，最多同时比较 2 款。`
    : '先选择一款，看看它适合什么空间。'
  $('#comparison-rows').innerHTML =
    checked
      .map((i) => {
        const m = models[i.value]
        return `<tr><td><div class="comparison-product"><img src="${m.image}" alt="Quiet ${i.value} 独立机型产品图"><span>${i.value}</span></div></td><td>${m.height}</td><td>${m.placement}</td></tr>`
      })
      .join('') || '<tr><td colspan="3">尚未选择机型。用上方选项开始比较。</td></tr>'
}
document.querySelectorAll<HTMLInputElement>('.choice input').forEach(
  (input) =>
    (input.onchange = () => {
      if (document.querySelectorAll('.choice input:checked').length > 2) {
        input.checked = false
        $('#compare-msg').textContent = '最多比较 2 款，请先取消一款再选择。'
        return
      }
      compare()
    }),
)
compare()

void announceReady('apple')
