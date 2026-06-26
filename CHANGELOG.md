# Changelog

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
