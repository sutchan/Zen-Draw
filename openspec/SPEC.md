# ZenDraw | 禅抽 v5.7.11 — 项目规范文档

## 1. 项目概述

### 1.1 项目信息
- **项目名称**: ZenDraw | 禅抽
- **当前版本**: v5.7.11
- **上次更新**: 2026-11-09
- **描述**: 一款采用 Apple 设计风格的专业全屏随机抽签应用，适用于年会抽奖、课堂互动、抽签活动等场景。极简设计、密码学安全随机、11 种主题配色、Web Audio API 音效、4 Tab 设置（抽取/外观/体验/历史）、彩屑庆祝、减弱动效与界面密度调节。
- **许可证**: MIT License
- **代码质量**: 严格 TypeScript (strict mode) + ESLint + CI/CD + 代码审查标准 + 安全头

### 1.2 设计理念
| 原则 | 说明 |
|------|------|
| 减法美学 | 去除冗余元素，每个像素都有存在的理由，界面服务于抽签仪式本身 |
| 聚焦核心 | 抽签是中心行为，界面围绕它设计，而非分散注意力 |
| 克制即力量 | 色彩、动效、字体都服务于仪式感，强调色使用不超过 10% 视觉面积 |
| 跨端一致 | 从桌面到移动端，体验连续且精致 |
| 留白艺术 | 充足呼吸空间，降低视觉疲劳，增强内容层次感 |

### 1.3 技术栈
| 类别 | 技术 | 版本（以 `package.json` 为准） |
|------|------|--------|
| 框架 | Next.js (App Router) | ^15.4.9 |
| UI 库 | React / React DOM | ^19.2.1 |
| 样式 | Tailwind CSS v4 + PostCSS | 4.1.11 / ^8.5.6 |
| 动画 | Motion (ex-Framer Motion) | ^12.23.24 |
| 图标 | Lucide React | ^0.553.0 |
| 主题 | next-themes | ^0.4.6 |
| 组件基础 | @base-ui/react | ^1.3.0 |
| 工具函数 | clsx / class-variance-authority / tailwind-merge | ^2.1.1 / ^0.7.1 / ^3.5.0 |
| 代码检查 | ESLint + eslint-config-next | 9.39.1 / 16.0.8 |
| 测试 | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.0.0 / ^26.0.0 |
| 语言 | TypeScript (strict mode) | 5.9.3 |
| 音效 | Web Audio API（自合成，无外部文件） | — |
| 国际化 | 自建 i18n（createTranslator） | — |

> 说明：`shadcn` CLI 不是运行时依赖，已从表中移除；`components.json` 仅保存组件生成配置。

### 1.4 字体配置
| 名称 | 字体 | CSS 变量 |
|------|------|----------|
| 无衬线 | Geist (Google Fonts), Inter 备用 | `--font-geist-sans` |
| 等宽 | JetBrains Mono | `--font-geist-mono` |
| 衬线 | Playfair Display | `--font-serif` |

### 1.5 核心交互流程
```
Welcome ──[点击/空格键]──→ Drawing ──[点击/空格键]──→ Result
  ↑                                                      │
  └──────────────────[继续/重试]──────────────────────────┘

Any State ──[Escape]──→ Welcome
```

步骤分解：
1. 打开应用 → 欢迎界面（图标 + 准备状态 + 脉冲呼吸光晕）
2. 点击圆形「开始抽取」按钮或按空格 → 数字高速滚动动画 + 滴答音效
3. 再次点击按钮或按空格 → 数字逐字定格（老虎机效果）+ 结果揭晓琶音 + 庆祝光晕
4. 查看结果 → 点击「继续抽取」重置到欢迎状态
5. 随时按 Escape → 返回欢迎状态

---

## 2. 目录结构

```
zen-draw/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # 根布局（SEO metadata + 字体加载）
│   ├── page.tsx                   # 主页面（状态编排 + 键盘快捷键）
│   ├── error.tsx                  # ⭐ 全局错误边界 (v4.0)
│   ├── not-found.tsx              # ⭐ 404 页面 (v4.0)
│   ├── style.css                  # 全局样式（Tailwind v4 + shadcn/ui + 11 主题）
│   ├── components/
│   │   ├── ui/                    # 基础组件（base-nova 风格，16 个 .tsx 文件）
│   │   │   ├── button.tsx, card.tsx, dialog.tsx, input.tsx, label.tsx
│   │   │   ├── select.tsx, select-scroll-buttons.tsx  # Select（拆分滚动按钮）
│   │   │   ├── slider.tsx, switch.tsx, tabs.tsx, textarea.tsx
│   │   │   ├── toast.tsx, tooltip.tsx
│   │   │   └── sheet/            # 侧边抽屉（context/parts/index，拆分）
│   │   ├── layout/                # 布局组件
│   │   │   └── app-header.tsx            # 顶部导航栏（Logo + 主题切换 + 设置）
│   │   ├── draw/                  # 抽签业务组件
│   │   │   ├── draw-button.tsx           # 核心抽取按钮（脉冲动画 + aria）
│   │   │   ├── draw-settings.tsx         # 抽取参数设置
│   │   │   ├── appearance-settings.tsx   # 外观设置（主题/字体/数字格式）
│   │   │   ├── appearance-settings.parts.tsx # 外观设置子组件拆分
│   │   │   ├── custom-list-settings.tsx  # 自定义名单导入/导出
│   │   │   ├── draw-display/             # 结果展示组件集
│   │   │   │   ├── index.tsx             # 主显示区（状态路由）
│   │   │   │   ├── welcome-screen.tsx    # 空闲/欢迎状态
│   │   │   │   ├── error-screen.tsx      # 错误状态
│   │   │   │   ├── celebration-effect.tsx# 结果揭晓庆祝光晕
│   │   │   │   ├── confetti-burst.tsx    # 彩屑粒子爆发
│   │   │   │   ├── result-card.tsx       # 单个结果卡片
│   │   │   │   └── results-grid.tsx      # 结果网格展示
│   │   │   ├── history-list/             # 历史记录组件集
│   │   │   │   ├── index.tsx             # 历史记录列表
│   │   │   │   ├── history-card.tsx      # 历史记录卡片
│   │   │   │   └── empty-state.tsx       # 空状态
│   │   │   ├── settings-panel/           # 设置面板组件集
│   │   │   │   ├── index.tsx             # 4 Tab 设置面板（抽取/外观/体验/历史）
│   │   │   │   ├── header-bar.tsx        # 面板标题栏
│   │   │   │   ├── experience-settings.tsx  # 体验设置（音效/彩屑/减弱动效/自动隐藏/密度/重置）
│   │   │   │   └── custom-list-inline.tsx    # 名单模式内联编辑
│   │   │   └── __tests__/draw-button.test.tsx  # 按钮单元测试
│   │   ├── number-roller.tsx      # 数字滚动动画组件
│   │   └── theme-provider.tsx     # 主题提供者（11 预设 + 3 字体 + 深浅色）
│   ├── hooks/                     # 自定义 Hooks（12 个）
│   │   ├── draw-types.ts          # 类型定义 + SETTINGS_FIELDS 单一来源
│   │   ├── draw-helpers.ts        # 纯函数（抽签逻辑/验证/格式化/LIMITS）
│   │   ├── draw-reducer.ts        # 状态 Reducer（25 个 action）
│   │   ├── use-draw.ts            # 主 Hook（状态管理入口）
│   │   ├── use-draw-actions.ts    # 抽取动作回调
│   │   ├── use-draw-settings-actions.ts  # 设置 setter 回调
│   │   ├── use-draw-utils.ts      # 抽签动作工具函数
│   │   ├── use-draw-persistence.ts# 持久化设置（17 组 localStorage）
│   │   ├── use-local-storage.ts   # localStorage Hook（含跨标签同步）
│   │   ├── use-stored-language.ts # 语言偏好快照（错误页/404 页）
│   │   ├── use-sound.ts           # Web Audio API 音效合成
│   │   ├── use-mounted-reduced-motion.ts # 减少动效偏好 Hook
│   │   └── __tests__/             # 5 个测试文件
│   ├── lib/
│   │   ├── utils.ts              # 工具函数（cn / secureRandomInt / sanitizeListInput）
│   │   ├── version.ts            # APP_VERSION / BUILD_ID / FOOTER_VERSION
│   │   ├── i18n.ts               # 国际化翻译工具（createTranslator）
│   │   └── __tests__/utils.test.ts # 工具函数测试
│   ├── locales/                  # 国际化数据
│   │   ├── index.ts              # re-export
│   │   ├── types.ts              # TranslationKey（110 键，实算）
│   │   ├── en.ts                 # 英文翻译（110 键）
│   │   └── zh.ts                 # 中文翻译（110 键）
│   └── test/
│       └── setup.ts              # 测试环境配置
├── prototype/                    # 设计原型（4 个 HTML + 令牌 + 规范）
│   ├── index.html               # 高保真可交互原型（主流程 + 主题演示）
│   ├── prototypes.html          # 状态机图示 + 真实联动
│   ├── wireframes.html          # 组件库规范线框图
│   ├── settings.html            # 设置选项高保真原型（4 Tab + 名单 Dialog）
│   ├── tokens.css               # 设计令牌单一来源（四套原型共享）
│   └── design-system.md         # 完整设计系统规范（令牌/组件库/交互/动效）
├── docs/design/                  # 设计参考文档
│   ├── color-system.html
│   ├── motion.html
│   └── typography.html
├── .github/                      # GitHub 配置
│   ├── CODEOWNERS
│   ├── CODE_REVIEW_SETUP.md
│   ├── CODE_REVIEW_STANDARD.md
│   ├── FIXES_SUMMARY.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── PUSH_GUIDE.md
│   └── workflows/
│       └── ci.yml
├── openspec/
│   └── SPEC.md                   # 本文档
├── eslint.config.js              # ESLint Flat Config
├── tsconfig.json                 # TypeScript strict mode
├── next.config.ts                # Next.js + 安全头
├── components.json               # shadcn/ui 配置
├── package.json
├── postcss.config.mjs
├── vitest.config.ts
├── CHANGELOG.md
├── README.md / README_CN.md
└── metadata.json
```

---

## 3. 功能规格

### 3.1 核心功能

#### 3.1.1 随机抽取
- **数值范围**: 自定义最小值和最大值（范围宽度 ≤ 10,000,000）
- **抽取数量**: 一次抽取多个结果（≤ 范围宽度或 1000 项上限）
- **重复选项**: 允许/禁止重复抽取
- **自定义名单**: 导入自定义名单（每行一个，最多 1000 项，每项 ≤ 200 字符）
- **随机数安全**: `crypto.getRandomValues()` + 拒绝采样消除模偏差；降级方案 `Math.random()`

#### 3.1.2 显示规则
- **位数补零**: `digits` 设置（如 3 位数: 001, 002...），0 时不补零
- **前缀/后缀**: 自定义文本，限制 ≤ 50 字符，过滤控制字符

#### 3.1.3 动画效果
- **滚动动画**: Slot-machine 风格，每个字符独立滚动
- **逐字定格**: 停止时从左到右依次延迟 80ms 定格，弹性弹簧动画
- **动画时长**: 可配置（1–30 秒）
- **彩屑庆祝**: 结果揭晓时触发 confetti 粒子爆发（`draw-display/confetti-burst.tsx`）
- **减弱动效**: 双重控制——系统 `prefers-reduced-motion` 与设置内「减弱动效」开关（`reduceMotion`）任一开启即跳过所有非必要动画

#### 3.1.4 音效系统（Web Audio API）
- **开始抽取**: 上升音（440Hz→880Hz，0.15s 正弦波）
- **滚动滴答**: 短促咔嗒音（800Hz，0.05s 方波）
- **结果揭晓**: 琶音（C5→E5→G5→C6，每音符 0.12s 正弦波）
- **错误提示**: 下降音（440Hz→220Hz，0.3s 锯齿波）
- **停止音**: 短促叮声（600Hz，0.08s 正弦波）

### 3.2 界面功能

#### 3.2.1 顶部导航栏
- **高度**: 56px (`h-14`)
- **背景**: `bg-background/80 backdrop-blur-xl` 毛玻璃半透明
- **布局**: 左（Logo + 名称） 中（弹性空间） 右（主题切换 + 设置开关）
- **分隔线**: `border-b border-border/50`

#### 3.2.2 设置面板（Sheet 侧边栏）
- **布局**: 右滑入，`w-full`（移动端） / `sm:w-[380px]`（桌面）
- **4 个 Tabs 切换**: 抽取 / 外观 / 体验 / 历史
- **抽取设置**: 抽取模式（数字 / 列表）、范围（min/max）、个数、重复、自动隐藏、动画时长、自定义名单（开关 + 导入对话框 + 导出 txt）
- **外观设置**: 深浅模式（light/dark/system）、11 种配色方案、3 种字体、数字格式（位数补零 / 前缀 / 后缀）
- **体验设置**: 音效开关、界面密度（舒适 / 紧凑）、彩屑开关、减弱动效开关、重置设置
- **历史记录**: 卡片列表 + 复制 + 清空

#### 3.2.3 主显示区域
- **空闲态**: 圆形图标 + 标题 + 描述 + 脉冲呼吸光晕 + 圆形大按钮
- **抽取中**: 大字号数字滚动 + 提示文字
- **结果态**: 结果标签 + 大字号数字 + 元信息 + 操作按钮
- **错误态**: 错误图标 + 错误信息 + 重试按钮

---

## 4. 设计系统规范（对齐 v5.7.11）

### 4.1 设计 Tokens — 色彩

#### 4.1.1 shadcn/ui CSS 变量（实际代码值）
```css
:root {
  --background: oklch(0.99 0 0);      --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);               --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);            --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);        --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.965 0 0);      --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.965 0 0);          --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.965 0 0);         --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.91 0 0);          --input: oklch(0.91 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.75rem;
}
.dark {
  --background: oklch(0.145 0 0);     --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);           --card-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);          --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);         --accent-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);       --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}
```

#### 4.1.2 阴影系统（自定义变量）
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 8px 32px rgba(0,0,0,0.06);
--shadow-lg: 0 20px 60px rgba(0,0,0,0.10);
--shadow-xl: 0 30px 100px rgba(0,0,0,0.12);
```
Dark 模式透明度：sm 0.3 / md 0.35 / lg 0.45 / xl 0.5。

#### 4.1.3 动画曲线
```css
--ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1);  /* 标准 Apple 缓动 */
/* Motion (Framer) spring 参数: stiffness=300~400, damping=16~30, mass=0.55~0.8 */
```

### 4.2 类型系统（Modular Scale 1.25）

| Token | Size | Weight | Line Height | 使用场景 |
|-------|------|--------|-------------|----------|
| — | 12px | 400/600 | 1.33 | 辅助文字、页码 |
| `text-sm` | 14px | 400/500 | 1.4 | 标签、设置项 |
| `text-base` | 16px | 400/500 | 1.5 | 正文 |
| `text-lg` | 18px | 500/600 | 1.4 | 突出正文 |
| `text-xl` | 20px | 600 | 1.3 | 小标题 |
| `text-2xl` | 24px | 600/700 | 1.2 | 标题 |
| `text-4xl` | 36px | 700 | 1.1 | 页标题 |
| `text-7xl` | 48px | 700 | 1 | 抽签数字(移动端) |
| `text-8xl` | 60px | 700 | 1 | 抽签数字(桌面) |
| `text-9xl / [12vw]` | 72px+ | 700 | 1 | 抽签数字(大屏) |

### 4.3 间距与布局

#### 4.3.1 间距模式
| 场景 | Tailwind | 说明 |
|------|----------|------|
| 内聚 | `gap-1` ~ `gap-2` (4–8px) | 关联紧密元素（图标+文字） |
| 舒适 | `gap-3` ~ `gap-4` (12–16px) | 列表项、表单行 |
| 呼吸 | `gap-6` ~ `gap-8` (24–32px) | 区块间、section 间距 |
| 留白 | `gap-12` ~ `gap-16` (48–64px) | 主要区域间隔 |

#### 4.3.2 响应式断点
| 设备 | 断点 | 布局变化 |
|------|------|----------|
| 移动端 | < 768px | 全屏侧边栏、单列布局 |
| 平板/桌面 | ≥ 768px | 380px 侧边栏宽度、双列布局 |
| 大屏 | ≥ 1200px | 更大留白 |

#### 4.3.3 圆角系统
| 名称 | 值 | 适用场景 |
|------|-----|---------|
| rounded-lg | 0.5rem | 小按钮、标签 |
| rounded-xl | 0.75rem | 小卡片、输入框 |
| rounded-2xl | 1rem | 输入框、中等卡片 |
| rounded-[2rem] | 2rem | 结果卡片主显示区 |
| rounded-full | ∞ | 胶囊/圆形按钮 |

### 4.4 交互标准

#### 4.4.1 八种状态
| 状态 | 触发 | 视觉反馈 |
|------|------|----------|
| Default | 静态 | 基础样式 |
| Hover | 鼠标悬停 | `translateY(-2px)` + shadow 增强 |
| Focus | Tab 键盘导航 | `focus-visible:ring-2 ring-ring ring-offset-2` |
| Active | 按下 | `scale(0.97~0.98)` |
| Disabled | 无效 | `opacity-50 pointer-events-none` |
| Loading | 处理中 | 按钮脉冲动画 |
| Error | 无效输入 | `border-destructive` + `aria-invalid` |
| Success | 操作完成 | 绿色徽章 + 庆祝光晕 |

#### 4.4.2 键盘导航
| 按键 | 操作 |
|------|------|
| `Space` / `Enter` | 抽取按钮触发（原生 `<button>` 自动支持） |
| `Escape` | 返回欢迎状态 / 关闭弹窗 |
| `Tab` | 控件间导航 |

### 4.5 配色方案（11 种主题）

| # | 类名 | 名称 | 风格 | 强调色（OKLCH） |
|---|------|------|------|-----------------|
| 1 | `.theme-default` | Default | 黑白极简 | oklch(0.205 0 0) |
| 2 | `.theme-ocean` | Ocean | 明亮蓝调 | oklch(0.5 0.15 220) |
| 3 | `.theme-forest` | Forest | 自然绿调 | oklch(0.5 0.15 140) |
| 4 | `.theme-sunset` | Sunset | 温暖橙调 | oklch(0.6 0.15 40) |
| 5 | `.theme-purple` | Purple | 优雅紫调 | oklch(0.5 0.2 300) |
| 6 | `.theme-neon` | Neon | 霓虹赛博 | oklch(0.7 0.35 200) |
| 7 | `.theme-sakura` | Sakura | 柔和粉调 | oklch(0.7 0.15 10) |
| 8 | `.theme-midnight` | Midnight | 深邃暗蓝 | oklch(0.5 0.1 260) |
| 9 | `.theme-retro` | Retro | 复古暖棕 | oklch(0.6 0.1 70) |
| 10 | `.theme-pixel` | Pixel | 像素游戏绿 | oklch(0.7 0.25 140) |
| 11 | `.theme-rose` | Rose | 玫瑰粉调 | oklch(0.6 0.18 350) |

> 说明：`default` 为 `:root` 基线，**无独立 `.theme-default` 类**；`app/style.css` 实际定义 10 个 `.theme-*` 覆盖类，连同默认态共 11 种预设。页脚主题数取自 `THEME_PRESETS.length`（11）、字体数取自 `FONT_FAMILIES.length`（3），不再硬编码。

### 4.6 动效规范

| 场景 | 时长 | 缓动函数 | 说明 |
|------|------|----------|------|
| 悬停过渡 | 200ms | ease-out | 按钮、卡片 hover |
| 按下反馈 | 100ms | ease-out | `scale(0.98)` |
| 按钮脉冲 | 2.8s | ease-in-out | 空闲时呼吸光晕 |
| 面板滑入 | 300ms | spring(300,30,0.8) | Sheet 侧边栏 |
| 数字滚动 | 80ms/帧 | steps(1) | 老虎机效果 |
| 逐字定格 | 80ms 延迟/字 | spring(400,16,0.55) | 弹性 overshoot |
| 结果揭示 | 700ms | ease-out | `scale(0.9→1)` + fade |
| 庆祝光晕 | 1.2s | spring | 径向渐变闪烁 |
| 页面入场 | 600ms | ease-out | `fadeUp(translateY 16px)` |

### 4.7 图标系统
- **库**: Lucide React
- **尺寸**: 按钮 16px、导航图标 18px、状态图标 28–36px
- **规则**: 装饰性图标设 `aria-hidden="true"`；操作图标配 `aria-label`

---

## 5. 基础组件库（base-nova 风格）

### 5.1 基础组件清单

`app/components/ui/` 现存 **16 个 `.tsx` 文件**（13 个顶层 + `sheet/` 3 个），按逻辑组件计 14 个。2026-10-22 已删除 4 个零引用组件：`alert.tsx` / `badge.tsx` / `checkbox.tsx` / `separator.tsx`。

| 组件 | 文件 | 使用 @base-ui/react |
|------|------|-------------------|
| Button | `ui/button.tsx` | 是（ButtonPrimitive） |
| Card | `ui/card.tsx` | 否（原生 div） |
| Dialog | `ui/dialog.tsx` | 是（Dialog 系列） |
| Input | `ui/input.tsx` | 否（原生 input） |
| Label | `ui/label.tsx` | 否（原生 label） |
| Select | `ui/select.tsx` + `ui/select-scroll-buttons.tsx` | 是（SelectPrimitive） |
| Sheet | `ui/sheet/`（context / index / parts） | 是（Drawer） |
| Slider | `ui/slider.tsx` | 是（Slider） |
| Switch | `ui/switch.tsx` | 是（Switch） |
| Tabs | `ui/tabs.tsx` | 是（Tabs） |
| Textarea | `ui/textarea.tsx` | 否（原生 textarea） |
| Tooltip | `ui/tooltip.tsx` | 是（Tooltip） |
| Toast | `ui/toast.tsx` | 是（Toast 系列） |

#### 5.1.1 容器语义化 id 规范

为便于调试与端到端测试，所有**结构性/语义化容器**须带 kebab-case 语义化 `id`（DOM 调试锚点）；UI 基础原子组件（Button/Input/Label/Switch/Slider/Checkbox/Textarea/Tooltip/Toast 等可复用控件）**不加**（由其父容器承载）。

| 容器 | id |
|------|----|
| 应用根（`layout.tsx` body） | `app-body` |
| 页面外壳（`page.tsx` root） | `app-shell` |
| 主内容区（`page.tsx` main） | `app-main` |
| 页脚（`page.tsx` footer） | `app-footer` |
| 错误边界页 | `error-page` |
| 404 页 | `not-found-page` |
| 顶栏（`app-header`） | `app-header` |
| 设置面板（`SheetContent`） | `settings-panel` |
| 设置面板头部 | `settings-header-bar` |
| 4 个设置 Tab 面板 | `tab-panel-draw` / `tab-panel-appearance` / `tab-panel-experience` / `tab-panel-history` |
| 抽取设置 | `draw-settings` |
| 外观设置 | `appearance-settings` |
| 体验设置 | `experience-settings` |
| 自定义名单内联块 | `custom-list-inline` |
| 自定义名单对话框 | `custom-list-dialog` |
| 主题预设网格 | `theme-preset-grid` |
| 字体选择容器 | `font-family-select` |
| 抽取展示区（`draw-display` region） | `draw-display-region` |
| 欢迎屏 | `welcome-screen` |
| 结果区（results grid region） | `results-region` |
| 单条结果卡（多实例） | `result-card-${index}` |
| 错误屏 | `error-screen` |
| 抽取按钮根容器 | `draw-button-root` |
| 历史列表容器 | `history-list` |
| 历史卡片列表 | `history-cards` |
| 单条历史卡（多实例） | `history-card-${index}` |
| 历史空状态 | `history-empty-state` |
| 庆祝光晕 | `celebration-effect` |
| 彩屑画布 | `confetti-burst` |

> 多实例容器（结果卡、历史卡）使用 `${index}` 后缀保证 id 唯一；纯展示型单实例（彩屑/光晕）加 `aria-hidden` 仍附 id 便于定位。

#### 5.1.2 页脚版本与构建标识规范

应用页面的**页脚区为版本号唯一展示位**，格式固定为 `V主.次.修 · build yymmddhhmm`（示例：`V1.2.3 · build 2611051259`）。

| 项目 | 约定 |
|------|------|
| 版本号 | 取自 `app/lib/version.ts` 的 `APP_VERSION`（与 `package.json` 一致），`V` 大写，禁止硬编码 |
| build 编号 | 10 位时间戳 `yymmddhhmm`（2 位年份 + 月日时分）；由 `next.config.ts` 在构建期生成并注入 `NEXT_PUBLIC_BUILD_ID`，`dev` / `build` 均生效 |
| 缺失回退 | 注入缺失时页脚仅展示 `V{APP_VERSION}`，不展示占位 build |
| 唯一位置 | 页眉 / 顶部导航等头部组件不得再出现版本号；页脚不展示「更新日期」，以 build 编号替代 |
| 语义化 id | 页脚容器 `app-footer`，版本号行 `app-footer-version` |

> build 编号由 `app/lib/version.ts` 统一组装为 `FOOTER_VERSION` 后供 `page.tsx` 渲染，避免在组件内拼接格式或直接读取环境变量。

### 5.2 业务组件规范

| 组件 | 位置 | 关键样式 | 说明 |
|------|------|----------|------|
| DrawButton | `draw/draw-button.tsx` | `px-12 py-5 rounded-[1.75rem]` | 胶囊形脉冲大按钮，`aria-pressed` |
| NumberRoller | `number-roller.tsx` | `tabular-nums` + 渐变色 | 字符级滚动动画，尊重 reduce-motion |
| DrawDisplay | `draw/draw-display/` | 居中布局 | 按状态展示不同视图 |
| SettingsPanel | `draw/settings-panel/` | 4 Tab（抽取/外观/体验/历史） | Sheet 容器 + 状态编排 |
| HistoryCard | `draw/history-list/history-card.tsx` | `p-5 rounded-2xl bg-muted/15` | 结果卡片 + 复制 |
| CustomListModal | `draw/custom-list-settings.tsx` | `role="dialog" aria-modal="true"` | 导入弹窗 + 自动聚焦 |

---

## 6. 状态管理

### 6.1 Reducer 状态结构

设置字段统一收敛进嵌套的 `DrawSettings` 对象，运行时字段独立平铺；`status` 状态机替代旧的 `isDrawing` 布尔；`history` 仍属 `DrawState` 一部分。

```typescript
type DrawStatus = "idle" | "drawing" | "result" | "error";

interface DrawSettings {
  min: number;
  max: number;
  count: number;
  allowDuplicates: boolean;
  autoHide: boolean;
  duration: number;                // 动画时长（秒）
  customList: string[];
  useCustomList: boolean;
  digits: number;
  prefix: string;
  suffix: string;
  language: "zh" | "en";
  soundEnabled: boolean;
  density: "comfortable" | "compact";
  confettiEnabled: boolean;
  reduceMotion: boolean;
}

interface DrawState {
  ...DrawSettings;                 // 设置字段平铺展开（便于 reducer 访问）
  currentResults: string[];        // 当前抽取结果（字符串）
  rollingValues: string[];         // 滚动中的临时值
  status: DrawStatus;              // 状态机：idle/drawing/result/error
  errorMessage: string;            // 错误信息
  history: HistoryEntry[];         // 历史记录（最多 100 条）
  isRolling: boolean;              // 是否正在滚动（派生自 status === "drawing"）
}
```

> 注：`isDrawing` / `results`（number[]） / `error` 等旧式平铺字段已由 `isRolling` / `currentResults`（string[]） / `errorMessage` 取代；`status` 状态机取代布尔标记。

### 6.2 Action 类型

每个设置字段对应独立的 `SET_*` Action，运行时流程由状态机驱动：

- `START_DRAW` / `UPDATE_ROLLING` / `FINALIZE_DRAW` / `CANCEL` — 抽取流程与滚动更新
- `SET_MIN` / `SET_MAX` / `SET_COUNT` / `SET_DURATION` / `SET_DIGITS` — 数值设置
- `SET_PREFIX` / `SET_SUFFIX` / `SET_ALLOW_DUPLICATES` / `SET_AUTO_HIDE` — 文本与开关
- `SET_USE_CUSTOM_LIST` / `SET_CUSTOM_LIST` — 自定义名单
- `SET_LANGUAGE` / `SET_SOUND_ENABLED` / `SET_DENSITY` — 语言/音效/密度
- `SET_CONFETTI_ENABLED` / `SET_REDUCE_MOTION` — 体验开关
- `RESET_SETTINGS` — 重置所有设置到默认（保留当前语言偏好）
- `CLEAR_HISTORY` / `DISMISS_ERROR` / `ERROR` — 历史、错误清除与写入

### 6.3 持久化（localStorage）

全部 key 以 `zendraw-` 为前缀，共 **19 个**：`usePersistedSettings()` 通过 `useLocalStorage` 管理 17 个（16 个设置字段 + `history`），`theme-provider.tsx` 另管理 2 个（`theme-preset` / `font-family`）。字段与 key 的映射见 §9，设置字段清单以 `SETTINGS_FIELDS` 为单一来源。

跨标签同步：通过 `window.addEventListener('storage', ...)` 实现。

---

## 7. 国际化

### 7.1 支持语言
- `en` — English
- `zh` — 简体中文

### 7.2 翻译键（110 个，实算）

翻译键由 `app/locales/types.ts` 的 `TranslationKey` 联合类型强约束；`zh.ts` / `en.ts` 均标注为 `TranslationDict = Record<TranslationKey, string>`，缺失或多余键在编译期报错。实算结果：`types.ts` / `zh.ts` / `en.ts` 各 **110 个键**，三处完全对齐（另有 `Language = "en" | "zh"` 的 2 个字面量不属于翻译键）。

覆盖分类：界面导航（settings/close/history）、范围与计数（minVal/maxVal/drawCount/allowDup/autoHideDesc）、外观（theme*/font*）、抽签流程（ready/startDraw/stopDraw/continueDraw/copy*）、名单导入（customList/itemsLoaded/clearList/editList/listPlaceholder）、错误提示（err*/minMaxError/rangeError）、体验设置（sound/density/confetti/reduceMotion/resetSettings）、语言（languageLabel/langZh/langEn）、错误页与 404（pageError*/notFound*/retry/backHome）、页脚（footerInfo）等。

2026-10-22 清理了 16 个零消费键（`title` / `drawMode` / `modeNumber` / `modeList` / `custom` / `theme` / `export` / `import_` / `drawing` / `noItems` / `switchLight` / `switchDark` / `importDesc` / `confirmImport` / `removeItem` / `colorPreview`），文档不得再引用。新增键须同步加入 `TranslationKey`、`zh.ts`、`en.ts` 三处。

### 7.3 使用方式
```typescript
import { createTranslator } from "@/lib/i18n";
const t = React.useMemo(() => createTranslator(language), [language]);
// 普通: t("settings")
// 参数: t("footerInfo", String(THEME_PRESETS.length), String(FONT_FAMILIES.length))
//       → 支持 {0} / {1} 位置占位符；缺失 key 回退为 key 本身
```

---

## 8. 代码质量规范

### 8.1 TypeScript 严格配置
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "forceConsistentCasingInFileNames": true
}
```

### 8.2 ESLint 规则（Flat Config，`eslint.config.js`）
- **基线**: `eslint-config-next` (16.0.8) + `typescript-eslint` strict (8.x) + `reportUnusedDisableDirectives`
- **TypeScript**: `no-explicit-any` (warn)、`no-non-null-assertion` (error)、`no-unused-vars` (warn，忽略 `_` 前缀)
- **React Hooks**: `rules-of-hooks` / `exhaustive-deps` (error)
- **安全**: `no-eval` / `no-new-func` (error)、`no-restricted-syntax` (warn，拦截 `Math.random` 调用)
- **无障碍**: jsx-a11y 系列 (warn)、`tabindex-no-positive` (error)
- **代码质量**: `no-console`（warn，允许 warn/error）、`no-debugger` / `no-var` (error)、`prefer-const` (warn)、`unused-imports/no-unused-imports` (error)
- **忽略范围**: `node_modules/`、`.next/`、配置文件、`app/components/ui/**`、`app/test/**`、`.github/**`
- **门禁**: 本地与 CI 均执行 `eslint . --max-warnings=0`（零告警）

### 8.3 安全头（next.config.ts）
| 头 | 值 |
|----|-----|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; ...` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| X-DNS-Prefetch-Control | `on` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |

> 共 8 条安全头，由 `next.config.ts` 的 `headers()` 统一注入；CSP 含 `connect-src 'self'`、`frame-ancestors 'none'`。

### 8.4 安全编码规范
- **随机数**: 必须使用 `crypto.getRandomValues()` + 拒绝采样
- **输入验证**: `parseFiniteNumber()`、`sanitizeListInput()`、prefix/suffix 控制字符过滤
- **XSS 防护**: 零处 `dangerouslySetInnerHTML`、零处 `eval`/`new Function`
- **localStorage**: 敏感数据（custom-list）可选清除

### 8.5 错误边界
- `app/error.tsx` — 全局错误捕获 + 重试按钮 + 返回首页
- `app/not-found.tsx` — 404 友好提示

### 8.6 CI/CD（GitHub Actions）
`.github/workflows/ci.yml` 在 push / PR 到 `main`、`master`、`develop` 时触发（Node 22 + `npm ci`），含两个作业：

`quality-check`（四连检，任一失败即阻断）：
1. `npm run type-check` → TypeScript 类型检查
2. `npm run lint -- --max-warnings=0` → ESLint 零告警
3. `npm test` → Vitest 单元测试
4. `npm run build` → 生产构建验证

`security-check`：`npm audit --audit-level=high`（当前 `continue-on-error: true`，不阻断）+ PR 时 `actions/dependency-review`。

> 本地等价验证命令见 `docs/tasks.md` 元信息；构建环境红线见项目长期记忆。

---

## 9. 本地存储键名对照

| 键名 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| zendraw-min | number | 1 | 最小值 |
| zendraw-max | number | 100 | 最大值 |
| zendraw-count | number | 1 | 抽取数量 |
| zendraw-duplicates | boolean | true | 允许重复 |
| zendraw-autohide | boolean | true | 自动隐藏面板 |
| zendraw-duration | number | 5 | 动画时长(秒) |
| zendraw-custom-list | string[] | [] | 自定义名单 |
| zendraw-use-custom | boolean | false | 启用自定义名单 |
| zendraw-digits | number | 3 | 补零位数 |
| zendraw-prefix | string | "" | 前缀 |
| zendraw-suffix | string | "" | 后缀 |
| zendraw-language | "zh"\|"en" | "zh" | 语言 |
| zendraw-sound | boolean | true | 音效 |
| zendraw-density | "comfortable"\|"compact" | "comfortable" | 界面密度 |
| zendraw-confetti | boolean | true | 结果彩屑 |
| zendraw-reduce-motion | boolean | false | 减弱动效 |
| zendraw-history | HistoryEntry[] | [] | 历史记录（≤ 100 条） |
| zendraw-theme-preset | ThemePreset | "default" | 配色方案（11 种） |
| zendraw-font-family | FontFamily | "sans" | 字体（3 种） |

> 前 17 项由 `usePersistedSettings()` 管理，后 2 项由 `theme-provider.tsx` 管理；`custom-list` / `history` 带类型守卫防脏数据白屏。

---

## 10. 原型对照

### 10.1 原型文件
| 文件 | 位置 | 说明 |
|------|------|------|
| 主原型 | `prototype/index.html` | 高保真可交互原型（主流程 + 11 主题演示） |
| 状态机原型 | `prototype/prototypes.html` | 状态机图示 + 真实联动 |
| 组件库线框 | `prototype/wireframes.html` | 组件库规范线框图 |
| 设置原型 | `prototype/settings.html` | 设置选项高保真原型（4 Tab + 名单 Dialog） |
| 设计令牌 | `prototype/tokens.css` | 四套原型共享的令牌单一来源 |
| 设计系统 | `prototype/design-system.md` | 完整设计系统文档（令牌/组件库/交互/动效） |
| 设计参考 | `docs/design/`（color-system.html / motion.html / typography.html） | 色彩/动效/字体系统参考 |

> 原型为静态设计稿，不参与应用构建；其版本标注随产品版本同步，但 build 编号（构建期注入）不适用。

### 10.2 代码与原型对齐清单
| 特性 | 原型状态 | 代码状态 | 说明 |
|------|----------|----------|------|
| 欢迎页图标 + 脉冲光晕 | ✅ | ✅ | 代码使用 motion 实现 |
| 圆形抽取按钮 | ✅ | ✅ | `rounded-[1.75rem]` 胶囊 |
| 数字滚动动画 | ✅ | ✅ | 逐字定格老虎机效果 |
| 结果揭示动效 | ✅ | ✅ | 庆祝光晕 + 粒子 |
| 11 种主题切换 | ✅ | ✅ | CSS 变量驱动 |
| 深浅色切换 | ✅ | ✅ | next-themes |
| 侧边栏设置面板 | ✅ | ✅ | Sheet 组件 + Tabs |
| 自定义名单导入 | ✅ | ✅ | 含 a11y 对话框 |
| 历史记录列表 | ✅ | ✅ | 含空状态 |
| 键盘快捷键 | ✅ | ✅ | Space/Enter/Escape |
| 音效系统 | — | ✅ | Web Audio API |
| 错误边界 | ✅ | ✅ | error.tsx + not-found.tsx |
| 安全头 | ✅ | ✅ | CSP + HSTS 等 8 条 |
| 页脚 `V版本 · build` | — | ✅ | 应用页脚专属；原型静态稿不注入 build |
| 110 翻译键（zh/en 对齐） | — | ✅ | `TranslationKey` 编译期强约束 |

---

## 11. SEO 与元数据

```typescript
// layout.tsx
export const metadata: Metadata = {
  title: `ZenDraw | 禅抽 v${APP_VERSION}`,   // APP_VERSION 取自 app/lib/version.ts（单一来源）
  description: "A professional, full-screen random draw application with Apple-inspired design...",
  keywords: ["ZenDraw", "禅抽", "random draw", "lucky draw", ...],
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,         // 保留缩放能力（WCAG 无障碍要求）
};
```

---

## 12. npm 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | ESLint 检查 |
| `npm run lint:fix` | 自动修复 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run test` | Vitest 运行测试 |
| `npm run test:watch` | 测试 watch 模式 |
| `npm run test:coverage` | 测试覆盖率 |
| `npm run clean` | 清理构建缓存 |

---

## 13. 版本历史

> 以下为节选，完整记录以 `CHANGELOG.md` 为准（按版本倒序）。

### v5.7.11 - 2026-11-09
- 全量文档与代码对齐：目录结构、依赖版本、实算数字（110 键 / 16 组件 / 19 存储键）、接口契约、构建标识
- 新增 §14「接口与数据契约（无服务端 API）」；页脚主题数改为取自 `THEME_PRESETS.length`（11）

### v5.7.10 - 2026-11-06
- 页脚版本与 build 编号规范（§5.1.2）：`next.config.ts` 注入 `NEXT_PUBLIC_BUILD_ID`，`version.ts` 组装 `FOOTER_VERSION`
- 移除设置面板 HeaderBar 版本号；全项目版本展示位统一至 5.7.10

### v5.7.9 - 2026-10-19 / 10-22 补充清理
- 设置面板嵌套 Sheet 修复、错误页/404 页 i18n、结果态按钮对齐 SPEC、CI 补齐 `npm test` 并收紧 lint 至零告警
- 补充清理：删除 4 个零引用 UI 组件与 16 个零消费翻译键；`SETTINGS_FIELDS` 单一来源 + 守卫测试；39 个源文件头注释统一

### v5.7.8 - 2026-08-13
- 核心逻辑单元测试补充（21 + 13 + 工具函数用例），魔法数字集中为 `LIMITS`，超长文件拆分

### v5.7.5
- 修复设置容器 UI 问题：抽取时长 Slider 下限由 0 改为 1；外观设置主题模式区块首屏渲染 disabled 占位
- 全仓库版本号统一至 v5.7.5

### v5.7.4
- 删除与代码严重脱节的 `CODE_REVIEW.md` 冗余文档；全仓库版本号统一至 v5.7.4
- SPEC.md 目录树修正（hooks 缩进、移除 CODE_REVIEW.md）

### v5.7.2
- 为所有结构性/语义化容器补充 kebab-case 语义化 `id`（页面级、布局、设置面板、抽取展示、历史列表、特效）；SPEC.md 新增 §5.1.1 容器语义化 id 规范表

### v5.7.1
- 修正 SPEC.md §4/§10.1/§11/§13 多处失准（版本标注、原型路径、SEO 标题、版本历史）；拆分 settings-panel 与 use-draw-actions（≤200 行规约）

### v5.7.0
- 深色/浅色切换移入设置「外观」Tab；新增「结果彩屑动效」「减弱动效」偏好
- 全链路打通 `confettiEnabled` / `reduceMotion` 与对应 setter，新增 translation key
- 统一版本号至 v5.7.0

### v5.6.0
- 设置窗口重规划为 4 Tab（抽取/外观/体验/历史）；新增音效、界面密度、自动隐藏生效、重置选项
- 全链路打通 `soundEnabled` / `density` / `RESET_SETTINGS`

### v5.5.0
- 修复设置面板嵌套 Sheet 无法打开；新增「使用自定义名单」开关、名单自动去重
- 修正「允许重复」错用文案、补 `speechRate`、`exportList` 等键

### v5.3.7
- SPEC.md 组件表补 Checkbox/Tooltip/Toast；目录树补 `use-mounted-reduced-motion.ts`，ui 组件列举完整（共 18 个）；style.css 注释主题数 10→11

### v5.3.6
- 修复页脚版本展示 bug（`APP_VERSION` 5.3.3→5.3.6）；SPEC.md 主题数 10→11（补 Rose）、翻译键 71→110、原型目录结构对齐；新增 CHANGELOG 5.3.6

### v5.3.5
- 原型精简：合并 v1/v2/interactive/minimal 为单一高保真可交互原型 `prototype/index.html`（真实数据 + 组件库规范 + 11 主题 + 完整交互）
- 设计规范文档 `prototype/DESIGN-SYSTEM.md` 升级至 v5.3.5：三级组件库（基础/复合/业务）、交互标准、动效时序、响应式、无障碍
- shadcn/ui 补齐缺口组件（base-nova 风格）：`ui/checkbox.tsx`、`ui/tooltip.tsx`、`ui/toast.tsx`，并接入根布局 `ToastProvider`/`TooltipProvider`
- 复制结果反馈升级为 Toast 轻量提示；主题切换按钮加 Tooltip
- 主题数对齐：原型与规范统一为 11 套（含 Rose），消除原型与代码最小颗粒度不一致
- 全项目源文件头注释、`package.json`、`metadata.json`、README×2、SPEC.md、CHANGELOG 统一至 v5.3.5

### v5.3.1
- 模块化拆分：`ui/sheet.tsx`（252 行）→ `ui/sheet/`（context/parts/index）；`ui/select.tsx`（201 行）→ 抽出 `select-scroll-buttons.tsx`
- 页面结构重构：`page.tsx` 抽出 `layout/app-header.tsx`（顶部导航栏），主页面精简至 ~104 行
- 清理死代码：删除未引用的 `use-persist-settings.ts`、死翻译键 `drawResults`、冗余无障碍属性
- Bug 修复：页脚字体数（6→3）、`layout.tsx` 根语言（`en`→`zh-CN`）、`history-list` 重复类型声明
- 版本号统一：全项目源文件头注释、`package.json`、文档统一至 v5.2.1
- 翻译键更新：实际 71 个键（zh/en 完全对齐，编译期强约束）
- 所有源文件均 ≤ 200 行

### v5.0.0
- 极简设计系统重构（minimal-design-system.md）
- 原型优化（minimal-prototype.html）
- 代码与原型对齐（shadcn/ui 组件替换）
- 响应式设计优化（移动端/桌面端完美适配）
- 性能优化（移除渐变背景，使用纯色）

### v4.0.0
- 高保真可交互原型（prototype/interactive/）
- 组件库完善（shadcn/ui v4 base-nova 风格）
- 动效系统升级（Apple 式缓动函数）
- 无障碍设计强化（WCAG AA 标准）

### v3.3.0
- 组件拆分（大文件 → 子组件目录）
- 音效系统（Web Audio API）
- 动效优化（逐字定格 + 庆祝光晕）
- 国际化重构（49 翻译键 + createTranslator）

### v3.2.0
- 代码质量体系（ESLint 强化 / 严格 TypeScript / CI/CD）
- 代码审查标准 + PR 模板

### v3.1.0
- Apple Design 风格重设计
- 圆角/阴影/间距系统统一

### v3.0.0
- 初始版本
- 基础随机抽取功能
- 自定义名单导入导出

---

## 14. 接口与数据契约（无服务端 API）

本项目是纯客户端应用：`app/` 下**无 `api/` 目录、无 `route.ts`、无 Server Actions、无 middleware**，也没有任何 HTTP 端点或数据库；页面与组件均为 `"use client"`，状态由 `useReducer` + `localStorage` 管理。因此不存在对外 API 文档，下列为内部模块契约（实算自源码）。

### 14.1 `app/lib/`

| 导出 | 签名 | 说明 |
|------|------|------|
| `APP_VERSION` | `const APP_VERSION: "5.7.11"` | 版本单一来源，与 `package.json` 一致 |
| `BUILD_ID` | `const BUILD_ID: string` | `NEXT_PUBLIC_BUILD_ID`，仅 10 位数字通过校验时非空 |
| `FOOTER_VERSION` | `const FOOTER_VERSION: string` | `V{版本} · build {BUILD_ID}`；缺失时仅 `V{版本}` |
| `createTranslator` | `(language: Language) => (key: TranslationKey, ...args: string[]) => string` | 缺失 key 回退 key 本身，支持 `{0}` / `{1}` 位置参数 |
| `cn` | `(...inputs: ClassValue[]) => string` | 类名合并 |
| `secureRandomInt` | `(max: number) => number` | `max <= 0` 返回 0；crypto 不可用时降级 |
| `secureRandomFloat` | `(min: number, max: number) => number` | 安全随机浮点 |
| `generateLocalId` | `() => string` | 本地唯一 ID |
| `parseFiniteNumber` | `(input: string, fallback: number) => number` | 安全数值解析 |
| `sanitizeListInput` | `(input: string) => string[]` | 单项 ≤ 200 字符、最多 1000 项、过滤控制字符 |

### 14.2 `app/hooks/`

| 导出 | 签名 | 说明 |
|------|------|------|
| `DrawSettings` | `interface`（16 字段） | 设置项；`SETTINGS_FIELDS` 为其键的单一来源 |
| `SETTINGS_FIELDS` | `as const satisfies readonly (keyof DrawSettings)[]`（16 项） | 新增设置项必须登记，守卫测试会编译报错 |
| `DrawState` | `extends DrawSettings` + 6 运行时字段 | `currentResults` / `rollingValues` / `status` / `errorMessage` / `history` / `isRolling` |
| `DrawAction` | 判别联合（25 个变体） | 每个设置字段一个 `SET_*`，另有流程 action |
| `LIMITS` | `MAX_COUNT=1000` / `MAX_LIST_ITEMS=1000` / `MAX_RANGE=10_000_000` / `MAX_DURATION=30` / `MAX_DIGITS=20` | 常量集中 |
| `formatNumber` | `(n: number, digits: number, prefix: string, suffix: string) => string` | 补零与前后缀 |
| `finalizeDraw` | `(settings: {...9 键}) => string[]` | 生成最终结果 |
| `generateTemporaryResults` | `(settings: {...8 键}) => string[]` | 滚动中的临时值 |
| `validateSettings` | `(settings: {...6 键}) => ValidationErrorKey \| null` | 返回翻译键，由调用方翻译 |
| `toSettings` | `(state: DrawSettings) => DrawSettings` | 按字段清单复制设置快照 |
| `createInitialState` | `(settings: DrawSettings) => DrawState` | Reducer 初始态 |
| `drawReducer` | `(state: DrawState, action: DrawAction) => DrawState` | 25 个 case；历史上限 100 条 |
| `usePersistedSettings` | `() => 17 对 value/setter` | 16 设置 + history，`zendraw-*` 键 |
| `useDraw` | `(onSound?: (type: SoundType) => void) => UseDrawReturn` | 主 Hook，返回状态 + 动作 + `settings` 快照 |

### 14.3 数据边界

- 语言：`"zh" \| "en"`（110 个翻译键，`zh.ts` / `en.ts` 编译期对齐）。
- 主题：`THEME_PRESETS` 11 项（`default` … `rose`）；字体：`FONT_FAMILIES` 3 项。
- 历史：最多 100 条；名单：最多 1000 项；抽取数量：最多 1000。
- 持久化：19 个 `zendraw-*` 键，见 §9；跨标签页通过 `storage` 事件同步。

---

*本文档最后更新: 2026-11-09 · 与 app/ 代码、package.json、prototype/ 保持对齐；完整变更见 CHANGELOG.md*

