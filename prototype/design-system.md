# ZenDraw Design System v5.0

> **极简 · 精准 · 禅意** — 国际顶尖设计师水准的随机抽签应用

**设计灵感**: Apple Design · Linear · Vercel · Stripe

---

## 1. Design Philosophy

**Zen-Draw 的设计信条：抽签本身即是仪式。**

- **减法美学**：每个像素都有存在的理由。没有装饰性的装饰，只有功能的优雅表达。
- **聚焦核心**：抽签是中心行为 — 界面围绕它设计，而非分散注意力。
- **克制即力量**：色彩、动效、字体都服务于一个目标 — 让抽签过程充满仪式感。
- **跨端一致**：从桌面到移动端，体验保持连续与精致。

---

## 2. Color System

### 2.1 Design Tokens

```css
/* Neutral — cool-tinted, 非纯灰 */
--bg: #fafbfc;               /* Light mode 背景 */
--bg-subtle: #f4f5f7;        /* 次级背景 (hover, input) */
--bg-elevated: #ffffff;      /* 卡片/弹窗 */
--bg-muted: #eef0f4;         /* 悬停背景 */
--fg: #1a1d23;               /* 主要文字 */
--fg-secondary: #5a5f6b;     /* 次要文字 */
--fg-tertiary: #8e939f;      /* 辅助文字 */
--fg-quaternary: #b4b8c2;    /* 占位符/禁用 */
--border: #e2e5ea;           /* 边框 */
--border-subtle: #eef0f4;    /* 弱边框 */
--border-strong: #c4c8d0;    /* 强调边框 */
--ring: #1a1d23;              /* 焦点环 */

/* Brand — Zen Indigo */
--accent: #4f6ef7;           /* 品牌强调色 — 冷静的靛蓝 */
--accent-hover: #3b5ae0;     /* 悬停 */
--accent-subtle: rgba(79, 110, 247, 0.10);
--accent-soft: rgba(79, 110, 247, 0.06);

/* Semantic */
--success: #22a06b;          /* 成功 */
--warning: #e8a313;          /* 警告 */
--danger: #c9374b;           /* 错误 */
--info: #4f6ef7;             /* 信息 */

/* Dark Mode (所有颜色反转，保持对比度) */
[data-theme="dark"] {
  --bg: #0c0d0f;
  --bg-subtle: #141519;
  --bg-elevated: #1a1c22;
  --bg-muted: #23252b;
  --fg: #e8eaed;
  --fg-secondary: #9ca0ab;
  --fg-tertiary: #6b7080;
  --fg-quaternary: #464b58;
  --border: #2e3038;
  --border-subtle: #23252b;
  --border-strong: #3e414b;
  --accent: #6b87ff;
  --accent-hover: #85a0ff;
}
```

### 2.2 10 种配色主题

| # | 名称 | 风格 | 主色 |
|---|------|------|------|
| 1 | **Default** | 靛蓝 · 经典 | `#4f6ef7` |
| 2 | **Ocean** | 海洋 · 冷静 | `#00b4d8` |
| 3 | **Forest** | 森林 · 自然 | `#2d8a4e` |
| 4 | **Sunset** | 日落 · 温暖 | `#e07c3c` |
| 5 | **Purple** | 紫色 · 优雅 | `#7b2d8e` |
| 6 | **Neon** | 霓虹 · 激进 | `#ff2d55` |
| 7 | **Sakura** | 樱花 · 柔和 | `#ff8fab` |
| 8 | **Midnight** | 午夜 · 深邃 | `#3a3a5c` |
| 9 | **Retro** | 复古 · 怀旧 | `#a67c52` |
| 10 | **Pixel** | 像素 · 复古游戏 | `#33ff33` |

规则：所有主题仅改变 accent 色相，保持中性色系一致。

---

## 3. Typography

### 3.1 Font Stack

```css
--font-sans:  'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-mono:  'JetBrains Mono', ui-monospace, monospace;
--font-serif: 'Playfair Display', Georgia, 'Noto Serif SC', serif;
```

### 3.2 Type Scale (Modular Scale 1.25)

| Token | Size | Weight | Leading | Use |
|-------|------|--------|---------|-----|
| `--text-xs` | 0.75rem (12px) | 400/600 | 1.33 | 辅助文字、页码 |
| `--text-sm` | 0.875rem (14px) | 400/500 | 1.4 | 标签、设置项 |
| `--text-base` | 1rem (16px) | 400/500 | 1.5 | 正文 |
| `--text-lg` | 1.125rem (18px) | 500/600 | 1.4 | 突出正文 |
| `--text-xl` | 1.25rem (20px) | 600 | 1.3 | 小标题 |
| `--text-2xl` | 1.5rem (24px) | 600/700 | 1.2 | 标题 |
| `--text-3xl` | 1.875rem (30px) | 700 | 1.15 | 大标题 |
| `--text-4xl` | 2.25rem (36px) | 700 | 1.1 | 页标题 |
| `--text-5xl` | 3rem (48px) | 700 | 1.05 | 抽签数字(移动) |
| `--text-6xl` | 3.75rem (60px) | 700 | 1 | 抽签数字(桌面) |
| `--text-7xl` | 4.5rem (72px) | 700 | 1 | 抽签数字(大屏) |

### 3.3 原则

- 最大字号用于抽签数字，创造仪式感
- 等宽字体仅用于数字显示（抽签结果、计数）
- 衬线字体仅用于特殊装饰场景
- 所有文字在深色模式下 line-height 增加 0.05

---

## 4. Spacing System

### 4.1 4px Grid

```css
--space-05: 2px;   --space-1: 4px;    --space-1_5: 6px;
--space-2: 8px;    --space-2_5: 10px; --space-3: 12px;
--space-3_5: 14px; --space-4: 16px;   --space-5: 20px;
--space-6: 24px;   --space-8: 32px;   --space-10: 40px;
--space-12: 48px;  --space-16: 64px;  --space-20: 80px;
--space-24: 96px;
```

### 4.2 布局模式

| 模式 | 间距 | 说明 |
|------|------|------|
| 内聚 (tight) | 4-8px | 关联紧密的元素（图标+文字） |
| 舒适 (comfortable) | 12-16px | 列表项、表单行 |
| 呼吸 (breathing) | 24-32px | 区块间、section 间距 |
| 留白 (generous) | 48-96px | 主要区域间隔 |

---

## 5. Component Library

### 5.1 基础组件 (Primitives)

#### Button 按钮系统

```css
/* Primary — 主要操作 (抽取) */
.btn-primary {
  background: var(--accent); color: white;
  padding: var(--space-3_5) var(--space-6);
  border-radius: 9999px; font-size: var(--text-base); font-weight: 600;
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.25);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-primary:hover   { transform: translateY(-1px); box-shadow: 0 4px 16px ...; }
.btn-primary:active  { transform: translateY(0); }

/* Secondary — 次要操作 */
.btn-secondary {
  background: var(--bg-subtle); color: var(--fg);
  border: 1px solid var(--border-subtle);
  padding: var(--space-2_5) var(--space-5);
  border-radius: 9999px;
}

/* Ghost — 最小化按钮 */
.btn-ghost {
  background: transparent; color: var(--fg-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
}

/* Draw — 核心抽签按钮 (圆形) */
.btn-draw {
  width: 200px; height: 200px; border-radius: 50%;
  background: var(--accent); color: white;
  font-size: var(--text-2xl); font-weight: 700;
  box-shadow: 0 8px 32px rgba(79, 110, 247, 0.3);
  position: relative;
}
.btn-draw::before {
  content: ''; position: absolute; inset: -6px;
  border-radius: 50%; border: 2px solid var(--accent-subtle);
  animation: draw-pulse 2s ease-in-out infinite;
}
```

#### Input 输入

```css
.input {
  padding: var(--space-2_5) var(--space-3);
  background: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  transition: border-color 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
.input:hover  { border-color: var(--border); }
.input:focus  { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-subtle); }
.input::placeholder { color: var(--fg-quaternary); }
```

#### Toggle 开关

```css
.toggle {
  width: 40px; height: 22px;
  background: var(--bg-muted); border-radius: 9999px;
  cursor: pointer; transition: background 200ms;
}
.toggle.active { background: var(--accent); }
.toggle::after {
  content: ''; width: 18px; height: 18px; border-radius: 50%;
  background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: transform 200ms;
}
.toggle.active::after { transform: translateX(18px); }
```

#### Select 下拉

```css
.select {
  appearance: none;
  background: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
  padding: var(--space-1_5) var(--space-3);
  border-radius: var(--radius-sm);
  min-width: 100px;
  cursor: pointer;
}
```

#### Badge 标记

```css
.badge {
  display: inline-flex; align-items: center;
  padding: 2px var(--space-2_5);
  border-radius: 9999px;
  font-size: var(--text-xs); font-weight: 600;
}
.badge-accent  { background: var(--accent-subtle); color: var(--accent); }
.badge-success { background: var(--success-subtle); color: var(--success); }
.badge-danger  { background: var(--danger-subtle); color: var(--danger); }
.badge-neutral { background: var(--bg-muted); color: var(--fg-secondary); }
```

### 5.2 复合组件

#### Draw Display (抽签展示)

- **Welcome State**: 图标 + 标题 + 描述 + 抽签按钮
- **Drawing State**: 数字滚动动画 + 停止按钮
- **Result State**: 标签 + 结果数字 + 元信息 + 操作按钮
- **Error State**: 错误图标 + 错误信息 + 重试按钮
- **Empty State**: 空图标 + 提示文字

#### Settings Panel (设置面板)

- Tab 切换：抽取 / 外观 / 历史
- 抽取设置：个数、范围、重复、动画时长
- 名单模式：开关 + 文本输入
- 外观设置：主题色网格、字体选择、深浅色切换
- 历史记录：列表项 + 空状态 + 清空操作

#### Number Roller (数字滚动)

- 等宽字体 + 高速数字切换
- 老虎机风格滚动动画
- 停止时缓出效果

### 5.3 业务组件

- **History Card**: 抽取结果 + 时间戳 + 复制操作
- **Celebration Effect**: 粒子动画庆祝效果
- **Settings Panel**: 侧边栏式完整设置界面
- **Theme Swatches**: 10 色主题选择网格

---

## 6. Interaction Patterns

### 6.1 状态转换

```
Welcome ──[点击/空格]──→ Drawing ──[点击/空格]──→ Result
  ↑                                                    |
  └────────────────────[继续]──────────────────────────┘

Any State ──[Escape]──→ Welcome
```

### 6.2 交互标准

| 状态 | 触发 | 反馈 |
|------|------|------|
| Default | - | 静态显示 |
| Hover | 鼠标悬停 | 轻微上浮、透明度/颜色变化、cursor pointer |
| Focus | Tab 键导航 | 2px 焦点环 + offset 2px |
| Active | 鼠标按下 | 下沉效果 (scale: 0.97) |
| Disabled | 不可交互 | opacity: 0.4, cursor: not-allowed |
| Loading | 处理中 | 动画指示器（脉冲/旋转） |
| Error | 无效状态 | 红色边框 + 错误图标 + 错误信息 |
| Success | 操作完成 | 绿色提示 + 庆祝动效（粒子/光晕） |

### 6.3 键盘导航

| 按键 | 操作 |
|------|------|
| `Space` / `Enter` | 开始/停止抽取 |
| `Escape` | 返回欢迎状态 |
| `Tab` | 在控件间导航 |
| `↑/↓` | 数字输入增减 |

---

## 7. Motion Design

### 7.1 Timing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);    /* 苹果式缓出 */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);

--dur-50: 50ms;    /* 微交互反馈 */
--dur-100: 100ms;  /* 悬停过渡 */
--dur-150: 150ms;  /* 颜色/背景过渡 */
--dur-200: 200ms;  /* 标准过渡 */
--dur-300: 300ms;  /* 面板滑入 */
--dur-500: 500ms;  /* 结果揭示 */
--dur-700: 700ms;  /* 页面过渡 */
--dur-1000: 1000ms; /* 庆祝动效 */
```

### 7.2 动效模式

| 场景 | 动效 | 时长 | 缓动 |
|------|------|------|------|
| 页面入场 | fadeUp + translateY(16px) | 600ms | ease-out |
| 按钮悬停 | scale(1.04) + shadow 增强 | 200ms | ease-out |
| 按钮按下 | scale(0.97) | 100ms | ease-out |
| 抽取滚动 | 数字高速切换 | 80ms/帧 | steps(1) |
| 结果揭示 | scale(0.9→1) + fade | 700ms | ease-out |
| 侧边栏滑入 | translateX | 300ms | ease-out |
| 庆祝粒子 | 粒子从天而降 + 旋转 | 2.5s | ease-out |
| 开关切换 | knob 滑移 | 200ms | ease-out |
| Toast 出现 | fade + translateY(20px) | 400ms | ease-out |

---

## 8. Responsive Behavior

| Breakpoint | Layout | Sidebar | Draw Button | Number Size |
|------------|--------|---------|-------------|-------------|
| > 1024px (桌面) | 侧边栏 + 主区域 | 固定显示，320px | 200x200px | 72px |
| 640–1024px (平板) | 侧边栏 + 主区域 | 默认隐藏，滑出 | 160x160px | 48px |
| < 640px (手机) | 全屏 | 全屏覆盖 | 140x140px | 36px |

### 响应式原则

- 侧边栏在移动端默认隐藏，汉堡菜单触发
- 抽签按钮在移动端缩小但保持圆形
- 所有交互在移动端保持触控友好（最小 44px 触控区域）
- 字体使用 clamp() 实现流式缩放
- 容器查询 (container queries) 优先于媒体查询

---

## 9. Error & Edge Cases

### 9.1 错误处理矩阵

| 场景 | 用户看到 | 操作 |
|------|----------|------|
| 输入无效值 | 输入框红色边框 + 错误提示 | 重置为有效值 |
| 名单为空 | 错误状态视图 + 提示文字 | 引导添加名单 |
| 范围无效 (min > max) | 自动交换值或提示 | 阻止抽取 |
| localStorage 满 | 静默降级，不影响功能 | 下次重试 |
| 密码学随机数失败 | 回退 Math.random() + 警告 | 继续使用 |
| 动画帧率低 | 自动降低动画复杂度 | 流畅度优先 |

### 9.2 空状态

| 场景 | 展示内容 |
|------|----------|
| 无历史记录 | 文件图标 + "暂无记录" + "开始抽取后，结果将显示在这里" |
| 无自定义名单 | 文本提示 + "每行输入一个名字..." |
| 首次使用 | 欢迎状态 + 抽签按钮脉冲动画 |

---

## 10. Accessibility

- 所有交互元素支持键盘导航 (Tab/Enter/Space/Escape)
- 焦点环使用 `:focus-visible` 避免鼠标误触
- 颜色对比度 ≥ 4.5:1 (AA) 正文 / ≥ 3:1 (AA) 大文字
- 语义化 HTML 标签 (nav, main, aside, button)
- ARIA 标签: `aria-label`, `aria-expanded`, `aria-describedby`
- 动效尊重 `prefers-reduced-motion`
- 触控目标 ≥ 44x44px

---

## 11. Icon System

使用 Lucide Icons (lucide-react) 作为图标库。

| 场景 | 图标 | 尺寸 |
|------|------|------|
| 导航菜单 | Menu | 18px |
| 主题切换 | Moon/Sun | 18px |
| 抽签计时器 | Clock | 36px (欢迎页) |
| 历史记录 | History | 16px |
| 复制 | Copy | 14px |
| 清空 | Trash2 | 16px |
| 错误 | AlertCircle | 28px |
| 空状态 | FileText | 24px |
| 成功 | CheckCircle2 | 20px |
| 关闭 | X | 16px |

---

*此设计系统与原型文件 (prototype/interactive/) 保持完全对齐，作为前端开发的唯一设计参考。*
