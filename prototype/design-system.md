# ZenDraw Design System v5.3.2

> **极简 · 精准 · 禅意** — 国际顶尖设计师水准的随机抽签应用

**设计灵感**: Apple Design · Linear · Vercel · Stripe
**技术基座**: Next.js · Tailwind CSS · Motion · shadcn/ui (base-nova, built on `@base-ui/react`)

**变更记录**: v5.3.2 — 原型体系拆分为三个互补 HTML + 本规范文档；组件库补全 toast / tooltip / checkbox；明确三级分类（基础 / 复合 / 业务）；统一交互标准与动效时序。

### 原型文件体系（prototype/）
| 文件 | 定位 | 内容 |
|------|------|------|
| `index.html` | 总入口 | 设计令牌 + 组件预览 + 主流程 + 11 主题 + 交互标准速览，导航至其余两文件 |
| `prototypes.html` | 高保真视觉设计稿 | 完整界面视觉稿（空闲/抽取/结果/历史 4 屏）+ 可交互动效（数字滚动/庆祝彩屑）+ 真实数据 + 状态机 + 11 主题实时切换 |
| `wireframes.html` | 组件库规范 | 基础组件 / 复合组件 / 业务组件 可视化规范 + 组件使用规则（Do/Don't） |
| `DESIGN-SYSTEM.md` | 设计规范文档 | 底层令牌、三级组件库、交互标准、动效时序、响应式、无障碍（本文件） |

四者共享同一套设计令牌，保证原型与代码最小颗粒度对齐。

---

## 1. Design Philosophy

**ZenDraw 的设计信条：抽签本身即是仪式。**

- **减法美学**：每个像素都有存在的理由。没有装饰性的装饰，只有功能的优雅表达。
- **聚焦核心**：抽签是中心行为 — 界面围绕它设计，而非分散注意力。
- **克制即力量**：色彩、动效、字体都服务于一个目标 — 让抽签过程充满仪式感。
- **跨端一致**：从桌面到移动端，体验保持连续与精致。

---

## 2. Color System

### 2.1 Design Tokens (Light)

```css
--bg: #fafbfc;               /* 背景 */
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
--ring: #1a1d23;             /* 焦点环 */

--accent: #4f6ef7;           /* 品牌强调色 — 冷静靛蓝 (Default) */
--accent-fg: #ffffff;
--accent-hover: #3b5ae0;
--accent-subtle: rgba(79,110,247,0.10);
--accent-soft: rgba(79,110,247,0.06);

--success: #22a06b;  --success-subtle: rgba(34,160,107,0.10);
--warning: #e8a313;  --warning-subtle: rgba(232,163,19,0.10);
--danger:  #c9374b;  --danger-subtle:  rgba(201,55,75,0.10);
--info:    #4f6ef7;  --info-subtle:    rgba(79,110,247,0.10);
```

### 2.2 Dark Theme

```css
[data-theme="dark"] {
  --bg:#0c0d0f; --bg-subtle:#141519; --bg-elevated:#1a1c22; --bg-muted:#23252b;
  --fg:#e8eaed; --fg-secondary:#9ca0ab; --fg-tertiary:#6b7080; --fg-quaternary:#464b58;
  --border:#2e3038; --border-subtle:#23252b; --border-strong:#3e414b; --ring:#e8eaed;
  --accent:#6b87ff; --accent-hover:#85a0ff;
  --accent-subtle:rgba(107,135,255,0.12); --accent-soft:rgba(107,135,255,0.06);
  --success:#2ec483; --warning:#f5b820; --danger:#e05a6d;
}
```

### 2.3 11 套配色主题（仅 accent 变化）

| # | 名称 | 主色 | # | 名称 | 主色 |
|---|------|------|---|------|------|
| 1 | Default | `#4f6ef7` | 7 | Sakura | `#ff8fab` |
| 2 | Ocean | `#00b4d8` | 8 | Midnight | `#6b6bd6` |
| 3 | Forest | `#2d8a4e` | 9 | Retro | `#a67c52` |
| 4 | Sunset | `#e07c3c` | 10 | Pixel | `#33ff33` |
| 5 | Purple | `#7b2d8e` | 11 | Rose | `#c93d5f` |
| 6 | Neon | `#ff2d55` | | | |

规则：所有主题仅改变 accent 色相与对应 subtle/soft，中性色系与对比度恒定。

---

## 3. Typography

- `--font-sans`: Inter / Noto Sans SC
- `--font-mono`: JetBrains Mono（仅用于数字显示）
- `--font-serif`: Playfair Display（特殊装饰场景）

**Type Scale (1.25)**: xs 12 / sm 14 / base 16 / lg 18 / xl 20 / 2xl 24 / 3xl 30 / 4xl 36 / 5xl 48 / 6xl 60 / 7xl 72。
最大字号仅用于抽签数字，创造仪式感；等宽字体仅用于数字结果；深色模式 line-height +0.05。

---

## 4. Spacing & Geometry

**4px Grid**: 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96。
**Radius**: xs 4 / sm 6 / md 8 / lg 12 / xl 16 / 2xl 24 / full 9999。

---

## 5. Component Library

### 5.1 基础组件 / Primitives (shadcn base-nova)

| 组件 | 变体 | 用途 |
|------|------|------|
| `Button` | primary / secondary / ghost / icon / draw(圆形) | 所有操作入口 |
| `Input` | default / error | 数值与文本输入 |
| `Textarea` | — | 自定义名单多行输入 |
| `Switch` | default / active | 布尔开关（允许重复/自动隐藏） |
| `Checkbox` | default / active | 多选语义（与 Switch 区分使用） |
| `Select` | — | 字体 / 主题下拉 |
| `Slider` | — | 动画时长、抽取个数 |
| `Badge` | accent / success / danger / neutral | 状态标记 |
| `Card` | — | 信息容器 |
| `Dialog` | — | 确认导入 |
| `Sheet` | side=left/right | 移动端设置抽屉 |
| `Separator` | — | 分隔线 |
| `Label` | — | 表单标签 |
| `Tabs` | — | 设置面板分段（抽取/外观/历史） |
| `Alert` | danger / success / info | 内联错误与提示 |
| `Tooltip` | — | 图标按钮悬浮说明（复制/清空/语言） |
| `Toast` | — | 轻量全局反馈（复制成功/清空完成） |

### 5.2 复合组件 / Composite

| 组件 | 状态 | 说明 |
|------|------|------|
| `DrawDisplay` | welcome / drawing / result / error | 抽签主舞台 |
| `SettingsPanel` | tabs 切换 | 抽取 / 外观 / 历史 三区 |
| `NumberRoller` | rolling / settled | 等宽数字老虎机滚动 |
| `ThemeSwatches` | 10 色网格 | 主题选择 |

### 5.3 业务组件 / Business

| 组件 | 说明 |
|------|------|
| `HistoryCard` | 结果 + 时间戳 + 复制 |
| `HistoryList` + `EmptyState` | 历史列表与空状态 |
| `CelebrationEffect` | 粒子/光晕庆祝动效 |
| `DrawButton` | 核心圆形抽签按钮（脉冲动画） |
| `AppHeader` | 品牌 + 语言 + 主题 + 菜单入口 |

---

## 6. Interaction Standards

### 6.1 状态反馈矩阵

| 状态 | 触发 | 反馈 |
|------|------|------|
| Default | — | 静态显示 |
| Hover | 指针悬停 | 轻微上浮 + 颜色/透明度变化 + pointer |
| Focus | 键盘 | 2px 焦点环 + offset 2px (`:focus-visible`) |
| Active | 按下 | scale(0.97) |
| Disabled | 不可交互 | opacity .4 + cursor not-allowed |
| Error | 无效输入 | 红框 + 图标 + 文案（内联 Alert） |
| Success | 完成 | 绿提示 + 庆祝动效（Toast + 粒子） |

### 6.2 键盘导航

| 按键 | 操作 |
|------|------|
| `Space` / `Enter` | 开始 / 停止抽取 |
| `Esc` | 返回欢迎态 |
| `Tab` | 控件导航 |
| `↑ / ↓` | 数值增减 |

### 6.3 主流程状态机

```
Welcome ──[Space/点击]──▶ Drawing ──[Space/点击]──▶ Result
  ▲                                                   │
  └──────────────[继续/完成]──────────────────────────┘
Any ──[Esc]──▶ Welcome
```

---

## 7. Motion Design

```
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* 苹果式缓出 */
--dur-100/150/200/300/500/700/1000
```

| 场景 | 动效 | 时长 | 缓动 |
|------|------|------|------|
| 页面入场 | fadeUp + translateY(16px) | 600ms | ease-out |
| 按钮悬停 | scale(1.04) + 阴影增强 | 200ms | ease-out |
| 按钮按下 | scale(0.97) | 100ms | ease-out |
| 抽取滚动 | 数字高速切换 | 80ms/帧 | steps(1) |
| 结果揭示 | scale(0.9→1) + fade | 700ms | ease-out |
| 侧边栏滑入 | translateX | 300ms | ease-out |
| 庆祝粒子 | 粒子下落 + 旋转 | 2.5s | ease-out |
| Toast | fade + translateY(20px) | 400ms | ease-out |

所有动效尊重 `prefers-reduced-motion`。

---

## 11 套配色主题

> 注：当前版本含 11 套主题（含 Rose 玫瑰红），原型 `index.html` 与 `theme-provider.tsx` 的 `THEME_PRESETS` 已对齐。

## 8. Responsive Behavior

| Breakpoint | Layout | Sidebar | Draw Button | Number |
|------------|--------|---------|-------------|--------|
| >1024px | 侧栏 + 主区 | 固定 320px | 200×200 | 72px |
| 640–1024px | 侧栏 + 主区 | 滑出 | 160×160 | 48px |
| <640px | 全屏 | 覆盖抽屉 | 140×140 | 36px |

原则：移动端侧栏默认隐藏（Sheet 抽屉）；触控目标 ≥ 44px；字号 `clamp()` 流式缩放。

---

## 9. Error & Empty States

| 场景 | 展示 |
|------|------|
| 输入无效 | 输入框红框 + 内联 Alert 文案 |
| 名单为空 | 错误视图 + 引导添加 |
| 范围无效 (min>max) | 阻止抽取 + 提示 |
| 无历史记录 | 文件图标 + "暂无记录" + 引导文案 |
| 首次使用 | 欢迎态 + 抽签按钮脉冲 |

---

## 10. Accessibility

- 全键盘可达 (Tab/Enter/Space/Esc)，焦点环 `:focus-visible`
- 对比度 ≥ 4.5:1 (AA) 正文 / ≥ 3:1 大文字
- 语义标签 (nav/main/aside/button) + ARIA (label/expanded/describedby)
- `prefers-reduced-motion` 降级；触控目标 ≥ 44×44px

---

## 11. Icon System (lucide-react)

Menu 18 / Moon·Sun 18 / Clock 36 / History 16 / Copy 14 / Trash2 16 / AlertCircle 28 / FileText 24 / CheckCircle2 20 / X 16。

---

**版本**: v5.3.0  **理念**: 极简 · 精准 · 禅意
