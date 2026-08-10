# ZenDraw 设计系统规范（DESIGN-SYSTEM）

> 适用产品：ZenDraw｜禅抽 v5.7.4
> 定位：高保真可交互原型的设计令牌、组件库、交互与无障碍基准。
> 配套原型：`index.html`（主流程 + 主题演示）、`prototypes.html`（状态机图示）、`wireframes.html`（组件库规范）。
> 代码对应：`app/lib/version.ts` 的 `THEME_PRESETS`（由 `theme-provider.tsx` 消费）。

---

## 1. 令牌命名约定

三套 HTML 均使用统一前缀，避免漂移：

| 类别 | 变量前缀 | 示例 |
|------|----------|------|
| 颜色 | `--color-*` | `--color-bg`、`--color-fg`、`--color-primary` |
| 圆角 | `--radius-*` | `--radius-sm`(0.5rem) / `--radius-lg`(2rem) / `--radius-pill`(999px) |
| 间距 | `--space-*` | `--space-1`~`--space-8` |
| 阴影 | `--shadow-*` | `--shadow-card`、`--shadow-float` |
| 动效时长 | `--dur-*` | `--dur-fast`(200ms) / `--dur`(300ms) / `--dur-slow`(500ms) |
| 字号 | `--text-*` | `--text-xs`~`--text-5xl` |
| 字体 | `--font-*` | `--font-sans`、`--font-mono`、`--font-serif` |

> 注：设计令牌在三套 HTML 中各自内联一份（约 50 行/份），已抽取为共享 `tokens.css` 通过 `<link>` 引入，改令牌只需改一处。

---

## 2. 颜色令牌

### 2.1 深色（默认）

```css
--color-bg:        #0b0b0f;
--color-surface:   #14141b;
--color-fg:        #f5f5f7;
--color-muted:     #a1a1aa;
--color-border:    #2a2a33;
--color-primary:   #6366f1;   /* Indigo */
--color-primary-fg:#ffffff;
```

### 2.2 浅色

```css
--color-bg:        #ffffff;
--color-surface:   #f5f5f7;
--color-fg:        #18181b;
--color-muted:     #6b7280;
--color-border:    #e4e4e7;
--color-primary:   #4f46e5;
--color-primary-fg:#ffffff;
```

### 2.3 11 套主题预设（THEME_PRESETS）

`THEME_PRESETS` 共 11 套（代码侧 `theme-provider.tsx` 为唯一事实来源）：

- 中性 1：`default`（默认靛蓝）
- 彩色 7：`ocean`（海蓝）、`forest`（森林绿）、`sunset`（日落橙）、`purple`（紫罗兰）、`neon`（霓虹绿）、`sakura`（樱粉）、`rose`（玫瑰红）
- 暗调 1：`midnight`（午夜蓝）
- 复古 1：`retro`（怀旧暖色）
- 单色 1：`pixel`（终端绿 #33ff33，仅展示用，对比度未做 WCAG 实测）

> 主题切换通过 `next-themes` 实现：预设以 `theme-<preset>` 类挂在 `<html>` 上（`default` 不挂类，仅其余 10 套挂类），深/浅模式以 `.dark` 类挂在 `<html>` 上。原型 `tokens.css` 据此提供 `.theme-*` / `.dark` 两条覆盖链路，与原型导航栏「切换深浅色」按钮（切 `.dark`）及外观 Tab 预设色块（切 `theme-*`）一致。

---

## 3. 圆角 / 间距 / 阴影

```css
--radius-sm:   0.5rem;
--radius-lg:   2rem;
--radius-pill: 999px;

--space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
--space-4: 1rem;     --space-5: 1.5rem;  --space-6: 2rem;
--space-7: 3rem;     --space-8: 4rem;

--shadow-card: 0 1px 3px rgba(0,0,0,.12), 0 8px 24px rgba(0,0,0,.18);
--shadow-float:0 12px 40px rgba(0,0,0,.28);
```

---

## 4. 字体 / 排版

- 字体族：`--font-sans`（系统无衬线）、`--font-mono`（等宽）、`--font-serif`（衬线），通过 `theme.font` 切换。
- 字号阶梯（`--text-xs` … `--text-5xl`）：

| Token | px | 用途 |
|-------|----|------|
| xs | 12 | 辅助说明、页脚 |
| sm | 14 | 次要文本、标签 |
| base | 16 | 正文 |
| lg | 18 | 小节标题 |
| xl | 20 | 卡片标题 |
| 2xl | 24 | 区块标题 |
| 3xl | 30 | 页面标题 |
| 4xl | 36 | 大号数字 |
| 5xl | 48 | 结果数字（HTML 中以 `--text-5xl: 3rem` 落地） |

> 原型 Hero 区结果数字使用 `clamp(2.5rem, 8vw, 4rem)` 实现流体缩放，未引用静态令牌（属设计意图，非令牌缺失）。
> 文档原「6xl/7xl」阶梯在原型中已删除，特此更正——实际最大阶梯为 5xl。
> 深色模式下 `line-height` 不额外 +0.05，原型未实现该差异（已移除不实承诺）。

---

## 5. 动效时长（Motion Tokens）

| Token | 时长 | 用途 |
|-------|------|------|
| `--dur-fast` | 200ms | hover、微交互 |
| `--dur` | 300ms | 通用过渡、Toast、彩屑 |
| `--dur-slow` | 500ms | 抽屉滑入、卡片缩放 |

缓动曲线统一：`cubic-bezier(0.25, 0.1, 0.25, 1)`（Apple 标准）。

> 原型已落地的动效：
> - **结果揭晓彩屑**：`prototypes.html` 结果屏停止时触发 canvas 彩屑（130+ 粒子，`prefers-reduced-motion` 下不渲染）。
> - **Toast**：300ms 淡入淡出（`--dur`）。
> - **抽屉**：`--dur-slow` 右侧滑入。
>
> 原型**未**实现以下动画（文档不再承诺，待代码侧落地后补充）：整页入场 `fadeUp`、结果揭示 `scale 0.9→1` 专用动画。

---

## 6. 状态机（主流程）

产品核心流程为 **4 态**，三套原型须表达一致：

```
① 欢迎 (welcome)  →  ② 抽取中 (drawing)  →  ③ 结果 (result)
                                                    │
                                                    └─────── ④ 历史沉淀 (history)
```

| 态 | 触发 | 说明 |
|----|------|------|
| ① 欢迎 | 初始 / 「再来一次」结束 | 大标题 + 抽取按钮 |
| ② 抽取中 | 点击抽取 | 数字滚动动画（slot-machine） |
| ③ 结果 | 停止滚动 | 揭晓数字 + 彩屑 + 「已揭晓：N」Toast |
| ④ 历史 | 「查看历史」 | `index.html` 用右侧抽屉；`prototypes.html` 切换至历史整屏；均展示本会话抽签记录 |

> `index.html` 主流程含全部 4 态（含历史抽屉）；`prototypes.html` 以图示 + 真实联动演示同一状态机，两者均含「历史沉淀」态、共享单一状态源（顶部「下一步」与屏幕按钮不再各自为政），无竞态、无分歧。

---

## 7. 交互标准

### 7.1 键盘可达性（强制）

| 控件 | 键盘支持 | 状态 |
|------|----------|------|
| 抽取按钮 / 主操作 | Space / Enter 触发，Esc 取消滚动 | ✅ index / prototypes 均已实现 |
| 数值微调（数量） | ↑ / ↓ 增减 | ✅ prototypes 的 countInput 已实现 |
| Switch / Checkbox | Enter / Space 切换 | ✅ index 的 Switch、wireframes 的 Switch/Checkbox 已实现 |
| Select | 点击展开 / 点选收起（listbox 模式） | ✅ wireframes 已实现（`aria-expanded` + 点外部关闭）；↑/↓ 键盘移动待补 |
| Slider | 原生 ←/→ 调整，已带 `aria-valuenow` | ✅ wireframes 已实现 |

### 7.2 语义结构

内容区用 `<main aria-label="...">` 包裹；导航用 `<nav aria-label="...">`；历史用 `<aside>`（index）或整屏 section（prototypes）。三套原型均已补 `<main>` 分区。

---

## 8. 无障碍（WCAG AA）

- 对比度：正文 fg/bg ≥ 4.5:1（Pixel 主题未做实测，仅展示）。
- 焦点可见：自定义控件 `tabindex=0` 须有 `:focus-visible` 轮廓。
- 动效尊重：所有装饰动画在 `prefers-reduced-motion: reduce` 下停用。

---

## 9. 图标系统

原型使用内联 SVG（尺寸随上下文）。代码侧绑定 `lucide-react`，常用映射：

| 语义 | lucide 图标 | 原型近似尺寸 |
|------|-------------|--------------|
| 时钟/时长 | `Clock` | 24–36 |
| 历史 | `History` | 16–20 |
| 复制 | `Copy` | 16 |
| 主题 | `Palette` | 18 |

---

## 10. 响应式

- 断点：移动 <640 / 平板 640–1024 / 桌面 >1024。
- `wireframes.html` 提供真机视图切换（375 / 768 / 1280），其余原型以窄容器模拟。
- 主操作按钮移动端全宽，桌面端自适应。

---

## 11. 错误 / 空状态

- 空历史：浮动骰子插画 + 俏皮文案（`index.html` 历史抽屉空态、`prototypes.html` 历史整屏空态）。
- 输入越界：`prototypes.html` 的「数量」输入用 `Math.max(1, Math.min(10, v))` 自动 clamp 兜底，无错误态路由（原型未实现 `aria-invalid`，待代码侧落地后补充）。

---

## 12. 设置容器 Settings Container

应用全局设置入口为**右侧滑入抽屉**，由顶部导航齿轮按钮触发。结构固定，原型（`wireframes.html` 设置容器区块）与代码（`settings-panel/index.tsx`）必须一致。

### 12.1 结构

```
Sheet (side="right", aria-modal="true", role="dialog")
├── HeaderBar
│   ├── 应用标识（「抽」徽标 + 标题 ZenDraw｜禅抽）
│   ├── 版本号（mono 小字，读 APP_VERSION）
│   └── 语言切换按钮（右上，lucide Languages）
└── Tabs
    ├── 抽取 (draw)      ：范围 / 数量 / 时长 / 允许重复 / 自定义名单 / 自动隐藏
    ├── 外观 (appearance)：主题预设 / 字体 / 语言 / 数字格式 / 实时预览
    ├── 体验 (experience)：音效 / 彩屑 / 减弱动效 / 自动收起面板 / 结果显示密度 / 重置所有选项
    └── 历史 (history)   ：本会话记录列表 + 清空入口
```

> 自定义名单编辑为独立 Dialog（非嵌套 Sheet），避免与原 Sheet 的 open 状态冲突。
> 「自动隐藏」原在抽取 Tab，逻辑上归属体验（面板收起行为），代码侧已并入 `experience` 的 `autoHide`；抽取 Tab 仅保留范围/数量/时长/允许重复/自定义名单。

### 12.2 尺寸与动效

| 维度 | 规范 | 令牌/值 |
|------|------|---------|
| 位置 | 右侧滑入 | `side="right"` |
| 宽度 | 移动端全宽；≥640px 固定 | `w-full sm:w-[26rem]` |
| 滑入时长 | 300ms 缓动 | `--dur-slow` (500ms 代码侧用 0.3s，原型统一 300ms) |
| 遮罩 | 半透明 + 背景模糊 | `bg-black/50 backdrop-blur-sm` |
| 关闭 | Esc / 遮罩点击（无独立关闭按钮） | 代码侧 `SheetContent` 已绑 Esc |

### 12.3 无障碍

- `role="dialog"` + `aria-modal="true"`；遮罩 `aria-hidden="true"`。
- Esc 键关闭（代码侧 `SheetContent` useEffect 已绑定；原型 `wireframes` 已演示）。
- Tabs 用标准 tab 语义；自定义控件（Switch/Select/Slider）键盘可达见 §7.1。
- 聚焦管理：打开时焦点进入抽屉，关闭后回落触发按钮（代码侧 next-themes/base-ui 处理；原型以 Tab 切换演示）。

### 12.4 与代码对齐核对

| 规范项 | 代码侧事实 | 结论 |
|--------|------------|------|
| 右侧 Sheet + 4 Tabs(draw/appearance/experience/history) | `settings-panel/index.tsx` 一致 | ✅ |
| HeaderBar（标识+版本+语言） | `header-bar.tsx` 读 `APP_VERSION`、右上语言键 | ✅ |
| Esc / 遮罩关闭 | `sheet/index.tsx` Esc 绑定 + 遮罩 onClick | ✅ |
| 宽度 26rem | `className="w-full sm:w-[26rem]"` | ✅ |
| 自定义名单独立 Dialog | `custom-list-settings.tsx` base-ui Dialog | ✅ |
| experience 体验开关 | `experience-settings.tsx`：soundEnabled/confettiEnabled/reduceMotion/autoHide/density/重置 | ✅ |

---

## 13. 与代码仓库的对应核对

| 文档声明 | 代码侧事实 | 结论 |
|----------|------------|------|
| 11 套主题（default/ocean/forest/sunset/purple/neon/sakura/midnight/retro/pixel/rose） | `THEME_PRESETS` 在 `theme-provider.tsx` 确有 11 套 | ✅ 一致 |
| 主题机制 `.theme-<preset>` 类 + `.dark` 类 | `theme-provider.tsx` 写 `theme-*` 类、`next-themes` 写 `.dark` | ✅ 一致 |
| 翻译键 90 | `app/locales` zh/en 各 90 键 | ✅ 一致 |
| 主流程 4 态 | `use-draw.ts` 状态机含 history | ✅ 一致 |
| 设置 4 Tab（含 experience） | `settings-panel/index.tsx` Tabs 含 experience | ✅ 一致 |
| 彩屑揭晓触发 | `ConfettiBurst` 在结果落定时渲染 | ✅ 一致 |

---

## 变更记录

### v5.7.4 - 2026-08-10
- **原型对齐代码真值**：版本号统一至 v5.7.4（代码 `APP_VERSION` 为事实来源）。
- **设置容器改 4 Tab**：新增「体验 (experience)」Tab（音效/彩屑/减弱动效/自动收起/密度/重置），`自动隐藏` 由抽取 Tab 并入体验。
- **主题机制修正**：由 `data-theme` + `data-mode` 改为 `theme-<preset>` 类 + `.dark` 类（对齐 `next-themes` / `theme-provider.tsx`）。
- **主题清单修正**：11 套真实预设为 default/ocean/forest/sunset/purple/neon/sakura/midnight/retro/pixel/rose（移除不存在的 Graphite/Mono）。

### v5.3.7 - 2026-08-09
- **文档对齐实现**：删除 design-system.md 中未落地的承诺（整页入场 fadeUp、结果揭示 scale 动画、深色 line-height +0.05、6xl/7xl 字号阶梯、↑/↓ 全量键盘）。
- **合并重复变更记录**：原 v5.3.6 两条重复条目合并为一条。
- **状态机统一**：明确主流程 4 态（含历史沉淀），要求 index/prototypes 双原型一致。
- **a11y 标注**：补全 Switch/Checkbox/Select/Slider 键盘可达性与 `<main>` 语义的真实状态（⚠️ 待原型补完）。
- **令牌共享**：抽取 `tokens.css` 减少三套 HTML 令牌重复。
- 同步版本号至 v5.3.7。

### v5.3.6 - 2026-08-09
统一全项目版本至 v5.3.6；修正 SPEC.md 主题预设数 10→11（含 Rose）、翻译键 71→90、原型目录结构对齐实际 `prototype/` 四文件。

### v5.3.3 - 2026-08-09
原型精简与 design-system 升级（三级组件库、交互标准、动效时序、响应式与无障碍）。
