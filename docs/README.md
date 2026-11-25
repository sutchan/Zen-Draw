# ZenDraw｜禅抽 · 文档中心索引

> 适用版本：**v5.7.14** ｜ 最后更新：2026-11-25 ｜ 维护人：WorkBuddy（AI 助手）
> 权威规范：[openspec/SPEC.md](../openspec/SPEC.md)（术语以 SPEC §0.4 为准）｜ 变更历史：[CHANGELOG.md](../CHANGELOG.md)

## 1. 文档地图

| 文档 | 核心内容 | 适用读者 |
|---|---|---|
| [overview.md](overview.md) | 项目背景、目标、技术栈选型、架构设计、核心数据流 | 全体 / 新成员 |
| [deployment.md](deployment.md) | 环境依赖、安装配置、多环境部署、验证方法 | 部署者 / 开发者 |
| [features.md](features.md) | 7 大功能模块、业务流程图、关键逻辑 | 产品 / 开发者 |
| [api.md](api.md) | 接口契约（无 HTTP API）、内部签名、持久化契约、错误码、调用示例 | 开发者 / 测试 |
| [openapi.yaml](openapi.yaml) | OpenAPI 3.1 机器可读契约（`paths: {}` 为真实状态） | 工具链 / 契约测试 |
| [user-guide.md](user-guide.md) | 角色说明、快速上手、详细操作步骤、快捷键 | 终端用户 |
| [faq.md](faq.md) | 常见问题与故障排除流程 | 终端用户 / 支持 |
| [optimization.md](optimization.md) | 优化建议与未来展望（O1–O8，含量化目标与优先级） | 产品 / 架构 / 开发者 |
| [tasks.md](tasks.md) | **唯一任务来源**：未完成事项、待验证细节、计划优化项 | 全体 |
| [tasks-done.md](tasks-done.md) | 已完成任务的归档记录 | 追溯 |
| [design/](design/) | 设计参考静态稿（色彩/动效/字体，非应用页面） | 设计 / 开发者 |

## 2. 按角色的阅读路径

- **终端用户**：`user-guide.md` → `faq.md`
- **部署者**：`deployment.md` → `faq.md`（部署类问题）→ `overview.md`
- **新开发者**：`overview.md` → `features.md` → `api.md` + `openapi.yaml` → `openspec/SPEC.md`
- **产品 / 架构评审**：`overview.md` §4 架构 → `features.md` → `optimization.md` → `tasks.md`

## 3. 文档规范与约定

1. **规范优先级**：用户明确指令 > `openspec/SPEC.md` > `prototype/` > 记忆/历史文档（SPEC §0.2）。
2. **数字必须实算**：翻译键 110、UI 组件 16、配色预设 11（CSS 覆盖类 10）、持久化键 19、测试 7 文件 69 例——均为脚本实算值，禁止沿用旧文档估值。
3. **版本单一来源**：`package.json` 与 `app/lib/version.ts` 的 `APP_VERSION` 一致；页脚是版本**唯一**展示位（`V主.次.修 · build yymmddhhmm`，SPEC §5.1.2），静态稿/原型不展示 build。
4. **历史不追溯改写**：CHANGELOG 旧小节、版本历史与 `tasks-done.md` 保留原貌；仅被改文件刷新头注释。
5. **文档不拆分**：`.md` 文件即使超过 200 行也保持完整（200 行拆分规则仅适用于源代码）。
6. **任务单一来源**：所有未完成事项只写入 `tasks.md`，含优先级、责任人、计划完成时间。

## 4. 维护与变更

- 新增/修改文档时同步：本文索引、对应文档头部版本与日期、CHANGELOG 当前版本小节。
- 文档变更引起的代码/架构/性能/体验改进点，按"背景 → 实施方案 → 预期效果 → 优先级"格式写入 `optimization.md`，并登记至 `tasks.md`。
- 待验证技术细节（无实测数据的性能指标等）必须显式标注"需实测"，禁止编造量化结论。
