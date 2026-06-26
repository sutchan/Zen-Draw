# ZenDraw | 禅抽 v3.2

[English Version](./README.md)

禅抽 (ZenDraw) 是一款采用 Apple 设计风格的专业全屏随机抽签应用。基于 Next.js、Tailwind CSS 和 Framer Motion 构建，专为抽奖、课堂活动或任何需要随机选择的场景设计，提供极具冲击力的视觉呈现。

## 设计理念

本版本采用 Apple 设计风格，重新定义视觉体验：

- **极简布局**：去除冗余元素，只保留核心功能入口
- **大图展示**：突出显示抽奖结果，视觉冲击力更强
- **充足留白**：呼吸空间让界面更优雅，阅读更舒适
- **清晰层次**：明确的内容层级，信息结构一目了然

## 功能特性

- **滚筒式抽签**：动态的随机滚筒动画效果，增加趣味性。
- **全屏沉浸式显示**：超大字体配合灵动的动画效果，适合大屏展示。
- **高度可自定义规则**：
  - 自定义数值范围（最小值/最大值）。
  - 设置抽取数量及是否允许重复。
  - 自定义位数补零、前缀和后缀。
- **自定义名单导入**：支持导入自定义名单（姓名、奖品等）进行抽取，而不仅限于数字。
- **多语言支持**：支持中英文无缝切换。
- **响应式设计**：针对桌面端、平板和手机端进行了深度优化。
- **主题与字体**：提供多种配色方案（默认、海洋蓝、森林绿、落日橙、紫罗兰、霓虹）和字体样式（无衬线、等宽、衬线）供选择。
- **深浅色模式**：完美支持系统主题及手动切换。
- **历史记录与导出**：自动记录所有抽签结果并支持导出为文本文件。
- **设置持久化**：所有用户设置自动保存到 localStorage。

## 代码质量

本项目遵循严格的代码质量标准：

- **TypeScript 严格模式**：启用 `noUncheckedIndexedAccess`、`exactOptionalPropertyTypes` 等增强类型安全选项。
- **ESLint 强化规则**：安全规则、无障碍规则 (jsx-a11y)、React 最佳实践强制检查。
- **代码审查标准**：定义三级问题分类（🔴 必须修复、🟡 应该修复、💭 可选优化）的审查清单。
- **CI/CD 流水线**：每次 PR 自动运行类型检查、Lint 检查、构建验证、安全审计。
- **安全优先**：使用 `crypto.getRandomValues()` 保证随机数质量，输入验证，XSS 防护。

详见 [代码审查标准](./.github/CODE_REVIEW_STANDARD.md)。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS v4
- **动画**: Framer Motion (motion/react)
- **图标**: Lucide React
- **主题**: next-themes
- **UI 组件**: shadcn/ui
- **语言**: TypeScript (严格模式)

## 安装与运行

1. 克隆仓库。
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run lint:fix` | 自动修复 ESLint 错误 |
| `npm run type-check` | TypeScript 类型检查 |

## 项目结构

```
app/
├── layout.tsx              # 根布局
├── page.tsx                # 主页面
├── style.css               # 全局样式
├── components/
│   ├── draw/               # 抽签功能组件
│   ├── number-roller.tsx   # 数字滚动动画
│   ├── theme-provider.tsx  # 主题提供者
│   └── ui/                 # shadcn/ui 组件
├── hooks/                  # 自定义 React Hooks
├── lib/                    # 工具函数
└── locales/                # 国际化翻译
```

## 贡献指南

提交 Pull Request 前，请阅读 [代码审查标准](./.github/CODE_REVIEW_STANDARD.md) 和 [PR 模板](./.github/PULL_REQUEST_TEMPLATE.md)。

### PR 提交流程

1. 从 `main` 分支创建功能分支
2. 填写 PR 模板中的自查清单
3. 确保所有 CI 检查通过
4. 请求代码所有者审查
5. 处理审查反馈

## 安全说明

- 随机数生成使用 `crypto.getRandomValues()` 保证密码学质量
- 所有用户输入均经过验证和脱敏处理
- 客户端代码不存储敏感信息
- 定期运行 `npm audit` 进行依赖安全审计

## 开源协议

MIT License
