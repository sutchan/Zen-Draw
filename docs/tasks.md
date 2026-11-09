# Zen-Draw 开发任务清单

> 本清单仅跟踪**未完成 / 阻塞**的任务。
> 已完成的基线、T1–T9、L1、L2、C1–C5 及 L5（CHANGELOG 清理条目）均已归档至 `docs/tasks-done.md`。

## 元信息
- 最后更新：2026-11-09
- 当前版本：APP_VERSION = 5.7.11（lib/version.ts）
- 维护人：WorkBuddy（AI 助手）
- 检视方式：tsc --noEmit / eslint . --max-warnings=0 / vitest run / next build
- 门禁现状：2026-11-07 审查时 tsc 与 ESLint 全绿；2026-11-09 文档治理轮因沙箱重置 `node_modules`，四连检未在本机复跑，待有依赖环境复验。本机 Node v26.4.0 下 `use-stored-language.test.ts` 5 例因 jsdom 缺 localStorage 失败（见 L6）；生产构建受 `.next` 清理红线限制，交由 CI 验证

## 任务总览
| 编号 | 优先级 | 状态 | 说明 |
|---|---|---|---|
| L3 | P2 | 🟡 阻塞 | `.next` 目录清理（待用户决策，不擅自删除） |
| L6 | P1 | 🟢 待办 | Node 26 下 5 例测试失败：为 `app/test/setup.ts` 补 localStorage polyfill |
| L7 | P1 | 🟢 待确认 | `package-lock.json` 被外部删除，需恢复或确认包管理器策略（影响 CI `npm ci`） |
| L8 | P3 | 🟢 待确认 | `.github/PUSH_GUIDE.md` / `FIXES_SUMMARY.md` 为一次性过程文档，是否删除 |

## 未完成 / 阻塞事项

### L3 [P2] `.next` 目录清理 🟡 阻塞（待用户决策）
- **现状**：`.next` 内残留中断构建的 `standalone`（约 1300+ 文件）。直接 `next build` 时清理它的旧 standalone 会触发环境安全删除防护（单轮删除 > 50 文件需确认）导致构建失败。
- **约束**：`.next` 删除此前已遭用户否决，**不得尝试等价删除**；仓库不受影响（`.next` 已被 git 忽略）。
- **待用户决策**：① 批准由我清理 `.next`，或 ② 由用户在本地终端自行执行 `rm -rf .next && npm run build`。
- **替代验证（已实现）**：本轮继续通过临时 distDir（`.next/verify3` / `.next/verify4`，位于 git 忽略区内、全新目录免清理）完成四连检，验证结论对产物分析有效。
- **状态更新时间**：2026-10-22 16:14

### L6 [P1] 测试环境 localStorage polyfill 🟢 待办
- **现状**：本机 Node v26.4.0 下 `window.localStorage` 在 jsdom/vitest 环境为 undefined，`use-stored-language.test.ts` 5 例全部失败（69 例中 64 通过）。CI 使用 Node 22。
- **建议**：在 `app/test/setup.ts` 注入 localStorage polyfill，或固定 Node 版本 / 调整 vitest 环境配置。

### L7 [P1] package-lock.json 恢复 🟢 待确认
- **现状**：`git status` 显示删除已被暂存（`D  package-lock.json`，工作区由外部删除，HEAD 仍保留）。CI `npm ci` 与本地洁净安装均依赖该文件。
- **待确认**：若非有意迁移包管理器，执行 `git checkout -- package-lock.json` 恢复；恢复前该文件 `version` 字段长期停在 5.0.0，建议 `npm install` 同步一次。

### L8 [P3] 一次性过程文档去留 🟢 待确认
- `.github/PUSH_GUIDE.md` 与 `FIXES_SUMMARY.md` 已在 2026-11-09 标注为历史归档，是否删除需人工确认。

> L4（清理轮改动 Git 提交）已于 2026-11-06 完成并提交推送（`f3025ca`），归档至 `docs/tasks-done.md`。
