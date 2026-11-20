import { announceReady } from '../_shared/runtime.ts'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

document.querySelectorAll<HTMLButtonElement>('[data-platform]').forEach((b) =>
  b.addEventListener('click', () => {
    const platform = b.dataset.platform!
    document
      .querySelectorAll<HTMLButtonElement>('[data-platform]')
      .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    $('.phone').classList.toggle('android', platform === 'android')
    $('#device-name').textContent = platform === 'ios' ? 'iPhone / preview' : 'Android / preview'
    $('#command').textContent = 'npx expo run:' + platform
  }),
)
$('#form').addEventListener('submit', (e) => {
  e.preventDefault()
  const title = $<HTMLInputElement>('#title').value.trim()
  if (!title) {
    $('#feedback').textContent = '请先填写便笺标题。'
    return
  }
  document.querySelectorAll('.note-title').forEach((n) => (n.textContent = title))
  document
    .querySelectorAll('.note-body')
    .forEach((n) => (n.textContent = $<HTMLTextAreaElement>('#body').value))
  source()
  $('#feedback').textContent = '两个设备预览与组件示意已同步；未保存或发布。'
})

function source() {
  const title = $<HTMLInputElement>('#title').value.trim()
  const body = $<HTMLTextAreaElement>('#body').value
  $('#native-source').textContent =
    'import { View, Text } from "react-native"\n\nexport function PocketNote() {\n  return (\n    <View>\n      <Text>{' +
    JSON.stringify(title) +
    '}</Text>\n      <Text>{' +
    JSON.stringify(body) +
    '}</Text>\n    </View>\n  )\n}\n// Displayed source; not compiled here.'
}
source()
void announceReady('expo')
