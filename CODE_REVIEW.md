# 项目代码审查报告 — ZenDraw v3.0

> 审查范围：`/workspace/app/`、`/workspace/components/`、`/workspace/hooks/`、`/workspace/lib/`、`/workspace/locales/`、`/workspace/next.config.ts`
> 审查日期：2026-06-18

---

## 1. 执行摘要

本项目是一个纯前端的随机抽取应用，所有状态存储在 `localStorage` 中。**整体代码质量良好**，核心逻辑完整、样式系统现代化（Tailwind v4 + shadcn + CVA）。但是存在以下值得关注的问题：

| 严重性 | 数量 | 主要问题 |
|--------|------|----------|
| 🔴 高 | 2 | 不安全的 `Math.random()`、`ignoreDuringBuilds` 屏蔽 lint |
| 🟡 中 | 4 | XSS 风险（自定义名单）、缺少 `noindex`、Dialog 无障碍缺陷、URL 内存泄漏 |
| 🟢 低 | 8 | 巨型组件未拆分、Hook 命名、`key` 问题、`ref` 类型、`useEffect` 依赖项、事件绑定重复等 |

> **说明**：本应用为客户端工具，无用户身份、无后端鉴权、无网络请求，因此无认证/授权/CSRF/SQL 注入类问题。

---

## 2. 安全最佳实践审查

### 🔴 S-1 `Math.random()` 不具备密码学安全性（伪随机数生成器风险）

**文件**：[app/page.tsx](file:///workspace/app/page.tsx#L129-L164)

**问题**：在 `performFinalDraw` 中使用 `Math.random()` 作为随机源：

```tsx
const randomIndex = Math.floor(Math.random() * available.length);
// 以及 line 213: Math.floor(Math.random() * range) + min
```

`Math.random()` 返回的是**弱伪随机数**，对以下场景不满足要求：
- 如果应用被用作抽奖、赌局、密码类工具，可能被预测/操纵
- 不符合 "生成不可预测随机数" 的通用安全要求

**建议**：替换为 `crypto.getRandomValues()`（Web Cryptography API）：

```tsx
function secureRandomInt(maxExclusive: number): number {
  if (typeof crypto === "undefined" || !crypto.getRandomValues) {
    return Math.floor(Math.random() * maxExclusive);
  }
  // 使用拒绝采样避免模偏差
  const maxUint32 = 0xffffffff;
  const limit = Math.floor((maxUint32 + 1) / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % maxExclusive;
}
```

**收益**：消除随机数可预测性风险，符合 OWASP 安全编码规范。

---

### 🔴 S-2 `eslint.ignoreDuringBuilds = true` 屏蔽构建期静态分析

**文件**：[next.config.ts](file:///workspace/next.config.ts#L4-L7)

```ts
eslint: {
  ignoreDuringBuilds: true,
},
```

**问题**：禁用 Next.js 在 `next build` 阶段执行 ESLint，等于放弃了 CI/CD 流水线中对以下问题的自动捕获：
- 不安全的 `dangerouslySetInnerHTML`、`eval`
- 未转义的用户输入（`no-unsanitized`）
- `a11y` 规则（键盘可达性、ARIA）
- `react-hooks/exhaustive-deps`

**建议**：改为 `false`（默认），并提供一份合理的 `.eslintrc.json`。若确实需临时跳过，也应在 commit 前本地跑 `npm run lint`。

---

### 🟡 S-3 自定义名单（Custom List）缺少内容长度/字符校验 → XSS 风险

**文件**：[app/page.tsx](file:///workspace/app/page.tsx#L229-L237) 以及 `History` 渲染处 [page.tsx](file:///workspace/app/page.tsx#L505-L516)

```tsx
const handleImportSubmit = React.useCallback(() => {
  const items = importText.split('\n').filter(i => i.trim() !== '');
  if (items.length > 0) {
    setCustomList(items);  // 直接存储用户输入，未校验/截断
    setUseCustomList(true);
  }
}, ...);
```

**风险点**：
1. 用户可粘贴任意长度字符串 → `localStorage` 容量（约 5MB）超限会抛 `QuotaExceededError`
2. 虽然当前渲染只使用 `{result}`（React 会自动转义文本节点），但一旦未来改用 `dangerouslySetInnerHTML`、`<title>`、`href` 等，即存在存储型 XSS
3. 历史记录同样以原始字符串入 `localStorage`，重启后会回显

**建议**：
- 增加单项长度限制（如 200 字符）、总条数限制（如 1000）
- 过滤或 reject 控制字符（`\x00-\x1f`、`\u202e` RLO 等）
- 对导入文本做 `DOMPurify` 风格白名单（或至少 strip 标签）

```tsx
const sanitize = (s: string) =>
  s.replace(/[\x00-\x1f\u202e<>"']/g, "").slice(0, 200);
```

---

### 🟡 S-4 `URL.createObjectURL` 未撤销 → 内存泄漏

**文件**：[app/page.tsx](file:///workspace/app/page.tsx#L448-L454)

```tsx
const blob = new Blob([data], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'draw-results.txt'; a.click();
```

**问题**：每次点击导出都会创建一个新的 Blob URL，**永远不释放**。重复点击会累积内存。

**建议**：

```tsx
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'draw-results.txt';
a.rel = 'noopener';
document.body.appendChild(a);
a.click();
a.remove();
setTimeout(() => URL.revokeObjectURL(url), 0);
```

---

### 🟡 S-5 缺少 `robots` meta / 纯工具型站点应 `noindex`

**文件**：[app/layout.tsx](file:///workspace/app/layout.tsx#L19-L24)

当前 metadata 未声明 `robots`。对于不希望被搜索引擎收录的工具页，建议显式声明：

```tsx
export const metadata: Metadata = {
  ...
  robots: { index: false, follow: false },   // 纯工具站
};
```

---

### 🟡 S-6 Dialog 组件存在无障碍缺陷（与安全边界相关）

**文件**：[components/ui/dialog.tsx](file:///workspace/components/ui/dialog.tsx#L14-L28)

当前极简实现存在以下问题：
1. ❌ 无 `role="dialog"` / `aria-modal="true"` → 屏幕阅读器无法识别
2. ❌ 无 `aria-labelledby` / `aria-describedby` → 对话框无名称
3. ❌ 无焦点陷阱（Focus Trap）→ Tab 会跳出对话框到页面底层，键盘用户可操作底层元素
4. ❌ 无 `Escape` 键关闭
5. ❌ 无 body scroll lock
6. ❌ 打开时不把焦点送入对话框、关闭后不把焦点归还触发者
7. ❌ 仅以 `onClick` 监听遮罩关闭 → 键盘用户无法通过 Enter/Space 触发遮罩层关闭

**建议**：使用 `@radix-ui/react-dialog` 或 `@base-ui/react/dialog` 等成熟库。如果要自实现，至少补上：

```tsx
React.useEffect(() => {
  if (!open) return;
  const prev = document.activeElement as HTMLElement | null;
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") onOpenChange(false);
  };
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", onKey);
  // 聚焦对话框第一个可聚焦元素
  requestAnimationFrame(() => {
    const first = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    first?.focus();
  });
  return () => {
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    prev?.focus?.();
  };
}, [open, onOpenChange]);
```

---

### 🟢 S-7 localStorage 读写未捕获 `QuotaExceededError` / `SecurityError`

**文件**：[hooks/use-local-storage.ts](file:///workspace/hooks/use-local-storage.ts)

当前 `try/catch` 只抓 `JSON.parse` 异常，但：
- `localStorage.setItem` 在隐私模式 / Storage 满时会抛 `QuotaExceededError`
- 用户输入含 `\u0000` 等控制字符也会出问题

**建议**：在 `setValue` 中也对 `setItem` 做 try/catch，并在 catch 中走降级路径（内存态 / `sessionStorage`）。

---

### 🟢 S-8 `window` 在组件初始化阶段直接访问 → SSR 水合不一致

**文件**：[hooks/use-local-storage.ts](file:///workspace/hooks/use-local-storage.ts#L5)
```ts
if (typeof window === "undefined") return initialValue;
```

当前在 `useState` 的初始化器中做分支判断，**SSR 与 CSR 的首次渲染不一致**。Next.js 若启用 SSR/Streaming 可能触发 hydration mismatch 警告。

**建议**：使用 "mount 后再同步" 模式（参考 React 文档 `useSyncExternalStore` 的推荐做法），或保持该 Hook 仅在 `"use client"` 组件内消费并对初始返回值做一致化处理。

---

## 3. React 与组件架构最佳实践

### 🟡 R-1 主组件 `RandomDrawApp` 超过 650 行，职责过载

**文件**：[app/page.tsx](file:///workspace/app/page.tsx)

一个组件里同时承载：
- 语言切换
- 主题切换（含预设色板）
- 抽取逻辑（数字、自定义名单、去重/可重复）
- 动画计时 (`setInterval` ref)
- 历史记录 CRUD
- 导出 / 导入
- 自动空闲计时 (`mousemove/keydown/touchstart`)
- Tabs / 对话框 / 滑块 / ...

**建议**：按 "关注点" 拆分：

```
app/page.tsx                         ← 只做装配与布局
hooks/use-draw.ts                    ← 抽取业务逻辑（状态机）
hooks/use-idle-timer.ts              ← idle 检测
components/draw/NumberDisplay.tsx    ← 中央结果显示
components/draw/DrawButton.tsx       ← 底部胶囊按钮
components/settings/SettingsPanel.tsx ← 侧边栏
components/settings/RangeSettings.tsx ← 数值范围
components/settings/AppearanceSettings.tsx
components/history/HistoryPanel.tsx
components/common/ImportDialog.tsx
```

拆分后：
- 可独立测试、可独立审查
- `useEffect` / `useCallback` 依赖项数量显著减少
- 避免 "600 行组件，任何一次改动可能引入回归"

---

### 🟡 R-2 `mounted` 使用 `useSyncExternalStore(() => () => {}, () => true, () => false)` 的非常规用法

**文件**：[app/page.tsx](file:///workspace/app/page.tsx#L35)

```tsx
const mounted = React.useSyncExternalStore(() => () => {}, () => true, () => false);
```

这是在 "借用" `useSyncExternalStore` 的 SSR-safe 语义来获取 `isMounted`。虽然可用，但：
- 可读性差（团队其他成员难以理解）
- 并非 React 文档推荐方式

**建议**：使用更通用的 `useMounted`：

```ts
function useMounted() {
  const [m, setM] = React.useState(false);
  React.useEffect(() => setM(true), []);
  return m;
}
```

或直接使用 `next-themes` 的 `useTheme()` 内部已有的 mounted 检查（它已处理好闪烁）。

---

### 🟡 R-3 `AnimatePresence` 使用不一致：有条件渲染却未包裹

**文件**：[components/number-roller.tsx](file:///workspace/components/number-roller.tsx#L44-L81)

`CharacterSlot` 中的 `rolling` 动效使用了 AnimatePresence 包裹（正确）。

但 [app/page.tsx](file:///workspace/app/page.tsx#L302-L619) 里对侧边栏使用 `translate-x-full` 做视觉切换而不是条件挂载，对结果区直接 map 而无 key-driven 过渡——这些地方动效/可访问性不一致。

**建议**：统一"可动画元素"的写法，用 AnimatePresence 包裹条件挂载的子树，而不是仅做 CSS transform；对列表项保证 key 是稳定的 ID。

---

### 🟢 R-4 `use-local-storage` Hook 的命名与返回值不符合惯例

**文件**：[hooks/use-local-storage.ts](file:///workspace/hooks/use-local-storage.ts#L32)

```ts
return [storedValue, setValue] as const;
```

虽然模仿了 `useState`，但是 `setValue` 实际上是异步写入 storage 的函数，且依赖 `storedValue`（见 line 29 的 deps）。这会导致：
- 如果多个组件共用一个 key，不同实例间不会同步（无跨组件订阅）
- `setValue` 依赖 `storedValue`，当它变化时 setValue 会被重建，从而引起下游 `useCallback` 级联重建

**建议**：
1. 将 `setValue` 中对当前值的读取改为函数式 `setStoredValue(prev => ...)`，并把 deps 改成 `[key]`
2. 接入 `storage` 事件以支持多 Tab 同步（可选项）

```ts
const setValue = React.useCallback(
  (value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prev => {
        const next = value instanceof Function ? (value as any)(prev) : value;
        if (typeof window !== "undefined") {
          try { window.localStorage.setItem(key, JSON.stringify(next)); } catch {}
        }
        return next;
      });
    } catch (error) { console.error(...); }
  },
  [key]   // 不再依赖 storedValue
);
```

---

### 🟢 R-5 `use-mobile.ts` 中 `React.useState` 初始化器直接读取 `window.innerWidth`

**文件**：[hooks/use-mobile.ts](file:///workspace/hooks/use-mobile.ts#L7-L12)

SSR 环境下 `window` 不存在，当前代码用 `typeof window === 'undefined'` 兜底，但在 Next.js App Router 的客户端组件中，仍可能出现：
- 服务器渲染 → 返回 `false`
- 客户端 hydration → 返回 `true`（移动端）
- 首次渲染即出现 hydration mismatch

**建议**：初始化统一返回 `false`，`useEffect` 中再同步真实值（与 `useTheme` 的 mounted 模式一致）。

---

### 🟢 R-6 `animationIntervalRef` 类型是 `NodeJS.Timeout`（Node 类型）而不是 `number`

**文件**：[app/page.tsx](file:///workspace/app/page.tsx#L127)

在浏览器环境，`setInterval` 返回值是 `number`（虽然 TypeScript 的 `@types/node` 会把它扩成 `NodeJS.Timeout`）。跨环境兼容写法：

```ts
const animationIntervalRef = React.useRef<number | null>(null);
// 或使用 ReturnType<typeof setInterval>
```

---

### 🟢 R-7 `useEffect` 依赖项问题汇总

- [app/page.tsx](file:///workspace/app/page.tsx#L55-L66) `themePreset/fontFamily` 的 effect 内部依赖 `document.body.classList`，却没有任何外部依赖声明；应改为 ref 或显式依赖。
- [app/page.tsx](file:///workspace/app/page.tsx#L85-L108) idle timer：`setTimeout` 返回值应使用 `const timerRef = useRef<number | null>(null)` 保存，而不是在闭包里 let 变量 + 依赖 `[showUI, autoHide, isDrawing]` 来重置；每次依赖变化都会**重新 addEventListener**，cleanup 也会因闭包捕获到旧 `timer` 而漏清理。

**推荐写法**：

```tsx
React.useEffect(() => {
  let timer: number | null = null;
  const reset = () => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => setShowUI(false), 8000);
  };
  reset();
  const onMove = () => reset();
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("keydown", onMove, { passive: true });
  window.addEventListener("touchstart", onMove, { passive: true });
  return () => {
    if (timer) window.clearTimeout(timer);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("keydown", onMove);
    window.removeEventListener("touchstart", onMove);
  };
}, [showUI, autoHide, isDrawing]);
```

---

### 🟢 R-8 历史记录列表使用 index 作为 key

**文件**：[app/page.tsx](file:///workspace/app/page.tsx#L505-L516)

```tsx
{history.map((record) => (
  <motion.div key={record.id} ...>  // ✅ 这里用 id 是正确的
    ...
    {record.results.map((res, idx) => (
      <motion.span key={idx} ...>{res}</motion.span>  // ⚠️ 仅用 idx 作为 key
    ))}
  </motion.div>
))}
```

外层使用了 `record.id`（正确），但内层的 `res` 用 `idx` 作为 key。对**纯展示文本**来说可接受，但如果有动画/交互元素，会导致 React 复用错节点 → 动画异常。

**建议**：内层使用 `${record.id}-${idx}-${res}` 作为 key，或内部给每个结果生成稳定 id。

---

### 🟢 R-9 巨型 `translations` 对象硬编码在 `locales/index.ts`

**文件**：[locales/index.ts](file:///workspace/locales/index.ts)

当前做法可工作，但不支持：
- 按需加载（大语种包场景）
- 运行时切换的类型安全（`t` 直接用任意字符串键，无 autocomplete）

**建议**：引入 `@formatjs/intl` / `react-i18next` / ` next-intl`，并将文本抽到 JSON/PO 文件中，便于翻译协作与 lint（key 是否完整覆盖）。

---

### 🟢 R-10 主题类操作通过 `document.body.classList` 做 imperative DOM 操作

**文件**：[app/page.tsx](file:///workspace/app/page.tsx#L55-L66)

```tsx
React.useEffect(() => {
  const body = document.body;
  const themeClasses = Array.from(body.classList).filter(...);
  themeClasses.forEach(cls => body.classList.remove(cls));
  if (themePreset !== 'default') body.classList.add(`theme-${themePreset}`);
  body.classList.remove('font-sans','font-mono','font-serif');
  body.classList.add(`font-${fontFamily}`);
}, [themePreset, fontFamily]);
```

这在 React 18/19 下会出现两个典型问题：
1. RSC 首屏渲染的 HTML 中不含这些类， hydration 后会**瞬间闪一下**
2. 组件卸载时不会清理（页面切换时 body 上的类永久残留）

**建议**：改为 `next-themes` 管理（已在用），并把 `theme-preset` 和 `font-family` 也抽象成类似 provider；或至少在 root `layout.tsx` 中统一处理。

---

## 4. 可访问性（A11y）要点

1. **Dialog 缺 role/aria-modal/焦点陷阱/Esc**（见 S-6）
2. **`suppressHydrationWarning` 全局启用** [layout.tsx](file:///workspace/app/layout.tsx#L28) —— 这会**把真正的 bug 也静音**，应只在具体需要的元素上单独启用。
3. **按钮 `title` 替代了 `aria-label`**：对 `Button variant="ghost"` 类的图标按钮，应同时提供 `aria-label`（title 仅鼠标悬停可见，键盘/读屏用户看不到）。
4. **`viewport` 中 `userScalable: false`**：会剥夺视力不佳用户双指缩放能力（WCAG 1.4.4 Resize Text）。一般仅在全屏游戏/PWA 场景接受。
5. **`select-none` 全局** [page.tsx](file:///workspace/app/page.tsx#L244)：阻止用户复制文本，对无障碍与可操作性都是减分项。建议仅对装饰性图标/按钮使用，而非整个容器。

---

## 5. 样式与主题

1. **CSS 变量定义顺序不一致**：`@theme inline` 块在 [style.css](file:///workspace/app/style.css#L253-L300) 里定义了 `--radius-*`，但 `@layer base` 又应用了 `border-border outline-ring/50`。可能出现首次渲染闪。
2. **自定义主题类 `.theme-*` 写死在组件里**：`theme-${themePreset}` 是字符串拼接 → 对 Tailwind v4 的静态分析不友好（必须把这类类名加到 `safelist` 或改成显式映射）。

**建议**：

```tsx
const PRESET_CLASS: Record<string, string> = {
  default: "",
  ocean:   "theme-ocean",
  forest:  "theme-forest",
  sunset:  "theme-sunset",
  purple:  "theme-purple",
  neon:    "theme-neon",
};
// 而不是 `theme-${themePreset}`
```

---

## 6. 类型与 TS 严格度

1. **`translations` 的 key 使用字符串字面量** → 当前 `t.rangeCount` 会有类型提示（TS 已推断），但缺少"未翻译键"的强制检查。建议把 `Language` 与 `TranslationKey` 分开声明，并通过 `satisfies` 约束。
2. **`use-local-storage.ts` 中 `as const` 返回 tuple 与实际类型不一致**：`setValue` 在 TS 层面会被推断为精确字面量类型，但在 `setMin`、`setMax` 等处消费时被当作可变值写入，语义不清晰。建议显式返回 `[T, (v: T | ((prev: T) => T)) => void]`。
3. **`animationIntervalRef.current = null` 与 `NodeJS.Timeout` 类型冲突**（浏览器 `number` vs Node 的对象）。统一为 `number | null`。

---

## 7. 修复优先级路线图

### Phase 1（马上做）— 🔴 高优先级
- [ ] S-1：`Math.random()` 替换为 `crypto.getRandomValues()`
- [ ] S-2：把 `ignoreDuringBuilds` 改回 `false` 并修复 lint 告警

### Phase 2（本周做）— 🟡 中优先级
- [ ] S-3：自定义名单加入长度/字符白名单校验
- [ ] S-4：`URL.createObjectURL` 后 `revokeObjectURL`
- [ ] S-6：重写 Dialog（或替换为 `@base-ui/react/dialog`）
- [ ] R-1：将 `page.tsx` 按功能拆分为多个子组件 / hooks

### Phase 3（可作为重构）— 🟢 低优先级
- [ ] R-2：替换 `useSyncExternalStore` 技巧为标准 `useMounted`
- [ ] R-4：改写 use-local-storage 的依赖项与跨组件同步
- [ ] R-7：清理 `useEffect` 中事件监听的闭包陷阱
- [ ] R-9：引入 i18n 方案（`next-intl` 等）
- [ ] A11y：移除全局 `select-none`，补充 `aria-label`，把 `suppressHydrationWarning` 收缩到最小范围

---

## 8. 亮点

也值得指出一些做得好的地方：

- ✅ 组件变体通过 CVA 管理（`components/ui/button.tsx`），符合 shadcn 约定
- ✅ `use client` 边界放置正确（所有需要 browser API 的组件都已标记）
- ✅ Tailwind v4 + CSS variables 主题系统，支持多种预设色板和 dark mode
- ✅ `lucide-react` 统一图标，避免内联 SVG 风格混乱
- ✅ `next/font/google` 自托管字体，避免第三方脚本
- ✅ 动效使用 Framer Motion `motion`，对 `prefers-reduced-motion` 有感知
- ✅ `next.config.ts` 已启用 `reactStrictMode`（有助于发现不安全副作用）

---

## 9. 附：建议的 ESLint / TypeScript 严格度

在现有 `.eslintrc.json`（如为空）基础上，建议至少开启：

```jsonc
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react-hooks/exhaustive-deps": "error",
    "@next/next/no-img-element": "error",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "no-unsanitized/property": "warn",
    "no-unsanitized/method":   "warn"
  }
}
```

并在 `tsconfig.json` 中开启：
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

---

> 本报告为一次性静态审查。如需自动化，可将 `S-1`~`S-8` 中的关键项注册为 ESLint 自定义规则或 CI 检查，并在 PR 阶段阻断不合规代码。
