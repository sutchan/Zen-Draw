# ZenDraw | 禅抽 · 接口文档

> 适用版本：v5.7.14 ｜ 最后更新：2026-11-25 ｜ 维护人：WorkBuddy（AI 助手）
> 权威签名以源码为准：SPEC §14「接口与数据契约」。

## 目录

1. [关于 OpenAPI：本项目不适用](#1-关于-openapi本项目不适用)
2. [内部模块接口契约](#2-内部模块接口契约)
3. [持久化数据契约](#3-持久化数据契约)
4. [错误处理约定](#4-错误处理约定)
5. [错误码定义](#5-错误码定义)
6. [调用示例](#6-调用示例)

## 1. 关于 OpenAPI：本项目不适用

> **本项目为纯客户端应用，无任何 HTTP API。** 经源码全量核查（2026-11-25）：`app/` 下无 `route.ts`、无 `app/api/` 目录、无 Server Actions（`"use server"` 零命中）、无 `middleware.ts`。数据不出浏览器，全部读写 localStorage。

因此**不存在也不需要 OpenAPI 规范文档**——OpenAPI 用于描述 HTTP 资源，本项目没有可描述的网络端点；编造一份虚构的 REST 接口将违反「信息与代码实现一致」的文档红线。

若未来引入服务端能力（如云同步、分享链接），应：① 在本文件补齐 OpenAPI 3.x 描述（`openapi.yaml` 置于仓库根或 `docs/`，CI 校验）；② 同步更新 SPEC §14.3 数据边界；③ 新增 CHANGELOG 条目。

本章余下内容以**内部模块接口契约 + 持久化数据契约**替代，供二次开发与测试定位使用。

> **OpenAPI 3.1 契约文件**：[`docs/openapi.yaml`](openapi.yaml) 是符合 OpenAPI 3.1 规范的机器可读契约——`paths: {}`（无 HTTP 端点）、`components.schemas` 定义 `DrawSettings` / `DrawState` / `HistoryEntry` / `ValidationErrorKey` 等结构与错误码，`components.examples` 给出返回示例。该文件可被契约测试与代码生成工具消费；其"无路径"状态是真实声明，不是待补全的占位。

## 2. 内部模块接口契约

### 2.1 app/lib/

| 导出 | 签名 | 说明 |
|---|---|---|
| `APP_VERSION` | `const APP_VERSION: string` | 版本单一来源（当前 `"5.7.14"`），与 `package.json` 一致 |
| `BUILD_ID` | `const BUILD_ID: string` | 构建期注入的 10 位 `yymmddhhmm`；非法/缺失时为 `""` |
| `FOOTER_VERSION` | `const FOOTER_VERSION: string` | `V{版本} · build {编号}`；BUILD_ID 缺失时回退 `V{版本}` |
| `createTranslator` | `(language: Language) => (...args: string[]) => string` | 依语言返回翻译函数；`TranslationKey` union 保证键合法 |
| `cn` | `(...inputs: ClassValue[]) => string` | clsx + tailwind-merge |
| `secureRandomInt` | `(min: number, max: number) => number` | crypto.getRandomValues，含均匀性测试（6000 次偏差检查） |
| `parseFiniteNumber` | `(v: unknown) => number \| null` | 容错解析 |
| `sanitizeListInput` / `sanitizeTextField` | 输入净化 | 防 XSS 的文本/名单清洗 |

### 2.2 app/hooks/

| 导出 | 签名 | 说明 |
|---|---|---|
| `useDraw` | `() => UseDrawReturn`（extends `DrawState`，直接展开 `status/history/results/isRolling` 及 `startDraw/stopDraw/reset/clearHistory` 等方法与各 setter） | 主编排 hook；`canDraw = status === "idle" \|\| "result"`，`settings` 为 16 字段只读快照 |
| `drawReducer` | `(state: DrawState, action: DrawAction) => DrawState` | 状态机：`idle → drawing → result/error` |
| `SETTINGS_FIELDS` | `readonly (keyof DrawSettings)[]` | 16 字段唯一登记处 + 编译期穷尽守卫 |
| `DEFAULT_SETTINGS` | `DrawSettings` | min 1 / max 100 / count 1 / allowDuplicates true / autoHide true / duration 5 / digits 3 / language "zh" 等 |
| `LIMITS` | `{ MAX_COUNT: 1000; MAX_LIST_ITEMS: 1000; MAX_RANGE: 10_000_000; MAX_DURATION: 30; MAX_DIGITS: 20 }` | 全部数值边界 |
| `validateSettings` | `(settings) => ValidationErrorKey \| null` | 校验失败返回错误翻译键（`draw-helpers.ts`），成功返回 `null` |
| `toSettings` | `(partial) => DrawSettings` | 遍历 `SETTINGS_FIELDS` 组装快照 |
| `finalizeDraw` | `(settings) => string[]` | 生成最终结果（secureRandomInt / 名单取样） |
| `formatNumber` | `(n: number, digits: number, prefix: string, suffix: string) => string` | 补零 + 前后缀（4 个位置参数，非对象参数） |
| `useStoredLanguage` | `() => [Language, setLanguage]` | `zendraw-language` 读写 + 枚举校验 + 跨标签页同步 |
| `useLocalStorage` | `(key, { validate? }) => [value, setValue]` | JSON 序列化、类型守卫、QuotaExceededError 告警、storage 事件同步 |
| `THEME_PRESETS` / `FONT_FAMILIES` | 11 项 / 3 项 | 配色与字体枚举（`theme-provider.tsx`） |

### 2.3 核心类型

```ts
type DrawStatus = "idle" | "drawing" | "result" | "error";
type Language = "zh" | "en";
type ThemePreset = "default" | "ocean" | "forest" | "sunset" | "purple"
  | "neon" | "sakura" | "midnight" | "retro" | "pixel" | "rose";
type FontFamily = "sans" | "mono" | "serif";
interface HistoryEntry { id: string; timestamp: string; results: string[]; }
```

## 3. 持久化数据契约

19 个 `localStorage` 键（17 个 `use-draw-persistence.ts` + 2 个 `theme-provider.tsx`），前缀 `zendraw-`，统一 JSON 序列化：

| 键 | 类型 | 默认 | 守卫 |
|---|---|---|---|
| `zendraw-min` / `zendraw-max` | number | 1 / 100 | — |
| `zendraw-count` | number | 1 | — |
| `zendraw-duration` | number（秒） | 5 | — |
| `zendraw-duplicates` / `zendraw-use-custom` | boolean | true / false | — |
| `zendraw-custom-list` | string[] | [] | 类型守卫 |
| `zendraw-digits` | number（0–20） | 3 | — |
| `zendraw-prefix` / `zendraw-suffix` | string | "" | — |
| `zendraw-language` | `"zh" \| "en"` | "zh" | 枚举校验 |
| `zendraw-sound` / `zendraw-confetti` / `zendraw-reduce-motion` / `zendraw-autohide` | boolean | true/true/false/true | — |
| `zendraw-density` | `"comfortable" \| "compact"` | "comfortable" | — |
| `zendraw-history` | HistoryEntry[]（≤100 条） | [] | 类型守卫 |
| `zendraw-theme-preset` | ThemePreset | "default" | — |
| `zendraw-font-family` | FontFamily | "sans" | — |

- 主题模式（light/dark/system）由 `next-themes` 管理，**不属于**上表；
- 写满（QuotaExceededError）时控制台告警、不中断 UI；
- 所有读取均有默认值回退：脏数据/缺失不会白屏。

## 4. 错误处理约定

| 场景 | 行为 | 用户可见反馈 |
|---|---|---|
| 抽取参数校验失败 | reducer → `error` 态 | error 音效 + 错误文案（翻译键） |
| localStorage 读取脏数据 | 类型守卫 → 回退默认值 | 无感（不白屏） |
| localStorage 写入超限 | 控制台告警 | 无感 |
| 剪贴板复制失败 | toast 提示 | 可见提示 |
| 构建标识缺失 | `FOOTER_VERSION` 回退仅版本号 | 页脚显示 `V5.7.14` |

## 5. 错误码定义

`validateSettings` 返回 `ValidationErrorKey | null`，是**内部错误码而非 HTTP 状态码**（本项目无 HTTP 接口）；调用方经 `createTranslator` 翻译为用户可见文案：

| 错误码 | 触发条件 | 边界常量 |
|---|---|---|
| `errCustomListEmpty` | 启用名单但名单为空 | — |
| `errCustomListTooMany` | 名单项数 > 1000 | `MAX_LIST_ITEMS` |
| `errCustomListRange` | 名单模式且禁止重复，但请求数量 > 名单项数 | `MAX_COUNT` |
| `minMaxError` | 最小值 > 最大值，或非有限数值 | — |
| `errRangeInvalid` | 范围跨度 ≤ 0 或 > 10,000,000 | `MAX_RANGE` |
| `rangeError` | 数字模式且禁止重复，但请求数量 > 范围跨度 | `MAX_COUNT` |
| `null` | 校验通过 | — |

机器可读定义见 [`openapi.yaml` `ValidationErrorKey`](openapi.yaml)。`LIMITS` 完整值：`MAX_COUNT=1000`、`MAX_LIST_ITEMS=1000`、`MAX_RANGE=10_000_000`、`MAX_DURATION=30`、`MAX_DIGITS=20`。

## 6. 调用示例

无 HTTP 端点，以下为**模块内调用示例**（TypeScript，路径别名 `@/` 指向 `app/`）：

```ts
import { useDraw } from '@/hooks/use-draw';
import { validateSettings, finalizeDraw, formatNumber, LIMITS } from '@/hooks/draw-helpers';
import { createTranslator } from '@/lib/i18n';
import { FOOTER_VERSION } from '@/lib/version';

// ① 组件内主编排：直接展开返回值，无 state/actions 包装层
function DrawPanel() {
  const { status, results, isDrawing, canDraw, startDraw, stopDraw, history } = useDraw();
  return <button onClick={() => (isDrawing ? stopDraw() : startDraw())}>{status}</button>;
}

// ② 参数校验：返回错误码或 null，i18n 翻译后展示
const t = createTranslator('zh');
const code = validateSettings({ min: 100, max: 1, count: 2, allowDuplicates: false, useCustomList: false, customList: [] });
if (code) console.warn(t(code)); // minMaxError → 中文错误文案

// ③ 结果生成 + 格式化：formatNumber 为 4 个位置参数
const values = finalizeDraw({ min: 1, max: 100, count: 2, allowDuplicates: true, digits: 3, prefix: 'NO.', suffix: '', useCustomList: false, customList: [] });
// => ['NO.007', 'NO.042']（示意值；实际由 crypto.getRandomValues 生成）

// ④ 页脚展示：单一来源，禁止自行拼接版本/build
console.log(FOOTER_VERSION); // V5.7.14 · build <10 位编号>
```

> `console` 仅用于本文档示例说明，项目源码受 ESLint 零告警门禁约束，禁止保留调试输出。
