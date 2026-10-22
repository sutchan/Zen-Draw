# Zen-Draw 已完成任务清单

> 本文件收录 `docs/tasks.md` 中已完成的任务条目，按完成时间归档。
> 来源：2026-10-13 两轮开发 + 2026-10-19 收尾轮（Git 提交 / CHANGELOG 补记 / 版本统一）。
> 进行中与待决策事项见 `docs/tasks.md`。

## 元信息
- 归档时间：2026-10-19 (GMT+8)
- 版本基准：APP_VERSION = 5.7.9（lib/version.ts，2026-10-19 由 5.7.8 提升）

---

## 基线（代码审查结论，先于任务清单存在）

- [x] 类型检查、ESLint、生产构建均通过（上一轮最终复核：四项全绿）
- [x] 版本号统一由 `APP_VERSION`（lib/version.ts）驱动，无旧版硬编码（v3.3.0 等说法不成立）
- [x] `footerInfo` 文案参数（10 种主题 / 3 种字体）与 `THEME_PRESETS`(10 个可选预设) / `FONT_FAMILIES`(3) 实际数量一致，无需修正
- [x] `use-persist-settings.ts` 清理任务不成立——该文件根本不存在
- [x] 设置面板结构：AppHeader 已用外层 `Sheet` 包裹 `SettingsPanel`（CHANGELOG 记录此意图）
- [x] 代码内无 TODO/FIXME/HACK 残留（仅两处"临时"字样为正常业务注释）

---

## 第一轮任务（2026-10-13 16:2x–19:45）

### T1 [P0 · Critical] 修复 SettingsPanel 嵌套 Sheet 导致设置面板空白 ✅
- **文件**：`app/components/draw/settings-panel/index.tsx`
- **问题**：`SettingsPanel` 自身被包裹在一个**未受控的内层 `<Sheet>`**，而它又渲染在 `app-header.tsx` 外层 `Sheet` 的 `SheetContent` 之内。内层 Sheet 默认 `open=false` → 其 `SheetContent` 在 `!open` 时 `return null`（sheet/parts.tsx），导致 `HeaderBar` + 全部 `Tabs` **不渲染**，打开设置面板后内容区为空白；且内层齿轮按钮会再开一层重复抽屉。
- **修复**：移除 `SettingsPanel` 内层 `<Sheet>` 包裹，改为直接渲染 `<HeaderBar/> + <Tabs>`，作为 AppHeader 外层 Sheet 的内容；保留独立的 `CustomListSettings` 对话框；清理不再使用的导入。
- **完成时间**：2026-10-13 16:2x

### T2 [P1] 错误页 / 404 页接入 i18n ✅
- **文件**：`app/error.tsx`、`app/not-found.tsx`、`app/hooks/use-stored-language.ts`（新增）、`app/locales/{types,zh,en}.ts`
- **问题**：两页均硬编码中文文案，未接入 `createTranslator`，无法随语言切换。
- **修复**：新增共享钩子 `useStoredLanguage`（基于 `useSyncExternalStore`，参照项目既有 `use-mounted-reduced-motion` 范式：服务端快照固定 "zh" 保证 hydration 一致，订阅 storage 事件支持跨标签页同步）；两页改用该钩子 + `createTranslator`；新增翻译 key：`pageErrorTitle / pageErrorDesc / retry / backHome / notFoundTitle / notFoundDesc / continueDraw / continueHint`。
- **完成时间**：2026-10-13 16:3x

### T3 [P2] 结果态按钮对齐 SPEC（「继续抽取」→ 重置欢迎态）✅
- **文件**：`app/hooks/draw-reducer.ts`、`app/hooks/draw-types.ts`、`app/hooks/use-draw-actions.ts`、`app/components/draw/draw-button.tsx`、`app/page.tsx`
- **问题**：SPEC 要求结果态显示「继续抽取」并点击**重置到欢迎状态**；原 `DrawButton` 在结果态显示「开始抽取」并直接重抽。
- **修复**：新增 `RESET` reducer action + `reset` action（清空 currentResults/rollingValues 回 idle，保留设置与历史）；`DrawButton` 按 `idle / drawing / result` 三态区分文案与回调；`page.tsx` 透传 `status` 与 `onContinue`；键盘空格在结果态同样触发 `reset`（与按钮一致）。
- **完成时间**：2026-10-13 16:4x

### T4 [P0 · Critical] 修复 package.json BOM 导致构建失败 ✅
- **文件**：`package.json`
- **问题**：`package.json` 首字节为 UTF-8 BOM（`ef bb bf`），Next.js 15.5.19 在读取 `output.uniqueName` 时 `JSON.parse` 直接抛 `SyntaxError: Unexpected token '﻿'`，**生产构建完全无法进行**。
- **修复**：剥离 BOM，其余字节不变；`JSON.parse` 验证通过。
- **备注**：项目源码文件（.ts/.tsx）以 BOM 开头是既定风格（tsc 容忍），但 package.json 绝不可带 BOM。
- **完成时间**：2026-10-13 19:42

### T5 [P1] 适配/补充单元测试 ✅
- **文件**：`app/components/draw/__tests__/draw-button.test.tsx`、`app/hooks/__tests__/draw-reducer.test.ts`
- **问题**：T3 修改 `DrawButtonProps`（新增 `onContinue`、`status`）后，原测试 props 不完整，tsc 报 3 处 TS2739。
- **修复**：测试补齐新 props；新增用例——结果态渲染「继续抽取」文案、结果态点击触发 `onContinue`、抽取中点击触发 `onStop`、reducer `RESET` 从结果态回 idle 且保留历史。
- **完成时间**：2026-10-13 19:41

### T6 [P1] 修复 set-state-in-effect lint 错误 ✅
- **文件**：`app/error.tsx`、`app/not-found.tsx`、`app/hooks/use-stored-language.ts`（新增）
- **问题**：T2 初版用 `useState + useEffect` 读取 localStorage 语言，触发 `react-hooks/set-state-in-effect` 报错（eslint --max-warnings=0 下为 error）。
- **修复**：改用 `useSyncExternalStore` 惰性快照模式（见 T2），消除 effect 内 setState。
- **完成时间**：2026-10-13 19:44

---

## 第二轮任务（2026-10-13 20:2x 起）

### T7 [P2] 为 useStoredLanguage 补跨标签页 storage 事件单测 ✅
- **文件**：`app/hooks/__tests__/use-stored-language.test.ts`（新增）
- **背景**：T2/T6 新增的 `useStoredLanguage` 钩子目前无直接测试覆盖；其核心行为（读 localStorage、storage 事件订阅/退订、服务端快照固定 "zh"）应有单测固化。
- **验收**：jsdom 环境下覆盖——初始读取 "zh"/"en"、dispatchEvent(new Event("storage")) 后重新读取、unmount 后监听器移除。
- **完成内容**：5 个用例全部落地并通过——① localStorage 无值时回退 "zh"；② 有值 "en" 时初始读取；③ 同标签写入 + dispatch storage 事件后同步到 "en"；④ 卸载后 dispatch 不再触发重渲染（监听器已移除）；⑤ 语言被改为非法值时回退 "zh"。
- **完成时间**：2026-10-13 22:4x

### T8 [P2] 核实 /_not-found 产物体积（103 kB）是否需要优化 ✅
- **文件**：`next build` 输出分析（无代码改动）
- **背景**：上轮构建报告 `/_not-found` First Load JS 103 kB，疑似偏大。需核实构成：若绝大部分为全局共享 chunks（React/Next 运行时基线），属正常现象，记录结论即可；若路由自身代码异常增大再定位。
- **验收**：给出构成拆解与结论。
- **结论（无需优化）**：`/_not-found` 路由自身代码仅 **123 B**；其 First Load JS 103 kB 中 **102 kB 为全局共享基线**（chunks/255 46.2 kB + framework chunk 54.2 kB + other 1.99 kB），404 页增量约 1 kB。构成健康，与首页（117 kB 路由代码 + 239 kB First Load）对比同理——体积几乎全部来自 React/Next 运行时，属正常现象，无优化空间亦无优化必要。
- **完成时间**：2026-10-13 22:5x

### T9 [P1] CI 补齐四连检（vitest + lint 阈值对齐）✅
- **文件**：`.github/workflows/ci.yml`
- **问题**：现 CI 仅跑 type-check / lint(--max-warnings=20) / build——① 缺 `vitest run` 步骤，测试回归无法在 PR 拦截；② lint 阈值 20 与本地 `--max-warnings=0` 标准不一致，CI 会放行本地不允许的告警。
- **修复**：quality-check job 增加 `npm test` 步骤（置于 lint 与 build 之间）；lint 阈值由 20 收紧为 0；头部注释补充四连检说明。
- **验收**：本地 `eslint . --max-warnings=0` 已通过（全仓库 0 告警，CI 不会因阈值收紧而红）；yml 结构与既有步骤风格一致。
- **完成时间**：2026-10-13 22:4x

---

## 第三轮收尾任务（2026-10-19 收尾 + 2026-10-22 验证）

### L2 [P1] CHANGELOG 补记 + 版本号提升 5.7.9 ✅
- **文件**：`CHANGELOG.md`、`app/lib/version.ts`、`package.json`、`metadata.json`、`README.md`、`README_CN.md`、`openspec/SPEC.md`，以及源码头注释（`settings-panel/index.tsx`、`draw-helpers.ts`、`use-draw-actions.ts`、`use-draw-settings-actions.ts`、`use-draw-utils.ts`）
- **内容**：新增 `[5.7.9] - 2026-10-19` 条目，按 fix / test / ci / chore 四类汇总 T1–T9 全部变更；`APP_VERSION` 与 `package.json` / `metadata.json` 版本引用统一至 5.7.9；顺带修正 `SPEC.md` 与 README×2 停留于 v5.7.7 的既有漂移；源码头注释版本号同步刷新。
- **完成时间**：2026-10-19 收尾轮（版本号与 CHANGELOG 落地）；2026-10-22 四连检复验通过

### L1 [P1] Git 提交 ✅
- **范围**：T1–T9 全部代码/配置改动 + CHANGELOG + 版本号提升 + CI 补齐 + 任务文档（`docs/tasks.md` / `docs/tasks-done.md`）
- **提交**：分两个 commit —— ① 代码与配置修复（含 CHANGELOG、ci.yml、版本号、READMEs、SPEC 等）；② 任务文档更新
- **推送**：尝试 `git push origin main`；若远端鉴权不可用则保留本地提交并提示用户处理
- **完成时间**：2026-10-22 15:1x
