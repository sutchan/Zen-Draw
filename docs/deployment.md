# ZenDraw | 禅抽 · 安装部署指南

> 适用版本：v5.7.14 ｜ 最后更新：2026-11-25 ｜ 维护人：WorkBuddy（AI 助手）
> 本项目**无服务端 API、无数据库**，部署仅涉及 Node.js 运行时与静态资源服务。

## 目录

1. [环境依赖清单](#1-环境依赖清单)
2. [安装步骤](#2-安装步骤)
3. [配置说明](#3-配置说明)
4. [多环境部署方案](#4-多环境部署方案)
5. [验证方法](#5-验证方法)

## 1. 环境依赖清单

| 依赖 | 要求 | 说明 |
|---|---|---|
| Node.js | ≥ 18.18（Next.js 15 最低要求） | **CI 门禁锚定 Node 22**；本机开发曾用 Node 26 验证通过。⚠️ 当前版本策略不一致（CI 22 / `.nvmdrc` 26.13.1 / `package.json` 无 `engines`），统一方案见 [optimization.md O2](optimization.md) |
| npm | 随 Node 附带（≥ 10） | 依赖安装与脚本执行 |
| 浏览器 | 最新 2 个主要版本（Chrome / Edge / Firefox / Safari） | 运行时目标；纯客户端渲染 |
| 操作系统 | 无限制 | Node 可运行即可 |
| 数据库 / 后端 | **不需要** | 全部数据存浏览器 localStorage |

源码依赖以 `package.json` 为准（dependencies 13 个 / devDependencies 20 个），关键精确锁定版本：typescript 5.9.3、eslint 9.39.1、tailwindcss 4.1.11。

## 2. 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/sutchan/Zen-Draw.git
cd Zen-Draw

# 2. 安装依赖（无 postinstall 副作用，prepare 仅输出提示）
npm install

# 3. 启动开发服务器
npm run dev
# 打开 http://localhost:3000
```

> 本地 Node 26 环境提示：`vitest` 在 Node 26 + jsdom 下缺少 `window.localStorage`，`app/test/setup.ts` 已内置 polyfill（v5.7.13 起），测试可直接运行。

## 3. 配置说明

本项目**无需任何必填环境变量或配置文件**：

| 项 | 机制 | 说明 |
|---|---|---|
| build 编号 | `next.config.ts` 构建期自动生成 `NEXT_PUBLIC_BUILD_ID`（10 位 `yymmddhhmm`） | dev / build 均生效；缺失时页脚回退为仅显示 `V{APP_VERSION}`（SPEC §5.1.2） |
| 应用版本 | `app/lib/version.ts` 的 `APP_VERSION`（与 `package.json` 一致） | 页脚唯一展示位，格式 `V主.次.修 · build yymmddhhmm` |
| 主题 / 语言 / 字体 | 用户运行时选择，持久化至 localStorage | 无服务端配置项 |
| SEO / metadata | `metadata.json` + Next Metadata API | 静态声明 |

## 4. 多环境部署方案

### 4.1 本地开发（development）

```bash
npm run dev        # http://localhost:3000，热更新
```

### 4.2 生产构建 + Node 服务（production）

```bash
npm run build      # 产物输出至 .next/（含自动构建编号注入）
npm run start      # 以 Node 服务托管生产构建，默认 3000 端口
```

### 4.3 CI/CD（GitHub Actions）

`.github/workflows/ci.yml`，触发于 push / pull_request（main、master、develop）：

| Job | Node | 步骤 |
|---|---|---|
| quality-check | 22 | checkout → npm ci → `type-check` → `lint --max-warnings=0` → `test` → `build` |
| security-check | 22 | checkout → npm ci → `npm audit --audit-level=high`（continue-on-error）→ dependency-review（仅 PR） |

### 4.4 平台部署（Vercel / EdgeOne 等）

仓库为标准 Next.js 15 项目，可直接对接支持 Next 的托管平台：

- 构建命令 `npm run build`，输出目录 `.next`；
- 无需额外环境变量（build 编号构建期自动注入）；
- ⚠️ 若以子目录/rootDir 方式部署（如 EdgeOne `rootDir:app`），Next 不服务仓库根 `public/`，引用 `/favicon.svg` 等静态资源会 404——部署前需评估该约束。

> **已知本机构建红线**：`.next` 内残留中断构建的 `standalone` 时，`next build` 的清理步骤可能触发环境安全删除防护而失败（任务 L3，待用户决策）。替代验证：使用全新临时 distDir 构建后删除。

## 5. 验证方法

### 5.1 自动化门禁（四连检，与 CI 等价）

```bash
npm run type-check                 # tsc --noEmit → 预期 0 错误
npm run lint -- --max-warnings=0   # 预期 0 警告 0 错误
npm test                           # Vitest → 预期 7 文件 69/69 通过
npm run build                      # 预期构建成功（注意 4.4 红线）
```

### 5.2 手动冒烟清单

- [ ] 首页加载，页脚显示 `V5.7.14 · build <10 位编号>`；
- [ ] 点击「开始抽取」→ 数字滚动 → 结果揭晓 + 彩屑（体验设置关闭彩屑后不再出现）；
- [ ] 打开设置面板 4 个 Tab，修改任一项刷新页面后保持；
- [ ] 历史记录显示最近抽取，单条点击可复制，清空生效；
- [ ] 切换语言 zh/en、切换 11 种配色预设、3 种字体均即时生效；
- [ ] 抽取进行中按 `Space` 提前停止；面板开启时 `Escape` 关闭。
