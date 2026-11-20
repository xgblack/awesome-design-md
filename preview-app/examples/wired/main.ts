import '@fontsource-variable/inter'
import '@fontsource-variable/cormorant-garamond'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!
let articlePosition = 0
let magazinePosition = 0
let opened = false
let trigger: HTMLElement | null = null
const openArticle = (event: MouseEvent) => {
  if (!$('#article').hidden) return
  magazinePosition = window.scrollY
  trigger = event.currentTarget as HTMLElement
  $('#magazine').hidden = true
  $('#topics').hidden = true
  $('#article').hidden = false
  $('#article-title').focus({ preventScroll: true })
  window.scrollTo({ top: opened ? articlePosition : 0, behavior: 'instant' })
  opened = true
  $('#open-article').textContent = '继续阅读本期长文'
}
const closeArticle = () => {
  if ($('#article').hidden) return
  articlePosition = window.scrollY
  $('#article').hidden = true
  $('#magazine').hidden = false
  $('#topics').hidden = false
  window.scrollTo({ top: magazinePosition, behavior: 'instant' })
  trigger?.focus({ preventScroll: true })
}
$('#open-article').onclick = openArticle
$('#cover-read').onclick = openArticle
$('#back-magazine').onclick = closeArticle
$('#article-close').onclick = closeArticle
$('#home-link').onclick = (event) => {
  if (!$('#article').hidden) {
    event.preventDefault()
    closeArticle()
  }
}
document.querySelectorAll<HTMLButtonElement>('[data-section]').forEach((button) => {
  button.onclick = () => {
    const value = button.dataset.section!
    let count = 0
    document.querySelectorAll<HTMLElement>('[data-section-story]').forEach((story) => {
      story.hidden = value !== 'all' && story.dataset.sectionStory !== value
      if (!story.hidden) count++
    })
    $('#section-status').textContent = `${count} 篇专题导读`
    document
      .querySelectorAll('[data-section]')
      .forEach((item) => item.setAttribute('aria-pressed', String(item === button)))
  }
})
void announceReady('wired')
