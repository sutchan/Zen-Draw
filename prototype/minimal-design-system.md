# ZenDraw Minimal Design System v5.0

> **极简 · 精准 · 禅意** — 国际顶尖设计师水准的随机抽签应用

---

## 设计理念

### 核心原则

1. **减法美学（Subtractive Design）**
   - 每个像素都有存在的理由
   - 没有装饰性的装饰，只有功能的优雅表达
   - 留白是最好的装饰

2. **聚焦核心（Focus on Core）**
   - 抽签是中心行为 — 界面围绕它设计
   - 消除所有干扰元素
   - 让用户注意力始终在抽签上

3. **克制即力量（Restraint is Power）**
   - 色彩、动效、字体都服务于一个目标
   - 让抽签过程充满仪式感
   - 少即是多

4. **跨端一致（Cross-Device Consistency）**
   - 从桌面到移动端，体验保持连续与精致
   - 响应式设计不仅仅是适配，而是优化

---

## 色彩系统

### 设计令牌（Design Tokens）

```css
/* 中性色 — cool-tinted, 非纯灰 */
--color-bg: #fafbfc;               /* 背景 */
--color-bg-subtle: #f4f5f7;        /* 次级背景 */
--color-bg-elevated: #ffffff;      /* 卡片/弹窗 */
--color-text: #1a1d23;             /* 主要文字 */
--color-text-secondary: #5a5f6b;   /* 次要文字 */
--color-text-tertiary: #8e939f;    /* 辅助文字 */
--color-border: #e2e5ea;           /* 边框 */
--color-border-subtle: #eef0f4;    /* 弱边框 */

/* 品牌色 — Zen Indigo */
--color-primary: #4f6ef7;          /* 品牌色 */
--color-primary-hover: #3b5ae0;    /* 悬停 */
--color-primary-subtle: rgba(79, 110, 247, 0.08);

/* 深色模式 */
[data-theme="dark"] {
  --color-bg: #0c0d0f;
  --color-bg-subtle: #141519;
  --color-bg-elevated: #1a1c22;
  --color-text: #e8eaed;
  --color-text-secondary: #9ca0ab;
  --color-border: #2e3038;
}
```

### 色彩使用规则

- **主色（Primary）**：仅用于核心操作（抽签按钮、重要按钮）
- **中性色（Neutral）**：用于背景、边框、次要文字
- **语义色（Semantic）**：成功（绿）、警告（橙）、错误（红）— 仅在必要时使用

---

## 排版系统

### 字体栈

```css
--font-sans: 'Inter', 'Noto Sans SC', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

### 字体尺度（Type Scale）

| Token | Size | Weight | Line Height | 用途 |
|-------|------|--------|-------------|------|
| `--text-xs` | 0.75rem | 400 | 1.33 | 辅助文字 |
| `--text-sm` | 0.875rem | 500 | 1.4 | 标签、设置项 |
| `--text-base` | 1rem | 400 | 1.5 | 正文 |
| `--text-lg` | 1.125rem | 600 | 1.4 | 突出正文 |
| `--text-xl` | 1.25rem | 600 | 1.3 | 小标题 |
| `--text-2xl` | 1.5rem | 700 | 1.2 | 标题 |
| `--text-3xl` | 1.875rem | 700 | 1.15 | 大标题 |
| `--text-4xl` | 2.25rem | 700 | 1.1 | 页标题 |
| `--text-5xl` | 3rem | 700 | 1.05 | 抽签数字（移动端） |
| `--text-6xl` | 3.75rem | 700 | 1 | 抽签数字（桌面端） |

### 排版原则

1. **层次清晰**：使用字重和大小创建清晰的视觉层次
2. **行高优化**：正文 1.5，标题 1.2，确保可读性
3. **响应式字体**：使用 `clamp()` 实现流式缩放

```css
/* 响应式字体示例 */
.heading-1 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  line-height: 1.2;
}
```

---

## 间距系统

### 4px 网格

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### 布局间距模式

| 模式 | 间距 | 说明 |
|------|------|------|
| 紧密（tight） | 4-8px | 关联紧密的元素 |
| 舒适（comfortable） | 12-16px | 列表项、表单行 |
| 呼吸（breathing） | 24-32px | 区块间、section 间距 |
| 留白（generous） | 48-96px | 主要区域间隔 |

---

## 组件设计

### 按钮（Button）

#### 主按钮（Primary Button）

```css
.btn-primary {
  /* 外观 */
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 9999px;  /* 完全圆形 */
  
  /* 尺寸 */
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: 600;
  
  /* 阴影 */
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.25);
  
  /* 过渡 */
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(79, 110, 247, 0.35);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### 抽签按钮（Draw Button）

```css
.btn-draw {
  /* 圆形按钮 */
  width: 200px;
  height: 200px;
  border-radius: 50%;
  
  /* 背景渐变 */
  background: radial-gradient(circle, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  
  /* 阴影 */
  box-shadow: 0 8px 32px rgba(79, 110, 247, 0.3);
  
  /* 脉冲动画 */
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### 输入框（Input）

```css
.input {
  /* 外观 */
  padding: 10px 16px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border-subtle);
  border-radius: 8px;
  
  /* 过渡 */
  transition: border-color 150ms, box-shadow 150ms;
}

.input:hover {
  border-color: var(--color-border);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-subtle);
  outline: none;
}
```

### 卡片（Card）

```css
.card {
  /* 外观 */
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: 12px;
  
  /* 阴影 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  
  /* 内边距 */
  padding: 24px;
}
```

---

## 动效设计

### 缓动函数

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);  /* 苹果式缓出 */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### 动画时长

| 场景 | 时长 | 缓动 |
|------|------|------|
| 微交互（悬停） | 150ms | ease-out |
| 标准过渡 | 200ms | ease-out |
| 面板滑入 | 300ms | ease-out |
| 结果揭示 | 500ms | ease-out |
| 页面过渡 | 700ms | ease-out |

### 动画模式

#### 页面入场

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: fadeInUp 600ms var(--ease-out);
}
```

#### 按钮悬停

```css
.btn-primary {
  transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(79, 110, 247, 0.35);
}
```

#### 数字滚动

```css
@keyframes numberRoll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
}

.number-rolling {
  animation: numberRoll 80ms steps(1) infinite;
}
```

---

## 响应式设计

### 断点系统

```css
/* 移动端 */
@media (max-width: 640px) {
  /* 抽签按钮缩小 */
  .btn-draw {
    width: 140px;
    height: 140px;
  }
  
  /* 字体缩小 */
  .text-6xl {
    font-size: 2.25rem;
  }
  
  /* 间距缩小 */
  .card {
    padding: 16px;
  }
}

/* 平板 */
@media (min-width: 641px) and (max-width: 1024px) {
  .btn-draw {
    width: 160px;
    height: 160px;
  }
}

/* 桌面 */
@media (min-width: 1025px) {
  .btn-draw {
    width: 200px;
    height: 200px;
  }
}
```

### 响应式原则

1. **移动优先（Mobile First）**：先设计移动端，再渐进增强
2. **触控友好（Touch Friendly）**：最小触控目标 44x44px
3. **流式布局（Fluid Layout）**：使用 `clamp()` 实现流式缩放
4. **灵活图片（Flexible Images）**：`max-width: 100%`

---

## 无障碍设计

### 键盘导航

- 所有交互元素支持 Tab 键导航
- 使用 `:focus-visible` 显示焦点样式
- 焦点环：2px solid，offset 2px

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 屏幕阅读器

- 使用语义化 HTML（`nav`, `main`, `aside`, `button`）
- 添加 ARIA 标签（`aria-label`, `aria-expanded`）
- 隐藏装饰性图标（`aria-hidden="true"`）

### 颜色对比度

- 正文文字对比度 ≥ 4.5:1（WCAG AA）
- 大文字对比度 ≥ 3:1（WCAG AA）

---

## 性能优化

### 图片优化

- 使用 WebP 格式，提供 Fallback
- 懒加载非关键图片（`loading="lazy"`）
- 使用 SVG 图标（可缩放，体积小）

### 动画性能

- 优先使用 `transform` 和 `opacity`（GPU 加速）
- 避免动画中的布局抖动
- 尊重 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 设计检查清单

### 视觉设计

- [ ] 留白充足，层次清晰
- [ ] 色彩使用克制，主色不超过 2 种
- [ ] 字体层次清晰，可读性良好
- [ ] 图标风格统一（使用 Lucide Icons）

### 交互设计

- [ ] 所有交互元素有悬停状态
- [ ] 按钮有按下的反馈
- [ ] 动画流畅，不超过 700ms
- [ ] 加载状态有明确反馈

### 响应式设计

- [ ] 移动端布局完整
- [ ] 触控目标 ≥ 44x44px
- [ ] 字体在移动端可读
- [ ] 横屏布局正常

### 无障碍设计

- [ ] 支持键盘导航
- [ ] 颜色对比度符合 WCAG AA
- [ ] 语义化 HTML
- [ ] ARIA 标签完整

---

## 设计灵感来源

- **Apple Design**: 极简、精致、流畅
- **Linear**: 现代、高效、优雅
- **Vercel**: 简洁、专业、高端
- **Stripe**: 清晰、可信、精致

---

*此设计系统作为前端开发的唯一设计参考，确保代码与原型完全对齐。*

**版本**: v5.0  
**更新日期**: 2026-06-30  
**设计理念**: 极简 · 精准 · 禅意
