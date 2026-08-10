# Changelog

## [5.7.3] - 2026-08-10

### chore（语义化 id 补全 + 版本同步）
- 为页面级与区块级容器补齐语义化 `id`：draw-area / action-area / history-area / header-content / header-brand / header-actions / 各设置 Card（draw-range/count/duration/allow-dup/custom-list、experience-* 6 项）/ appearance-* 区块 / result-cards / history-tab-header
- 统一同步所有源文件头注释与文档版本号至 v5.7.3

## [5.7.2] - 2026-08-10

### feat（调试可观测性）
- 为所有结构性/语义化容器补充 kebab-case 语义化 `id` 便于调试与 E2E 定位
- 覆盖范围：页面级（`app-body`/`app-shell`/`app-main`/`app-footer`/`error-page`/`not-found-page`）、布局与设置面板（`app-header`/`settings-panel`/`tab-panel-*`/`draw-settings`/`appearance-settings`/`experience-settings` 等）、抽取展示（`draw-display-region`/`results-region`/`result-card-${index}`/`draw-button-root` 等）、历史列表（`history-list`/`history-card-${index}`/`history-empty-state` 等）、特效（`celebration-effect`/`confetti-burst`）
- 多实例容器用 `${index}` 后缀保证 id 唯一；UI 基础原子组件不加 id
- `SPEC.md` 新增 §5.1.1 容器语义化 id 规范表

## [5.7.1] - 2026-08-10

### Docs（规范文档修正）
- 修正 `SPEC.md` §4 设计系统版本标注（v4.0 → v5.7.0，与代码对齐）
- 修正 `SPEC.md` §10.1 原型文件路径为真实文件（`prototype/index.html` 等，删除不存在的 `prototype/v1`、`prototype/interactive` 路径）
- 修正 `SPEC.md` §11 SEO 标题为 `v${APP_VERSION}`（与 `layout.tsx` 代码一致，原硬编码 v5.0）
- 修正 `SPEC.md` §13 版本历史：去除两处错误的 `(当前)` 标注，补录 v5.3.6 ~ v5.7.0 缺失记录（与 CHANGELOG 对齐）
- 全项目源文件头注释、`package.json`、`metadata.json`、README×2、SPEC.md 统一至 v5.7.1

### Refactor（模块拆分，符合 ≤200 行规约）
- `settings-panel/index.tsx`（365 行）拆分出 `settings-panel/custom-list-inline.tsx`（CustomListInline）与 `settings-panel/experience-settings.tsx`（ExperienceSettings），主文件降至 185 行
- `hooks/use-draw-actions.ts`（206 行）抽取纯函数 `clamp`/`sanitizeTextField` 至 `hooks/use-draw-utils.ts`，数值 setter 改用工厂 `makeNumberSetter` 合并，主文件降至 195 行；公开 API（`useDrawActions` 返回值）不变
- 全仓库复核：无超过 200 行的源文件

## [5.7.0] - 2026-08-10

### Features（设置入口整合 + 更多选项）
- **深色/浅色切换移入设置**：移除顶栏独立主题切换按钮，主题模式（浅/深/系统）已在「外观」Tab 统一管理，顶栏仅保留设置入口
- **新增「结果彩屑动效」开关**：控制揭晓结果时的庆祝彩屑/光晕动画（`confettiEnabled`）
- **新增「减弱动效」偏好**：用户级降低页面过渡与滚动动画强度，与系统级 reduce-motion 合并生效（`reduceMotion`）
- **全链路打通**：state/reducer/helpers/persistence/use-draw/actions 新增 `confettiEnabled`、`reduceMotion` 与对应 setter
- 新增翻译键 `confetti`/`confettiDesc`/`reduceMotion`/`reduceMotionDesc`
- 统一同步所有源文件头注释与文档版本号至 v5.7.0

## [5.6.0] - 2026-08-10

### Features（设置窗口重规划 + 新增常用项）
- **设置窗口信息架构重规划为 4 个 Tab**：抽取 / 外观 / 体验（新增）/ 历史，原散落的自动隐藏移到「体验」
- **新增「音效」开关**：补齐此前缺失的音效总开关（音效基础设施已存在，此前始终播放）；在动作层用 `soundEnabled` 门控所有提示音
- **新增「结果显示密度」**：舒适 / 紧凑两档，接入结果卡片尺寸与网格间距
- **「自动隐藏面板」真正生效**：开始抽取或产生结果后若开启则自动收起面板（此前仅占位未接线）
- **新增「重置所有选项」**：一键恢复默认设置（保留历史记录）
- **全链路打通**：state/reducer/helpers/persistence/use-draw/actions 新增 `soundEnabled`、`density` 与 `RESET_SETTINGS`
- 新增翻译键 `experience`/`sound`/`soundDesc`/`density`/`densityDesc`/`densityComfortable`/`densityCompact`/`resetSettings`/`resetSettingsDesc`

## [5.5.0] - 2026-08-09

### Features & Fixes（设置模块修复与完善）
- **设置面板结构修正**：移除 SettingsPanel 内多余的嵌套 Sheet（此前 `open={!autoHide}` 在默认 `autoHide=true` 时导致面板内容无法打开），改由外层 app-header 的 Sheet 统一控制显隐
- **新增「使用自定义名单」开关**：此前用户无法主动启用/停用自定义列表，现于抽取设置区暴露 Switch，并在名单已填但未启用时给出提示
- **自定义列表重复项改为自动去重保存**：此前存在重复项时直接拒绝保存（与「保存时自动去除」文案矛盾），现自动去重并提示去除数量
- **修复「允许重复」描述错用**：该卡片下方误用 `customListHint` 文案，改为新增的 `allowDupDesc`
- **数字格式预览在名单模式提示不生效**：外观设置预览在自定义名单模式下显示「格式不生效」
- **滑块上限对齐体验**：抽取数量上限 20→100、时长上限 10→30，避免 UI 范围过窄
- 新增翻译键 `allowDupDesc`/`listModeFormatNote`/`notApplicable`/`listNotEnabledHint`，并补全 `duplicateItemsWarning` 占位符
- **原型规划设置容器规范**：`wireframes.html` 新增「设置容器 Settings Container」区块（可开预览 + Tabs 切换 + Esc/遮罩关闭）；`design-system.md` 新增 §12 设置容器规范（结构/尺寸/动效/a11y 与代码对齐核对表）
- **原型版本对齐代码真值**：`prototype/` 四文件（index/prototypes/wireframes/tokens/design-system）版本号 `v5.3.7` → `v5.5.0`，修复此前原型滞后于代码的版本漂移（代码侧自 5.4.x 起已 bump 至 5.5.0，原型未同步）
- 设置容器代码侧经核对已与规范一致（右侧 Sheet + HeaderBar + Tabs(draw/appearance/history) + Esc + 遮罩 blur + `w-[26rem]` + 自定义名单独立 Dialog），无需改动

## [5.4.1] - 2026-08-09

### Bug Fixes & Code Quality
- **数字动效缓进缓出**：`number-roller.tsx` 定格动画由弹簧（带 overshoot 弹跳）改为 `easeInOut` 平滑 tween，消除弹跳、符合缓进缓出；滚动切换用短线性 tween 保持流畅；`prefers-reduced-motion` 静态兜底不变

## [5.4.0] - 2026-08-09

### Features
- 完善设置面板 UI：抽取设置（数量/时长）改用 Slider 并卡片化；外观设置新增数字格式实时预览与主题配色色块预览网格
- 自定义列表编辑弹窗升级为 base-ui Dialog，支持条目计数、清空列表，新增中/EN 语言切换按钮于外观区

### Bug Fixes & Code Quality
- **编译错误修复**：`app-header.tsx` 向 `SettingsPanel` 传递的 setter prop 名（`onMinChange` 等）与 `UseDrawReturn` 接口（`setMin` 等）不匹配导致 tsc 失败；改为整体展开 `draw` 对象透传，消除 14 处类型错误
- **i18n 鲁棒性**：`createTranslator` 对缺失 `key` 回退到 `key` 本身，避免运行期 `TypeError` 白屏
- **性能**：`use-draw.ts` 的 `settings` 对象改用 `useMemo` 包裹，避免下游非必要重渲染
- **输入校验**：`use-draw-actions.ts` 所有数值 setter（setMin/setMax/setCount/setDuration/setDigits）的 number 入增加 `Number.isFinite` 校验，防止 `NaN`/`Infinity` 写入状态
- **模块拆分**：`appearance-settings.tsx`（246 行）拆分出 `appearance-settings.parts.tsx`，抽离 `THEME_PRESET_KEYS`/`THEME_SWATCHES`/`cn` 与子组件 `ThemePresetGrid`/`FontFamilySelect`，主文件降至 130 行（≤200）
- **规范对齐**：SPEC.md §7.2 翻译键计数由过时的 90 修正为真实 112（zh/en/types 三处完全对齐，编译期强约束）

## [5.3.7] - 2026-08-09

### 文档同步与完善
- SPEC.md 组件库清单对齐实际代码：§5.1 基础组件表补 `Checkbox`/`Tooltip`/`Toast` 三行（均基于 @base-ui/react）
- SPEC.md §6 目录结构修正：补充遗漏的 `use-mounted-reduced-motion.ts`；`ui/` 组件列举补全（标明共 18 个）；`style.css` 主题数注释 10→11（含 Rose）
- 全项目版本号统一至 `v5.3.7`：源文件头注释、`package.json`、`metadata.json`、README×2、SPEC.md、design-system.md、prototype 三套 HTML
- **原型整改（prototype/）**：
  - 抽取共享 `tokens.css`，三套 HTML 改 `<link>` 引用，消除令牌重复（约 150 行）
  - design-system.md 合并重复的 v5.3.6 变更记录；删除未落地承诺（整页入场 fadeUp、结果揭示 scale 动画、深色 line-height +0.05、6xl/7xl 阶梯、↑/↓ 全量键盘），仅保留已实现动效与实际字号
  - 状态机统一 4 态（含历史沉淀），index/prototypes 双原型一致；修复 prototypes 顶部「下一步」与屏幕按钮竞态（共享单一状态源）
  - 主流程/状态机原型补充结果揭晓彩屑、↑/↓ 数值微调、Switch/Checkbox 键盘可达、`<main>` 语义、深浅色 localStorage 记忆
  - wireframes 组件库补 Slider `aria-valuenow`、Select `listbox` 模式、Dialog Esc 关闭、Switch/Checkbox 键盘；保留真机视图切换（375/768/1280）
  - 复审回写 design-system.md：§6/§7.1/§7.2/§11 同步实现（键盘表、`<main>` 语义、历史态双原型差异、错误态 clamp 兜底）；删除 main CSS 无效 aria-label 行、prototypes 未使用 ORDER 死代码

## [5.3.6] - 2026-08-09

### 文档同步与完善
- 修复 `app/lib/version.ts` 的 `APP_VERSION` 展示值（由 `5.3.3` 修正为实际版本，页脚版本号与全局一致）
- 统一全项目版本号至 `v5.3.6`：源文件头注释、`package.json`、`metadata.json`、README×2、SPEC.md、CHANGELOG、design-system.md、prototype 三套 HTML
- 修正 SPEC.md 与代码/原型不一致项：主题预设数 10→11（含 Rose）、翻译键计数 71→90、原型目录结构对齐实际 `prototype/`（`index.html`/`prototypes.html`/`wireframes.html`/`design-system.md`）

## [5.3.5] - 2026-08-09

### Bug Fixes
- **设置容器滑入动画失效**：`SheetContent` 的 `@keyframes slideIn` 由 scoped `<style jsx>` 改为 `<style jsx global>`，重命名为 `sheet-slideIn` 并同步 `animation` 引用，抽屉恢复右侧滑入过渡
- **宽度冲突**：`SheetContent` 移除左右侧强加的 `max-w-sm`，宽度完全由调用方 `className`（如 `w-full sm:w-[420px]`）决定，桌面端抽屉恢复 420px
- **滚动高度错乱**：`SettingsPanel` 根 div 与内部 `Tabs` 由 `h-full` 改为 `flex-1 min-h-0`，使内容区 `flex-1 overflow-y-auto` 在 flex 父级内正确分配高度，修复双重滚动/内容塌陷
- **SheetClose 定位**：默认 `absolute` 改为 `static`，避免在其他使用场景与标题重叠（AppHeader 已显式 `static ml-auto` 无冲突）

## [5.3.4] - 2026-08-09

### Code Quality & Spec Alignment
- 清理 i18n 9 个死键（rangeCount/rangeDesc/listImport/listImportDesc/displayRules/displayDesc/toggleUI/drawHistory/resultsCount），zh/en 键集对齐至 71 个
- SPEC.md 翻译键清单与目录注释同步为 71 键；§7.3 示例改用有效键 milestoneDraws
- 全局规则补充：超过 200 行的源代码文件须拆分为合理模块（已写入 CodeBuddy/Trae 全局规则与项目记忆）

## [5.3.3] - 2026-08-09

### Refactor
- 原型精简：合并 v1/v2/interactive/minimal 为单一高保真可交互原型 `prototype/index.html`（真实数据 + 组件库规范 + 11 主题）
- 设计规范文档 `prototype/DESIGN-SYSTEM.md` 升级：三级组件库、交互标准、动效时序、响应式与无障碍

### feat
- shadcn/ui 补齐缺口组件（base-nova）：`ui/checkbox.tsx`、`ui/tooltip.tsx`、`ui/toast.tsx`，根布局接入 `ToastProvider`/`TooltipProvider`
- 复制结果反馈升级为 Toast 轻量提示；主题切换按钮加 Tooltip
- 原型与代码主题数对齐为 11 套（含 Rose）

### fix
- 原型一致性修复：统一三套 HTML 令牌命名为 `--radius-*`/`--space-*`/`--shadow-*`/`--dur-*`（与 DESIGN-SYSTEM.md 一致）
- 修正 `index.html` 版本号与主题数矛盾（v5.3.2→v5.3.5、10→11 套含 Rose CSS）；主流程三屏改为真实联动（`goState` 状态机 + Space/Enter/Esc 键盘）
- 抽取范围统一为 1–100（修复 Math.random 误抽 0/100）
- `prototypes.html` 状态机图示与实现一致，彩屑改为结果揭晓时联动触发
- `wireframes.html` 修复 Slider 无效 JS（数值实时更新）、Select 点击外部关闭、Sheet 真实抽屉演示
- 补全 Dialog / Separator / Label 演示、Disabled/Error/Success 真实态、响应式真机视图与键盘/ARIA
- 组件三级分类对齐（`ThemeSwatches`/`DrawDisplay` 归业务，`SettingsPanel`/`Form`/`Select`/`Sheet` 归复合）

## [5.3.1] - 2026-08-09

### UI & Experience
- 历史记录卡片结果数字加大：由 `text-sm` 加粗改为 `text-lg sm:text-xl font-bold`，时间标签保持小字

## [5.3.0] - 2026-08-09

### Features
- 新增「玫瑰红」主题：配色方案增至 10 种彩色预设（含深/浅模式），每种预设均含 light/dark 两套变量

## [5.2.2] - 2026-08-09

### Bug Fixes
- 修复里程碑徽章「第 X 次抽签」左右跳动：移除 scale 缩放动画（跳动主因），锚定 `origin-top-right` 并以 `whitespace-nowrap` 防换行，改为纯垂直淡入

## [5.2.1] - 2026-08-09

### Bug Fixes
- **修复设置窗口错乱**：`SheetContent` 根容器由 `flex flex-col ... overflow-y-auto` 改为 `flex h-full flex-col`，并对侧边抽屉统一挂载 `h-full`，使 `SettingsPanel` 的 `flex h-full` 能正确撑满高度
- `AppHeader` 中 `SheetContent` 透传 className 移除冗余 `overflow-y-auto`，删除破坏 `h-full` 弹性链的 `<div className="py-4">` 包裹层，`SheetHeader` 加 `shrink-0` 防止被内容挤压，消除双重滚动容器与内容塌陷

### UI & Experience
- 历史记录卡片压缩为单行显示：时间与结果逗号连成一行，结果过长省略号截断，复制按钮保留在行尾

## [5.2.0] - 2026-08-09

### Code Quality & Robustness
- **Security hardening**: `useLocalStorage` 新增可选校验器参数，为 `customList` / `history` 数组加入类型守卫，防止 localStorage 被污染（如外部写入非数组）导致下游白屏
- **Perf fix**: `use-draw` 持久化 effect 补齐依赖数组 `[state, persisted]`，避免每次 render 都执行字段比较
- **Bug fix**: 修复 `SettingsPanel` 未向 `CustomListSettings` 传递 `onUseCustomListChange` 的预存在缺陷，使「使用自定义名单」开关可正常切换
- **Dead code removal**: 删除无消费端的 `setHistory` 回调及其 `SET_HISTORY` action/reducer 分支，移除未使用的 `SidebarToggle` 组件与 `SheetDescription` / `SheetFooter` 导出
- **i18n cleanup**: 移除 9 个未被引用的死翻译键（`notice` / `ok` / `display` / `drawAgain` / `clickToExpand` / `configureHint` / `recordLabel` / `exportList` / `settingsPanel`），`types.ts` / `zh.ts` / `en.ts` 键集对齐至 88 个

### Docs & Versioning
- 新增 `app/lib/version.ts` 作为应用版本单一事实来源（已用于页脚）
- SPEC.md 状态管理（§6）、国际化翻译键清单（§7.2）、目录结构同步至实际代码
- 统一所有源文件头注释、`package.json`、`metadata.json`、README×2、SPEC.md、CHANGELOG 至 **v5.2.1**

## [5.1.1] - 2026-07-28

### Delightful Experience Upgrade (愉悦体验升级包)
- **🎉 ConfettiBurst**: canvas 粒子彩屑在结果揭晓瞬间喷射 130+ 彩色粒子（重力回落 / 旋转 / 淡出），`prefers-reduced-motion` 下完全不渲染
- **✨ Reveal title**: 结果落定时弹出俏皮标题「揭晓时刻 ✨ / And the winner is…」
- **🏆 Milestone badges**: 会话内第 1 / 10 / 20… 次抽签弹出成就徽章
- **🎈 Pleasant empty state**: 历史空态改为浮动骰子插画 + 俏皮文案，取代纯文字
- **🔔 Sparkle tail sound**: 揭晓音效追加高频「叮」泛音尾音，增强开奖仪式感

### Bug Fixes
- Fix `ConfettiBurst` primary-color sampling: Tailwind v4 `--primary` is `oklch(...)`, previously wrapped into invalid `hsl(oklch(...))` and silently dropped; now uses the verified festive palette only
- Remove dead `@import "shadcn/tailwind.css"` in `app/style.css`: package is not installed and all its theme mappings (`@theme inline`, `@custom-variant dark`) are already inlined locally — eliminates the `Can't resolve 'shadcn/tailwind.css'` build warning
- Add `secureRandomFloat` to `lib/utils.ts`; all decorative randomness uses crypto (no `Math.random` warnings, consistent with project security rule)

### Versioning
- Unify version headers across all 39 source files, `package.json`, SPEC.md, README×2 to **v5.2.1**

## [5.1.0] - 2026-07-18

### Code Refactoring

#### Split Remaining Files Over 200 Lines
- `app/components/ui/sheet.tsx` (252 lines) → `app/components/ui/sheet/` (`context.tsx`, `parts.tsx`, `index.tsx`)
- `app/components/ui/select.tsx` (201 lines) → extract `select-scroll-buttons.tsx`
- `app/page.tsx` → extract top nav into `app/components/layout/app-header.tsx` (main page now ~104 lines)
- Removed stale duplicate `sheet.tsx` that shadowed the new `sheet/` module (imports now resolve to the split version)
- All source files are now ≤ 200 lines

#### Dead Code Removal
- Delete unused `app/hooks/use-persist-settings.ts` (no references; effect without deps risked infinite localStorage writes)
- Remove dead translation key `drawResults` from `types.ts` / `zh.ts` / `en.ts`
- Remove redundant a11y attributes (`aria-hidden="false"`, redundant `role="button"`/`tabIndex` on native `<button>`)

### Bug Fixes
- Fix footer font count (`6` → `3`, actual font families: sans/mono/serif)
- Fix root `<html lang>` (`en` → `zh-CN`) for correct SEO / screen-reader default
- Remove duplicate `HistoryEntry` interface in `history-list` (import from `draw-types`)

### Documentation & Versioning
- Unify version headers across all source files, `package.json`, SPEC.md, README to **v5.1.0**
- Update SPEC.md translation-key count (49 → 97), add v5.1.0 history entry
- Sync CHANGELOG with v4.0.0 / v5.0.0 / v5.1.0

## [5.0.0] - 2026-06-30

### Design & Prototype
- Minimal design system refactor (`minimal-design-system.md`)
- Prototype optimization (`minimal-prototype.html`), code aligned to prototype (shadcn/ui component replacement)
- Responsive design optimization (mobile / desktop parity)
- Performance: remove gradient backgrounds in favor of solid colors

## [4.0.0] - 2026-06-15

### Prototype & Components
- High-fidelity interactive prototype (`prototype/interactive/`)
- Component library completion (shadcn/ui v4 base-nova style)
- Motion system upgrade (Apple-style easing functions)
- Accessibility hardening (WCAG AA)

## [3.3.0] - 2026-06-28

### Security Fixes

#### Replace Math.random() with Cryptographically Secure Random
- `app/components/number-roller.tsx`: Replace `Math.random()` in `rollChar` with `secureRandomInt()` from `utils.ts`
- `app/lib/utils.ts`: Update `generateLocalId()` to use `crypto.getRandomValues()` for secure random string generation
- Align with project security standard (SPEC.md section 6.5)

### Bug Fixes

#### Fix Broken setHistory Function
- `app/hooks/use-draw.ts`: Add `SET_HISTORY` action to `DrawAction` type
- Handle `SET_HISTORY` in `drawReducer`
- Fix `setHistory` function to properly update history via reducer (was previously only clearing history)

### Code Refactoring

#### Split Large Files (Over 200 Lines)
- **`app/hooks/use-draw.ts` (634 lines)**:
  - Extract types to `app/hooks/draw-types.ts`
  - Extract helper functions to `app/hooks/draw-helpers.ts`
  - Extract reducer to `app/hooks/draw-reducer.ts`
  - Keep `useDraw` hook in `app/hooks/use-draw.ts` (now ~150 lines)
- **`app/components/draw/settings-panel.tsx` (781 lines)**:
  - Extract `DrawSettings` to `app/components/draw/draw-settings.tsx`
  - Extract `AppearanceSettings` to `app/components/draw/appearance-settings.tsx`
  - Extract `CustomListSettings` to `app/components/draw/custom-list-settings.tsx`
  - Keep `SettingsPanel` main component in `app/components/draw/settings-panel.tsx` (now ~250 lines)

#### Sound Effects System
- Add `app/hooks/use-sound.ts` — Web Audio API sound synthesis, no external files needed
- 5 sound types: start (rising tone), tick (rolling click), result (C5→E5→G5→C6 arpeggio), error (falling tone), stop
- Integrate into draw flow via `onSound` callback in `useDraw`

#### Animation Optimization
- Staggered stop effect: characters settle left-to-right with 80ms delay (slot machine style)
- Enhanced spring animation on settle: stiffness 400, damping 16, mass 0.55 with overshoot bounce
- Celebration effect: radial glow + Sparkles icon pulse (1.2s) when results are revealed
- Result card micro-bounce (1.025×) + box-shadow transition to primary highlight

#### i18n Refactoring
- Add `app/lib/i18n.ts` — `createTranslator` utility with `{0}` `{1}` parameter substitution
- Restructure `app/locales/` — split into `types.ts` (type defs), `en.ts` (English), `zh.ts` (Chinese)
- Add 21 new translation keys (header, buttons, welcome/error screens, result labels, theme toggle, footer)
- Migrate `draw-display.tsx`, `draw-button.tsx`, `page.tsx` to use centralized translations

#### Code Cleanup
- Remove unused imports: `Volume2`, `VolumeX`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`, `usePresetTheme`, `useThemeMounted`, `THEME_PRESETS`, `ThemePreset`, `useTheme`, `NumberRoller`
- Remove unused `total` prop from `HistoryCardProps`
- Fix `metadata.json` version (v3.2 → v3.3.0)
- Delete large original files and restructure as component directories

### Version Update
- Bump version from `3.2.0` to `3.3.0`
- Update `package.json`, `README.md`, `README_CN.md`, `app/layout.tsx`

---

## [3.2.0] - 2026-06-26

### Code Quality System

#### Code Review Standards
- 新增 [代码审查标准](./.github/CODE_REVIEW_STANDARD.md) — 定义三级问题分类（🔴必须修复 / 🟡应该修复 / 💭可选优化）
- 新增 [PR 提交模板](./.github/PULL_REQUEST_TEMPLATE.md) — 结构化 PR 描述和自查清单
- 新增 [CI/CD 工作流](./.github/workflows/ci.yml) — 自动运行类型检查、ESLint、构建、安全审计
- 新增 [CODEOWNERS](./.github/CODEOWNERS) — 自动分配代码审查者
- 新增 [代码审查体系搭建总结](./.github/CODE_REVIEW_SETUP.md) — 使用指南

#### ESLint Enhancement
- 重写 `eslint.config.js`（Flat Config 格式）
- 新增 TypeScript 严格规则（`no-explicit-any` 警告、`no-non-null-assertion` 错误）
- 新增 React Hooks 依赖检查（严格模式）
- 新增无障碍规则（jsx-a11y 系列）
- 新增安全规则（禁止 eval、警告 Math.random() 使用）
- 新增代码质量规则（禁止 console.log、禁止 var、自动移除未使用导入）
- 删除冲突的旧 `.eslintrc.json`

#### TypeScript Strict Mode
- `tsconfig.json` 新增 `noUncheckedIndexedAccess: true`
- 新增 `exactOptionalPropertyTypes: true`
- 新增 `noImplicitReturns: true`
- 新增 `forceConsistentCasingInFileNames: true`

#### Package Scripts
- 新增 `npm run lint:fix` — 自动修复 ESLint 错误
- 新增 `npm run type-check` — TypeScript 类型检查

### Security Enhancement

#### Secure Random Number Generation
- 强化随机数生成规范，要求使用 `crypto.getRandomValues()`
- 新增安全编码规范章节到 `openspec/SPEC.md`

#### Input Validation
- 新增输入验证规范（范围限制、长度限制）
- 新增 XSS 防护规范（不使用 `dangerouslySetInnerHTML`）

### Documentation

#### README Updates
- 更新 `README.md` 和 `README_CN.md` 到 v3.2
- 新增"代码质量"章节，说明项目质量标准
- 新增"贡献指南"章节，链接到代码审查标准
- 新增"安全说明"章节

#### OpenSpec Updates
- 更新 `openspec/SPEC.md` 到 v3.2
- 新增第 6 章"代码质量规范"
- 更新目录结构（添加 .github/ 目录）
- 更新 CHANGELOG 部分

---

## [3.1.0] - 2026-06-11

### Security Hardening

#### Input Validation
- 所有数字输入统一使用 `parseFiniteNumber()` 解析，杜绝 NaN/Infinity 写入状态
- `min/max` 范围限制为 ±1,000,000，`count` 限制为 1-1000，`duration` 限制为 1-120s，`digits` 限制为 0-20
- `prefix/suffix` 输入限制为 50 字符，过滤控制字符
- `customList` 单项最长 200 字符，最多 1000 项

#### Runtime Guards
- `handleDraw` 添加二次验证：min/max/count/range 全部经过 `Number.isFinite` 和边界检查
- `randomInt` 增加 `isFinite` 预检，防止 NaN 传递到 Math 函数
- `NumberRoller` 限制字符数上限 200，防止超长内容触发性能 DoS
- `html.lang` 使用白名单（仅允许 "en" / "zh"），防止任意字符串写入

#### Dependency Security
- 升级 `next`、`firebase-tools` 等易受攻击的依赖
- `npm audit` 漏洞数从 11（9 moderate + 2 high）降至 0

### Component Library
- 新增 [badge.tsx](file:///workspace/components/ui/badge.tsx) — 语义化徽章组件（7 种变体）
- 新增 [alert.tsx](file:///workspace/components/ui/alert.tsx) — 语义化警告组件（4 种变体）
- 新增 [separator.tsx](file:///workspace/components/ui/separator.tsx) — 水平/垂直分隔线组件

### React 19 Compliance
- 修复 `theme-provider.tsx` 和 `dialog.tsx` 的 setState-in-effect 级联渲染警告
- 修复 `select.tsx` 的 ARIA 属性缺失（`aria-controls` + listbox id）

### Design System Documents
- 新增 `prototype/color-system.html` — 完整色彩系统文档
- 新增 `prototype/typography.html` — 字体/排版系统规范
- 新增 `prototype/motion.html` — 动效系统规范
- 完善 `prototype/prototypes.html` — 高保真可交互原型
- 完善 `prototype/wireframes.html` — 组件库规范文档

## [3.0.0] - 2026-06-08

### Design Redesign - Apple Design Style

#### Design Changes
- Complete top navigation bar redesign with 56px height and frosted glass effect
- Settings panel width adjusted to 380px with Apple-style grouping
- Result display area optimized with large centered layout
- Unified border-radius system: sm uses rounded-xl, lg uses rounded-[2rem]
- Main action button changed to pill shape (rounded-full)
- New Apple-style floating animation with softer movement

#### Interaction Optimization
- Animation curve uses Apple standard cubic-bezier(0.25, 0.1, 0.25, 1)
- Transition duration adjusted to 300-500ms
- Tab style change from underline to rounded pill
- Section labels changed to uppercase for clearer grouping

#### Documentation & Specs
- Prototype redesign with new design specification page
- OpenSpec documentation fully updated for v3.0
- Added Apple HIG design references

## [2.7.0]
- feat: Add 6 color theme presets (Default, Ocean, Forest, Sunset, Purple, Neon)
- feat: Add 3 font family options (Sans, Mono, Serif)
- style: Optimize sidebar animation
- fix: Fix SSR hydration errors
- ux: Improve mobile experience

## [2.4.0]
- feat: Add adjustable draw duration (1-30s, default 5s)

## [2.3.0]
- feat: Set default number display to 3 digits (padding with zeros)

## [2.2.0]
- feat: Add visual expand hint for new users
- feat: Pulse animation on menu button when sidebar is hidden for the first time
- feat: Side-edge "Chevron" hint for quick sidebar expansion on Desktop
- feat: Force hide sidebar immediately when "Start Draw" is clicked
- ux: "New" badge in sidebar header for first-time discovery

## [2.1.0]
- feat: Advanced sidebar auto-hide logic
- feat: Add idle timer (8s) to automatically hide sidebar when inactive
- feat: Add click-outside/backdrop to close sidebar
- feat: Add mobile backdrop for better focus when settings are open
- ux: Improve sidebar interaction and focus

## [2.0.0]
- feat: Implement sidebar auto-hide feature (automatically hides when drawing starts)
- feat: Add "Auto-hide Sidebar" toggle in settings panel
- i18n: Add translations for auto-hide feature in English and Chinese
- refactor: Major version bump for core UX improvement

## [1.7.0]
- fix: Enforce strictly fixed width for individual digit slots in NumberRoller to prevent layout jitter
- style: Further optimize rolling speed for a more intense "slot machine" feel
- refactor: Standardize character slot sizing across responsive breakpoints

## [1.6.0]
- fix: Fix "Random Roller" animation visibility by moving gradient styling to internal elements
- style: Improve rolling animation smoothness and speed
- refactor: Clean up redundant styling in main page

## [1.5.0]
- fix: Remove geolocation permission request and location display
- security: Enhanced privacy by removing unnecessary tracking

## [1.4.0]
- feat: Implement slot-machine style "Random Roller" animation for draw results
- feat: Individual digit animation for a more dynamic visual experience
- style: Update UI to support rolling state

## [1.3.0]
- feat: Rename project to ZenDraw | 禅抽
- style: Update bilingual branding across UI and documentation

## [1.2.0]
- feat: Add SEO metadata and GEO location tracking
- feat: Optimize responsive layout for Desktop/Tablet/Mobile
- feat: Add semantic IDs to all major containers for debugging
- docs: Add GitHub compliant README.md and README_CN.md
- style: Standardize all file header comments to single-line format

## [1.1.0]
- feat: Support i18n (English and Simplified Chinese)
- feat: Refactor layout to full-screen display area
- feat: Add collapsible settings sidebar
- style: Enhance typography and animation for random numbers

## [1.0.0]
- feat: Initial release of Random Draw App
- feat: Add customizable number range (min, max)
- feat: Add customizable display rules (digits padding, prefix, suffix)
- feat: Add draw count and allow duplicates toggle
- feat: Add history panel
- feat: Support dark/light mode toggle

