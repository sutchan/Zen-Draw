# Zen-Draw 开发任务清单

> **唯一任务来源**：所有未完成事项、待验证技术细节与计划实施的优化项统一记录于此。
> 已完成项归档于 [tasks-done.md](tasks-done.md)；优化方案详情见 [optimization.md](optimization.md)。
> 文档体系索引见 [README.md](README.md)。

## 元信息
- 最后更新：**2026-11-25**（本次系统性文档标准化轮）
- 当前版本：APP_VERSION = **5.7.14**（`app/lib/version.ts`，与 `package.json` 一致）
- 维护人：WorkBuddy（AI 助手）；需用户决策项以「用户 + WorkBuddy」标注
- 检视方式：`tsc --noEmit` / `eslint . --max-warnings=0` / `vitest run` / `next build`
- 门禁现状：2026-11-23 复验 tsc 0 错误、ESLint 0 警告、vitest 7 文件 69/69 全绿；生产构建受 L3 本机清理红线限制，以 CI 为准
- 排序规则：优先级 P1 > P2 > P3；同级按编号升序。计划完成时间为目标日期，非承诺发布日

## 任务总览
| 编号 | 优先级 | 状态 | 说明 | 责任人 | 计划完成时间 |
|---|---|---|---|---|---|
| L3 | P1 | 🟡 阻塞 | `.next` 残留清理（待用户决策；阻断本机 `next build`） | 用户 + WorkBuddy | 待决策（建议 2026-11-30 前） |
| D1 | P1 | 🟢 待办 | OpenAPI 契约纳入 CI 校验（`docs/openapi.yaml` 结构性校验） | WorkBuddy | 2026-11-30 |
| D3 | P2 | 🟢 待办 | 繁中落地后同步 7 份文档的语言描述与 FAQ（依赖 O1） | WorkBuddy | 2026-12-16 |
| V1 | P2 | 🔵 待验证 | Node 版本一致性：本机 26.13.1 / CI 22 双版本跑全部门禁（关联 O2） | WorkBuddy | 2026-12-02 |
| O1 | P2 | 🟢 待办 | 补齐繁体中文（zh-Hant），110 键 × 3 语言 + 回退链 | WorkBuddy | 2026-12-09 |
| O2 | P2 | 🟢 待办 | 统一 Node 版本策略（engines + `.nvmrc` + CI 单一来源） | WorkBuddy | 2026-12-02 |
| O3 | P2 | 🟢 待办 | Playwright E2E 覆盖 3 条核心路径（10–15 用例） | WorkBuddy | 2026-12-16 |
| D2 | P3 | 🟢 待办 | 文档数字实算脚本固化至 `scripts/` 并纳入 CI（防止统计漂移） | WorkBuddy | 2026-12-16 |
| V2 | P3 | 🔵 待验证 | 滚动动画性能基线实测（count=1 / 1000），无实测不改代码（关联 O5） | WorkBuddy | 2026-12-16 |
| V3 | P3 | 🔵 待验证 | 生产构建验证（`next build`，依赖 L3 解除或 CI 环境） | WorkBuddy | 2026-12-02 |
| O4 | P3 | 🟢 待办 | `npm audit` 门禁收紧（报告 artifact + 白名单机制） | WorkBuddy | 2026-12-23 |
| O5 | P3 | 🟠 需实测 | 抽取滚动动画渲染优化（仅在 V2 超阈值时实施） | WorkBuddy | 2026-12-23 |
| O6 | P3 | 🟢 待办 | 历史记录批量导出（CSV / JSON） | WorkBuddy | 2026-12-23 |
| O7 | P3 | 🟠 条件触发 | 历史列表虚拟化预案（仅当上限放宽至 ≥1000 条时启动） | WorkBuddy | 条件触发，不排期 |
| O8 | P3 | 🟢 待办 | PWA 离线支持（`@serwist/next`） | WorkBuddy | 2026-12-31 |

## 未完成 / 阻塞事项（按优先级）

### L3 [P1] `.next` 残留清理 🟡 阻塞
- **背景**：`.next` 内残留中断构建的 `standalone`（约 1300+ 文件），`next build` 清理时触发环境安全删除防护；用户此前已否决删除 `.next`，不得尝试等价删除。
- **方案**：① 用户授权清理；或 ② 用户在本地终端执行 `rm -rf .next && npm run build`。仓库不受影响（`.next` 已 gitignore）。
- **预期效果**：本机可完成生产构建验证（V3），CI 不受影响。
- **责任人 / 计划完成时间**：用户 + WorkBuddy / 待决策（建议 2026-11-30 前）
- **状态更新时间**：2026-11-25（沿用 2026-11-23 阻塞结论）

### D1 [P1] OpenAPI 契约纳入 CI 校验 🟢 待办
- **背景**：本轮新增 `docs/openapi.yaml`（OpenAPI 3.1，`paths: {}` 为真实状态），目前仅人工维护，缺结构校验，未来编辑可能破坏 YAML 合法性或 schema 引用。
- **方案**：引入 `@redocly/cli`（或 `swagger-cli`）作为 devDependency；CI `quality-check` 增加 `lint openapi.yaml` 步骤；校验 `paths` 保持为空（防止误编造 HTTP 端点）。
- **预期效果**：契约文件结构错误在 PR 阶段拦截；预计新增 1 条 CI 步骤、校验耗时 < 10s。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-11-30

### D3 [P2] 繁中落地后同步文档 🟢 待办
- **背景**：`overview.md` / `features.md` / `user-guide.md` / `faq.md` 当前均写「zh/en 两种语言」，O1 落地后将过时。
- **方案**：O1 完成后批量同步 7 份文档的语言清单、`html lang`、`TranslationKey` 数量（110→110 键 × 3 语言）、FAQ 语言切换说明；同步 CHANGELOG。
- **预期效果**：文档与代码零漂移；验收以 `v5.7.14+` 全展示位扫描无「两种语言」表述为准。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-16（依赖 O1）

### V1 [P2] Node 版本一致性验证 🔵 待验证
- **背景**：CI Node 22、`.nvmdrc` 26.13.1、`package.json` 无 `engines`，三处不一致；历史出现因 Node 差异导致的 localStorage 测试失败。
- **方案**：在 Node 22 与 26 两个版本分别跑 `npm ci` + 四连检，记录差异；结果写入 `optimization.md O2` 作为决策依据。
- **预期效果**：明确版本策略是否有行为差异；若一致则 O2 风险降为低。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-02

### O1 [P2] 补齐繁体中文 🟢 待办
- **背景**：用户 i18n 优先级为简中→繁中→英文，当前仅 zh/en；繁体用户只能用简体或英文。
- **方案**：新增 `locales/zh-Hant.ts`（110 键，台湾用语）；`Language` 扩展为 `zh | zh-Hant | en`；回退链繁中缺键→简中、英文缺键→简中；`html lang="zh-Hant"`；语言切换 UI 增项。
- **预期效果**：繁体用户母语覆盖；编译期 `Record<TranslationKey, string>` 保证 110 键 × 3 语言一致。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-09（完成后触发 D3）

### O2 [P2] 统一 Node 版本策略 🟢 待办
- **背景**：见 V1；三处约束不一致，增加新成员环境搭建与问题排查成本。
- **方案**：`package.json` 增加 `engines.node`；`.nvmdrc` 改用标准 `.nvmrc` 并与 CI 对齐；`ci.yml` 读取版本文件单一来源；同步 `deployment.md`。
- **预期效果**：开发/CI/文档版本一致，消除「本机通过、CI 失败」类问题。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-02（依赖 V1 结论）

### O3 [P2] Playwright E2E 补齐 🟢 待办
- **背景**：69 个单元/组件用例之外无 E2E，核心路径（抽取→结果→历史→复制）缺端到端回归。
- **方案**：`@playwright/test`，Chromium + Firefox；首批 3 条路径、10–15 用例；复用现有语义化 id；CI 增加 e2e job。
- **预期效果**：核心路径自动化回归，减少人工冒烟成本。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-16

### D2 [P3] 文档数字实算脚本固化 🟢 待办
- **背景**：110 键 / 16 组件 / 19 键等数字目前由一次性脚本实算，易随代码演进漂移。
- **方案**：将实算逻辑固化为 `scripts/check-doc-facts.mjs`，输出 JSON 到 `reports/`，CI 比对文档声明值；产物目录预置 gitignore。
- **预期效果**：文档数字漂移自动拦截；每次校验耗时 < 5s。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-16

### V2 [P3] 滚动动画性能基线实测 🔵 待验证
- **背景**：`setInterval` 每 80ms dispatch 更新，count=1000 时单 tick 可能重渲染大量节点；**当前无实测数据**。
- **方案**：React Profiler / Chrome Performance 测 count=1 与 1000 两档帧率与 commit 时长，结果写入 `optimization.md O5`。
- **预期效果**：获得可量化基线；无数据前不做渲染改造（禁止编造指标）。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-16

### V3 [P3] 生产构建验证 🔵 待验证
- **背景**：本机 `next build` 受 L3 红线限制，当前仅以 CI 为准。
- **方案**：L3 解除后或用全新 distDir 验证一次构建（4 页静态生成 + 产物体积），结果记录到 `tasks-done.md`。
- **预期效果**：形成一次本机构建通过的完整证据。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-02（依赖 L3 或 CI 环境）

### O4 [P3] 安全审计门禁收紧 🟢 待办
- **背景**：`npm audit --audit-level=high` 带 `continue-on-error: true`，失败不阻塞合并。
- **方案**：报告 artifact + PR 评论强制可见；已知可接受漏洞白名单登记，未登记 high+ 阻塞。
- **预期效果**：漏洞从静默失败变为 PR 内可见；误报可治理。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-23

### O5 [P3] 滚动动画渲染优化 🟠 需实测
- **背景 / 方案 / 预期效果**：见 `optimization.md O5`；仅在 V2 实测超阈值时启动，备选 rAF 直写 DOM 或 memo 隔离。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-23（依赖 V2）

### O6 [P3] 历史记录批量导出 🟢 待办
- **背景**：历史仅支持单条复制，名单有导出而历史没有，能力不对称。
- **方案**：历史区增加导出按钮（CSV + JSON），Blob 下载，文件名含日期与 build 编号，语义化 id `history-export`。
- **预期效果**：补齐离线留存能力；约 1 组件 + 1 纯函数。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-23

### O7 [P3] 历史列表虚拟化预案 🟠 条件触发
- **背景**：当前上限 100 条，全量渲染无性能风险；预案避免未来扩容时临时调研。
- **方案**：仅当上限放宽至 ≥1000 条时引入 `@tanstack/react-virtual`。
- **预期效果**：当前零成本；触发时直接进入实施。
- **责任人 / 计划完成时间**：WorkBuddy / 条件触发，不排期

### O8 [P3] PWA 离线支持 🟢 待办
- **背景**：纯客户端应用，断网即白屏。
- **方案**：`@serwist/next` 预缓存 + 运行时兜底；manifest 与 11 配色对齐；仅缓存同源静态资源。
- **预期效果**：可安装、离线可用；Lighthouse PWA 项补齐（分值实施后实测）。
- **责任人 / 计划完成时间**：WorkBuddy / 2026-12-31

> 已完成项（基线、T1–T9、L1/L2/L4、C1–C5、L5–L8）归档于 [tasks-done.md](tasks-done.md)；本轮 D1/D2/D3/V1–V3/O1–O8 均为**未完成或待验证**，不得移入归档。
