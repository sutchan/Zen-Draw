# 项目长期记忆 (MEMORY.md)

## 项目：Zen-Draw (ZenDraw | 禅抽)
- 技术栈：Next.js 15 + React 19 + TypeScript，随机抽签应用
- 仓库路径：`e:\Github\Zen-Draw`
- 版本号单一来源：`app/lib/version.ts`（`APP_VERSION`），规范每次改动须同步所有出现位置

## 全局硬性规则（用户要求，跨项目/跨任务适用）
1. 始终使用简体中文回复，结论先行、输出精简，不冗长铺陈。
2. 大批量分批任务（如全站 SEO 写入、PO 翻译）自动继续，无需每批确认。

## 代码规范约定（Zen-Draw 项目）
- **拆分所有超过 200 行的源代码文件为合理模块**：单文件超过 200 行时必须按职责拆分为更小模块（组件拆分、逻辑抽离 hooks/util 等），保持可读性与可维护性。
- 每次对任意文件的修改（新增/删除/改代码文档配置）都须升级最小版本号（patch 起步），并同步更新：源文件头版本注释、package.json version、metadata.json name、README/README_CN 徽章与页脚、SPEC.md、CHANGELOG 对应版本小节。
- 提交信息遵循 `type: 描述`（feat/fix/docs/refactor/style/test/chore/perf/ci/revert），描述首字母小写、动词开头、≤50 字符、无句号。
- 安全红线：凭据仅存 `wp.secret.ps1`（git 忽略），不得硬编码；代码/日志不含密钥 Token。

## 已知历史遗留
- `wp.ps1` 历史版本曾含明文密码已泄漏，真密码仍需到插件后台吊销重置（运营动作）。
- 行尾问题：项目历史多为 CRLF，node 脚本写文件默认 LF 会导致整文件"被修改"噪音；提交前用 `git add --renormalize .` 归一化后再判断实质差异。
