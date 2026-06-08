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
| 极简布局 | 去除冗余元素，只保留核心功能入口 |
| 大图展示 | 突出显示抽奖结果，视觉冲击力更强 |
| 充足留白 | 呼吸空间让界面更优雅，阅读更舒适 |
| 清晰层次 | 明确的内容层级，信息结构一目了然 |

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
| xs | rounded-lg | 小按钮、标签 |
| sm | rounded-xl | 小卡片 |
| md | rounded-2xl | 输入框、中等卡片、对话框 |
| lg | rounded-[2rem] | 大型结果卡片 |
| full | rounded-full / 980px | 胶囊按钮 |

#### 4.1.2 间距系统
| 名称 | 间距值 | 适用场景 |
|------|--------|----------|
| xs | 4px | 紧凑元素 |
| sm | 8px | 小间距 |
| md | 16px | 默认间距 |
| lg | 24px | 区块间距 |
| xl | 32px+ | 大区块 |

#### 4.1.3 动画曲线
```typescript
// Apple 风格动画曲线
ease: [0.25, 0.1, 0.25, 1]  // cubic-bezier(0.25, 0.1, 0.25, 1)

// Spring 动画参数
stiffness: 300
damping: 30
mass: 0.8
```

#### 4.1.4 动画时长
| 场景 | 时长 |
|------|------|
| 快速过渡 | 200-300ms |
| 标准过渡 | 300-500ms |
| 强调动画 | 500-800ms |

### 4.2 布局规范

#### 4.2.1 响应式断点
- **移动端**: < 768px
- **平板/桌面**: >= 768px
- **侧边栏宽度**: 380px (sm:w-[380px])

#### 4.2.2 主显示区域
- **最大宽度**: max-w-4xl (896px)
- **垂直内边距**: py-12 (48px)
- **按钮容器**: max-w-md (448px)

### 4.3 组件规范

#### 4.3.1 按钮样式
```tsx
// 主要操作按钮 (胶囊形)
className="h-16 sm:h-[72px] rounded-full font-semibold"

// 次要按钮
className="h-11 rounded-xl"

// 图标按钮
className="h-10 w-10 rounded-xl"
```

#### 4.3.2 输入框样式
```tsx
className="h-11 rounded-2xl bg-muted/40 border border-border/20 
         focus:ring-2 focus:ring-primary/15 focus:bg-background transition-all"
```

#### 4.3.3 卡片样式
```tsx
// 结果卡片
className="bg-background rounded-[2rem] px-12 py-10 
         border border-border/15 backdrop-blur-xl 
         shadow-[0_8px_32px_rgba(0,0,0,0.06)]"

// 历史记录卡片
className="p-5 rounded-2xl bg-muted/20 hover:bg-muted/40 
         border border-transparent hover:border-border/30 transition-colors"
```

#### 4.3.4 阴影系统
| 级别 | 阴影值 | 适用场景 |
|------|--------|----------|
| sm | `0 1px 2px rgba(0,0,0,0.04)` | 轻微浮起 |
| md | `0 8px 32px rgba(0,0,0,0.06)` | 卡片、输入框聚焦 |
| lg | `0 20px 60px rgba(0,0,0,0.10)` | 大型卡片悬停 |
| xl | `0 30px 100px rgba(0,0,0,0.12)` | 突出显示结果 |
| button | `0 8px 30px rgba(0,0,0,0.12)` | 主按钮常态 |
| button-hover | `0 12px 40px rgba(0,0,0,0.18)` | 主按钮悬停 |

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
