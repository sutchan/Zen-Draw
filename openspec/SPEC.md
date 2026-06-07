# ZenDraw | 禅抽 v2.7.0 - 项目规范文档

## 1. 项目概述

### 1.1 项目信息
- **项目名称**: ZenDraw | 禅抽
- **版本**: v2.7.0
- **描述**: A professional, full-screen random draw application with customizable rules, history, and multi-language support. Perfect for lucky draws, classroom activities, and games.
- **许可证**: MIT License

### 1.2 技术栈
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

### 1.3 字体配置
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
│   ├── page.tsx            # 主页面
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
│   └── prototype.html     # 原型图
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

#### 3.2.1 主题系统
| 模式 | 描述 |
|------|------|
| Light | 浅色模式 |
| Dark | 深色模式 |
| System | 跟随系统 |

#### 3.2.2 配色方案
| ID | 名称 | 描述 |
|----|------|------|
| default | 默认 | 标准配色 |
| ocean | 海洋蓝 | 蓝调主题 |
| forest | 森林绿 | 绿调主题 |
| sunset | 落日橙 | 橙调主题 |
| purple | 紫罗兰 | 紫调主题 |
| neon | 霓虹 | 赛博朋克风格 |

#### 3.2.3 字体样式
| ID | 名称 | 字体 |
|----|------|------|
| sans | 无衬线 | Inter (Geist) |
| mono | 等宽 | JetBrains Mono |
| serif | 衬线 | Playfair Display |

#### 3.2.4 侧边栏
- **自动隐藏**: 支持自动隐藏侧边栏功能
- **设置面板**: 包含所有配置选项
- **历史记录**: 显示抽取历史

### 3.3 数据管理

#### 3.3.1 本地存储键名
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

#### 3.3.2 历史记录结构
```typescript
interface HistoryItem {
  id: string;          // 随机ID
  timestamp: string;   // ISO时间戳
  results: string[];   // 结果数组
}
```

---

## 4. 组件规格

### 4.1 NumberRoller
- **用途**: 显示滚动动画的数字
- **Props**:
  - `value: string` - 显示的值
  - `isDrawing: boolean` - 是否正在抽取
  - `className?: string` - 额外样式类

### 4.2 Dialog
- **用途**: 模态对话框
- **Props**:
  - `open: boolean` - 是否打开
  - `onOpenChange: (open: boolean) => void` - 打开状态变化回调
- **子组件**: DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter

### 4.3 Textarea
- **用途**: 多行文本输入
- **Props**: 继承原生 textarea 属性

### 4.4 ThemeProvider
- **用途**: 主题上下文提供者
- **配置**:
  - `attribute="class"`
  - `defaultTheme="system"`
  - `enableSystem`
  - `disableTransitionOnChange`

---

## 5. 国际化

### 5.1 支持语言
- `en` - English
- `zh` - 简体中文

### 5.2 翻译键名
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

## 6. 样式规格

### 6.1 CSS变量
```css
/* 主题颜色由 next-themes 生成 */
/* 字体变量由 next/font 配置 */
--font-sans: Inter
--font-mono: JetBrains Mono
--font-serif: Playfair Display

/* 自定义主题类 */
.theme-ocean { ... }
.theme-forest { ... }
.theme-sunset { ... }
.theme-purple { ... }
.theme-neon { ... }
```

### 6.2 响应式断点
- **移动端**: < 768px
- **平板/桌面**: >= 768px
- **侧边栏宽度**: 420px (sm:w-[420px])

### 6.3 动画配置
- **默认过渡时长**: 300ms
- **侧边栏动画**: spring (stiffness: 300, damping: 30, mass: 0.8)
- **数字结果动画**: spring (stiffness: 300, damping: 25, mass: 0.8)
- **自动隐藏延迟**: 8000ms

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
  title: 'ZenDraw | 禅抽 v2.7.0',
  description: 'A professional, full-screen random draw application...',
  keywords: ['ZenDraw', '禅抽', 'random draw', 'lucky draw', ...],
  authors: [{ name: 'Sut' }]
}
```

### 7.3 PWA配置
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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

### v2.7.0 (当前版本)
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

*本文档最后更新: v2.7.0*
