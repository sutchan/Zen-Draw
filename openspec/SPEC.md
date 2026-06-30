# ZenDraw | 禅抽 v3.3.0 — 项目规范文档

## 1. 项目概述

### 1.1 项目信息
- **项目名称**: ZenDraw | 禅抽
- **当前版本**: v3.3.0
- **上次更新**: 2026-06-30
- **描述**: 一款采用 Apple 设计风格的专业全屏随机抽签应用，适用于年会抽奖、课堂互动、抽签活动等场景。极简设计、密码学安全随机、10 种主题配色、Web Audio API 音效。
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
| 类别 | 技术 | 版本 |
|------|------|--------|
| 框架 | Next.js (App Router) | ^15.4.9 |
| UI 库 | React / React DOM | ^19.2.1 |
| 样式 | Tailwind CSS v4 + PostCSS | 4.1.11 |
| 动画 | Motion (ex-Framer Motion) | ^12.23.24 |
| 图标 | Lucide React | ^0.553.0 |
| 主题 | next-themes | ^0.4.6 |
| 组件基础 | @base-ui/react | ^1.3.0 |
| shadcn/ui CLI | shadcn | ^4.12.0 |
| 工具函数 | clsx + class-variance-authority + tailwind-merge | latest |
| 测试 | Vitest + @testing-library/react + jsdom | latest |
| 语言 | TypeScript (strict mode) | 5.9.3 |
| 音效 | Web Audio API（自合成，无外部文件） | — |
| 国际化 | 自建 i18n（createTranslator） | — |

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
│   ├── style.css                  # 全局样式（Tailwind v4 + shadcn/ui + 10 主题）
│   ├── components/
│   │   ├── ui/                    # shadcn/ui v4 组件（base-nova 风格）
│   │   │   ├── alert.tsx, badge.tsx, button.tsx, card.tsx
│   │   │   ├── dialog.tsx, input.tsx, label.tsx, select.tsx
│   │   │   ├── separator.tsx, sheet.tsx, slider.tsx
│   │   │   ├── switch.tsx, tabs.tsx, textarea.tsx
│   │   ├── draw/                  # 抽签业务组件
│   │   │   ├── draw-button.tsx           # 核心抽取按钮（脉冲动画 + aria）
│   │   │   ├── draw-settings.tsx         # 抽取参数设置
│   │   │   ├── appearance-settings.tsx   # 外观设置（主题/字体/数字格式）
│   │   │   ├── custom-list-settings.tsx  # 自定义名单导入/导出
│   │   │   ├── draw-display/             # 结果展示组件集
│   │   │   │   ├── index.tsx             # 主显示区（状态路由）
│   │   │   │   ├── welcome-screen.tsx    # 空闲/欢迎状态
│   │   │   │   ├── error-screen.tsx      # 错误状态
│   │   │   │   ├── celebration-effect.tsx# 结果揭晓庆祝光晕
│   │   │   │   ├── result-card.tsx       # 单个结果卡片
│   │   │   │   └── results-grid.tsx      # 结果网格展示
│   │   │   ├── history-list/             # 历史记录组件集
│   │   │   │   ├── index.tsx             # 历史记录列表
│   │   │   │   ├── history-card.tsx      # 历史记录卡片
│   │   │   │   └── empty-state.tsx       # 空状态
│   │   │   ├── settings-panel/           # 设置面板组件集
│   │   │   │   ├── index.tsx             # 主面板（Tabs 切换）
│   │   │   │   ├── header-bar.tsx        # 面板标题栏
│   │   │   │   └── sidebar-toggle.tsx    # 侧边栏开关按钮
│   │   │   └── __tests__/
│   │   │       └── draw-button.test.tsx  # 按钮单元测试
│   │   ├── number-roller.tsx      # 数字滚动动画组件
│   │   └── theme-provider.tsx     # 主题提供者（10 预设 + 3 字体 + 深浅色）
│   ├── hooks/                     # 自定义 Hooks
│   │   ├── draw-types.ts          # 类型定义
│   │   ├── draw-helpers.ts        # 纯函数（抽签逻辑/验证/格式化）
│   │   ├── draw-reducer.ts        # 状态 Reducer
│   │   ├── use-draw.ts            # 主 Hook（状态管理入口）
│   │   ├── use-draw-actions.ts    # 动作回调（start/stop/setters）
│   │   ├── use-draw-persistence.ts# 持久化设置（13 组 localStorage）
│   │   ├── use-local-storage.ts   # localStorage Hook（含跨标签同步）
│   │   ├── use-persist-settings.ts# 批量持久化副作用
│   │   └── use-sound.ts          # Web Audio API 音效合成
│   ├── lib/
│   │   ├── utils.ts              # 工具函数（cn / secureRandomInt / sanitizeListInput）
│   │   └── i18n.ts               # 国际化翻译工具（createTranslator）
│   ├── locales/                  # 国际化数据
│   │   ├── index.ts              # re-export
│   │   ├── types.ts              # TranslationKey（49 键）
│   │   ├── en.ts                 # 英文翻译
│   │   └── zh.ts                 # 中文翻译
│   └── test/
│       └── setup.ts              # 测试环境配置
├── prototype/                    # 设计原型（v4.0 重构）
│   ├── v1/                       # 线框图 + 初始原型
│   │   ├── wireframes.html
│   │   └── prototype.html
│   ├── v2/                       # 交互原型
│   │   └── prototypes.html
│   ├── interactive/              # v4.0 高保真可交互原型
│   │   └── index.html
│   ├── design-system.md          # 完整设计系统规范
│   └── assets/
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
├── CODE_REVIEW.md
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
- **优化**: 尊重 `prefers-reduced-motion`，跳过所有非必要动画

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
- **Tabs 切换**: 抽取 / 外观 / 历史
- **抽取设置**: 范围（min/max）、个数、重复、自动隐藏、动画时长
- **外观设置**: 深浅模式（light/dark/system）、10 种配色方案、3 种字体、数字格式
- **自定义名单**: 开关 + 导入对话框 + 导出 txt
- **历史记录**: 卡片列表 + 复制 + 清空

#### 3.2.3 主显示区域
- **空闲态**: 圆形图标 + 标题 + 描述 + 脉冲呼吸光晕 + 圆形大按钮
- **抽取中**: 大字号数字滚动 + 提示文字
- **结果态**: 结果标签 + 大字号数字 + 元信息 + 操作按钮
- **错误态**: 错误图标 + 错误信息 + 重试按钮

---

## 4. 设计系统规范 (v4.0)

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

### 4.5 配色方案（10 种主题）

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

## 5. shadcn/ui 组件库 (v4 base-nova)

### 5.1 基础组件清单

| 组件 | 文件 | 使用 @base-ui/react |
|------|------|-------------------|
| Alert | `ui/alert.tsx` | 否（原生 div） |
| Badge | `ui/badge.tsx` | 是（useRender） |
| Button | `ui/button.tsx` | 是（ButtonPrimitive） |
| Card | `ui/card.tsx` | 否（原生 div） |
| Dialog | `ui/dialog.tsx` | 是（Dialog 系列） |
| Input | `ui/input.tsx` | 否（原生 input） |
| Label | `ui/label.tsx` | 否（原生 label） |
| Select | `ui/select.tsx` | 是（SelectPrimitive） |
| Separator | `ui/separator.tsx` | 是（Separator） |
| Sheet | `ui/sheet.tsx` | 是（Drawer） |
| Slider | `ui/slider.tsx` | 是（Slider） |
| Switch | `ui/switch.tsx` | 是（Switch） |
| Tabs | `ui/tabs.tsx` | 是（Tabs） |
| Textarea | `ui/textarea.tsx` | 否（原生 textarea） |

### 5.2 业务组件规范

| 组件 | 位置 | 关键样式 | 说明 |
|------|------|----------|------|
| DrawButton | `draw/draw-button.tsx` | `px-12 py-5 rounded-[1.75rem]` | 胶囊形脉冲大按钮，`aria-pressed` |
| NumberRoller | `number-roller.tsx` | `tabular-nums` + 渐变色 | 字符级滚动动画，尊重 reduce-motion |
| DrawDisplay | `draw/draw-display/` | 居中布局 | 按状态展示不同视图 |
| SettingsPanel | `draw/settings-panel/` | Tabs 切换 | prop-drilling 模式（20+ props） |
| HistoryCard | `draw/history-list/history-card.tsx` | `p-5 rounded-2xl bg-muted/15` | 结果卡片 + 复制 |
| CustomListModal | `draw/custom-list-settings.tsx` | `role="dialog" aria-modal="true"` | 导入弹窗 + 自动聚焦 |

---

## 6. 状态管理

### 6.1 Reducer 状态结构
```typescript
interface DrawState {
  status: 'idle' | 'drawing' | 'result' | 'error';
  min: number;                      // 最小值
  max: number;                      // 最大值
  count: number;                    // 抽取数量
  allowDuplicates: boolean;          // 允许重复
  autoHide: boolean;                // 自动隐藏侧边栏
  duration: number;                 // 动画时长（秒）
  customList: string[];             // 自定义名单
  useCustomList: boolean;           // 使用自定义名单
  digits: number;                   // 补零位数
  prefix: string;                   // 前缀
  suffix: string;                   // 后缀
  language: 'zh' | 'en';           // 语言
  history: HistoryEntry[];          // 历史记录
  results: string[];                // 当前结果
  error: string | null;             // 错误信息
}
```

### 6.2 Action 类型
- `SET_FIELD<K>` — 更新单个字段（泛型约束）
- `START_DRAW` / `STOP_DRAW` — 状态转换
- `SET_RESULTS` / `SET_ERROR` — 结果/错误
- `SET_HISTORY` — 设置历史记录
- `RESET` — 重置到 idle

### 6.3 持久化（localStorage）
所有 key 以 `zendraw-` 为前缀，共 13 组：
`min`, `max`, `count`, `duplicates`, `autohide`, `duration`,
`custom-list`, `use-custom`, `digits`, `prefix`, `suffix`,
`language`, `history`

跨标签同步: 通过 `window.addEventListener('storage', ...)` 实现。

---

## 7. 国际化

### 7.1 支持语言
- `en` — English
- `zh` — 简体中文

### 7.2 翻译键（49 个）
```
title, settings, history,
rangeCount, rangeDesc, minVal, maxVal, drawCount,
allowDup, autoHide, autoHideDesc,
clickToExpand, configureHint,
custom, display, drawAgain, drawSettings, appearance,
drawDuration, drawDurationDesc,
theme, themeMode, themeLight, themeDark, themeSystem,
themePreset, themeDefault, themeOcean, themeForest,
themeSunset, themePurple, themeNeon,
themeSakura, themeMidnight, themeRetro, themePixel,
fontFamily, fontSans, fontMono, fontSerif,
listImport, listImportDesc, useCustomList,
export, displayRules, displayDesc,
minDigits, minDigitsDesc, prefix, suffix,
drawHistory, historyDesc, noHistory,
ready, drawing, startDraw, stopDraw, startHint, stopHint,
recordLabel, resultsCount, copiedToClipboard, copyResult, copied,
import_, importDesc, listPlaceholder, confirmImport,
cancel, ok, notice, itemsLoaded, noItems, clearHistory,
toggleUI, switchLang, minMaxError, rangeError
```

### 7.3 使用方式
```typescript
import { createTranslator } from "@/lib/i18n";
const t = React.useMemo(() => createTranslator(language), [language]);
// 普通: t("title")
// 参数: t("resultsCount", "5")  → 支持 {0} 占位符
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

### 8.2 ESLint 规则（Flat Config）
- **TypeScript**: no-explicit-any (warn), no-non-null-assertion (error), no-unused-vars (warn)
- **React Hooks**: rules-of-hooks (error), exhaustive-deps (error)
- **安全**: no-eval (error), no-new-func (error), no-restricted-syntax (warn Math.random)
- **无障碍**: jsx-a11y (warn)
- **代码质量**: no-console (warn), no-debugger (error), no-var (error), prefer-const (warn)

### 8.3 安全头（next.config.ts）
| 头 | 值 |
|----|-----|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; ...` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |

### 8.4 安全编码规范
- **随机数**: 必须使用 `crypto.getRandomValues()` + 拒绝采样
- **输入验证**: `parseFiniteNumber()`、`sanitizeListInput()`、prefix/suffix 控制字符过滤
- **XSS 防护**: 零处 `dangerouslySetInnerHTML`、零处 `eval`/`new Function`
- **localStorage**: 敏感数据（custom-list）可选清除

### 8.5 错误边界
- `app/error.tsx` — 全局错误捕获 + 重试按钮 + 返回首页
- `app/not-found.tsx` — 404 友好提示

### 8.6 CI/CD（GitHub Actions）
每次 PR 自动运行：
1. `npm run type-check` → 类型检查
2. `npm run lint` → ESLint（最多 20 警告）
3. `npm run build` → 构建验证
4. `npm audit --audit-level=high` → 安全审计

---

## 9. 本地存储键名对照

| 键名 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| zendraw-min | number | 1 | 最小值 |
| zendraw-max | number | 100 | 最大值 |
| zendraw-count | number | 1 | 抽取数量 |
| zendraw-duplicates | boolean | true | 允许重复 |
| zendraw-autohide | boolean | true | 自动隐藏 |
| zendraw-duration | number | 5 | 动画时长(秒) |
| zendraw-custom-list | string[] | [] | 自定义名单 |
| zendraw-use-custom | boolean | false | 启用自定义名单 |
| zendraw-digits | number | 0 | 补零位数 |
| zendraw-prefix | string | "" | 前缀 |
| zendraw-suffix | string | "" | 后缀 |
| zendraw-language | "zh"\|"en" | "zh" | 语言 |
| zendraw-history | HistoryEntry[] | [] | 历史记录 |
| zendraw-theme-preset | string | "default" | 配色方案 |
| zendraw-font-family | string | "sans" | 字体 |

---

## 10. 原型对照

### 10.1 原型文件
| 文件 | 位置 | 说明 |
|------|------|------|
| 线框图 | `prototype/v1/wireframes.html` | 低保真布局探索 |
| 初始原型 | `prototype/v1/prototype.html` | v3.0 设计系统展示 |
| 交互原型 | `prototype/v2/prototypes.html` | v3.0 交互流程 |
| 高保真原型 | `prototype/interactive/index.html` | **v4.0 可交互原型（主参考）** |
| 设计系统 | `prototype/design-system.md` | 完整设计系统文档 |

### 10.2 代码与原型对齐清单
| 特性 | 原型状态 | 代码状态 | 说明 |
|------|----------|----------|------|
| 欢迎页图标 + 脉冲光晕 | ✅ | ✅ | 代码使用 motion 实现 |
| 圆形抽取按钮 | ✅ | ✅ | `rounded-[1.75rem]` 胶囊 |
| 数字滚动动画 | ✅ | ✅ | 逐字定格老虎机效果 |
| 结果揭示动效 | ✅ | ✅ | 庆祝光晕 + 粒子 |
| 10 种主题切换 | ✅ | ✅ | CSS 变量驱动 |
| 深浅色切换 | ✅ | ✅ | next-themes |
| 侧边栏设置面板 | ✅ | ✅ | Sheet 组件 + Tabs |
| 自定义名单导入 | ✅ | ✅ | 含 a11y 对话框 |
| 历史记录列表 | ✅ | ✅ | 含空状态 |
| 键盘快捷键 | ✅ | ✅ | Space/Enter/Escape |
| 音效系统 | — | ✅ | Web Audio API |
| 错误边界 | ✅ | ✅ | error.tsx + not-found.tsx |
| 安全头 | ✅ | ✅ | CSP + HSTS + 7 条 |

---

## 11. SEO 与元数据

```typescript
// layout.tsx
export const metadata: Metadata = {
  title: "ZenDraw | 禅抽 v3.3.0",
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

### v3.3.0 (当前)
- 组件拆分（大文件 → 子组件目录）
- 音效系统（Web Audio API）
- 动效优化（逐字定格 + 庆祝光晕）
- 国际化重构（49 翻译键 + createTranslator）
- 安全加固（secureRandomInt 全面替换 Math.random）

### v3.2.0
- 代码质量体系（ESLint 强化 / 严格 TypeScript / CI/CD）
- 代码审查标准 + PR 模板

### v3.1.0
- Apple Design 风格重设计
- 圆角/阴影/间距系统统一

---

*本文档最后更新: 2026-06-30 · 与 prototype/interactive/index.html 和 app/ 代码保持对齐*
