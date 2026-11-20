// 本地策划标签，不是上游原生字段。依据与未知轴显式保留；真实示例特征另存各页 example.json。
import type { Features, FeatureEvidence } from '../types.ts'
export interface Curation {
  name: string
  summary: string
  category: string
  referenceFeatures: Features
  referenceEvidence: FeatureEvidence[]
}
export const curation: Record<string, Curation> = {
  '1win': {
    name: '1win',
    summary: '近黑画布、亮绿行动色与高密度内容轨道。',
    category: 'retail',
    referenceFeatures: {
      moods: ['playful', 'tech'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['dense'],
      typography: ['sans'],
      backgrounds: ['solid'],
      accentHues: ['green', 'blue'],
      headingWeight: ['bold'],
      headingScale: ['compact'],
      visualMedia: ['ui', 'illustration'],
    },
    referenceEvidence: [
      {
        source: '原规范 L230–242、286–316、379–408',
        reason:
          '固定图标左轨/顶栏 → 双推广板与赛事横轨 → 紧凑对阵行/右清单。`#141415`/`#2e3035`暗层、绿色主操作/蓝导航、Inter600/800、16px满幅海报，首屏保持信息密度。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L230–242、286–316、379–408',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L230–242、286–316、379–408',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  airbnb: {
    name: 'Airbnb',
    summary: '温暖珊瑚色、充裕留白与摄影主导的消费体验。',
    category: 'retail',
    referenceFeatures: {
      moods: ['minimal'],
      tones: ['light'],
      scenarios: ['commerce', 'product'],
      density: ['balanced'],
      visualMedia: ['photo'],
      geometry: ['pill'],
      accentHues: ['pink'],
      headingScale: ['compact'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L331–345、429–446、464–506',
        reason:
          '轻导航/三段胶囊搜索 → 四列摄影条目 → 目的地索引；本地详情含拼贴/设施/行程预览。白底、`#222222`与稀少`#ff385c`、小号标题、14px照片角、红心/黑评分。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L331–345、429–446、464–506',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L331–345、429–446、464–506',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  airtable: {
    name: 'Airtable',
    summary: '白底编辑式框架，以整幅彩色区块组织产品叙事。',
    category: 'creative',
    referenceFeatures: {
      moods: ['editorial', 'tech'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      headingScale: ['regular'],
      temperature: ['warm'],
      backgrounds: ['solid'],
      accentHues: ['neutral'],
      headingWeight: ['regular'],
      chroma: ['vivid'],
      visualMedia: ['ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L289–301、338–368、445–457',
        reason:
          '白首屏 → 氧化珊瑚拍摄大板 → 白解释 → 奶油关联记录/森林绿协作/暗结尾。40px/400标题、黑12px CTA；`#aa2d00`/`#0a2e0e`/`#f5e9d4`整板与96px留白，高度不同，不加hero渐变。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L289–301、338–368、445–457',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L289–301、338–368、445–457',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  aljazeera: {
    name: 'Al Jazeera',
    summary: '报纸式白底与密集标题，以橙色签名和红色标记新闻。',
    category: 'media',
    referenceFeatures: {
      moods: ['editorial'],
      tones: ['mixed'],
      scenarios: ['content'],
      density: ['dense'],
      typography: ['sans'],
      layouts: ['timeline'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      headingScale: ['regular'],
      backgrounds: ['solid'],
      visualMedia: ['photo', 'type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L320–333、397–430、523–536',
        reason:
          '白刊头/议题条 → 主报道/次栏/排行 → 图文、视频条与时间线。Roboto300眉题/700标题/900状态、橙色8px竖眉条、黑胶囊、方照片/细灰线，紧密报纸密度。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L320–333、397–430、523–536',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L320–333、397–430、523–536',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  apple: {
    name: 'Apple',
    summary: '让产品成为主角：清晰字阶、宽裕留白与克制蓝色。',
    category: 'media',
    referenceFeatures: {
      moods: ['minimal', 'cinematic'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['airy'],
      chroma: ['mono'],
      temperature: ['neutral'],
      layouts: ['chapters'],
      geometry: ['pill'],
      layering: ['glass'],
      accentHues: ['blue'],
      headingWeight: ['bold'],
      headingScale: ['regular'],
      backgrounds: ['solid'],
      visualMedia: ['render'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L278–292、373–425、458–476',
        reason:
          '44px顶栏/轻磨砂二级栏 → 白整屏产品/暗剖面 → 白配件/暗场景 → 羊皮纸收尾。56/40px、600紧标题、17px正文、`#0066cc`蓝胶囊；大区块不圆角，阴影仅产品本体。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L278–292、373–425、458–476',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L278–292、373–425、458–476',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  binance: {
    name: 'Binance',
    summary: '深色主画布与标志性亮黄，交易场景切换到浅色。',
    category: 'finance',
    referenceFeatures: {
      moods: ['tech'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['dense'],
      typography: ['sans', 'mono'],
      headingScale: ['compact'],
      accentHues: ['yellow'],
      headingWeight: ['bold'],
      backgrounds: ['solid'],
      visualMedia: ['ui', 'type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L342–350、434–450、525–549、595–610',
        reason:
          '暗首屏左大数字/右行情 → 五列市场表/解释/FAQ → 浅色换算对话框及页脚。`#0b0e11`/`#1e2329`、`#FCD535`配黑字、700大数/等宽数字、6–12px紧角。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L342–350、434–450、525–549、595–610',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L342–350、434–450、525–549、595–610',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  bmw: {
    name: 'BMW',
    summary: '浅色企业画布、深蓝影像区块与轻重分明的字阶。',
    category: 'auto',
    referenceFeatures: {
      moods: ['minimal', 'cinematic'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['balanced'],
      visualMedia: ['photo', 'render'],
      layouts: ['directory'],
      geometry: ['square'],
      accentHues: ['blue'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid', 'image'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L281–289、340–363、438–456',
        reason:
          '白导航/深海军产品主视觉 → 白底车型目录/参数 → 配置器 → 摄影行动/浅灰页脚，80px节奏。`#1c69d4`单蓝、方角按钮/输入、700标题/300正文、宽字距大写链接、无卡影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L281–289、340–363、438–456',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L281–289、340–363、438–456',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  'bmw-m': {
    name: 'BMW M',
    summary: '近黑赛道影像、轻量大写标题与少量 M 三色标记。',
    category: 'auto',
    referenceFeatures: {
      moods: ['cinematic', 'tech'],
      tones: ['dark'],
      scenarios: ['product', 'commerce'],
      density: ['airy'],
      chroma: ['mono'],
      headingScale: ['display'],
      visualMedia: ['photo', 'type'],
      layouts: ['chapters'],
      geometry: ['square'],
      backgrounds: ['image', 'solid'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      typography: ['sans', 'condensed'],
    },
    referenceEvidence: [
      {
        source: '原规范 L254–260、307–327、403–429',
        reason:
          '纯黑80px大写压整幅赛车图 → 四项技术信息/三列纪实 → 黑色杂志条目/通栏摄影。700/300强对比、方角白描边、少量4px三色分线、96px段距。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L254–260、307–327、403–429',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L254–260、307–327、403–429',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  bugatti: {
    name: 'Bugatti',
    summary: '电影般纯黑影像，宽字距大写与近乎消失的界面。',
    category: 'auto',
    referenceFeatures: {
      moods: ['minimal', 'cinematic', 'luxury'],
      tones: ['dark'],
      scenarios: ['product'],
      density: ['airy'],
      chroma: ['mono'],
      typography: ['sans', 'serif', 'mono', 'condensed'],
      temperature: ['neutral'],
      geometry: ['pill'],
      backgrounds: ['image', 'solid'],
      accentHues: ['neutral'],
      headingWeight: ['regular'],
      visualMedia: ['photo', 'render', 'type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L214–220、249–293、346–370',
        reason:
          '透明极简导航/暗场钟表 → 单列衬线工艺短文/满幅微距 → 四项规格/工坊纪事，120px空场。纯黑单色、400宽字距大写、衬线正文/等宽控件三家族、透明描边胶囊/方照片。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L214–220、249–293、346–370',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L214–220、249–293、346–370',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  cal: {
    name: 'Cal.com',
    summary: '干净白底、黑色行动按钮与友好的几何标题。',
    category: 'saas',
    referenceFeatures: {
      moods: ['minimal', 'tech'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['airy'],
      chroma: ['mono'],
      headingScale: ['display'],
      visualMedia: ['ui'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L285–293、327–358、434–448、541',
        reason:
          '白首屏7/5文案/真实日历 → 灰流程/白日程片段/轻团队说明 → 黑页脚。64px/600紧字、黑8px CTA、灰12px内容卡/16px大框、分段选择器。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L285–293、327–358、434–448、541',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L285–293、327–358、434–448、541',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  claude: {
    name: 'Claude',
    summary: '暖奶油画布、衬线标题和珊瑚色，带着人文温度。',
    category: 'ai',
    referenceFeatures: {
      moods: ['editorial', 'minimal', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'content'],
      density: ['airy'],
      typography: ['serif', 'sans'],
      headingScale: ['display'],
      temperature: ['warm'],
      accentHues: ['orange'],
      headingWeight: ['regular'],
      chroma: ['muted'],
      backgrounds: ['solid'],
      visualMedia: ['illustration', 'type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L315–322、361–394、477–495',
        reason:
          '奶油衬线首屏/珊瑚线稿 → 浅奶油材料板/暖黑摘录 → 留白正文/珊瑚结尾/暖黑页脚。`#faf9f5`/`#cc785c`/`#efe9de`、64px常规衬线/人文正文、8px按钮/12px卡。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L315–322、361–394、477–495',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L315–322、361–394、477–495',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  clay: {
    name: 'Clay',
    summary: '黏土质感插画与鲜明彩色面板，让数据产品更亲近。',
    category: 'creative',
    referenceFeatures: {
      moods: ['playful', 'warm'],
      tones: ['light'],
      scenarios: ['product'],
      density: ['balanced'],
      temperature: ['warm'],
      accentHues: ['neutral'],
      headingWeight: ['medium'],
      headingScale: ['display'],
      chroma: ['vivid'],
      backgrounds: ['solid'],
      visualMedia: ['render'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L304–312、350–377、446–480',
        reason:
          '暖奶油巨大圆润字/黏土山景 → 粉/深青/薰衣草/桃/赭章节分别承载招募、分组、回访 → 奶油山景结尾。`#fffaf0`、72px/500、黑12px CTA/24px彩板；哑光3D是核心。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L304–312、350–377、446–480',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L304–312、350–377、446–480',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  clickhouse: {
    name: 'ClickHouse',
    summary: '黑底亮黄与直接嵌入的代码界面，技术表达鲜明。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      visualMedia: ['code', 'ui'],
      accentHues: ['yellow'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid'],
    },
    referenceEvidence: [
      {
        source: '原规范 L299–306、340–370、437–455',
        reason:
          '暗首屏7/5文案/SQL窗 → 黄字结果/真实表格 → 暗解释/单块黄强调。`#0a0a0a`/`#1a1a1a`、`#faff69`、Inter700/JetBrains Mono、8px控件/12px卡、无阴影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L299–306、340–370、437–455',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L299–306、340–370、437–455',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  cohere: {
    name: 'Cohere',
    summary: '白色编辑空间、矿物色表面与深绿产品区块。',
    category: 'ai',
    referenceFeatures: {
      moods: ['editorial', 'tech'],
      tones: ['mixed'],
      scenarios: ['product', 'content'],
      density: ['balanced'],
      headingScale: ['display'],
      visualMedia: ['photo', 'ui'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      headingWeight: ['regular'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L203–210、254–274、334–390',
        reason:
          '96px常规紧声明 → 宽检索/窄质感摄影双卡 → 留白信任带/深绿能力带 → 日期/主题文献行。白/`#003c33`、黑胶囊、22px主媒体角；珊瑚仅分类，线分隔不全包卡。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L203–210、254–274、334–390',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L203–210、254–274、334–390',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  coinbase: {
    name: 'Coinbase',
    summary: '白底、低字重与单一钴蓝，平静而清晰的金融表达。',
    category: 'finance',
    referenceFeatures: {
      moods: ['minimal'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      headingScale: ['display'],
      geometry: ['pill'],
      accentHues: ['blue'],
      headingWeight: ['regular'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid'],
      visualMedia: ['geometry', 'ui'],
    },
    referenceEvidence: [
      {
        source: '原规范 L310–316、353–388、465–475',
        reason:
          '暗首屏漂浮预算卡 → 白解释/开放收支行 → 灰练习板/深产品故事。80px/400紧字、`#0052ff`蓝胶囊、24px卡角/圆资产符号、独立等宽数字。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L310–316、353–388、465–475',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L310–316、353–388、465–475',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  composio: {
    name: 'Composio',
    summary: '深色终端面板与电光蓝，精密的开发工具氛围。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      visualMedia: ['ui', 'code'],
      layouts: ['centered'],
      accentHues: ['blue'],
      headingWeight: ['medium'],
      headingScale: ['display'],
      backgrounds: ['solid', 'gradient'],
    },
    referenceEvidence: [
      {
        source: '原规范 L269–275、312–340、412–426',
        reason:
          '72px居中标题 → 2×2真实演示四窗/限定蓝聚光 → 连接器/运行说明/暗资源。`#0f0f0f`/`#181818`/`#222222`亮度层、`#0007cd`行动、500 sans/Mono、8px控件。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L269–275、312–340、412–426',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L269–275、312–340、412–426',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  cursor: {
    name: 'Cursor',
    summary: '暖奶油画布、轻量编辑式排版，以及少量橙色强调。',
    category: 'dev',
    referenceFeatures: {
      moods: ['minimal', 'editorial', 'tech', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['airy'],
      headingScale: ['display'],
      temperature: ['warm'],
      visualMedia: ['ui', 'code'],
      layouts: ['timeline'],
      layering: ['lines'],
      accentHues: ['orange'],
      headingWeight: ['regular'],
      backgrounds: ['solid'],
      typography: ['sans', 'mono'],
    },
    referenceEvidence: [
      {
        source: '原规范 L293–331、435–459',
        reason:
          '奶油72px常规标题 → 白色文件树/代码/对话/终端多窗 → 小型差异说明/留白编辑段。`#f7f7f4`/`#26251e`、`#f54e00`主行动、400标题/1px细线无影；五色阶段只给时间线。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L293–331、435–459',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L293–331、435–459',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  'dell-1996': {
    name: 'Dell · 1996',
    summary: '黑色页面框、平面彩色缎带与早期 Web 贴纸语言。',
    category: 'retro',
    referenceFeatures: {
      moods: ['retro', 'playful'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['dense'],
      typography: ['pixel', 'sans', 'serif'],
      layouts: ['directory'],
      geometry: ['square'],
      layering: ['hard'],
      accentHues: ['blue', 'red'],
      headingWeight: ['bold'],
      headingScale: ['compact'],
      backgrounds: ['solid'],
      visualMedia: ['pixel', 'type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L349–359、391–459、515–540',
        reason:
          '760px黑框/横幅 → 28%图标目录和红说明、72%彩缎带目录 → 手绘图标链接。8px黑框/方角、Arial Black900/Helvetica700/Times14、八色低位色、蓝下划线与硬贴纸。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L349–359、391–459、515–540',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L349–359、391–459、515–540',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  dji: {
    name: 'DJI',
    summary: '摄影展厅般的产品方格、白底与工程蓝行动按钮。',
    category: 'media',
    referenceFeatures: {
      moods: ['minimal', 'cinematic'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['balanced'],
      typography: ['sans'],
      visualMedia: ['photo', 'render'],
      layouts: ['centered', 'chapters'],
      geometry: ['pill'],
      accentHues: ['blue'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid', 'image'],
    },
    referenceEvidence: [
      {
        source: '原规范 L527–556、743–759、787–791',
        reason:
          '公告/白导航 → 通栏摄影/两张方产品大砖 → 居中比较/四列规格 → 灰探索/场景/深灰品牌页脚。Open Sans600/400、`#0070d5`、方媒体/蓝或描边胶囊、橙仅器材级别。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L527–556、743–759、787–791',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L527–556、743–759、787–791',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  elevenlabs: {
    name: 'ElevenLabs',
    summary: '轻字重编辑式排版，柔和光晕与近白纸感表面。',
    category: 'ai',
    referenceFeatures: {
      moods: ['editorial', 'minimal'],
      tones: ['light'],
      scenarios: ['product', 'content'],
      density: ['airy'],
      chroma: ['mono'],
      typography: ['serif', 'sans'],
      headingScale: ['display'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      headingWeight: ['light'],
      temperature: ['neutral'],
      backgrounds: ['solid', 'gradient'],
      visualMedia: ['ui'],
    },
    referenceEvidence: [
      {
        source: '原规范 L264–270、317–345、412–424',
        reason:
          '淡灰64px轻衬线/色雾 → 大播放器/声音卡 → 讲述者说明/浅收尾。`#f5f5f5`、黑胶囊、300衬线/400微正字距正文、薄边圆卡、薄荷/桃/薰衣草氛围。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L264–270、317–345、412–424',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L264–270、317–345、412–424',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  expo: {
    name: 'Expo',
    summary: '纯白底、柔和天空蓝与直接呈现的多设备产品画面。',
    category: 'dev',
    referenceFeatures: {
      moods: ['minimal', 'tech'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['airy'],
      typography: ['sans', 'mono'],
      visualMedia: ['ui', 'render'],
      layouts: ['centered'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid', 'gradient'],
    },
    referenceEvidence: [
      {
        source: '原规范 L275–283、335–356、426–456',
        reason:
          '白底天空气氛首屏/居中紧标题 → 笔电+手机重叠 → 三步流程/代码/生态板。Inter600/JetBrains Mono、黑8px CTA、蓝仅文本链接，设备合成是主角。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L275–283、335–356、426–456',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L275–283、335–356、426–456',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  ferrari: {
    name: 'Ferrari',
    summary: '明暗交错的电影叙事，赛车红只出现在关键时刻。',
    category: 'auto',
    referenceFeatures: {
      moods: ['cinematic', 'editorial'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['airy'],
      typography: ['sans'],
      headingScale: ['display'],
      visualMedia: ['photo'],
      layouts: ['chapters'],
      geometry: ['square'],
      accentHues: ['red'],
      headingWeight: ['medium'],
      backgrounds: ['image', 'solid'],
    },
    referenceEvidence: [
      {
        source: '原规范 L281–289、335–356、430–446',
        reason:
          '整屏影院摄影/80px标题 → 白节目单 → 黑创作者/三列静帧 → 深结尾。暖黑`#181818`、稀少`#da291c`、Inter500/14px正文、方角/1.4px大写CTA字距。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L281–289、335–356、430–446',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L281–289、335–356、430–446',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  figma: {
    name: 'Figma',
    summary: '黑白编辑框架与大幅剪纸般彩色面板，专业又活泼。',
    category: 'creative',
    referenceFeatures: {
      moods: ['playful', 'editorial', 'experimental'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      typography: ['sans'],
      headingScale: ['display'],
      layouts: ['directory'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      headingWeight: ['light'],
      chroma: ['vivid'],
      backgrounds: ['solid'],
      visualMedia: ['ui', 'geometry'],
    },
    referenceEvidence: [
      {
        source: '原规范 L282–288、335–357、371–396、511–527',
        reason:
          '白大字/窄黑标语 → 白解释 → 淡紫工作板 → 回白 → 青柠结构/深蓝复盘/白模板目录。86px/340展示、320正文、黑白胶囊；粉彩是整板，Mono大写仅分类。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L282–288、335–357、371–396、511–527',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L282–288、335–357、371–396、511–527',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  framer: {
    name: 'Framer',
    summary: '纯黑工作画布、紧字距标题与浓烈渐变展示区。',
    category: 'creative',
    referenceFeatures: {
      moods: ['tech', 'playful', 'experimental'],
      tones: ['dark'],
      scenarios: ['product'],
      density: ['airy'],
      headingScale: ['display'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      backgrounds: ['solid', 'gradient'],
      visualMedia: ['type', 'ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L265–271、306–358、447–453',
        reason:
          '黑画布110px压紧标题/白胶囊 → 双列作品和一两张紫/橙聚光卡 → 大浏览器预览/暗页脚。显示字距约−5%、可变字体、15–20px卡/30px聚光，蓝仅焦点/选中。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L265–271、306–358、447–453',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L265–271、306–358、447–453',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  hashicorp: {
    name: 'HashiCorp',
    summary: '近黑基础设施画布，按产品区分强调色与技术层次。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      typography: ['sans'],
      layering: ['lines'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid'],
      visualMedia: ['render', 'type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L275–281、339–357、449–458、511–527',
        reason:
          '黑大标题/单产品体块 → 活动产品身份卡 → 炭灰能力行/资源缩略/黑页脚。500正文/600–700标题、白8px CTA、透明灰细线/亮度阶；紫黄青各是产品身份，营销不全等宽。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L275–281、339–357、449–458、511–527',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L275–281、339–357、449–458、511–527',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  hp: {
    name: 'HP',
    summary: '白纸般企业界面，以电光蓝和斜线装饰连接产品影像。',
    category: 'media',
    referenceFeatures: {
      moods: ['minimal', 'tech'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['balanced'],
      accentHues: ['blue'],
      headingWeight: ['medium'],
      headingScale: ['display'],
      backgrounds: ['solid'],
      visualMedia: ['photo', 'render'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L335–341、386–416、538–545、593–605',
        reason:
          '工具条/白导航 → 照片文案主板及蓝斜纹 → 类别图标/设备/灰场景 → 暗帮助区。`#024ad8`、72px/500、4px按钮/16px卡、克制Soft Lift与硬斜纹。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L335–341、386–416、538–545、593–605',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L335–341、386–416、538–545、593–605',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  ibm: {
    name: 'IBM',
    summary: 'Carbon 式方正网格、轻字重标题与明确的单一蓝色。',
    category: 'media',
    referenceFeatures: {
      moods: ['tech', 'minimal'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      typography: ['sans'],
      geometry: ['square'],
      layering: ['lines'],
      accentHues: ['blue'],
      headingWeight: ['light'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid', 'grid'],
      visualMedia: ['geometry', 'type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L273–280、326–382、455–467',
        reason:
          '灰工具条/48px导航 → 轻标题和平面图 → 16列体系下四列资源/能力行 → 蓝结尾/炭黑页脚。Plex Sans300展示/400正文、微正字距、`#0f62fe`、全方角/细线/下划线输入。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L273–280、326–382、455–467',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L273–280、326–382、455–467',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  intercom: {
    name: 'Intercom',
    summary: '奶油白与细边界产品卡片，以橙色突出 AI 品牌。',
    category: 'saas',
    referenceFeatures: {
      moods: ['editorial', 'tech', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      headingScale: ['display'],
      temperature: ['warm'],
      layouts: ['workspace'],
      accentHues: ['neutral'],
      headingWeight: ['medium'],
      chroma: ['muted'],
      backgrounds: ['solid'],
      visualMedia: ['ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L266–272、325–349、365–385、412–423、481–498',
        reason:
          '暖奶油72px标题 → 白框三栏收件箱 → 白知识片段/分类示范 → 暖结尾。`#f5f1ec`/`#111111`、500负字距、12px卡/16px样机；橙仅助手标签，不作通用CTA。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L266–272、325–349、365–385、412–423、481–498',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L266–272、325–349、365–385、412–423、481–498',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  jobright: {
    name: 'Jobright',
    summary: '春薄荷色、浓缩大标题与高对比黑色胶囊按钮。',
    category: 'ai',
    referenceFeatures: {
      moods: ['playful'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      typography: ['sans'],
      geometry: ['pill'],
      accentHues: ['neutral', 'green'],
      headingWeight: ['bold'],
      backgrounds: ['solid'],
      visualMedia: ['ui', 'illustration'],
    },
    referenceEvidence: [
      {
        source: '原规范 L282–294、317–340、451–472',
        reason:
          '浅薄荷首屏的匹配卡 → 白底项目列表 → 黑色项目条与交替说明 → 黑底人物故事/薄荷 FAQ。大面积 `#ecffe0`、少量 `#00f0a0`；Titillium Web 粗标题与 Inter 轻正文；黑主胶囊、绿色收尾胶囊，白卡保留单侧尖角。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L282–294、317–340、451–472',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L282–294、317–340、451–472',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  kraken: {
    name: 'Kraken',
    summary: '白色基底与坚定紫色，以清晰字阶建立可信赖感。',
    category: 'finance',
    referenceFeatures: {
      moods: ['minimal', 'tech'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      headingScale: ['regular'],
      accentHues: ['purple'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid'],
      visualMedia: ['geometry', 'ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L5–38、88–113、125',
        reason:
          '白底标题/紫色行动 → 可筛观察表与选中摘要 → 系列介绍与规则学习。白画布、`#7132f5`、`#101114`；48px负字距粗标题、12px按钮、冷蓝灰细分隔与极轻阴影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L5–38、88–113、125',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L5–38、88–113、125',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  lamborghini: {
    name: 'Lamborghini',
    summary: '纯黑舞台、白色标题与精准金色，影像占据主场。',
    category: 'auto',
    referenceFeatures: {
      moods: ['cinematic'],
      tones: ['dark'],
      scenarios: ['product'],
      density: ['airy'],
      layouts: ['chapters'],
      geometry: ['square'],
      backgrounds: ['image', 'solid'],
      accentHues: ['yellow'],
      visualMedia: ['photo', 'render'],
      typography: ['sans', 'condensed'],
    },
    referenceEvidence: [
      {
        source: '原规范 L5–20、64–67、138–155、174–202',
        reason:
          '全视口夜航场景/透明导航 → 巨大艇名、通栏侧影、技术剖面 → 配置演示。真黑/白/`#FFC000`金；超大全大写紧行高、零圆角、六边形暂停键、细进度线；不用阴影抬层。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L5–20、64–67、138–155、174–202',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L5–20、64–67、138–155、174–202',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  'linear.app': {
    name: 'Linear',
    summary: '近黑层次、精密排版与薰衣草蓝，沉静的产品界面感。',
    category: 'saas',
    referenceFeatures: {
      moods: ['minimal', 'tech'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      accentHues: ['purple'],
      headingWeight: ['medium'],
      headingScale: ['compact'],
      backgrounds: ['solid'],
      visualMedia: ['ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L260–275、312–347、382–405、462–474',
        reason:
          '短标题后立即是可操作发行面板 → 不同尺度 issue 列表、进展和变更日志 → 克制入口。`#010102`微蓝黑、四级暗表面、顶部细高光；薰衣草蓝仅行动/焦点；负字距中等字重，8/12/16px分工。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L260–275、312–347、382–405、462–474',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L260–275、312–347、382–405、462–474',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  lovable: {
    name: 'Lovable',
    summary: '羊皮纸般暖奶油底，亲近而克制的开发产品气质。',
    category: 'dev',
    referenceFeatures: {
      moods: ['minimal', 'editorial', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['airy'],
      temperature: ['warm'],
      geometry: ['pill'],
      backgrounds: ['paper', 'gradient'],
      accentHues: ['neutral'],
      chroma: ['muted'],
      visualMedia: ['type', 'ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L5–19、119–165、187–215',
        reason:
          '羊皮纸底的中央输入/建议胶囊 → 原位展开纸感行程 → 自然长度活动模板画廊。`#f7f4ed`、单色透明度层级、人文负字距标题、暖边框、黑按钮细高光；渐变只极淡地出现于首尾。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L5–19、119–165、187–215',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L5–19、119–165、187–215',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  mastercard: {
    name: 'Mastercard',
    summary: '石色纸感、信号橙与轨道般圆形构图，温暖而从容。',
    category: 'finance',
    referenceFeatures: {
      moods: ['editorial'],
      tones: ['light'],
      scenarios: ['product', 'content'],
      density: ['airy'],
      temperature: ['warm'],
      geometry: ['pill', 'rounded'],
      layering: ['shadow'],
      accentHues: ['neutral'],
      headingWeight: ['medium'],
      backgrounds: ['solid', 'image'],
      visualMedia: ['photo'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L5–19、57–88、146–175、211–217、239–260',
        reason:
          '白色悬浮胶囊导航/40px体育场式影像 → 非对称人物圆像与水印标题/橙色细轨道 → 暗暖黑信息区。石膏奶油 `#F3F0EE`、圆/椭圆、大弧度；白色卫星箭头，500/450轻中标题/正文，黑色正文 CTA。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L5–19、57–88、146–175、211–217、239–260',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L5–19、57–88、146–175、211–217、239–260',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  mercury: {
    name: 'Mercury',
    summary: '墨紫夜景与近白产品页，以靛蓝动作和轻字重连接。',
    category: 'finance',
    referenceFeatures: {
      moods: ['minimal', 'editorial'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['airy'],
      layouts: ['centered'],
      geometry: ['pill'],
      layering: ['solid'],
      accentHues: ['blue'],
      headingWeight: ['regular'],
      chroma: ['muted'],
      backgrounds: ['solid', 'gradient'],
      visualMedia: ['render', 'ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L323–359、383–389、419–439、469–491',
        reason:
          '夜紫导航/柔光物件及收支卡 → 近白/淡紫的产品演示 → 居中引语/深色页脚。`#171721`、`#edecfb`、`#5266eb`；360/420/480轻字重、单实色主按钮、半透明次胶囊，填色卡而非强描边。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L323–359、383–389、419–439、469–491',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L323–359、383–389、419–439、469–491',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  meta: {
    name: 'Meta',
    summary: '白色产品展陈、整幅摄影与蓝色购买入口。',
    category: 'retail',
    referenceFeatures: {
      moods: ['minimal', 'cinematic'],
      tones: ['light'],
      scenarios: ['product', 'commerce'],
      density: ['airy'],
      visualMedia: ['photo', 'render'],
      layouts: ['chapters'],
      geometry: ['pill'],
      accentHues: ['neutral', 'blue'],
      headingWeight: ['medium'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L353–363、400–445、597–612、623–636、655–666',
        reason:
          '58/42画廊/固定配置栏 → 生活方式通栏摄影 → 无边框功能卡/规格/FAQ。白底、32/40px摄影卡；黑色营销胶囊与配置区钴蓝分工；300编辑标题对500展示字、圆形色样、8px选项。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L353–363、400–445、597–612、623–636、655–666',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L353–363、400–445、597–612、623–636、655–666',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  minimax: {
    name: 'MiniMax',
    summary: '黑白基础界面与高饱和渐变产品卡片，模型各有表情。',
    category: 'ai',
    referenceFeatures: {
      moods: ['tech', 'playful'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      typography: ['sans'],
      headingScale: ['display'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      backgrounds: ['solid'],
      visualMedia: ['illustration', 'ui'],
    },
    referenceEvidence: [
      {
        source: '原规范 L383–394、433–462、543–559、648–668、717–729',
        reason:
          '白底80px紧凑标题 → 四张唱片封面式彩卡 → 当前作品工作台 → 白色能力/材料表 → 黑页脚。DM Sans 单字体，黑主胶囊/描边次胶囊；珊瑚/洋红/蓝/紫编码作品；彩卡32px、白卡16px。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L383–394、433–462、543–559、648–668、717–729',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L383–394、433–462、543–559、648–668、717–729',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  mintlify: {
    name: 'Mintlify',
    summary: '天空渐变营销页与三栏技术文档，以绿色串联。',
    category: 'saas',
    referenceFeatures: {
      moods: ['tech', 'editorial'],
      tones: ['mixed'],
      scenarios: ['product', 'content', 'tool'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      temperature: ['warm'],
      visualMedia: ['code', 'illustration'],
      layouts: ['workspace', 'directory'],
      geometry: ['pill'],
      accentHues: ['neutral', 'green'],
      headingScale: ['compact'],
      backgrounds: ['solid', 'gradient'],
    },
    referenceEvidence: [
      {
        source: '原规范 L455–466、510–515、557–565、722–767、821–834',
        reason:
          '小幅天空蓝到奶油介绍带 → 真正的左目录/正文/右 TOC 三栏文档 → 暖橙作者提示。Inter/Geist Mono、薄荷活动项/确认、黑胶囊、12px产品框；云朵与精密代码密度形成反差。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L455–466、510–515、557–565、722–767、821–834',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L455–466、510–515、557–565、722–767、821–834',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  miro: {
    name: 'Miro',
    summary: '金丝雀黄、彩色便签面板与真实白板式产品表达。',
    category: 'creative',
    referenceFeatures: {
      moods: ['playful'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      backgrounds: ['solid'],
      visualMedia: ['ui', 'geometry'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L441–452、503–550、744–749、770–776、795–807',
        reason:
          '白底短引导/黑主胶囊 → 可操作便签工作板 → 粉/青/珊瑚案例章节 → 黑色收尾。少量金丝雀黄、圆润几何字、白板图形主导、轻卡与黑胶囊并存。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L441–452、503–550、744–749、770–776、795–807',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L441–452、503–550、744–749、770–776、795–807',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  'mistral.ai': {
    name: 'Mistral AI',
    summary: '暖奶油底、日落条纹与山景影像，带着独特的暖意。',
    category: 'ai',
    referenceFeatures: {
      moods: ['editorial', 'playful', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'content'],
      density: ['airy'],
      typography: ['sans', 'mono'],
      temperature: ['warm'],
      visualMedia: ['photo', 'code'],
      layouts: ['split'],
      backgrounds: ['solid'],
      accentHues: ['orange'],
    },
    referenceEvidence: [
      {
        source: '原规范 L404–414、463–468、509–517、688–705、718–724',
        reason:
          '落日山景与编辑大字分栏 → 奶油档案/暗色代码/开放资料交替 → 红橙黄奶油日落色条连接页脚。近衬线展示/Inter/JetBrains Mono；橙行动，8px按钮/12px卡；暖黄奶油是表面而非所有内容的渐变。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L404–414、463–468、509–517、688–705、718–724',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L404–414、463–468、509–517、688–705、718–724',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  mongodb: {
    name: 'MongoDB',
    summary: '深青绿产品区与白色文档，以明绿行动按钮贯穿。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech'],
      tones: ['mixed'],
      scenarios: ['product', 'content', 'tool'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      visualMedia: ['code', 'ui'],
      layouts: ['directory'],
      geometry: ['pill'],
      accentHues: ['green'],
      backgrounds: ['solid'],
    },
    referenceEvidence: [
      {
        source: '原规范 L407–417、465–509、683–695、712–718、737–749',
        reason:
          '深海青首屏/终端/亮绿行动 → 白色密集课程目录 → 深青练习入口。几何 sans、12px课程卡/胶囊按钮；橙/紫/绿/青是分类标签，不是随意装饰。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L407–417、465–509、683–695、712–718、737–749',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L407–417、465–509、683–695、712–718、737–749',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  mydealz: {
    name: 'mydealz',
    summary: '白卡片信息流、品牌绿与冷热投票，紧凑而易扫读。',
    category: 'retail',
    referenceFeatures: {
      moods: ['playful'],
      tones: ['light'],
      scenarios: ['commerce', 'content'],
      density: ['dense'],
      accentHues: ['green'],
      headingWeight: ['bold'],
      headingScale: ['compact'],
      backgrounds: ['solid'],
      visualMedia: ['ui', 'render'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L296–339、355–374、476–498',
        reason:
          '紧凑搜索导航 → 横向商品主栏/讨论侧栏 → 连续列表及本地分页，首屏直接看见多条商品。冷灰/白8px条目、绿色价格/行动、红温度/蓝降温/薄荷标签；500/700两档字。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L296–339、355–374、476–498',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L296–339、355–374、476–498',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  nerdwallet: {
    name: 'NerdWallet',
    summary: '深绿与薄荷色分区，以细线和紧凑表格组织金融信息。',
    category: 'finance',
    referenceFeatures: {
      moods: ['editorial'],
      tones: ['light'],
      scenarios: ['content', 'tool'],
      density: ['dense'],
      accentHues: ['green'],
      headingWeight: ['bold'],
      backgrounds: ['solid'],
      visualMedia: ['type', 'ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L372–400、429–459、470–476、621–638',
        reason:
          '全宽绿标题带/作者及口径 → 白底指南 → 薄荷计算面板/成本比较 → 提示及 FAQ。`#008254`云杉绿/多层薄荷、2px方正按钮、300正文/700标题、细分隔/近无阴影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L372–400、429–459、470–476、621–638',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L372–400、429–459、470–476、621–638',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  nike: {
    name: 'Nike',
    summary: '大写运动标题与整幅摄影，黑白零售界面退居其后。',
    category: 'retail',
    referenceFeatures: {
      moods: ['cinematic', 'editorial'],
      tones: ['mixed'],
      scenarios: ['commerce', 'product'],
      density: ['balanced'],
      chroma: ['mono'],
      visualMedia: ['photo'],
      geometry: ['square', 'pill'],
      backgrounds: ['image', 'solid'],
      accentHues: ['neutral'],
      headingScale: ['display'],
      temperature: ['neutral'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L263–276、317–365、498–501、519–526、546–557',
        reason:
          '满幅运动摄影/极短巨型标语 → 无边框商品矩阵 → 场景轨道/单幅专题故事 → 分隔式详情。黑白/`#f5f5f5`、96px/0.9全大写、黑胶囊；商品图零圆角零阴影，颜色留给摄影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L263–276、317–365、498–501、519–526、546–557',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L263–276、317–365、498–501、519–526、546–557',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  'nintendo-2001': {
    name: 'Nintendo · 2001',
    summary: '拉丝紫蓝金属面板、斜面按钮与 Y2K 游戏机界面。',
    category: 'retro',
    referenceFeatures: {
      moods: ['retro', 'playful'],
      tones: ['mixed'],
      scenarios: ['product', 'content'],
      density: ['dense'],
      typography: ['sans', 'pixel'],
      visualMedia: ['pixel', 'illustration'],
      geometry: ['cut'],
      accentHues: ['yellow', 'orange'],
      headingScale: ['compact'],
      chroma: ['vivid'],
      backgrounds: ['solid', 'grid'],
    },
    referenceEvidence: [
      {
        source: '原规范 L348–419、428–455、555–583',
        reason:
          '像素角色说话框/搜索 → 双层导航 → 约800px机器面板/大封面 → 2/3新闻、1/3侧栏。长春花金属板、硬斜面/45°切角、碳蓝网点、金菜单/橙箭头，Arial小字与描边盒装标题。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L348–419、428–455、555–583',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L348–419、428–455、555–583',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  notion: {
    name: 'Notion',
    summary: '深蓝主视觉、紫色行动按钮与丰富的彩色插画卡片。',
    category: 'saas',
    referenceFeatures: {
      moods: ['playful', 'tech'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      visualMedia: ['ui', 'illustration'],
      accentHues: ['purple'],
      headingWeight: ['bold'],
      chroma: ['vivid'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L448–463、529–555、608–625、745–748、792–804',
        reason:
          '深海军蓝/彩点线框插画/紫行动 → 可操作编辑部面板 → 鲜黄横幅和桃/粉/薄荷资料模块 → 浅页脚。600/400字重、8px矩形按钮/12px卡；真实文档层级与彩色属性。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L448–463、529–555、608–625、745–748、792–804',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L448–463、529–555、608–625、745–748、792–804',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  nvidia: {
    name: 'NVIDIA',
    summary: '黑白工程画布、锐利几何与高饱和绿色信号。',
    category: 'media',
    referenceFeatures: {
      moods: ['tech'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['dense'],
      visualMedia: ['render'],
      layouts: ['editorial'],
      accentHues: ['green'],
      headingWeight: ['bold'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid', 'image'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L309–339、366–415、610–622',
        reason:
          '黑色工程渲染首屏/明确技术标题 → 白色资源网格/规格/开发指南 → 黑色专题及结构页脚。`#76b900`唯一高饱和行动、2px微圆角、400/700强分工；灰细边无阴影，卡角绿色小方块。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L309–339、366–415、610–622',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L309–339、366–415、610–622',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  ollama: {
    name: 'Ollama',
    summary: '像 README 一样直接：白底、终端命令与手绘羊驼。',
    category: 'ai',
    referenceFeatures: {
      moods: ['minimal', 'tech'],
      tones: ['light'],
      scenarios: ['product', 'content', 'tool'],
      density: ['airy'],
      chroma: ['mono'],
      temperature: ['neutral'],
      visualMedia: ['illustration', 'code'],
      layouts: ['split'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      headingWeight: ['medium'],
      headingScale: ['regular'],
      backgrounds: ['solid'],
      typography: ['sans', 'mono'],
    },
    referenceEvidence: [
      {
        source: '原规范 L250–263、302–349、428–449、511–521',
        reason:
          '720px窄白列/36px圆润标题/线描小鹅/命令胶囊 → 一处文字终端分栏 → 用法和始终展开 FAQ。纯白、黑胶囊、500/600圆润字、12px细边终端/交通灯、大间隔。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L250–263、302–349、428–449、511–521',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L250–263、302–349、428–449、511–521',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  'opencode.ai': {
    name: 'OpenCode',
    summary: '全等宽字、暖白底与 ASCII 标记，终端原生的表达。',
    category: 'ai',
    referenceFeatures: {
      moods: ['tech', 'minimal'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      chroma: ['mono'],
      typography: ['mono', 'pixel'],
      visualMedia: ['pixel', 'code'],
      accentHues: ['neutral'],
      backgrounds: ['solid'],
    },
    referenceEvidence: [
      {
        source: '原规范 L225–238、282–342、413–427、469–476',
        reason:
          'manpage 引言/ASCII字标 → 大幅暗终端 → `[+]`规则列表、Fig编号例子与问答。全等宽、`#fdfcfc`/`#201d1d`、4px按钮/1px线；语义色仅终端内，无摄影/普通图标。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L225–238、282–342、413–427、469–476',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L225–238、282–342、413–427、469–476',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  oracle: {
    name: 'Oracle',
    summary: '暖中性层次、衬线产品标题与几乎只用炭黑的动作。',
    category: 'dev',
    referenceFeatures: {
      moods: ['editorial', 'minimal'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      chroma: ['mono'],
      typography: ['serif', 'sans'],
      layouts: ['chapters'],
      geometry: ['square'],
      accentHues: ['neutral'],
      backgrounds: ['solid'],
      visualMedia: ['geometry', 'type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L416–452、471–478、509–530、649–670',
        reason:
          '白企业抬头/深色粘性子导航 → 暖灰 Georgia 产品标题和唯一40×4px金线 → 白/暖白通栏案例资料 → 青色短带。暖中性六阶、炭灰4px按钮、正文Inter350/小标题800；通栏零圆角/无阴影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L416–452、471–478、509–530、649–670',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L416–452、471–478、509–530、649–670',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  oura: {
    name: 'Oura',
    summary: '暖纸色与大地色摄影，编辑式衬线配上克制行动蓝。',
    category: 'media',
    referenceFeatures: {
      moods: ['editorial', 'cinematic', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'commerce'],
      density: ['airy'],
      typography: ['serif', 'sans'],
      temperature: ['warm'],
      visualMedia: ['photo'],
      accentHues: ['blue'],
      headingWeight: ['light'],
      chroma: ['muted'],
      backgrounds: ['paper', 'image'],
    },
    referenceEvidence: [
      {
        source: '原规范 L337–371、385–455、502–503、610–616',
        reason:
          '暖纸轻衬线/晨光生活摄影 → 芥末/橄榄习惯章节、银灰手帐物件 → 黑底阅读摘录。`#f7f1e8`、高对比轻衬线/中性sans、石褐次行动、`#2a72de`主行动；长留白与照片主导。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L337–371、385–455、502–503、610–616',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L337–371、385–455、502–503、610–616',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  pinterest: {
    name: 'Pinterest',
    summary: '影像主导的瀑布流与暖白框架，以红色突出入口。',
    category: 'media',
    referenceFeatures: {
      moods: ['playful', 'editorial'],
      tones: ['light'],
      scenarios: ['content', 'commerce'],
      density: ['dense'],
      layouts: ['masonry'],
      accentHues: ['red'],
      headingScale: ['compact'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid'],
      visualMedia: ['photo'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L286–299、344–387、478–500、539–542、590–597',
        reason:
          '粘性导航/搜索主题条 → 自然纵横比瀑布流 → 一处非对称主题图文；图像占首屏主体。`#f6f6f3`、`#e60023`主行动、16px图片/输入/32px大图，8px紧间距与负字距大字。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L286–299、344–387、478–500、539–542、590–597',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L286–299、344–387、478–500、539–542、590–597',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  playstation: {
    name: 'PlayStation',
    summary: '黑、白、蓝三种整幅章节，轻标题与游戏影像相接。',
    category: 'media',
    referenceFeatures: {
      moods: ['cinematic', 'tech'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['balanced'],
      geometry: ['pill'],
      accentHues: ['blue'],
      headingWeight: ['light'],
      backgrounds: ['image', 'solid'],
      visualMedia: ['illustration'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L318–355、378–428、523–534、602–609',
        reason:
          '黑色单作主视觉 → 白色玩法 → 黑色16:9作品轨道 → 白日程资讯 → 蓝色行动章。黑/白/`#0070d1`三画布、300轻字/700按钮、全胶囊/8px内容卡，影像主导。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L318–355、378–428、523–534、602–609',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L318–355、378–428、523–534、602–609',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  posthog: {
    name: 'PostHog',
    summary: '暖奶油画布、手绘刺猬与黄橙入口，像友好工程手册。',
    category: 'dev',
    referenceFeatures: {
      moods: ['playful', 'editorial', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'tool', 'content'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      temperature: ['warm'],
      visualMedia: ['illustration', 'code'],
      layouts: ['directory'],
      geometry: ['pill'],
      accentHues: ['yellow'],
      chroma: ['muted'],
      backgrounds: ['solid'],
    },
    referenceEvidence: [
      {
        source: '原规范 L359–372、412–483、557–574、634–639、683–690',
        reason:
          '暖奶油连续画布/小文档目录/白正文卡 → 暗橄榄代码岛、粉彩提示和刺猬旁注。`#eeefe9`/深橄榄、`#f7a501`主胶囊；IBM Plex Sans 层级、6/8px卡/细橄榄边。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L359–372、412–483、557–574、634–639、683–690',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L359–372、412–483、557–574、634–639、683–690',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  raycast: {
    name: 'Raycast',
    summary: '连续近黑画布、命令面板式卡片与细线边界。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech', 'minimal'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      chroma: ['mono'],
      typography: ['sans', 'mono'],
      accentHues: ['neutral'],
      temperature: ['neutral'],
      backgrounds: ['solid'],
      visualMedia: ['ui'],
    },
    referenceEvidence: [
      {
        source: '原规范 L332–345、388–453、565–574、610–618、636–650',
        reason:
          '仅一次红斜纹开场 → 真正可用命令面板 → 扩展轨道/操作例子。`#07080a`及四级暗面、白 CTA、1px灰边、Inter `ss03`特性与实体键帽；彩色只给扩展图标。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L332–345、388–453、565–574、610–618、636–650',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L332–345、388–453、565–574、610–618、636–650',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  renault: {
    name: 'Renault',
    summary: '黑白摄影画布、阳光黄与方正轮廓，直接而有力。',
    category: 'auto',
    referenceFeatures: {
      moods: ['cinematic'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['balanced'],
      layouts: ['directory', 'chapters'],
      geometry: ['square'],
      layering: ['solid'],
      accentHues: ['yellow'],
      headingWeight: ['bold'],
      backgrounds: ['solid'],
      visualMedia: ['render'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L269–303、333–398、419–432、492–500、536–543、563–573',
        reason:
          '白色方正车型目录 → 黑色产品故事/通栏侧影 → 60/40配置器 → 阳光黄强调/黑页脚。黑白/`#ffed00`、700/0.95紧字、400正文；零圆角图/2px按钮，靠色块而非阴影分章。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L269–303、333–398、419–432、492–500、536–543、563–573',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L269–303、333–398、419–432、492–500、536–543、563–573',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  replicate: {
    name: 'Replicate',
    summary: '奶油纸感、醒目橙色与等宽代码，像一本 AI 实验手册。',
    category: 'ai',
    referenceFeatures: {
      moods: ['editorial', 'tech', 'experimental'],
      tones: ['light'],
      scenarios: ['product', 'tool', 'content'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      headingScale: ['display'],
      temperature: ['warm'],
      visualMedia: ['illustration', 'code'],
      layouts: ['split', 'directory'],
      geometry: ['pill'],
      accentHues: ['orange'],
      headingWeight: ['bold'],
      backgrounds: ['solid'],
    },
    referenceEvidence: [
      {
        source: '原规范 L291–324、362–370、412–457、502–508、590–616',
        reason:
          '奶油刊头/单块橙宣言 → 方作品目录 → 深色分栏实验笔记 → 奶油收尾。`#f9f7f3`/`#ea2804`、72–128px紧粗展示、深色Mono代码井，胶囊与10px作品框分工。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L291–324、362–370、412–457、502–508、590–616',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L291–324、362–370、412–457、502–508、590–616',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  resend: {
    name: 'Resend',
    summary: '近黑细线界面，以大幅衬线标题带来刊物般气质。',
    category: 'saas',
    referenceFeatures: {
      moods: ['editorial', 'tech'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['airy'],
      chroma: ['mono'],
      typography: ['serif', 'sans', 'mono'],
      headingScale: ['display'],
      visualMedia: ['type', 'code', 'ui'],
      layouts: ['split'],
      accentHues: ['neutral'],
      headingWeight: ['regular'],
      backgrounds: ['solid', 'gradient'],
    },
    referenceEvidence: [
      {
        source: '原规范 L267–298、336–345、384–410、451–481、559–585',
        reason:
          '纯黑大衬线标题 → 下一段才有极淡蓝光 → 代码/叙述分栏 → 一封孤立白邮件打断暗节奏 → 事件说明。76–96px常规衬线、6%/14%白线、白8px主按钮、12px代码窗/交通灯。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L267–298、336–345、384–410、451–481、559–585',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L267–298、336–345、384–410、451–481、559–585',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  revolut: {
    name: 'Revolut',
    summary: '黑色大幅产品影像，巨型标题与浓郁钴紫色强调。',
    category: 'finance',
    referenceFeatures: {
      moods: ['cinematic', 'tech'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['airy'],
      headingScale: ['display'],
      layouts: ['directory'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      headingWeight: ['medium'],
      backgrounds: ['solid'],
      visualMedia: ['render'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L302–333、381–473、478–529、611–636',
        reason:
          '真黑巨大短句/通行证产品照 → 硬切白权益目录 → 黑底四档比较。80–136px/500紧字、暗区白胶囊、20px卡/12px输入、钴紫仅推荐项；黑白带无卡影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L302–333、381–473、478–529、611–636',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L302–333、381–473、478–529、611–636',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  runwayml: {
    name: 'Runway',
    summary: '电影制作般的深色编辑界面，让整幅影像成为语言。',
    category: 'ai',
    referenceFeatures: {
      moods: ['cinematic', 'editorial'],
      tones: ['dark'],
      scenarios: ['product', 'content'],
      density: ['airy'],
      chroma: ['mono'],
      layouts: ['editorial'],
      backgrounds: ['image', 'solid'],
      layering: ['lines'],
      accentHues: ['neutral'],
      headingWeight: ['regular'],
      headingScale: ['regular'],
      temperature: ['neutral'],
      visualMedia: ['photo'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L3–19、46–75、100–127、137–164、190–217',
        reason:
          '完整电影构图占首屏/仅片名与放映口 → 一大两小不等幅镜头网格 → 冷白研究笔记/黑导演宣言。48px/400几何字、黑/冷灰、4–8px小角、无影无界面渐变，颜色来自影像。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L3–19、46–75、100–127、137–164、190–217',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L3–19、46–75、100–127、137–164、190–217',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  sanity: {
    name: 'Sanity',
    summary: '近黑内容平台、结构化网格与单一珊瑚红重点。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech', 'editorial'],
      tones: ['dark'],
      scenarios: ['product', 'tool', 'content'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      headingScale: ['display'],
      geometry: ['pill'],
      accentHues: ['red', 'blue'],
      backgrounds: ['solid'],
      visualMedia: ['ui', 'code'],
    },
    referenceEvidence: [
      {
        source: '原规范 L3–68、91–96、159–168、230–264、304–317',
        reason:
          '112px紧标题/无色黑底 → 字段树/JSON/文章三联 → 大留白关系、复用、校验章节。`#0b0b0b`/`#212121`/`#353535`、珊瑚主行动/电蓝激活、Mono大写标签、3px输入/6px框/胶囊动作。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L3–68、91–96、159–168、230–264、304–317',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L3–68、91–96、159–168、230–264、304–317',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  sap: {
    name: 'SAP',
    summary: '白色企业应用框架，扁平灰色分区与明确的蓝色动作。',
    category: 'saas',
    referenceFeatures: {
      moods: ['tech', 'minimal'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['dense'],
      accentHues: ['blue'],
      backgrounds: ['solid'],
      visualMedia: ['geometry'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L356–371、402–470、489–548、619–639',
        reason:
          '60px全局栏/面包屑/标签轨 → 深蓝服务简介 → 白两列要求/淡蓝适用范围/灰文件区 → 法规说明。`#0057d2`单行动、黑字/石板正文、350列表/400导航、8px控件/12px媒体/方整带。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L356–371、402–470、489–548、619–639',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L356–371、402–470、489–548、619–639',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  sentry: {
    name: 'Sentry',
    summary: '深紫夜色、亮柠檬绿与贴纸式插画，技术感不失个性。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech', 'playful'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      backgrounds: ['solid', 'texture'],
      accentHues: ['neutral'],
      visualMedia: ['illustration', 'ui', 'code'],
      typography: ['sans', 'mono'],
    },
    referenceEvidence: [
      {
        source: '原规范 L275–322、326–455、469–489、531–541',
        reason:
          '紫夜星点/一个荧光关键词/跨区贴纸 → 错位演练产品窗 → 白色密集诊断 → 荧光曲线结尾。`#1f1633`/`#c2ef4e`、Rubik正文/大写按钮、营销2.0行高对报告1.5，角色不关卡里。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L275–322、326–455、469–489、531–541',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L275–322、326–455、469–489、531–541',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  shopify: {
    name: 'Shopify',
    summary: '深色电影叙事与奶油薄荷交易页，呈现两种商业节奏。',
    category: 'retail',
    referenceFeatures: {
      moods: ['cinematic'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['airy'],
      visualMedia: ['photo', 'type'],
      layouts: ['directory'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      headingWeight: ['light'],
      headingScale: ['display'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L266–281、314–429、452–475、499–516',
        reason:
          '选源文全黑电影轨：96px细字与摄影分置 → 三段跨幅工坊叙事/负空间 → 器物目录。330显示字/+2.4px正字距、白描边胶囊、摄影越容器，不用大遮罩压文。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L266–281、314–429、452–475、499–516',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L266–281、314–429、452–475、499–516',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  slack: {
    name: 'Slack',
    summary: '深茄紫品牌色、奶油薰衣草底与柔和产品合成画面。',
    category: 'saas',
    referenceFeatures: {
      moods: ['playful', 'tech', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      temperature: ['warm'],
      layouts: ['editorial'],
      backgrounds: ['solid', 'grid'],
      accentHues: ['purple'],
      headingScale: ['display'],
      chroma: ['muted'],
      visualMedia: ['ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L236–251、284–318、328–419、464–482',
        reason:
          '奶油薰衣草首屏/64px密字/柔网格中的话题板 → 集合、准备、回顾情景 → 茄紫收尾。`#4a154b`、柔桃/灰绿气氛、90px半径舒适按钮、蓝仅正文链接，局部4:3面板可读。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L236–251、284–318、328–419、464–482',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L236–251、284–318、328–419、464–482',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  spacex: {
    name: 'SpaceX',
    summary: '黑白极简与整幅航天影像，大写字与描边动作退后。',
    category: 'media',
    referenceFeatures: {
      moods: ['cinematic', 'minimal'],
      tones: ['dark'],
      scenarios: ['product', 'content'],
      density: ['airy'],
      chroma: ['mono'],
      backgrounds: ['image', 'solid'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      headingScale: ['display'],
      temperature: ['neutral'],
      visualMedia: ['photo'],
      typography: ['sans', 'condensed'],
    },
    referenceEvidence: [
      {
        source: '原规范 L151–165、195–265、295–326、346–353',
        reason:
          '三段独立满幅极地/海洋影像，工程大写标题/单描边行动落在画面负空间 → 黑底任务简报/极简脚注。黑白UI、80px/700/0.95窄字与正字距、透明导航，不加填色玻璃/遮罩渐变。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L151–165、195–265、295–326、346–353',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L151–165、195–265、295–326、346–353',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  spotify: {
    name: 'Spotify',
    summary: '近黑沉浸界面，让专辑封面和标志性绿色浮到前景。',
    category: 'media',
    referenceFeatures: {
      moods: ['playful'],
      tones: ['dark'],
      scenarios: ['content', 'tool'],
      density: ['dense'],
      headingScale: ['compact'],
      layouts: ['editorial'],
      geometry: ['pill'],
      accentHues: ['green'],
      temperature: ['neutral'],
      chroma: ['mono'],
      backgrounds: ['solid'],
      visualMedia: ['ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L3–19、54–83、117–180、215–220',
        reason:
          '资料库侧栏/紧封面网格与曲目列表/底部持续播放条/可展开队列，是完整应用不加营销hero。`#121212`/`#181818`/`#1f1f1f`暗层，绿仅播放/活动、10–24px紧字、圆播放/胶囊搜索/6–8px封面。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L3–19、54–83、117–180、215–220',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L3–19、54–83、117–180、215–220',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  starbucks: {
    name: 'Starbucks',
    summary: '咖啡馆般奶油底与多层大地绿，温暖且清晰的零售感。',
    category: 'retail',
    referenceFeatures: {
      moods: ['editorial', 'warm'],
      tones: ['light'],
      scenarios: ['commerce', 'product'],
      density: ['balanced'],
      temperature: ['warm'],
      visualMedia: ['photo', 'ui'],
      geometry: ['pill'],
      accentHues: ['green'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L3–64、119–128、183–191、273–393、500–521',
        reason:
          '40/60摄影/配置 → 深绿描述带/配方摘要 → 尺寸、配料和示例说明/浮动盘入口。奶油陶瓷底、`#006241`标题/`#00754A`行动/`#1E3932`分带、50px胶囊/12px卡，按下反馈。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L3–64、119–128、183–191、273–393、500–521',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L3–64、119–128、183–191、273–393、500–521',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  stripe: {
    name: 'Stripe',
    summary: '海军蓝文字、靛蓝与空气感渐变，轻字重的金融表达。',
    category: 'finance',
    referenceFeatures: {
      moods: ['tech', 'editorial'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      headingScale: ['regular'],
      temperature: ['warm'],
      visualMedia: ['ui', 'code', 'geometry'],
      geometry: ['pill'],
      layering: ['lines'],
      accentHues: ['purple'],
      headingWeight: ['light'],
      backgrounds: ['solid', 'gradient'],
      typography: ['sans', 'mono'],
    },
    referenceEvidence: [
      {
        source: '原规范 L246–261、295–358、404–429、470–477',
        reason:
          '首屏上1/3有机mesh/56px轻标题/票务账本代码三层 → 白流程/奶油案例/海军代码章。`#533afd`唯一行动、`#0d253d`深字非纯黑、300显示字/tnum金额、短胶囊/细线/微冷影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L246–261、295–358、404–429、470–477',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L246–261、295–358、404–429、470–477',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  supabase: {
    name: 'Supabase',
    summary: '黑白近中性框架与单一翡翠绿，突出产品界面细节。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech', 'minimal'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      headingScale: ['display'],
      visualMedia: ['ui', 'code'],
      backgrounds: ['solid'],
      accentHues: ['green'],
      headingWeight: ['medium'],
      typography: ['sans', 'mono'],
    },
    referenceEvidence: [
      {
        source: '原规范 L226–241、274–335、353–385、405–430、447–462',
        reason:
          '白营销轨64px中标题/绿行动 → SQL、表、变更流叠窗 → 录入/查询/观察章节。白/`#171717`、`#3ecf8e`配深字、500负字距、6px技术钮/12px窗；暗色仅代码，无气氛渐变。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L226–241、274–335、353–385、405–430、447–462',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L226–241、274–335、353–385、405–430、447–462',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  superhuman: {
    name: 'Superhuman',
    summary: '靛蓝夜色主视觉与安静白色正文，像高端编辑刊物。',
    category: 'dev',
    referenceFeatures: {
      moods: ['editorial', 'minimal'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['airy'],
      geometry: ['pill'],
      accentHues: ['purple'],
      headingWeight: ['medium'],
      backgrounds: ['solid', 'gradient'],
      visualMedia: ['photo', 'ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L214–231、260–333、337–364、387–413、431–439',
        reason:
          '靛蓝天空/半幅侧望肖像/单行动 → 白底Focus、Review、Plan叙事行 → 深青绿结尾。`#1b1938`/白/`#0e3030`三拍、460/540变量字重/0.96展示行高、暖灰正文；hero淡紫胶囊、正文及结尾8px矩形。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L214–231、260–333、337–364、387–413、431–439',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L214–231、260–333、337–364、387–413、431–439',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  tesla: {
    name: 'Tesla',
    summary: '全屏产品摄影与几乎消失的界面，把减法做到极致。',
    category: 'auto',
    referenceFeatures: {
      moods: ['cinematic', 'minimal'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['airy'],
      chroma: ['mono'],
      layouts: ['directory'],
      backgrounds: ['image', 'solid'],
      accentHues: ['blue'],
      headingWeight: ['medium'],
      headingScale: ['regular'],
      temperature: ['neutral'],
      visualMedia: ['photo', 'render'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L3–20、55–129、139–176、208–259',
        reason:
          '100vh环境图/40px型号/双行动 → 舱型逐屏 → 两幅2:1情景目录/轻问答。`#3E6AE1`唯一蓝、400/500正常字距、4px CTA、透明/白导航、无卡影/装饰渐变，一屏一事。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L3–20、55–129、139–176、208–259',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L3–20、55–129、139–176、208–259',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  theverge: {
    name: 'The Verge',
    summary: '近黑底、巨型标题与酸薄荷色信息流，像科技锐舞海报。',
    category: 'media',
    referenceFeatures: {
      moods: ['editorial', 'playful', 'experimental'],
      tones: ['dark'],
      scenarios: ['content'],
      density: ['dense'],
      typography: ['sans', 'condensed'],
      backgrounds: ['solid'],
      accentHues: ['green', 'purple'],
      visualMedia: ['type', 'photo'],
    },
    referenceEvidence: [
      {
        source: '原规范 L3–18、55–97、148–199、211–250、280–310',
        reason:
          '巨大原创刊名/重磅报道 → 持续时间轨/贴纸彩故事块/黑空段交错 → 阅读存档。`#131313`、酸薄荷/紫外线、重窄字对300眉题、Mono大写时间戳、20–24px彩块/1px轨，无渐变影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L3–18、55–97、148–199、211–250、280–310',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L3–18、55–97、148–199、211–250、280–310',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  'together.ai': {
    name: 'Together AI',
    summary: '黑白技术章节之间，以橙、洋红和蓝紫渐变衔接。',
    category: 'ai',
    referenceFeatures: {
      moods: ['tech'],
      tones: ['mixed'],
      scenarios: ['product', 'tool', 'content'],
      density: ['balanced'],
      typography: ['sans', 'mono'],
      layering: ['lines'],
      accentHues: ['neutral'],
      backgrounds: ['solid'],
      visualMedia: ['geometry', 'ui'],
    },
    referenceEvidence: [
      {
        source: '原规范 L331–411、422–459、476–528、549–579、618–633',
        reason:
          '暗海军左文/右完整三色带 → 白色密模型表 → 淡青统计/暗研究引用 → 巨淡字收尾。橙→洋红→长春花为完整SVG，句式标题/Mono大写标签、黑行动、4px角/细线无影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L331–411、422–459、476–528、549–579、618–633',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L331–411、422–459、476–528、549–579、618–633',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  uber: {
    name: 'Uber',
    summary: '有力的黑白节奏、几何标题与城市感编辑插画。',
    category: 'auto',
    referenceFeatures: {
      moods: ['minimal', 'editorial'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      chroma: ['mono'],
      visualMedia: ['illustration', 'ui'],
      geometry: ['pill'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      headingScale: ['regular'],
      temperature: ['neutral'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L324–338、364–445、448–480、499–558、619–636',
        reason:
          '白粗字/路线表单及原创示意地图 → 服务横类/左右交替交通插画 → 黑色志愿者章/黑页尾。黑白灰UI、52px/700正常字距、胶囊/16px卡/8px输入，明显影只给路线表单。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L324–338、364–445、448–480、499–558、619–636',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L324–338、364–445、448–480、499–558、619–636',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  vercel: {
    name: 'Vercel',
    summary: '黑白精密界面，以彩色网格光晕突出主视觉。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech', 'minimal'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      chroma: ['mono'],
      typography: ['sans', 'mono'],
      layouts: ['centered'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      headingScale: ['regular'],
      temperature: ['neutral'],
      backgrounds: ['solid', 'gradient'],
      visualMedia: ['type', 'geometry', 'code'],
    },
    referenceEvidence: [
      {
        source: '原规范 L393–447、451–487、498–577、657–681、718–736',
        reason:
          '居中句号标题/一片完整mesh → 版本流程带 → 浅模板条/深运行说明 → 真正可渲染的微型页面。Geist/Mono层级、48px/600/−2.4px、`#fafafa`/近黑、细内线/微小层影；营销圆钮与6px工具分工。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L393–447、451–487、498–577、657–681、718–736',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L393–447、451–487、498–577、657–681、718–736',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  vodafone: {
    name: 'Vodafone',
    summary: '宏大的大写标题、摄影章节与鲜明品牌红。',
    category: 'media',
    referenceFeatures: {
      moods: ['cinematic', 'editorial'],
      tones: ['mixed'],
      scenarios: ['product', 'commerce'],
      density: ['balanced'],
      backgrounds: ['image', 'solid'],
      accentHues: ['red'],
      headingWeight: ['bold'],
      headingScale: ['display'],
      visualMedia: ['photo', 'type'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L276–290、313–391、410–425、467–479、524–538',
        reason:
          '暗近景肖像/126–144px重短句 → 白底300轻解释 → 双列故事/地点，原创红色对话弧作节拍。`#e60000`单行动、800大写/300次题的喊/轻声差、60px圆CTA/6px图框，无渐变影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L276–290、313–391、410–425、467–479、524–538',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L276–290、313–391、410–425、467–479、524–538',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  voltagent: {
    name: 'VoltAgent',
    summary: '纯粹近黑画布、荧光绿和终端般产品网格。',
    category: 'ai',
    referenceFeatures: {
      moods: ['tech'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['dense'],
      typography: ['sans', 'mono'],
      headingScale: ['regular'],
      visualMedia: ['ui', 'code'],
      accentHues: ['green'],
      headingWeight: ['regular'],
      backgrounds: ['solid'],
    },
    referenceEvidence: [
      {
        source: '原规范 L281–295、320–355、369–400、417–470、509–521',
        reason:
          '60px常规工程标题/小启动片段 → 有入出参的节点链 → 可复制配方/失败说明，虚线分隔。`#101010`连续底、`#00d992`仅行动/状态、Inter400/宽距大写眉题、Mono代码数字、1px框/6px按钮/8px卡。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L281–295、320–355、369–400、417–470、509–521',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L281–295、320–355、369–400、417–470、509–521',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  warp: {
    name: 'Warp',
    summary: '暖炭黑终端画布、干净排版与偶尔出现的衬线斜体。',
    category: 'dev',
    referenceFeatures: {
      moods: ['tech', 'editorial'],
      tones: ['dark'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      chroma: ['mono'],
      typography: ['sans', 'mono'],
      visualMedia: ['code', 'ui'],
      backgrounds: ['solid'],
      layering: ['lines'],
      accentHues: ['neutral'],
      headingWeight: ['regular'],
      headingScale: ['display'],
    },
    referenceEvidence: [
      {
        source: '原规范 L278–292、315–386、398–475、514–526',
        reason:
          '暖棕黑64px安静标题 → 指导/终端双面板 → 个人笔记/行式练习/平台命令索引。`#2b2622`/`#f7f5f0`、Inter400/DM Mono、3px钮/4px终端、暖细线，无品牌彩渐变。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L278–292、315–386、398–475、514–526',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L278–292、315–386、398–475、514–526',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  webflow: {
    name: 'Webflow',
    summary: '黑白主框架与五种鲜明产品色，理性的创意工具表达。',
    category: 'creative',
    referenceFeatures: {
      moods: ['tech', 'playful'],
      tones: ['mixed'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      headingScale: ['display'],
      visualMedia: ['ui'],
      accentHues: ['neutral'],
      headingWeight: ['bold'],
      backgrounds: ['solid'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L319–333、367–453、455–537、576–588',
        reason:
          '白80px标题/真实可改16:9预览 → 跨列紫粉蓝橙绿分类板 → 黑作品间奏。近黑行动、600字重上限、15px大写宽眉、4px按钮/8px框，精选作品才微层影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L319–333、367–453、455–537、576–588',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L319–333、367–453、455–537、576–588',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  wired: {
    name: 'WIRED',
    summary: '纸白报刊网格、窄衬线标题与长文阅读节奏。',
    category: 'media',
    referenceFeatures: {
      moods: ['editorial'],
      tones: ['light'],
      scenarios: ['content'],
      density: ['dense'],
      chroma: ['mono'],
      typography: ['serif', 'sans'],
      layering: ['lines'],
      accentHues: ['blue'],
      headingWeight: ['regular'],
      headingScale: ['display'],
      temperature: ['neutral'],
      backgrounds: ['solid'],
      visualMedia: ['type', 'photo'],
    },
    referenceEvidence: [
      {
        source: '原规范 L254–268、292–364、378–445、485–497',
        reason:
          '白色原创刊名/细线 → 16:9封面大作/两篇4:3次稿 → 作者报道行 → 有引文图注的完整长文/黑页脚。黑白，蓝仅文章链接；64px高反差常规衬线、sans导航，方图方钮/1px线/无影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L254–268、292–364、378–445、485–497',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L254–268、292–364、378–445、485–497',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  wise: {
    name: 'Wise',
    summary: '厚重标题、明亮青柠绿与鼠尾草底，像北欧金融刊物。',
    category: 'finance',
    referenceFeatures: {
      moods: ['editorial', 'playful'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      accentHues: ['green'],
      headingWeight: ['bold'],
      backgrounds: ['solid'],
      visualMedia: ['type', 'ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L292–306、341–413、429–493、532–544',
        reason:
          '鼠尾草底左超重短句/右大白换算器 → 透明费率费用拆分 → 目的地预算 → 黑底绿字收束。`#e8ebe6`/`#9fe870`、900展示/常规工具字、24px卡钮/12px输入；白卡靠填色非影。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L292–306、341–413、429–493、532–544',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L292–306、341–413、429–493、532–544',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  'x.ai': {
    name: 'xAI',
    summary: '近黑宇宙画布、等宽注释与白色轮廓，克制而未来感。',
    category: 'ai',
    referenceFeatures: {
      moods: ['tech', 'minimal'],
      tones: ['dark'],
      scenarios: ['product', 'content'],
      density: ['airy'],
      chroma: ['mono'],
      typography: ['sans', 'mono'],
      headingScale: ['display'],
      layouts: ['directory'],
      geometry: ['pill'],
      backgrounds: ['solid'],
      layering: ['lines'],
      accentHues: ['neutral'],
      headingWeight: ['regular'],
      temperature: ['neutral'],
      visualMedia: ['type'],
    },
    referenceEvidence: [
      {
        source: '原规范 L242–255、285–352、365–414、453–465',
        reason:
          '近黑大空场/96px常规宣言/单档案入口 → Mono节标/双列公告/细线版本目录。`#0a0a0a`、400负字距、Mono大写正字距、25%白边胶囊/极少实白、8px暗卡，无影渐变。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L242–255、285–352、365–414、453–465',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L242–255、285–352、365–414、453–465',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
  zapier: {
    name: 'Zapier',
    summary: '暖奶油、深咖啡字与单一橙色，把工作流表达得亲近。',
    category: 'saas',
    referenceFeatures: {
      moods: ['playful', 'editorial', 'warm'],
      tones: ['light'],
      scenarios: ['product', 'tool'],
      density: ['balanced'],
      headingScale: ['regular'],
      temperature: ['warm'],
      layering: ['lines'],
      accentHues: ['orange'],
      headingWeight: ['medium'],
      backgrounds: ['solid'],
      visualMedia: ['ui'],
      typography: ['sans'],
    },
    referenceEvidence: [
      {
        source: '原规范 L295–309、331–414、420–485、524–537',
        reason:
          '暖奶油56px左题/右流程 → 触发/映射/条件/结果 → 奶油说明/深咖异常/暖FAQ。`#fffefb`/`#201515`、`#ff4f00`单橙、温暖500展示、12px中角/细线实色，不彩虹连线。',
        kind: 'interpretation',
      },
      {
        source: '原规范 L295–309、331–414、420–485、524–537',
        reason:
          '按该段主行动、标题与主要画布归纳；强调色只取行动/选中角色，字阶分档是本地分类，不等于上游官方标签。摄影题材不改变界面色温或目录领域。',
        kind: 'interpretation',
        fields: ['accentHues', 'headingScale', 'headingWeight', 'temperature', 'chroma'],
      },
      {
        source: '原规范 L295–309、331–414、420–485、524–537',
        reason:
          '仅按页面实际承担表达的载体、背景职责与字体角色归纳；“禁止渐变/摄影”等反例不作为正向标签，插图内容与界面画布分别判断。字体替代不表示取得原商业字库许可。',
        kind: 'interpretation',
        fields: ['backgrounds', 'visualMedia', 'typography'],
      },
    ],
  },
}

export const featuredIds = [
  'linear.app',
  'apple',
  'cursor',
  'mistral.ai',
  'kraken',
  'dell-1996',
  'claude',
  'figma',
  'nintendo-2001',
]
