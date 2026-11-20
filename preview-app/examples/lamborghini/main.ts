import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource/saira-condensed/700.css'
const video = $<HTMLVideoElement>('#reveal-film'),
  toggle = $('#film-toggle')
const sync = () => {
  const playing = !video.paused && !video.ended
  toggle.textContent = playing ? 'Ⅱ' : '▷'
  toggle.setAttribute('aria-label', playing ? '暂停原创汽车短片' : '播放原创汽车短片')
  toggle.setAttribute('aria-pressed', String(playing))
  if (video.duration)
    $<HTMLProgressElement>('#film-progress').value = video.currentTime / video.duration
}
video.addEventListener('play', () => {
  $('#film-status').textContent = '正在播放原创静态渲染的镜头运动，不是实车驾驶。'
  sync()
})
video.addEventListener('pause', sync)
video.addEventListener('timeupdate', sync)
video.addEventListener('ended', () => {
  $('#film-status').textContent = '短片已结束，可重新播放。'
  sync()
})
video.addEventListener('error', () => {
  video.hidden = true
  $('#film-status').textContent = '短片未能读取；保留静态渲染，没有模拟播放。'
  sync()
})
toggle.onclick = async () => {
  if (video.paused) {
    video.hidden = false
    try {
      if (video.ended) video.currentTime = 0
      await video.play()
    } catch {
      video.hidden = true
      $('#film-status').textContent = '本地短片播放失败，保留汽车静态渲染。'
    }
  } else {
    video.pause()
    $('#film-status').textContent = '镜头已暂停。'
  }
}
const images = {
  titan: new URL('./assets/rift-titan.svg', import.meta.url).href,
  obsidian: new URL('./assets/rift-obsidian.svg', import.meta.url).href,
  white: new URL('./assets/rift-white.svg', import.meta.url).href,
}
const names: Record<string, [string, string]> = {
  titan: ['TITAN', '冷银金属，让折面接住夜间的光。'],
  obsidian: ['OBSIDIAN', '曜黑表面，让低位车身融入夜色。'],
  white: ['POLAR', '瓷白表面，把锐利轮廓完整保留。'],
}
document.querySelectorAll<HTMLButtonElement>('[data-finish]').forEach(
  (b) =>
    (b.onclick = () => {
      const k = b.dataset.finish! as keyof typeof images
      video.pause()
      video.hidden = true
      for (const id of ['#rift-image', '#finish-image']) {
        $<HTMLImageElement>(id).src = images[k]
        $<HTMLImageElement>(id).alt = names[k][0] + ' 超级跑车原创渲染'
      }
      $('#finish-note').textContent = names[k].join(' / ')
      $('#film-status').textContent = '已切换静态涂装；短片固定展示 Titan 冷银版。'
      document
        .querySelectorAll('[data-finish]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
const menu = $<HTMLDialogElement>('#menu')
$('#menu-open').onclick = () => menu.showModal()
$('#menu-close').onclick = () => menu.close()
menu.querySelectorAll('a').forEach((a) => (a.onclick = () => menu.close()))

void announceReady('lamborghini')
