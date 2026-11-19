export const facets = {
  moods: [
    ['minimal', '极简克制'],
    ['tech', '科技与产品'],
    ['editorial', '编辑式排版'],
    ['retro', '复古与实验'],
    ['playful', '活泼鲜明'],
    ['cinematic', '影像叙事'],
  ],
  tones: [
    ['light', '浅色'],
    ['dark', '深色'],
    ['mixed', '混合'],
  ],
  scenarios: [
    ['product', '产品官网'],
    ['content', '内容与阅读'],
    ['tool', '工具与后台'],
    ['commerce', '电商与零售'],
  ],
  colors: [
    ['mono', '黑白中性'],
    ['warm', '暖色调'],
    ['cool', '冷色调'],
    ['vivid', '鲜明色彩'],
    ['gradient', '渐变氛围'],
  ],
  density: [
    ['airy', '疏朗'],
    ['balanced', '适中'],
    ['dense', '紧凑'],
  ],
  category: [
    ['ai', 'AI 平台'],
    ['dev', '开发与基础设施'],
    ['saas', '生产力与 SaaS'],
    ['creative', '设计与创意'],
    ['finance', '金融与支付'],
    ['retail', '消费与零售'],
    ['media', '媒体与科技'],
    ['auto', '汽车与出行'],
    ['retro', '复古 Web'],
  ],
} as const

export type FacetKey = keyof typeof facets
export function labelFor(key: FacetKey, value: string): string {
  return facets[key].find(([id]) => id === value)?.[1] ?? '待整理'
}
