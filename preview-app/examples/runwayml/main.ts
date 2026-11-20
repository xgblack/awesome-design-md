import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/manrope/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

import cityFilm from './assets/city.mp4?url'
import oceanFilm from './assets/ocean.mp4?url'
import mountainFilm from './assets/mountain.mp4?url'
import cityPoster from '../_shared/photos/city.webp?url'
import oceanPoster from '../_shared/photos/ocean.webp?url'
import mountainPoster from '../_shared/photos/mountain.webp?url'
const films = {
  city: {
    url: cityFilm,
    poster: cityPoster,
    title: 'Before the city wakes.',
    index: '01 — CITY',
    caption: 'A four-second study in distance and light.',
    prompt:
      'Begin on the city skyline. A slow, restrained push-in holds the geometry of the streets; keep the frame quiet.',
  },
  ocean: {
    url: oceanFilm,
    poster: oceanPoster,
    title: 'The space between waves.',
    index: '02 — COAST',
    caption: 'A four-second study in rhythm and stillness.',
    prompt:
      'Hold the coastline as a single composed image. Use a gentle push-in; do not invent wave motion from a static reference.',
  },
  mountain: {
    url: mountainFilm,
    poster: mountainPoster,
    title: 'A longer horizon.',
    index: '03 — ALPINE',
    caption: 'A four-second study in scale and quiet.',
    prompt:
      'Open on layered mountain silhouettes. Push in slowly to hold a sense of scale, with no synthetic movement of the landscape.',
  },
}
const video = $<HTMLVideoElement>('#film')
let key: keyof typeof films = 'city'
function update() {
  const duration = Number.isFinite(video.duration) ? video.duration : 4
  $('#time').textContent =
    '00:' +
    String(Math.floor(video.currentTime)).padStart(2, '0') +
    ' / 00:' +
    String(Math.floor(duration)).padStart(2, '0')
  $<HTMLInputElement>('#scrub').max = String(duration)
  $<HTMLInputElement>('#scrub').value = String(video.currentTime)
  $('#play').textContent = video.paused ? 'Play study ▶' : 'Pause study Ⅱ'
}
function choose() {
  video.pause()
  video.src = films[key].url
  video.poster = films[key].poster
  video.load()
  $('#film-title').textContent = films[key].title
  $('#film-index').textContent = films[key].index
  $('#film-caption').textContent = films[key].caption
  $('#film-prompt').textContent = films[key].prompt
  $('#state').textContent = '已切换本地相片剪辑短片，等待手动播放。'
  document
    .querySelectorAll<HTMLButtonElement>('[data-film]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.film === key)))
  update()
}
document.querySelectorAll<HTMLButtonElement>('[data-film]').forEach((b) =>
  b.addEventListener('click', () => {
    key = b.dataset.film as typeof key
    choose()
  }),
)
$('#play').addEventListener('click', async () => {
  if (!video.paused) {
    video.pause()
    return
  }
  try {
    await video.play()
    $('#state').textContent = '正在播放本地 MP4。影像由授权静态摄影与原创推镜剪辑组成。'
  } catch {
    $('#state').textContent = '播放未开始，请再次点击播放或重新选择影片。'
  }
})
$('#stop').addEventListener('click', () => {
  video.pause()
  video.currentTime = 0
  $('#state').textContent = '已停止并回到开场。'
  update()
})
$('#mute').addEventListener('click', () => {
  video.muted = !video.muted
  $('#mute').textContent = video.muted ? 'Unmute' : 'Mute'
  $('#state').textContent = video.muted
    ? '已静音。这三段短片本身没有音轨。'
    : '已取消静音。这三段短片本身没有音轨。'
})
$('#scrub').addEventListener('input', () => {
  if (Number.isFinite(video.duration))
    video.currentTime = Number($<HTMLInputElement>('#scrub').value)
})
document.querySelectorAll<HTMLButtonElement>('[data-shot]').forEach((b) =>
  b.addEventListener('click', () => {
    if (Number.isFinite(video.duration)) {
      video.currentTime = Number(b.dataset.shot)
      $('#state').textContent = '已定位到当前短片 ' + b.dataset.shot + ' 秒。'
      update()
    }
  }),
)
;['timeupdate', 'loadedmetadata', 'play', 'pause', 'ended'].forEach((e) =>
  video.addEventListener(e, update),
)
video.addEventListener(
  'error',
  () => ($('#state').textContent = '本地短片加载失败，请重新选择影片重试。海报与文字仍可阅读。'),
)
window.addEventListener('pagehide', () => video.pause())
choose()

void announceReady('runwayml')
