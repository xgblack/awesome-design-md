import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
const names: Record<string, string> = {
  library: '河岸图书馆',
  market: '周末集市',
  garden: '北园活动站',
  hill: '山顶书屋',
}
type Point = [number, number]
type Route = {
  from: string
  to: string
  normal: Point[]
  accessible: Point[]
  shuttle: Point[]
  walk: number
  stepFree: number
  ride: number
}
const routes: Route[] = [
  {
    from: 'library',
    to: 'market',
    normal: [
      [130, 160],
      [150, 350],
      [360, 337],
    ],
    accessible: [
      [130, 160],
      [130, 500],
      [360, 500],
      [360, 337],
    ],
    shuttle: [
      [130, 160],
      [337, 145],
      [360, 337],
    ],
    walk: 12,
    stepFree: 18,
    ride: 8,
  },
  {
    from: 'library',
    to: 'garden',
    normal: [
      [130, 160],
      [150, 350],
      [165, 510],
    ],
    accessible: [
      [130, 160],
      [100, 180],
      [110, 510],
      [165, 510],
    ],
    shuttle: [
      [130, 160],
      [150, 350],
      [165, 510],
    ],
    walk: 10,
    stepFree: 14,
    ride: 7,
  },
  {
    from: 'market',
    to: 'garden',
    normal: [
      [360, 337],
      [150, 350],
      [165, 510],
    ],
    accessible: [
      [360, 337],
      [360, 500],
      [165, 510],
    ],
    shuttle: [
      [360, 337],
      [380, 500],
      [165, 510],
    ],
    walk: 9,
    stepFree: 13,
    ride: 6,
  },
]
let selected: {
  route: Route
  reverse: boolean
  from: string
  to: string
  accessible: boolean
} | null = null
let mode: 'walk' | 'shuttle' = 'walk'
const invalidate = () => {
  selected = null
  $('#route-results').hidden = true
  $('#route-line').setAttribute('hidden', '')
  $('#start-marker').setAttribute('hidden', '')
  $('#end-marker').setAttribute('hidden', '')
  $('#map-route-name').textContent = '路线条件已改变，等待重新查看'
  $('#route-status').textContent = '条件已更新，请重新查看演示路线。'
  $('#from').removeAttribute('aria-invalid')
  $('#to').removeAttribute('aria-invalid')
}
const draw = () => {
  if (!selected) return
  const { route, reverse, accessible, from, to } = selected
  const source =
    mode === 'shuttle' && !accessible ? route.shuttle : accessible ? route.accessible : route.normal
  const points = reverse ? [...source].reverse() : source
  $('#route-line').setAttribute(
    'd',
    points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' '),
  )
  $('#route-line').setAttribute('stroke-dasharray', mode === 'walk' ? '11 8' : 'none')
  $('#route-line').removeAttribute('hidden')
  $('#start-marker').setAttribute('cx', String(points[0][0]))
  $('#start-marker').setAttribute('cy', String(points[0][1]))
  $('#end-marker').setAttribute('x', String(points[points.length - 1][0] - 12))
  $('#end-marker').setAttribute('y', String(points[points.length - 1][1] - 12))
  $('#start-marker').removeAttribute('hidden')
  $('#end-marker').removeAttribute('hidden')
  $('#map-route-name').textContent =
    `${names[from]} → ${names[to]} / ${mode === 'walk' ? '步行' : '接驳'}${accessible ? ' · 无障碍偏好' : ''}`
  $('#map-title').textContent = `虚构示意：${$('#map-route-name').textContent}，非真实导航`
  $('#mode-walk').setAttribute('aria-pressed', String(mode === 'walk'))
  $('#mode-shuttle').setAttribute('aria-pressed', String(mode === 'shuttle'))
}
$('#swap').onclick = () => {
  const from = $<HTMLSelectElement>('#from'),
    to = $<HTMLSelectElement>('#to')
  ;[from.value, to.value] = [to.value, from.value]
  invalidate()
  $('#route-status').textContent = '起终点已交换，请查看新路线。'
}
$('#from').onchange = invalidate
$('#to').onchange = invalidate
$('#accessible').onchange = invalidate
$('#planner').onsubmit = (event) => {
  event.preventDefault()
  const from = $<HTMLSelectElement>('#from').value,
    to = $<HTMLSelectElement>('#to').value
  invalidate()
  if (from === to) {
    $('#route-status').textContent = '起点和终点相同，请选择两个不同地点。'
    $('#to').setAttribute('aria-invalid', 'true')
    $('#to').focus()
    return
  }
  const route = routes.find(
    (candidate) =>
      (candidate.from === from && candidate.to === to) ||
      (candidate.from === to && candidate.to === from),
  )
  if (!route) {
    $('#route-status').textContent = '山顶书屋暂未接入演示线路，请选择图书馆、集市或北园。'
    const invalid = from === 'hill' ? $('#from') : $('#to')
    invalid.setAttribute('aria-invalid', 'true')
    invalid.focus()
    return
  }
  const accessible = $<HTMLInputElement>('#accessible').checked
  selected = { route, reverse: from !== route.from, from, to, accessible }
  mode = 'walk'
  $('#walk-time').textContent = `${accessible ? route.stepFree : route.walk} 分钟`
  $('#shuttle-time').textContent = `${accessible ? route.ride + 3 : route.ride} 分钟`
  $('#walk-detail').textContent = accessible ? '无障碍绕行 · 零台阶情境' : '固定步行情境'
  $('#route-results').hidden = false
  $('#route-status').textContent =
    `${names[from]} → ${names[to]} · ${accessible ? '无障碍绕行，零台阶' : '步行 / 接驳对照'}（固定演示时长）`
  draw()
}
$('#mode-walk').onclick = () => {
  mode = 'walk'
  draw()
}
$('#mode-shuttle').onclick = () => {
  mode = 'shuttle'
  draw()
}
void announceReady('uber')
