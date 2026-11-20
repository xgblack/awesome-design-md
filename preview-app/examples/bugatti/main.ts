import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
import '@fontsource/saira-condensed/400.css'
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/jetbrains-mono'
const paints = {
  argent: new URL('./assets/aurel-argent.svg', import.meta.url).href,
  noir: new URL('./assets/aurel-noir.svg', import.meta.url).href,
  ivory: new URL('./assets/aurel-ivory.svg', import.meta.url).href,
}
const names: Record<string, [string, string]> = {
  argent: ['Argent', '冷银表面，让长而连续的光线描述车身。'],
  noir: ['Noir', '深色漆面收起反光，保留肩线和车窗的边缘。'],
  ivory: ['Ivoire', '暖白色与低位座舱，让经典 GT 比例更从容。'],
}
document.querySelectorAll<HTMLButtonElement>('[data-paint]').forEach(
  (b) =>
    (b.onclick = () => {
      const k = b.dataset.paint! as keyof typeof paints
      for (const id of ['#hero-car', '#finish-car']) {
        $<HTMLImageElement>(id).src = paints[k]
        $<HTMLImageElement>(id).alt = `${names[k][0]} GT 原创外观渲染`
      }
      $('#paint-note').textContent = names[k].join(' — ')
      document
        .querySelectorAll('[data-paint]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
const craft: Record<string, string> = {
  leather: '开孔皮革保留自然纹理，包覆在手掌与座椅接触的位置。图为原创材质概念，不主张实物触感。',
  metal: '拉丝铝中控以独立旋钮形成明确的触觉层级；金属光泽由原创矢量渲染表现。',
  stitch: '两道平行缝线顺着仪表台与座椅的转折行进，连接不同材料，而不是额外装饰。',
}
document.querySelectorAll<HTMLButtonElement>('[data-hot]').forEach(
  (b) =>
    (b.onclick = () => {
      $('#craft-note').textContent = craft[b.dataset.hot!]
      document
        .querySelectorAll('[data-hot]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    }),
)
const index = $<HTMLDialogElement>('#index')
$('#index-open').onclick = () => index.showModal()
$('#index-close').onclick = () => index.close()
index.querySelectorAll('a').forEach((a) => (a.onclick = () => index.close()))

void announceReady('bugatti')
