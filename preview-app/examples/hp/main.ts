import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/manrope'
const documentPrinter = new URL('./assets/document-printer.webp', import.meta.url).href,
  photoPrinter = new URL('./assets/photo-printer.webp', import.meta.url).href
$('#wizard').onsubmit = (e) => {
  e.preventDefault()
  const kind = $<HTMLSelectElement>('#print-kind').value,
    volume = $<HTMLSelectElement>('#volume').value,
    binding = $<HTMLSelectElement>('#binding').value
  const fields = ['#print-kind', '#volume', '#binding'].map((id) => $<HTMLSelectElement>(id))
  fields.forEach((field) => field.setAttribute('aria-invalid', String(!field.value)))
  if (!kind || !volume || !binding) {
    $('#recommendation').textContent = '请先回答完整三项，再查看推荐组合。'
    fields.find((field) => !field.value)?.focus()
    return
  }
  const photo = kind === 'photo'
  $('#recommendation').innerHTML =
    `<article class="recommended-setup"><img id="recommended-device" src="${photo ? photoPrinter : documentPrinter}" alt="${photo ? 'Colorway 48 照片印制机' : 'Everyday 24 文档打印机'}推荐概念组合"><div><h3>${photo ? 'Colorway 48 / 六色照片印制' : 'Everyday 24 / 黑白文档印制'}</h3><p>${volume === 'large' ? '大容量进纸' : '单张精细进纸'} · ${photo ? '涂层图文纸样本' : '100gsm文档纸样本'}${binding === 'yes' ? ' · 骑马钉装订台' : ''}</p><small>这是虚构器材与纸张组合，不是采购、耗材兼容或性能承诺。</small></div></article>`
}
const diagnoses: Record<string, string> = {
  pale: '颜色偏淡：先核对纸张类型 → 查看设备说明中的校准选项 → 再核对耗材状态。不要在运行中拆机。',
  jam: '纸张卡住：先停止任务，再按具体设备说明书处理。不要在运转时伸手进入，不强拉纸张；不确定时联系对应售后。此页只说明帮助信息层级，不是维修指令。',
}
$('#problem').onchange = () => {
  $('#diagnosis').textContent =
    diagnoses[$<HTMLSelectElement>('#problem').value] || '选择一个问题，查看安全的演示检查顺序。'
}
$('#back').onclick = () => {
  $<HTMLSelectElement>('#problem').value = ''
  $('#diagnosis').textContent = '已返回问题选择，之前没有执行任何设备操作。'
}

void announceReady('hp')
