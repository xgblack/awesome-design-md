# 独立示例制作契约

每个目录独立 HTML + CSS + TypeScript，不使用页面生成器或共同的视觉骨架。读取本项目设计矩阵对应项及原 DESIGN.md；禁止修改原规范、共享配置和其他负责人的目录。

## 文件

`index.html` 使用 `<meta name="viewport" content="width=device-width, initial-scale=1">`，本地 `./style.css` 和 `<script type="module" src="./main.ts"></script>`。`main.ts` 为模块（导入即满足），绑定交互后调用 `announceReady('真实slug')`，从 `../_shared/runtime.ts` 导入。不得访问 parent DOM、修改父路由/收藏，不连业务 API，不用远程资源/字体。可 import 已安装 fontsource 的本地字体 CSS。没有合适字体时按实际可用的本地系统字体，记录替代，不抓商业字体。

`example.json` 最少：

```json
{
  "title": "虚构示例名",
  "description": "用户完成什么任务；本地演示边界",
  "status": "draft",
  "features": {
    "moods": ["minimal"],
    "tones": ["light"],
    "temperature": ["neutral"],
    "chroma": ["mono"],
    "accentHues": ["neutral"],
    "backgrounds": ["solid"],
    "layouts": ["split"],
    "density": ["airy"],
    "typography": ["sans"],
    "headingScale": ["display"],
    "headingWeight": ["medium"],
    "geometry": ["small-radius"],
    "layering": ["lines"],
    "visualMedia": ["ui"],
    "motion": ["feedback"],
    "scenarios": ["tool"]
  },
  "interactions": ["filter", "form"],
  "viewports": [],
  "notes": ["字体/素材/与原规范的具体取舍"],
  "references": [{ "source": "DESIGN.md L100–140", "reason": "采用的具体颜色、字阶及构图依据" }],
  "assets": [{ "file": "assets/asset.svg", "source": "原创 SVG", "license": "本项目原创" }]
}
```

只填已实现特征，不知道的轴可省略；`viewports` 空数组，`status` 由主代理验收后改 ready。不创建伪造缩略图；主代理从最终真实页面自动生成 `thumbnail.webp`。

合法选项：

- moods: minimal tech editorial retro playful cinematic warm luxury experimental
- tones: light dark mixed
- temperature: neutral warm cool contrast
- chroma: mono muted vivid
- accentHues: neutral red orange yellow green cyan blue purple pink
- backgrounds: solid paper gradient grid texture image
- layouts: centered split editorial masonry workspace directory chapters timeline
- density: airy balanced dense
- typography: sans serif mono condensed pixel
- headingScale: display regular compact
- headingWeight: light regular medium bold
- geometry: square small-radius pill rounded cut
- layering: lines solid shadow glass hard
- visualMedia: type ui code photo render illustration geometry pixel
- motion: static feedback transition ambient
- scenarios: product content docs tool commerce directory calculator media portfolio
- interactions: filter form configure edit media replay schedule
- viewports: desktop mobile（主代理验收后标）

每页 `example.spec.ts` 使用 `import { test, expect } from '@playwright/test'`，至少两个真实核心交互与相关失败边界；用 `await page.goto('examples/<slug>/index.html')` 打开（无开头斜杠，支持子目录）。测试最终可见的内容/状态变化，不只 button 存在。所有页面必须可在 1440×900 / 390×844 / 320px 操作且不整页横溢，dialog 可 Escape 关闭并返回焦点。不要假播放、假提交、假生成/实时指标，所有业务数据为本地内存固定示例。
