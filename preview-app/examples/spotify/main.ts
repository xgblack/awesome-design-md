import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const tracks = [
  {
    name: 'Window Seat',
    kind: 'ambient',
    type: '环境氛围 / Ambient study',
    note: '柔和持续音与短乐句，构成一个窗边停留的意象。原创合成片段，不是实地环境录音。',
    src: new URL('./assets/window.wav', import.meta.url).href,
    cover: new URL('./assets/window-cover.svg', import.meta.url).href,
  },
  {
    name: 'Tidal Notes',
    kind: 'synth',
    type: '合成短章 / Synth miniature',
    note: '以起伏音色描绘潮汐意象，听一段缓慢靠近又退去的声音。原创合成片段，没有采样真实海浪。',
    src: new URL('./assets/tidal.wav', import.meta.url).href,
    cover: new URL('./assets/tidal-cover.svg', import.meta.url).href,
  },
  {
    name: 'Afterglow',
    kind: 'sequence',
    type: '节奏序列 / Quiet sequence',
    note: '重复的短乐句，像留在房间里的余光。原创合成片段，不对应商业唱片或真实艺人作品。',
    src: new URL('./assets/afterglow.wav', import.meta.url).href,
    cover: new URL('./assets/afterglow-cover.svg', import.meta.url).href,
  },
]
const audio = $<HTMLAudioElement>('#audio')
let current = 0
let queue = [0, 1, 2]
let attempt = 0
let genre = 'all'
audio.src = tracks[0].src
audio.volume = 0.6
const time = (seconds: number) =>
  `0:${String(Math.floor(Number.isFinite(seconds) ? seconds : 0)).padStart(2, '0')}`
const clearError = () => {
  $('#audio-error').hidden = true
}
const showError = (message: string) => {
  $('#audio-error-message').textContent = message
  $('#audio-error').hidden = false
  $('#play').textContent = '播放'
  $('#audio-status').textContent = message
}
async function play() {
  const thisAttempt = ++attempt
  try {
    await audio.play()
    if (thisAttempt !== attempt) return
    clearError()
    $('#audio-status').textContent = `正在播放 ${tracks[current].name} 原创合成片段。`
  } catch {
    if (thisAttempt !== attempt) return
    showError('本地音频未能播放。没有模拟播放；请重试，或检查浏览器音频权限。')
  }
}
const markCurrent = () => {
  document.querySelectorAll<HTMLElement>('[data-track], [data-play-track]').forEach((button) => {
    const id = Number(button.dataset.track ?? button.dataset.playTrack)
    button.setAttribute('aria-current', String(id === current))
  })
}
async function load(index: number) {
  attempt++
  audio.pause()
  current = index
  audio.src = tracks[index].src
  $<HTMLInputElement>('#seek').value = '0'
  $<HTMLInputElement>('#seek').disabled = true
  $('#elapsed').textContent = '0:00'
  $('#now-title').textContent = tracks[index].name
  $('#now-kind').textContent = `${tracks[index].type.split(' / ')[0]} / 原创合成`
  $<HTMLImageElement>('#now-cover').src = tracks[index].cover
  $('#composition-title').textContent = tracks[index].name
  $('#composition-type').textContent = tracks[index].type
  $('#composition-note').textContent = tracks[index].note
  clearError()
  markCurrent()
  renderQueue()
  await play()
}
audio.onplay = () => {
  $('#play').textContent = '暂停'
}
audio.onpause = () => {
  $('#play').textContent = '播放'
}
audio.onloadedmetadata = () => {
  $<HTMLInputElement>('#seek').max = String(audio.duration)
  $<HTMLInputElement>('#seek').disabled = false
  $('#duration').textContent = time(audio.duration)
  clearError()
}
audio.ontimeupdate = () => {
  $<HTMLInputElement>('#seek').value = String(audio.currentTime)
  $<HTMLInputElement>('#seek').setAttribute(
    'aria-valuetext',
    `${time(audio.currentTime)} / ${time(audio.duration)}`,
  )
  $('#elapsed').textContent = time(audio.currentTime)
}
audio.onerror = () => {
  $<HTMLInputElement>('#seek').disabled = true
  showError('本地音频资源未能读取。没有模拟播放，请重试加载。')
}
$('#play').onclick = () => {
  if (audio.paused) void play()
  else {
    attempt++
    audio.pause()
    $('#audio-status').textContent = '播放已暂停。'
  }
}
const next = () => {
  if (!queue.length) {
    attempt++
    audio.pause()
    $('#queue-status').textContent = '队列为空，可从上方曲目列表重新加入。'
    return
  }
  const position = queue.indexOf(current)
  void load(queue[position < 0 ? 0 : (position + 1) % queue.length])
}
$('#next').onclick = next
audio.onended = next
$('#previous').onclick = () => {
  if (!queue.length) {
    $('#queue-status').textContent = '队列为空，可从上方曲目列表重新加入。'
    return
  }
  const position = queue.indexOf(current)
  void load(queue[position < 0 ? queue.length - 1 : (position + queue.length - 1) % queue.length])
}
$('#seek').oninput = () => {
  if (Number.isFinite(audio.duration))
    audio.currentTime = Number($<HTMLInputElement>('#seek').value)
}
$('#volume').oninput = () => {
  audio.volume = Number($<HTMLInputElement>('#volume').value) / 100
}
$('#retry-audio').onclick = () => {
  audio.load()
  void play()
}
function renderQueue() {
  $<HTMLButtonElement>('#clear-queue').disabled = queue.length === 0
  if (!queue.length) {
    $('#queue-items').textContent = '队列为空，可从曲目列表重新加入。'
    return
  }
  $('#queue-items').replaceChildren(
    ...queue.map((id, position) => {
      const row = document.createElement('div')
      row.className = 'queue-row'
      if (id === current) row.setAttribute('aria-current', 'true')
      const text = document.createElement('span')
      text.textContent = `${position + 1}. ${tracks[id].name}`
      const up = document.createElement('button')
      up.textContent = '上移'
      up.dataset.up = String(position)
      up.setAttribute('aria-label', `上移 ${tracks[id].name}`)
      up.disabled = position === 0
      up.onclick = () => {
        ;[queue[position - 1], queue[position]] = [queue[position], queue[position - 1]]
        renderQueue()
        $('#queue-status').textContent = `已将 ${tracks[id].name} 上移。`
        const target = document.querySelector<HTMLButtonElement>(`[data-remove="${id}"]`)
        target?.focus({ preventScroll: true })
      }
      const remove = document.createElement('button')
      remove.textContent = '移除'
      remove.dataset.remove = String(id)
      remove.setAttribute('aria-label', `移除 ${tracks[id].name}`)
      remove.onclick = () => {
        queue = queue.filter((value) => value !== id)
        renderQueue()
        $('#queue-status').textContent = '已从接下来队列移除，当前播放不受影响。'
        const targets = document.querySelectorAll<HTMLButtonElement>('[data-remove]')
        ;(targets[Math.min(position, targets.length - 1)] || $('#queue')).focus({
          preventScroll: true,
        })
      }
      row.append(text, up, remove)
      return row
    }),
  )
}
document
  .querySelectorAll<HTMLButtonElement>('[data-track], [data-play-track]')
  .forEach((button) => {
    button.onclick = () => {
      void load(Number(button.dataset.track ?? button.dataset.playTrack))
    }
  })
document.querySelectorAll<HTMLButtonElement>('[data-enqueue]').forEach((button) => {
  button.onclick = () => {
    const index = Number(button.dataset.enqueue)
    if (queue.includes(index)) {
      $('#queue-status').textContent = '作品已在队列中，不重复添加。'
      return
    }
    queue.push(index)
    $('#queue-status').textContent = '已加入本次队列。'
    renderQueue()
  }
})
$('#clear-queue').onclick = () => {
  queue = []
  renderQueue()
  $('#queue-status').textContent = '队列已清空，当前播放不受影响。'
}
const filter = () => {
  const query = $<HTMLInputElement>('#track-search').value.trim().toLowerCase()
  let count = 0
  tracks.forEach((track, index) => {
    const visible =
      (genre === 'all' || track.kind === genre) &&
      `${track.name} ${track.type} ${track.note} night signal studio`.toLowerCase().includes(query)
    $<HTMLElement>(`.albums [data-track="${index}"]`).hidden = !visible
    document.querySelectorAll<HTMLElement>('.track-row')[index].hidden = !visible
    if (visible) count++
  })
  $('#search-status').textContent = `${count} 段原创作品`
  $('#search-empty').hidden = count > 0
}
$('#track-search').oninput = filter
document.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach((button) => {
  button.onclick = () => {
    genre = button.dataset.kind!
    document
      .querySelectorAll('[data-kind]')
      .forEach((item) => item.setAttribute('aria-pressed', String(item === button)))
    filter()
  }
})
$('#reset-search').onclick = () => {
  $<HTMLInputElement>('#track-search').value = ''
  genre = 'all'
  document
    .querySelectorAll<HTMLElement>('[data-kind]')
    .forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.kind === 'all')))
  filter()
  $('#track-search').focus()
}
window.addEventListener('pagehide', () => {
  attempt++
  audio.pause()
})
renderQueue()
markCurrent()
void announceReady('spotify')
