import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource-variable/cormorant-garamond/index.css'
import aliceUrl from '../_shared/audio/alice-reading.mp3?url'
import timeMachineUrl from '../_shared/audio/time-machine-reading.mp3?url'
import alicePeaks from '../_shared/audio/alice-peaks.json'
import timeMachinePeaks from '../_shared/audio/time-machine-peaks.json'
import riverUrl from './assets/river.wav?url'
import bellsUrl from './assets/bells.wav?url'
import riverPeaks from './assets/river-peaks.json'
import bellsPeaks from './assets/bells-peaks.json'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

const pieces = {
  alice: {
    url: aliceUrl,
    peaks: alicePeaks,
    title: 'Alice / A classic reading.',
    number: '01',
    note: 'Alice’s Adventures in Wonderland',
    text: 'Lewis Carroll 原著，Kristen McQuillin 朗读。LibriVox 公共领域预录片段，取原录音60–78秒；不是在线生成或音色克隆。本页没有逐字稿，独立草稿与此录音无对应关系。',
    kind: 'reading',
  },
  timeMachine: {
    url: timeMachineUrl,
    peaks: timeMachinePeaks,
    title: 'The Time Machine / A reading.',
    number: '02',
    note: 'The Time Machine',
    text: 'H. G. Wells 原著，Aaron Elliott 朗读。LibriVox 公共领域预录片段，取原录音60–78秒；不是在线生成或音色克隆。本页没有逐字稿，独立草稿与此录音无对应关系。',
    kind: 'reading',
  },
  river: {
    url: riverUrl,
    peaks: riverPeaks,
    title: 'Morning by the river.',
    number: '03',
    note: '原创音景 / 河岸轻音',
    text: '本项目以正弦音、谐波与轻微噪声原创合成的八秒音景。没有人声，也不代表录音或音色克隆。',
    kind: 'sound',
  },
  bells: {
    url: bellsUrl,
    peaks: bellsPeaks,
    title: 'A bell, a little longer.',
    number: '04',
    note: '原创音景 / 旧钟余响',
    text: '本项目原创八秒钟声合成音景，无人声或真人身份。不是所播音频的逐字稿；无需文字即可试听声音的不同衰减。',
    kind: 'sound',
  },
}
const audio = $<HTMLAudioElement>('#audio')
let key: keyof typeof pieces = 'alice'
function time(n: number) {
  return Math.floor(n / 60) + ':' + String(Math.floor(n % 60)).padStart(2, '0')
}
function update() {
  const duration = Number.isFinite(audio.duration)
    ? audio.duration
    : pieces[key].kind === 'reading'
      ? 18
      : 8
  $('#time').textContent = time(audio.currentTime) + ' / ' + time(duration)
  $<HTMLInputElement>('#seek').max = String(duration)
  $<HTMLInputElement>('#seek').value = String(audio.currentTime)
  $('#play').textContent = audio.paused ? '▶' : 'Ⅱ'
  $('#play').setAttribute('aria-label', audio.paused ? '播放样本' : '暂停样本')
}
function choose() {
  audio.pause()
  audio.src = pieces[key].url
  audio.load()
  audio.playbackRate = Number($<HTMLSelectElement>('#speed').value)
  $('#piece-title').textContent = pieces[key].title
  $('#piece-number').textContent = 'VOICE SAMPLE / ' + pieces[key].number
  $('#duration').textContent =
    pieces[key].kind === 'reading' ? '18 SECOND READING' : '8 SECOND SOUND STUDY'
  $('#note-title').textContent = pieces[key].note
  $('#note-text').textContent = pieces[key].text
  $('#waveform').replaceChildren(
    ...pieces[key].peaks.map((n) => {
      const bar = document.createElement('i')
      bar.style.height = Math.min(100, Math.max(5, n * 125)) + '%'
      return bar
    }),
  )
  document
    .querySelectorAll<HTMLButtonElement>('[data-piece]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.piece === key)))
  $('#play-state').textContent =
    pieces[key].kind === 'reading'
      ? '已选择预置真人朗读，等待手动播放。'
      : '已选择原创无人声音景，等待手动播放。'
  update()
}
document.querySelectorAll<HTMLButtonElement>('[data-piece]').forEach((b) =>
  b.addEventListener('click', () => {
    key = b.dataset.piece as typeof key
    choose()
  }),
)
$('#play').addEventListener('click', async () => {
  if (!audio.paused) {
    audio.pause()
    return
  }
  try {
    await audio.play()
    $('#play-state').textContent =
      pieces[key].kind === 'reading'
        ? '正在播放预录朗读样本；非在线生成。'
        : '正在播放原创合成音景；不含人声。'
  } catch {
    $('#play-state').textContent = '样本未能播放，请再次点击或重新选择。'
  }
})
audio.addEventListener('pause', () => {
  update()
  $('#play-state').textContent = audio.ended ? '播放结束。' : '已暂停。'
})
;['timeupdate', 'loadedmetadata', 'ended', 'play'].forEach((event) =>
  audio.addEventListener(event, update),
)
audio.addEventListener('error', () => {
  $('#play-state').textContent = '本地音频未能加载，请重新选择样本重试。'
})
$('#seek').addEventListener('input', () => {
  if (Number.isFinite(audio.duration))
    audio.currentTime = Number($<HTMLInputElement>('#seek').value)
})
$('#speed').addEventListener('change', () => {
  audio.playbackRate = Number($<HTMLSelectElement>('#speed').value)
})
$('#restart').addEventListener('click', () => {
  audio.currentTime = 0
  update()
})
$('#draft').addEventListener('input', () => {
  $('#draft-count').textContent =
    $<HTMLTextAreaElement>('#draft').value.length + ' / 600 · 本页内存，不生成语音'
})
window.addEventListener('pagehide', () => audio.pause())
choose()

void announceReady('elevenlabs')
