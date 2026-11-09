# ZenDraw | 禅抽 v5.7.11

[English Version](./README.md)

禅抽 (ZenDraw) 是一款采用 Apple 设计风格的专业全屏随机抽签应用，基于 Next.js 15 App Router、React 19、Tailwind CSS v4 与 Motion 构建，适用于年会抽奖、课堂互动、抽签活动等场景。**纯客户端运行**：无后端、无 HTTP API、无数据库。

## 功能特性

- **滚筒式抽签**：字符级数字滚动 + 逐字定格，时长可配置（1–30 秒）。
- **抽取规则**：数值范围（最小值/最大值，跨度 ≤ 10,000,000）、抽取数量（≤ 1000）、允许/禁止重复、位数补零、前缀/后缀。
- **自定义名单**：导入姓名/奖品（≤ 1000 项，每项 ≤ 200 字符），自动去重，可导出为文本。
- **密码学安全随机**：`crypto.getRandomValues()` + 拒绝采样消除模偏差；仅在 crypto 不可用时降级 `Math.random()`。
- **主题与字体**：11 种配色（默认、海洋蓝、森林绿、落日橙、紫罗兰、霓虹、樱花粉、午夜蓝、复古棕、像素风、玫瑰红）× 3 种字体（无衬线 / 等宽 / 衬线），支持浅色 / 深色 / 跟随系统。
- **体验设置**：Web Audio 音效、结果彩屑、减弱动效、界面密度、自动隐藏面板、重置全部设置。
- **历史记录**：最多 100 条，支持点击复制与清空。
- **双语支持**：简体中文 / English，110 个翻译键，编译期强制对齐。
- **设置持久化**：19 个 `zendraw-*` localStorage 键，支持跨标签页同步。
- **无障碍**：结构性容器带 kebab-case 语义化 `id`、ARIA 标签、键盘快捷键（Space / Escape）、错误页与 404 页接入 i18n。
- **构建标识**：页脚展示 `V5.7.11 · build yymmddhhmm`，build 编号为 `next.config.ts` 构建期注入的 10 位时间戳；注入缺失时仅展示版本号。

## 技术栈

| 层级 | 依赖 | 版本 |
|---|---|---|
| 框架 | Next.js (App Router) | ^15.4.9 |
| UI | React / React DOM | ^19.2.1 |
| 样式 | Tailwind CSS v4 + @tailwindcss/postcss | 4.1.11 |
| 动画 | motion | ^12.23.24 |
| 图标 | lucide-react | ^0.553.0 |
| 主题 | next-themes | ^0.4.6 |
| 组件基础 | @base-ui/react | ^1.3.0 |
| 语言 | TypeScript（严格模式） | 5.9.3 |
| Lint | ESLint + eslint-config-next | 9.39.1 / 16.0.8 |
| 测试 | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.0.0 / ^26.0.0 |

## 安装与运行

```bash
npm install       # CI 在存在 package-lock.json 时使用 npm ci
npm run dev       # http://localhost:3000
```

质量门禁（与 `.github/workflows/ci.yml` 一致，Node 22）：

```bash
npm run type-check
npm run lint -- --max-warnings=0
npm test
npm run build
```

## 可用脚本

| 命令 | 描述 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本（`output: 'standalone'`） |
| `npm run start` | 启动生产服务器 |
| `npm run lint` / `lint:fix` | ESLint 检查 / 自动修复 |
| `npm run type-check` | `tsc --noEmit` 类型检查 |
| `npm test` / `test:watch` / `test:coverage` | Vitest 运行 / 监听 / 覆盖率 |
| `npm run clean` | 清理 Next.js 缓存（`next clean`） |

## 项目结构

```
app/
├── layout.tsx / page.tsx / error.tsx / not-found.tsx / style.css
├── components/
│   ├── layout/app-header.tsx
│   ├── ui/                 # 16 个 .tsx 文件（13 个顶层 + sheet/{context,index,parts}）
│   ├── draw/
│   │   ├── draw-button.tsx / draw-settings.tsx / custom-list-settings.tsx
│   │   ├── appearance-settings.tsx + appearance-settings.parts.tsx
│   │   ├── draw-display/   # 欢迎/错误/结果卡与网格/彩屑/庆祝光晕
│   │   ├── history-list/   # 列表、历史卡、空状态
│   │   └── settings-panel/ # 4 Tab 面板、标题栏、体验设置、名单内联编辑
│   └── number-roller.tsx / theme-provider.tsx
├── hooks/                  # 12 个 hook：draw-types、draw-helpers、draw-reducer、
│                           # use-draw、use-draw-actions、use-draw-settings-actions、
│                           # use-draw-utils、use-draw-persistence、use-local-storage、
│                           # use-sound、use-stored-language、use-mounted-reduced-motion
├── lib/                    # version.ts / i18n.ts / utils.ts
├── locales/                # types.ts（TranslationKey）、zh.ts、en.ts、index.ts
├── test/setup.ts            # Vitest 环境配置
└── **/__tests__/            # 7 个测试文件、69 个用例
prototype/                   # 4 个 HTML 原型 + tokens.css + design-system.md
docs/design/                 # color-system.html / motion.html / typography.html
docs/tasks.md / tasks-done.md
openspec/SPEC.md             # 权威项目规范
.github/                     # CI 工作流、审查标准、PR 模板
```

## 接口与数据

本项目为**纯客户端应用**：不存在 Route Handler、Server Actions、middleware 或任何 HTTP 端点，状态全部由 `useReducer` + `localStorage` 管理。内部模块接口（函数签名、参数、返回值）见 `openspec/SPEC.md` §14，19 个持久化键见 §9，因此无需单独的 API 参考文档。

## 近期变更

- v5.7.11 — 全量文档与代码对齐（目录结构、依赖版本、实算数字、接口契约、构建标识）。
- v5.7.10 — 页脚改为 `V{版本} · build yymmddhhmm`；构建期注入 build 编号；移除设置面板标题栏版本号。
- v5.7.9 — 设置面板嵌套 Sheet 修复、4 Tab 布局、错误页/404 页接入 i18n、`SETTINGS_FIELDS` 单一来源；清理 16 个死翻译键与 4 个零引用 UI 组件。

完整历史见 [CHANGELOG.md](./CHANGELOG.md)。

## 贡献指南

提交 PR 前请阅读 [代码审查标准](./.github/CODE_REVIEW_STANDARD.md) 与 [PR 模板](./.github/PULL_REQUEST_TEMPLATE.md)：从 `main` 创建功能分支、填写自查清单、确保 CI 通过、请求代码所有者审查。源码单文件 ≤ 200 行，主要容器使用 kebab-case 语义化 `id`，每次变更升级 patch 版本号。

## 安全说明

- 随机数使用 `crypto.getRandomValues()`；名单与前缀/后缀做输入净化。
- 无 `dangerouslySetInnerHTML`、无 `eval`；`next.config.ts` 配置 CSP、HSTS 等 8 条安全头。
- 所有数据仅存浏览器，代码与日志不含密钥。

## 开源协议

MIT License
