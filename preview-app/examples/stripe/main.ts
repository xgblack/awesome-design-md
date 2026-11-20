import '@fontsource-variable/inter'
import { announceReady } from '../_shared/runtime.ts'
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
import '@fontsource-variable/jetbrains-mono'
let quantity = 2,
  price = 200,
  event = 'confirmed'
let payload = ''
function render() {
  const gross = quantity * price,
    fee = Math.round((gross * 0.029 + 2) * 100) / 100,
    net = event === 'confirmed' ? gross - fee : -fee
  $('#gross').textContent = '¥' + gross.toFixed(2)
  $('#fee').textContent = '−¥' + fee.toFixed(2)
  $('#net').textContent = (net < 0 ? '−¥' : '¥') + Math.abs(net).toFixed(2)
  $('#net-label').textContent = event === 'confirmed' ? '可结算金额' : '退款后剩余费用'
  $('#event-note').textContent =
    event === 'confirmed'
      ? '演示票款已确认。没有真实支付或结算。'
      : '整单票款退回；按本页假设，示例费用不退。'
  payload = JSON.stringify(
    {
      type: 'ticket.' + event,
      demo_only: true,
      currency: 'CNY',
      quantity,
      unit_price: price,
      gross,
      fee,
      settlement: Number(net.toFixed(2)),
    },
    null,
    2,
  )
  $('#payload').textContent = payload
}
$('#ticket-form').onsubmit = (e) => {
  e.preventDefault()
  const q = ($('#quantity') as HTMLInputElement).value,
    p = ($('#price') as HTMLInputElement).value
  if (
    !/^\d+$/.test(q) ||
    Number(q) < 1 ||
    Number(q) > 1000 ||
    !/^\d+(\.\d{1,2})?$/.test(p) ||
    Number(p) <= 0 ||
    Number(p) > 10000
  ) {
    $('#error').textContent = '票数需为 1–1000 的整数，单价大于 0 且不超过 10,000，最多两位小数。'
    return
  }
  quantity = Number(q)
  price = Number(p)
  $('#error').textContent = ''
  render()
}
document.querySelectorAll<HTMLButtonElement>('[data-event]').forEach(
  (b) =>
    (b.onclick = () => {
      event = b.dataset.event!
      document
        .querySelectorAll('[data-event]')
        .forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      render()
    }),
)
$('#copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(payload)
    $('#copy-status').textContent = '已复制本地演示 payload。'
  } catch {
    $('#copy-status').textContent = '无法访问剪贴板；可在右侧选择 JSON 手动复制。'
  }
}
render()

void announceReady('stripe')
