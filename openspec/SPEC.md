# ZenDraw | 禅抽 v3.0 - 项目规范文档

## 1. 项目概述

### 1.1 项目信息
- **项目名称**: ZenDraw | 禅抽
- **版本**: v3.0
- **描述**: 一款专业的全屏随机抽奖应用，采用 Apple 设计风格，适用于年会抽奖、课堂互动、抽奖活动等场景。
- **许可证**: MIT License

### 1.2 设计理念
本版本采用 Apple 设计风格，重新定义了视觉呈现和交互体验：

| 设计原则 | 说明 |
|----------|------|
| 极简布局 | 去除冗余元素，只保留核心功能入口，让内容优先于界面 |
| 大图展示 | 突出显示抽奖结果，大字号居中布局，一眼即达 |
| 充足留白 | 呼吸空间让界面更优雅，阅读更舒适，降低视觉疲劳 |
| 清晰层次 | 明确的内容层级，信息结构一目了然，操作路径清晰 |

### 1.3 技术栈
| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| UI库 | React 19 |
| 样式 | Tailwind CSS v4 |
| 动画 | Framer Motion (motion/react) |
| 图标 | Lucide React |
| 主题 | next-themes |
| 组件库 | shadcn/ui |
| 语言 | TypeScript (strict mode) |

### 1.4 字体配置
| 名称 | 字体 | 变量名 |
|------|------|--------|
| 无衬线 | Inter (Geist) | --font-sans |
| 等宽 | JetBrains Mono | --font-mono |
| 衬线 | Playfair Display | --font-serif |

### 1.5 核心交互流程
1. 打开应用 → 显示主界面（大图居中布局 + 准备状态）
2. 点击右上角齿轮图标 → 侧边栏从右侧滑入（带 spring 物理动画）
3. 在侧边栏配置抽奖参数（范围、数量、动画时长、主题预设等）
4. 点击胶囊形「开始抽奖」按钮 → UI 自动隐藏 + 数字滚动动画
5. 动画结束 → 展示中奖结果（大字号聚焦展示 + spring 弹性动画）

---

## 2. 目录结构

```
/workspace
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面 (v3.0 Apple Design)
│   └── style.css           # 全局样式
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── number-roller.tsx   # 数字滚动组件
│   ├── theme-provider.tsx  # 主题提供者
│   └── theme-toggle.tsx    # 主题切换
├── hooks/
│   ├── use-local-storage.ts  # 本地存储hook
│   └── use-mobile.ts         # 移动端检测hook
├── lib/
│   └── utils.ts            # 工具函数
├── locales/
│   └── index.ts            # 国际化翻译
├── openspec/               # 规范文档
│   ├── SPEC.md            # 本文档
│   └── prototype.html     # 原型图 (v3.0 Apple Design)
├── .eslintrc.json         # ESLint配置
├── .gitignore
├── CHANGELOG.md
├── components.json         # shadcn配置
├── eslint.config.js       # ESLint flat config
├── metadata.json          # 项目元数据
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md              # 英文文档
├── README_CN.md           # 中文文档
└── tsconfig.json
```

---

## 3. 功能规格

### 3.1 核心功能

#### 3.1.1 随机抽取
- **数值范围**: 支持自定义最小值和最大值
- **抽取数量**: 支持一次抽取多个结果
- **重复选项**: 支持允许/禁止重复抽取
- **自定义名单**: 支持导入自定义名单（每行一个）

#### 3.1.2 显示规则
- **位数补零**: 最小位数设置（如 3 位数: 001, 002...）
- **前缀/后缀**: 支持添加自定义前缀和后缀

#### 3.1.3 动画效果
- **滚动动画**: Slot-machine 风格数字滚动效果
- **动画时长**: 可配置（1-30秒）
- **动画优化**: 支持 reduce motion 偏好设置

### 3.2 界面功能

#### 3.2.1 顶部导航栏 (v3.0 新增)
- **极简设计**: 高度 56px (h-14)，半透明背景
- **毛玻璃效果**: backdrop-blur-xl
- **品牌标识**: 左侧显示 Logo + 应用名称
- **控制按钮**: 右侧语言切换 + 设置面板开关

#### 3.2.2 设置面板 (v3.0 优化)
- **宽度**: 380px (sm:w-[380px])
- **毛玻璃背景**: backdrop-blur-xl
- **分组设计**: 使用大写标签区分功能区块
- **圆角风格**: 统一使用 rounded-xl / rounded-2xl

#### 3.2.3 主题系统
| 模式 | 描述 |
|------|------|
| Light | 浅色模式 |
| Dark | 深色模式 |
| System | 跟随系统 |

#### 3.2.4 配色方案
| ID | 名称 | 描述 |
|----|------|------|
| default | 默认 | 标准配色 |
| ocean | 海洋蓝 | 蓝调主题 |
| forest | 森林绿 | 绿调主题 |
| sunset | 落日橙 | 橙调主题 |
| purple | 紫罗兰 | 紫调主题 |
| neon | 霓虹 | 赛博朋克风格 |

#### 3.2.5 字体样式
| ID | 名称 | 字体 |
|----|------|------|
| sans | 无衬线 | Inter (Geist) |
| mono | 等宽 | JetBrains Mono |
| serif | 衬线 | Playfair Display |

---

## 4. 设计规范 (v3.0)

### 4.1 视觉规范

#### 4.1.1 圆角系统
| 名称 | 圆角值 | 适用场景 |
|------|--------|----------|
| xs | rounded-lg (0.5rem) | 小按钮、标签 |
| sm | rounded-xl (0.75rem) | 小卡片、输入框聚焦状态 |
| md | rounded-2xl (1rem) | 输入框、中等卡片、对话框 |
| lg | rounded-[2rem] | 大型结果卡片、主面板 |
| full | rounded-full / 980px | 胶囊按钮（主要操作） |

#### 4.1.2 间距系统
| 名称 | 间距值 | 适用场景 |
|------|--------|----------|
| xs | 4px (0.25rem) | 紧凑元素、图标间距 |
| sm | 8px (0.5rem) | 小组件间距 |
| md | 16px (1rem) | 默认间距、段落间距 |
| lg | 24px (1.5rem) | 区块间距、设置分组间距 |
| xl | 32px+ (2rem+) | 大区块留白、页面布局 |

#### 4.1.3 颜色系统 (Light Mode)
| 变量 | 值 | 用途 |
|------|-----|------|
| --background | oklch(0.99 0 0) | 页面背景 |
| --foreground | oklch(0.145 0 0) | 主要文字 |
| --muted | oklch(0.965 0 0) | 次要背景 |
| --muted-foreground | oklch(0.556 0 0) | 次要文字 |
| --border | oklch(0.91 0 0) | 边框颜色 |
| --ring | oklch(0.708 0 0) | 聚焦环颜色 |

#### 4.1.4 颜色系统 (Dark Mode)
| 变量 | 值 | 用途 |
|------|-----|------|
| --background | oklch(0.145 0 0) | 页面背景 |
| --foreground | oklch(0.985 0 0) | 主要文字 |
| --muted | oklch(0.269 0 0) | 次要背景 |
| --muted-foreground | oklch(0.708 0 0) | 次要文字 |
| --border | oklch(1 0 0 / 10%) | 边框颜色 |

#### 4.1.5 动画曲线
```typescript
// Apple 风格动画曲线 - 核心缓动
ease: [0.25, 0.1, 0.25, 1]  // cubic-bezier(0.25, 0.1, 0.25, 1)

// Spring 物理动画参数 - 侧边栏滑入/结果弹出
stiffness: 300  // 刚度
damping: 30     // 阻尼
mass: 0.8       // 质量
```

#### 4.1.6 动画时长规范
| 场景 | 时长 | 动画类型 |
|------|------|---------|
| 快速过渡（悬停、开关） | 200-300ms | ease-out |
| 标准过渡（页面切换） | 300-500ms | cubic-bezier(0.25, 0.1, 0.25, 1) |
| 强调动画（结果展示） | 500-800ms | spring(300, 30, 0.8) |
| 浮动装饰动画 | 4s | ease-in-out (infinite) |

#### 4.1.7 阴影系统
| 级别 | 阴影值 | 适用场景 |
|------|--------|----------|
| sm | `0 1px 2px rgba(0,0,0,0.04)` | 轻微浮起、卡片常态 |
| md | `0 8px 32px rgba(0,0,0,0.06)` | 卡片、输入框聚焦 |
| lg | `0 20px 60px rgba(0,0,0,0.10)` | 大型卡片悬停 |
| xl | `0 30px 100px rgba(0,0,0,0.12)` | 突出显示结果、模态框 |
| button | `0 8px 30px rgba(0,0,0,0.12)` | 主按钮常态 |
| button-hover | `0 12px 40px rgba(0,0,0,0.18)` | 主按钮悬停 |

### 4.2 布局规范

#### 4.2.1 响应式断点
| 设备 | 断点 | 布局变化 |
|------|------|---------|
| 移动端 | < 768px | 全屏侧边栏、单列布局 |
| 平板/桌面 | >= 768px | 380px 侧边栏宽度、双列布局 |
| 大屏 | >= 1200px | 结果卡片更大留白 |

#### 4.2.2 主显示区域规范
- **最大宽度**: max-w-4xl (896px) - 结果展示容器
- **垂直内边距**: py-12 (48px) - 结果区上下留白
- **按钮容器**: max-w-md (448px) - 底部操作区宽度
- **顶部导航高度**: h-14 (56px) - Desktop / h-12 (48px) - Mobile
- **侧边栏宽度**: w-full (Mobile) / sm:w-[380px] (Desktop)

#### 4.2.3 结果卡片规范
- **圆角**: rounded-[2rem] - 大圆角 Apple 风格
- **内边距**: px-12 py-10 sm:px-16 sm:py-12 - 响应式 padding
- **边框**: border border-border/15 - 极细边框增加层次
- **背景**: bg-background - 与页面一致，毛玻璃效果
- **阴影**: shadow-[0_8px_32px_rgba(0,0,0,0.06)] - 柔和投影

### 4.3 组件规范

#### 4.3.1 按钮样式
```tsx
// 主要操作按钮 (胶囊形) - 开始抽奖按钮
className="h-16 sm:h-[72px] rounded-full font-semibold 
           shadow-[0_8px_30px_rgba(0,0,0,0.12)]
           hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
           transition-all duration-300"

// 次要按钮
className="h-11 rounded-xl border border-border/30 hover:bg-muted/50"

// 图标按钮（顶部导航）
className="h-10 w-10 rounded-xl hover:bg-muted transition-colors"
```

#### 4.3.2 输入框样式
```tsx
// 数字输入框
className="h-11 rounded-2xl bg-muted/40 border border-border/20 
         focus:ring-2 focus:ring-primary/15 focus:bg-background 
         transition-all placeholder:text-muted-foreground/50"

// 自定义名单文本域
className="min-h-[200px] rounded-xl resize-none bg-muted/40 border-0 
         focus:ring-2 focus:ring-primary/20"
```

#### 4.3.3 卡片样式
```tsx
// 结果展示卡片
className="bg-background rounded-[2rem] px-12 py-10 sm:px-16 sm:py-12 
         text-center border border-border/15 backdrop-blur-xl 
         shadow-[0_8px_32px_rgba(0,0,0,0.06)] min-w-[240px] sm:min-w-[300px]"

// 历史记录卡片
className="p-5 rounded-2xl bg-muted/20 hover:bg-muted/40 
         border border-transparent hover:border-border/30 transition-colors"

// 设置分组卡片
className="space-y-5 pt-6"
```

#### 4.3.4 顶部导航栏
```tsx
// 导航栏容器
className="absolute top-0 left-0 right-0 h-14 px-6 
         flex items-center justify-between z-50 
         border-b border-border/50 
         bg-background/80 backdrop-blur-xl"

// 品牌标识
className="flex items-center gap-3"
// Logo: w-8 h-8 rounded-[10px] + Dices icon
// Title: text-base font-semibold tracking-tight
// Version: text-[10px] text-muted-foreground/60 font-mono

// 控制按钮组
className="flex items-center gap-2"
// 语言切换: Button variant="ghost" + Languages icon
// 设置切换: Button variant="secondary/ghost" + Menu/Settings icon
```

#### 4.3.5 侧边栏面板
```tsx
// 侧边栏容器
className="absolute inset-y-0 right-0 z-40 w-full sm:w-[380px] 
         bg-background/92 backdrop-blur-xl 
         border-l border-border/30 flex flex-col"
// 动画: animate x: 0 <-> 100%, spring(300, 30, 0.8)

// 侧边栏标题
className="px-6 py-5 border-b border-border/30"
// Title: text-2xl font-semibold tracking-tight

// Tabs 切换
className="w-full flex gap-1 p-1 bg-muted/40 rounded-xl m-5 mb-0"

// Tab 选项卡
className="flex-1 rounded-lg data-[state=active]:bg-background 
         data-[state=active]:shadow-sm text-sm font-medium"
```

#### 4.3.6 数字滚动组件 (NumberRoller)
```tsx
// 主容器
className="flex items-center justify-center tabular-nums"

// 数字大小
className="text-7xl sm:text-8xl md:text-9xl lg:text-[12vw] 
         font-bold tracking-tighter leading-none"

// 渐变色
className="bg-clip-text text-transparent 
         bg-gradient-to-b from-foreground to-foreground/80"

// 滚动动画参数
// 数字滚动: linear duration 0.1s + index * 0.03s
// 结果出现: spring(300, 20, 1)
```

---

## 4.4 主题预设规范

### 4.4.1 默认主题 (Default)
- **风格**: 黑白极简、高对比度
- **用途**: 默认推荐，适合正式场合
- **背景**: 浅灰 (#FBFBFD) / 深黑 (#1D1D1F)
- **强调色**: 深蓝灰 (#1D1D1F)

### 4.4.2 海洋蓝主题 (Ocean)
- **风格**: 清新、专业
- **背景**: 冷色调蓝灰
- **强调色**: oklch(0.5 0.15 220) - 明亮蓝色
- **用途**: 商务活动、企业年会

### 4.4.3 森林绿主题 (Forest)
- **风格**: 自然、活力
- **背景**: 冷色调绿灰
- **强调色**: oklch(0.5 0.15 140) - 自然绿色
- **用途**: 户外活动、环保主题

### 4.4.4 落日橙主题 (Sunset)
- **风格**: 温暖、活泼
- **背景**: 暖色调橙灰
- **强调色**: oklch(0.6 0.15 40) - 温暖橙色
- **用途**: 庆祝活动、节日抽奖

### 4.4.5 紫罗兰主题 (Purple)
- **风格**: 优雅、神秘
- **背景**: 紫色调灰
- **强调色**: oklch(0.5 0.2 300) - 优雅紫色
- **用途**: 品牌活动、创意展示

### 4.4.6 霓虹主题 (Neon)
- **风格**: 赛博朋克、高对比
- **背景**: 深色背景 (#121212)
- **强调色**: oklch(0.7 0.35 200) - 霓虹青色
- **用途**: 游戏活动、科技活动

---

## 5. 数据管理

### 5.1 本地存储键名
| 键名 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| zendraw-lang | Language | "zh" | 语言设置 |
| zendraw-min | number | 1 | 最小值 |
| zendraw-max | number | 100 | 最大值 |
| zendraw-count | number | 1 | 抽取数量 |
| zendraw-duplicates | boolean | true | 允许重复 |
| zendraw-autohide | boolean | true | 自动隐藏 |
| zendraw-duration | number | 5 | 动画时长 |
| zendraw-theme-preset | string | "default" | 配色方案 |
| zendraw-font-family | string | "sans" | 字体样式 |
| zendraw-custom-list | string[] | [] | 自定义名单 |
| zendraw-use-custom | boolean | false | 使用自定义名单 |
| zendraw-digits | number | 3 | 位数补零 |
| zendraw-prefix | string | "" | 前缀 |
| zendraw-suffix | string | "" | 后缀 |
| zendraw-history | HistoryItem[] | [] | 抽取历史 |

### 5.2 历史记录结构
```typescript
interface HistoryItem {
  id: string;          // 随机ID
  timestamp: string;   // ISO时间戳
  results: string[];   // 结果数组
}
```

---

## 6. 国际化

### 6.1 支持语言
- `en` - English
- `zh` - 简体中文

### 6.2 翻译键名
| 键名 | 英文 | 中文 |
|------|------|------|
| title | ZenDraw | 禅抽 |
| settings | Settings | 设置 |
| history | History | 历史记录 |
| rangeCount | Range & Count | 范围与数量 |
| rangeDesc | Define the pool of numbers. | 定义抽取数字的范围。 |
| minVal | Min Value | 最小值 |
| maxVal | Max Value | 最大值 |
| drawCount | Draw Count | 抽取数量 |
| allowDup | Allow Duplicates | 允许重复 |
| autoHide | Auto-hide Sidebar | 自动隐藏侧边栏 |
| autoHideDesc | Hide sidebar automatically when drawing or idle. | 开始抽签或长时间无操作时自动隐藏侧边栏。 |
| clickToExpand | Click to expand options | 点击展开选项 |
| drawDuration | Draw Duration (s) | 抽签时长 (秒) |
| drawDurationDesc | Set the duration of the rolling animation. | 设置数字滚动的动画时长。 |
| theme | Theme | 主题 |
| themeMode | Theme Mode | 深浅模式 |
| themeLight | Light | 浅色 |
| themeDark | Dark | 深色 |
| themeSystem | System | 跟随系统 |
| themePreset | Theme Preset | 配色方案 |
| themeDefault | Default | 默认 |
| themeOcean | Ocean | 海洋蓝 |
| themeForest | Forest | 森林绿 |
| themeSunset | Sunset | 落日橙 |
| themePurple | Purple | 紫罗兰 |
| themeNeon | Neon | 霓虹 |
| fontFamily | Font Family | 字体样式 |
| fontSans | Sans (Inter) | 无衬线 (Inter) |
| fontMono | Mono (JetBrains) | 等宽 (JetBrains) |
| fontSerif | Serif (Playfair) | 衬线 (Playfair) |
| listImport | List Import | 名单导入 |
| listImportDesc | Paste items separated by newlines. | 粘贴名单，每行一个。 |
| useCustomList | Use Custom List | 使用自定义名单 |
| export | Export Results | 导出结果 |
| displayRules | Display Rules | 显示规则 |
| displayDesc | Customize how numbers appear. | 自定义数字的显示方式。 |
| minDigits | Minimum Digits (Padding) | 最小位数 (补零) |
| minDigitsDesc | Set to 0 for no padding. | 设置为 0 则不补零。 |
| prefix | Prefix | 前缀 |
| suffix | Suffix | 后缀 |
| drawHistory | Draw History | 抽签历史 |
| historyDesc | Recent results. | 最近的抽签结果。 |
| noHistory | No history yet. | 暂无历史记录。 |
| ready | Ready to draw | 准备就绪 |
| drawing | Drawing... | 抽取中... |
| startDraw | START DRAW | 开始抽签 |
| minMaxError | Minimum value cannot be greater than maximum value. | 最小值不能大于最大值。 |
| rangeError | Cannot draw more unique numbers than the available range. | 抽取的不重复数字数量不能超过可用范围。 |
| clearHistory | Clear History | 清空历史 |
| toggleUI | Toggle UI | 切换控制面板 |
| switchLang | Switch Language | 切换语言 |

---

## 7. SEO与元数据

### 7.1 Viewport
```typescript
{
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}
```

### 7.2 Metadata
```typescript
{
  title: 'ZenDraw | 禅抽 v3.0',
  description: '一款专业的全屏随机抽奖应用，采用 Apple 设计风格...',
  keywords: ['ZenDraw', '禅抽', 'random draw', 'lucky draw', ...],
  authors: [{ name: 'Sut' }]
}
```

---

## 8. 规范要求

### 8.1 代码规范
- 使用 ESLint 进行代码检查
- TypeScript strict mode
- React hooks 规范:
  - 不在 useEffect 中同步调用 setState
  - 使用 useCallback/useMemo 优化性能

### 8.2 命名规范
- 组件名: PascalCase
- 文件名: kebab-case
- 变量名: camelCase
- 常量: UPPER_SNAKE_CASE

### 8.3 提交规范
遵循 Semantic Versioning:
- MAJOR: 不兼容的API更改
- MINOR: 向后兼容的功能添加
- PATCH: 向后兼容的bug修复

---

## 9. 更新日志

### v3.0 (当前版本)
**设计重构 - Apple Design Style**

#### 设计变更
- 顶部导航栏重新设计，56px 高度毛玻璃效果，border-border/50 分隔线
- 设置面板宽度调整为 380px，采用 Apple 风格分组
- 结果展示区域优化，大尺寸居中布局，圆角统一 rounded-[2rem]
- 圆角系统统一，输入框 rounded-2xl，卡片 rounded-[2rem]
- 按钮样式改为胶囊形 (rounded-full)，高度 h-16 / sm:h-[72px]
- 阴影系统重新定义，4 级阴影变量（sm/md/lg/xl）
- 数字显示渐变优化，from-foreground to-foreground/80 垂直渐变
- Ready 状态图标透明度降低至 10%，更柔和不抢视线

#### 交互优化
- 动画曲线采用 Apple 标准 cubic-bezier(0.25, 0.1, 0.25, 1)
- 过渡动画时长调整为 300-500ms
- 浮动动画优化，4 秒循环，更柔和的浮动效果
- 按钮阴影随 hover 变化，常态 `0 8px 30px` → hover `0 12px 40px`
- 输入框增加细边框 border-border/20，聚焦效果更柔和

#### 原型更新
- 重新设计原型图 prototype.html v3.0
- 新增设计规范页面（字体、间距、动效）
- 优化移动端预览展示

### v2.7.0
- 新增 6 种配色方案
- 新增 3 种字体样式
- 优化侧边栏动画
- 修复 SSR 水合错误
- 优化移动端体验

### 早期版本
参见 CHANGELOG.md

---

## 10. 附录

### 10.1 npm scripts
| 命令 | 描述 |
|------|------|
| npm run dev | 启动开发服务器 |
| npm run build | 构建生产版本 |
| npm run start | 启动生产服务器 |
| npm run lint | 运行 ESLint 检查 |
| npm run lint:fix | 自动修复 lint 错误 |

### 10.2 依赖版本
- next: ^15.x
- react: ^19.x
- react-dom: ^19.x
- tailwindcss: ^4.x
- framer-motion: ^12.x
- lucide-react: latest
- next-themes: ^0.4.x
- typescript: ^5.x

---

## 11. 设计参考

### 11.1 Apple Human Interface Guidelines 关键点
1. **清晰度**: 内容优先，界面服务于内容
2. **遵从**: 界面响应自然，符合用户预期
3. **深度**: 层次分明，过渡自然流畅
4. **美学**: 整体协调，细节精致

### 11.2 常用 Apple 动画模式
- **Enter**: opacity 0→1, scale 0.95→1
- **Exit**: opacity 1→0, scale 1→0.95
- **Interactive**: scale 1→1.02 hover, scale 1→0.98 active
- **Panel**: translateX slide with spring physics

---

*本文档最后更新: v3.0.1*
