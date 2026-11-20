import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/manrope/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

import aliceUrl from '../_shared/audio/alice-reading.mp3?url'
import timeMachineUrl from '../_shared/audio/time-machine-reading.mp3?url'
import riverUrl from './assets/river.wav?url'
import bellsUrl from './assets/bells.wav?url'
import cityUrl from '../_shared/photos/city.webp?url'
import oceanUrl from '../_shared/photos/ocean.webp?url'
import mountainUrl from '../_shared/photos/mountain.webp?url'
const audio = $<HTMLAudioElement>('#audio')
const voiceAudio = $<HTMLAudioElement>('#voice-audio')
voiceAudio.src = aliceUrl
const prompts = {
  text: 'Write a short, observant paragraph about walking through a quieter city.',
  music:
    'Create a restrained eight-second sound study with soft resonant tones and room to breathe.',
  story:
    'Plan three frames: establish a city, pause at the coast, then open onto a mountain horizon.',
  narration:
    'Draft a reflective narration about noticing familiar places. The draft is independent of the pre-recorded reading samples.',
}
const modelNames = {
  text: 'FOURFOLD TEXT / FICTIONAL MODEL',
  music: 'FOURFOLD AUDIO / FICTIONAL MODEL',
  story: 'FOURFOLD VISION / FICTIONAL MODEL',
  narration: 'FOURFOLD SPEECH / FICTIONAL MODEL',
}
const studies = {
  text: {
    tag: '01 / WORDS',
    title: 'The city, a little slower.',
    desc: '一个关于步行与观察的原创短段落。它是预先写好的材料，不是根据输入生成。',
    body: '沿着河岸走的时候，我们没有急着找到目的地。风把树叶翻到另一面，桥下的阴影挪了一点位置。城市没有变小，只是我们终于走慢了一些。',
  },
  music: {
    tag: '02 / SOUND',
    title: 'A little resonance.',
    desc: '真实可播放的八秒本地音景。旋律由正弦谐波与噪声合成，没有真人演唱或口述。',
    body: '',
  },
  story: {
    tag: '03 / FRAMES',
    title: 'Three places, one small story.',
    desc: '选择镜头，理解从城市到海岸、再到山野的空间关系。静态分镜，不冒充正在生成的视频。',
    body: '',
  },
  narration: {
    tag: '04 / NOTES',
    title: 'A voice, on the page.',
    desc: '一段独立的原创旁白草稿，旁边可试听公共领域真人朗读。录音不是草稿对应语音，也不是合成或克隆。',
    body: '如果今天只能留下一点什么，我希望是我们曾经认真看过这个地方。不是为了证明到过哪里，而是为了记住，怎样在同一条路上看见不同的光。',
  },
}
let current: keyof typeof studies = 'text'
function select() {
  audio.pause()
  voiceAudio.pause()
  $('#task-prompt').textContent = prompts[current]
  $('#model-name').textContent = modelNames[current]
  $('#voice-sample').hidden = current !== 'narration'
  const s = studies[current]
  $('#current').textContent = s.tag
  $('#title').textContent = s.title
  $('#description').textContent = s.desc
  $('#text-body').textContent = s.body
  $('#text').hidden = current !== 'text' && current !== 'narration'
  $('#sound').hidden = current !== 'music'
  $('#storyboard').hidden = current !== 'story'
  $('#boundary').textContent =
    current === 'music'
      ? '原创合成音景 · 非口述录音 · 不含人声'
      : current === 'narration'
        ? '独立草稿 + 预录朗读对照 · 没有草稿对应人声录音'
        : '本地预置演示，不调用 AI 服务。'
  document
    .querySelectorAll<HTMLButtonElement>('[data-kind]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.kind === current)))
  $('#feedback').textContent = ''
}
document.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach((b) =>
  b.addEventListener('click', () => {
    current = b.dataset.kind as typeof current
    select()
  }),
)
$('#version').addEventListener('change', () => {
  audio.pause()
  audio.src = $<HTMLSelectElement>('#version').value === 'river' ? riverUrl : bellsUrl
  audio.load()
})
audio.src = riverUrl
audio.addEventListener('loadedmetadata', () => {
  $('#audio-note').textContent = '原创八秒合成旋律，不含人声，非口述录音。'
})
audio.addEventListener(
  'error',
  () => ($('#audio-note').textContent = '本地音频加载失败，请切换版本重试。文字材料仍可阅读。'),
)
$('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(studies[current].body)
    $('#feedback').textContent = '当前文字已复制。'
  } catch {
    $('#feedback').textContent = '无法复制，请选中上方文字手动复制。'
  }
})
const frames = {
  city: {
    url: cityUrl,
    alt: '城市分镜：日暮的街道与建筑',
    caption: '01 / Establishing frame · 用城市远景建立空间。',
  },
  ocean: {
    url: oceanUrl,
    alt: '海岸分镜：浪与岸线',
    caption: '02 / Transition frame · 用海岸留出一段停顿。',
  },
  mountain: {
    url: mountainUrl,
    alt: '山野分镜：层叠的山峰',
    caption: '03 / Closing frame · 用山野把视野打开。',
  },
}
document.querySelectorAll<HTMLButtonElement>('[data-frame]').forEach((b) =>
  b.addEventListener('click', () => {
    const f = frames[b.dataset.frame as keyof typeof frames]
    $<HTMLImageElement>('#frame').src = f.url
    $<HTMLImageElement>('#frame').alt = f.alt
    $('#frame-caption').textContent = f.caption
    document
      .querySelectorAll<HTMLButtonElement>('[data-frame]')
      .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
  }),
)
$('#voice-version').addEventListener('change', () => {
  voiceAudio.pause()
  voiceAudio.src =
    $<HTMLSelectElement>('#voice-version').value === 'alice' ? aliceUrl : timeMachineUrl
  voiceAudio.load()
  $('#voice-note').textContent =
    '18秒LibriVox公共领域预录朗读 · 非在线生成 · 非音色克隆 · 未提供逐字稿'
})
voiceAudio.addEventListener('error', () => {
  $('#voice-note').textContent = '本地朗读样本加载失败，请重新选择另一段样本。独立草稿仍可阅读。'
})
window.addEventListener('pagehide', () => {
  audio.pause()
  voiceAudio.pause()
})
select()

void announceReady('minimax')
