# ZenDraw 页面完善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完善 4 个核心页面（page/layout/error/not-found）的 i18n、a11y、鲁棒性与 prototype 视觉对齐，使所有页面通过统一的翻译系统、可访问性标准与错误处理。

**Architecture:** 以现有 `createTranslator` 中央翻译系统为基础，扩展 9 个翻译键覆盖 404/错误页/skip-link；新增 `use-language` hook 提供 SSR 安全的语言读取；4 个页面分别按 a11y 优先级改造；最后更新 SPEC.md 文档对齐。

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5.9 strict, Vitest + @testing-library/react, motion/react, next-themes, lucide-react, Tailwind CSS v4。

---

## File Structure

| 文件 | 操作 | 职责 |
|------|------|------|
| `app/locales/types.ts` | Modify | 新增 9 个 TranslationKey 成员 |
| `app/locales/zh.ts` | Modify | 新增 9 个中文翻译 |
| `app/locales/en.ts` | Modify | 新增 9 个英文翻译 |
| `app/hooks/use-language.ts` | Create | SSR 安全的语言读取 hook + LanguageSync 组件 |
| `app/hooks/__tests__/use-language.test.ts` | Create | useLanguage hook 单元测试 |
| `app/layout.tsx` | Modify | lang 动态化 + LanguageSync + metadata 优化 + icons |
| `app/not-found.tsx` | Modify | client component + i18n + Button 样式 + lucide 图标 |
| `app/error.tsx` | Modify | i18n + Button + digest 展示 + lucide + reduce-motion |
| `app/page.tsx` | Modify | 移除 role=application + skip-link + main id + 动态 footerInfo + Button SheetTrigger + useThemeMounted |
| `app/components/__tests__/not-found.test.tsx` | Create | NotFound 渲染测试 |
| `app/components/__tests__/error.test.tsx` | Create | Error 渲染测试 |
| `app/components/__tests__/page-a11y.test.tsx` | Create | page.tsx a11y 属性测试 |
| `openspec/SPEC.md` | Modify | 更新翻译键数量、错误边界描述、目录树 |

---

## Task 1: 扩展 i18n 翻译键

**Files:**
- Modify: `app/locales/types.ts:4-44`
- Modify: `app/locales/zh.ts:4-116`
- Modify: `app/locales/en.ts:4-116`
- Test: `app/locales/__tests__/translations.test.ts` (Create)

- [ ] **Step 1: Write the failing test**

Create `app/locales/__tests__/translations.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { translations, type TranslationKey } from "@/locales";
import { createTranslator } from "@/lib/i18n";

describe("i18n extended keys", () => {
  const newKeys: TranslationKey[] = [
    "errorPageTitle",
    "errorPageDesc",
    "errorRetry",
    "errorBackHome",
    "errorIdLabel",
    "notFoundTitle",
    "notFoundDesc",
    "notFoundBackHome",
    "skipToContent",
  ];

  it.each(newKeys)("has key %s in zh", (key) => {
    expect(translations.zh[key]).toBeDefined();
    expect(translations.zh[key].length).toBeGreaterThan(0);
  });

  it.each(newKeys)("has key %s in en", (key) => {
    expect(translations.en[key]).toBeDefined();
    expect(translations.en[key].length).toBeGreaterThan(0);
  });

  it("translates errorPageTitle correctly", () => {
    const tZh = createTranslator("zh");
    const tEn = createTranslator("en");
    expect(tZh("errorPageTitle")).toBe("出了点问题");
    expect(tEn("errorPageTitle")).toBe("Something Went Wrong");
  });

  it("translates notFoundTitle correctly", () => {
    const tZh = createTranslator("zh");
    const tEn = createTranslator("en");
    expect(tZh("notFoundTitle")).toBe("页面未找到");
    expect(tEn("notFoundTitle")).toBe("Page Not Found");
  });

  it("translates skipToContent correctly", () => {
    const tZh = createTranslator("zh");
    const tEn = createTranslator("en");
    expect(tZh("skipToContent")).toBe("跳到主内容");
    expect(tEn("skipToContent")).toBe("Skip to main content");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/locales/__tests__/translations.test.ts`
Expected: FAIL with "Type error: Argument of type '"errorPageTitle"' is not assignable to parameter of type 'TranslationKey'" or runtime "Cannot read properties of undefined".

- [ ] **Step 3: Add new keys to types.ts**

In `app/locales/types.ts`, replace the last line of the `TranslationKey` union (line 43):

```typescript
  | "autoSaveDesc" | "clickToCopy" | "copied" | "copiedToClipboard" | "copyResult"
  | "listPlaceholder" | "recordLabel" | "resultsCount" | "settingsPanel"
  // 页面级（404 / 错误 / 无障碍）
  | "errorPageTitle" | "errorPageDesc" | "errorRetry" | "errorBackHome" | "errorIdLabel"
  | "notFoundTitle" | "notFoundDesc" | "notFoundBackHome"
  | "skipToContent";
```

- [ ] **Step 4: Add Chinese translations to zh.ts**

In `app/locales/zh.ts`, replace the closing of the object (lines 114-116):

```typescript
  listPlaceholder: "苹果\n香蕉\n橙子...",
  settingsPanel: "设置面板",
  // 页面级
  errorPageTitle: "出了点问题",
  errorPageDesc: "应用遇到了意外错误。请尝试刷新页面或重置状态。",
  errorRetry: "重试",
  errorBackHome: "返回首页",
  errorIdLabel: "错误编号",
  notFoundTitle: "页面未找到",
  notFoundDesc: "您访问的页面不存在。ZenDraw 是一个单页应用，返回首页即可使用。",
  notFoundBackHome: "返回首页",
  skipToContent: "跳到主内容",
};
```

- [ ] **Step 5: Add English translations to en.ts**

In `app/locales/en.ts`, replace the closing of the object (lines 114-116):

```typescript
  listPlaceholder: "Apple\nBanana\nOrange...",
  settingsPanel: "Settings panel",
  // Page-level
  errorPageTitle: "Something Went Wrong",
  errorPageDesc: "An unexpected error occurred. Please refresh the page or reset the state.",
  errorRetry: "Retry",
  errorBackHome: "Back to Home",
  errorIdLabel: "Error ID",
  notFoundTitle: "Page Not Found",
  notFoundDesc: "The page you requested does not exist. ZenDraw is a single-page app — return home to use it.",
  notFoundBackHome: "Back to Home",
  skipToContent: "Skip to main content",
};
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run app/locales/__tests__/translations.test.ts`
Expected: PASS — all assertions green.

- [ ] **Step 7: Run full type-check and lint**

Run: `npm run type-check && npm run lint`
Expected: Both pass with no errors.

- [ ] **Step 8: Commit**

```bash
git add app/locales/types.ts app/locales/zh.ts app/locales/en.ts app/locales/__tests__/translations.test.ts
git commit -m "feat(i18n): add 9 translation keys for 404/error/skip-link pages"
```

---

## Task 2: 创建 use-language hook

**Files:**
- Create: `app/hooks/use-language.ts`
- Test: `app/hooks/__tests__/use-language.test.ts` (Create)

- [ ] **Step 1: Write the failing test**

Create `app/hooks/__tests__/use-language.test.ts`:

```typescript
/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLanguage } from "../use-language";

describe("useLanguage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns default zh on server snapshot", () => {
    const { result } = renderHook(() => useLanguage());
    // jsdom is client-side; default zh when storage empty
    expect(result.current).toBe("zh");
  });

  it("returns en when localStorage has en", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("en");
  });

  it("returns zh when localStorage has zh", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("zh"));
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("zh");
  });

  it("returns zh fallback for invalid value", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("fr"));
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("zh");
  });

  it("returns zh fallback for malformed JSON", () => {
    window.localStorage.setItem("zendraw-language", "not-json");
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("zh");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/hooks/__tests__/use-language.test.ts`
Expected: FAIL with "Cannot find module '../use-language'".

- [ ] **Step 3: Create the hook implementation**

Create `app/hooks/use-language.ts`:

```typescript
// hooks/use-language.ts v5.0.0 — SSR 安全的语言读取 Hook
"use client";

import * as React from "react";
import type { Language } from "@/locales";

const STORAGE_KEY = "zendraw-language";
const DEFAULT_LANGUAGE: Language = "zh";

/** 从 localStorage 读取语言（JSON 解析，与 use-local-storage 格式一致） */
function readLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) return DEFAULT_LANGUAGE;
    const parsed = JSON.parse(item) as unknown;
    if (parsed === "zh" || parsed === "en") return parsed;
  } catch {
    // 落到默认值
  }
  return DEFAULT_LANGUAGE;
}

const noopSubscribe = () => () => {};
const getServerSnapshot = () => DEFAULT_LANGUAGE;

/**
 * 读取用户语言偏好（SSR 安全）。
 * - 服务端快照固定返回 "zh"（默认语言），避免 hydration mismatch
 * - 客户端 hydrate 后从 localStorage 读取实际偏好
 * - 监听 `storage` 事件实现跨标签同步
 */
export function useLanguage(): Language {
  const subscribe = React.useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);
  const getSnapshot = React.useCallback(() => readLanguage(), []);
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * 同步 <html lang> 属性到当前语言。
 * 在 layout 中渲染一次即可，依赖 suppressHydrationWarning 避免 warning。
 */
export function LanguageSync(): null {
  const language = useLanguage();
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/hooks/__tests__/use-language.test.ts`
Expected: PASS — 5 tests green.

- [ ] **Step 5: Run type-check and lint**

Run: `npm run type-check && npm run lint`
Expected: Both pass.

- [ ] **Step 6: Commit**

```bash
git add app/hooks/use-language.ts app/hooks/__tests__/use-language.test.ts
git commit -m "feat(hooks): add useLanguage hook with SSR-safe localStorage reading"
```

---

## Task 3: 完善 app/layout.tsx

**Files:**
- Modify: `app/layout.tsx:1-62`
- Test: manual verification (metadata is server-only, covered by build)

- [ ] **Step 1: Read current layout.tsx for reference**

Run: `Read /workspace/app/layout.tsx`
Confirm current state: `lang="en"` hardcoded, metadata title Chinese + description English, no icons.

- [ ] **Step 2: Update layout.tsx with dynamic lang, LanguageSync, and metadata improvements**

Replace the entire content of `app/layout.tsx` with:

```tsx
// app/layout.tsx v5.0.0
import type { Metadata, Viewport } from "next";
import "./style.css";
import { Geist, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageSync } from "@/hooks/use-language";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale: 1 & userScalable: false 会剥夺视障用户双指缩放能力（WCAG 1.4.4）。
  // 此处保留默认行为以符合无障碍标准。
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "ZenDraw v5.0.0 | 禅抽 — Truly Random Draw",
  description:
    "ZenDraw (禅抽) — a professional, full-screen random draw application with Apple-inspired design, customizable rules, multi-language support, slot-machine style rolling animations, and persistent settings.",
  keywords: [
    "ZenDraw",
    "禅抽",
    "random draw",
    "lucky draw",
    "randomizer",
    "抽签",
    "随机数",
    "抽奖",
    "roller",
    "slot machine",
  ],
  authors: [{ name: "Sut" }],
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang 默认 "zh"（项目默认语言），LanguageSync 会在客户端 hydrate 后修正为用户偏好
  return (
    <html
      lang="zh"
      className={cn("font-sans", geist.variable, jetBrainsMono.variable, playfairDisplay.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageSync />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Run type-check and lint**

Run: `npm run type-check && npm run lint`
Expected: Both pass. Note: `<head>` tag in App Router layout is allowed for legacy meta tags; Next.js will merge with its own head management.

- [ ] **Step 4: Run build to verify metadata compiles**

Run: `npm run build`
Expected: Build succeeds with 4/4 static pages. No metadata errors.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(layout): dynamic html lang via LanguageSync, unified metadata, themeColor"
```

---

## Task 4: 完善 app/not-found.tsx

**Files:**
- Modify: `app/not-found.tsx:1-37`
- Test: `app/components/__tests__/not-found.test.tsx` (Create)

- [ ] **Step 1: Write the failing test**

Create `app/components/__tests__/not-found.test.tsx`:

```typescript
/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/not-found";

describe("NotFound page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders Chinese content by default", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("页面未找到");
  });

  it("renders English content when language is en", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page Not Found");
  });

  it("has a link to home with correct aria-label", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("uses lucide icon with aria-hidden", () => {
    const { container } = render(<NotFound />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/components/__tests__/not-found.test.ts`
Expected: FAIL — heading text is "页面未找到" (hardcoded) for English test case, and no `aria-hidden` svg.

- [ ] **Step 3: Rewrite not-found.tsx with i18n and lucide icon**

Replace the entire content of `app/not-found.tsx` with:

```tsx
// app/not-found.tsx v5.0.0 — 404 页面（i18n + lucide 图标）
"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { createTranslator } from "@/lib/i18n";

export default function NotFound() {
  const language = useLanguage();
  const t = createTranslator(language);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("notFoundTitle")}</h1>
        <p className="text-muted-foreground text-sm max-w-md">{t("notFoundDesc")}</p>
      </div>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 py-3")}
      >
        {t("notFoundBackHome")}
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/components/__tests__/not-found.test.ts`
Expected: PASS — 4 tests green.

- [ ] **Step 5: Run type-check, lint, and build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: All pass. Build shows `/not-found` or `/_not-found` route.

- [ ] **Step 6: Commit**

```bash
git add app/not-found.tsx app/components/__tests__/not-found.test.tsx
git commit -m "feat(not-found): i18n via useLanguage, lucide icon, Button styles"
```

---

## Task 5: 完善 app/error.tsx

**Files:**
- Modify: `app/error.tsx:1-55`
- Test: `app/components/__tests__/error.test.tsx` (Create)

- [ ] **Step 1: Write the failing test**

Create `app/components/__tests__/error.test.tsx`:

```typescript
/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorPage from "@/error";

describe("Error page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders Chinese content by default", () => {
    const error = new Error("test error") as Error & { digest?: string };
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("出了点问题");
  });

  it("renders English content when language is en", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const error = new Error("test error") as Error & { digest?: string };
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Something Went Wrong");
  });

  it("shows error digest when present", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const error = new Error("test") as Error & { digest?: string };
    error.digest = "abc123";
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
  });

  it("does not show digest section when absent", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const error = new Error("test") as Error & { digest?: string };
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.queryByText(/Error ID/)).not.toBeInTheDocument();
  });

  it("calls reset when retry button clicked", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const reset = vi.fn();
    const error = new Error("test") as Error & { digest?: string };
    render(<ErrorPage error={error} reset={reset} />);
    screen.getByRole("button", { name: /retry/i }).click();
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("logs error to console.error on mount", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("logged error");
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(consoleSpy).toHaveBeenCalledWith("ZenDraw Error:", error);
    consoleSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/components/__tests__/error.test.tsx`
Expected: FAIL — heading is hardcoded "出了点问题", no digest display, retry button text is "重试" not matching /retry/i.

- [ ] **Step 3: Rewrite error.tsx with i18n, digest, lucide, and reduce-motion**

Replace the entire content of `app/error.tsx` with:

```tsx
// app/error.tsx v5.0.0 — 全局错误边界（i18n + digest + lucide + reduce-motion）
"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { createTranslator } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const language = useLanguage();
  const t = createTranslator(language);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    console.error("ZenDraw Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10"
      >
        <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("errorPageTitle")}</h1>
        <p className="text-muted-foreground text-sm max-w-md">{t("errorPageDesc")}</p>
      </div>

      {error.digest ? (
        <p className="text-xs text-muted-foreground/70 font-mono">
          {t("errorIdLabel")}: {error.digest}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button onClick={reset} variant="default" className="rounded-full">
          <RefreshCw className="size-4" aria-hidden="true" />
          {t("errorRetry")}
        </Button>
        <Button
          onClick={() => {
            window.location.href = "/";
          }}
          variant="outline"
          className="rounded-full"
        >
          <Home className="size-4" aria-hidden="true" />
          {t("errorBackHome")}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/components/__tests__/error.test.tsx`
Expected: PASS — 6 tests green.

- [ ] **Step 5: Run type-check, lint, and build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add app/error.tsx app/components/__tests__/error.test.tsx
git commit -m "feat(error): i18n, error digest display, lucide icons, reduce-motion support"
```

---

## Task 6: 完善 app/page.tsx a11y

**Files:**
- Modify: `app/page.tsx:1-174`
- Test: `app/components/__tests__/page-a11y.test.tsx` (Create)

- [ ] **Step 1: Write the failing test**

Create `app/components/__tests__/page-a11y.test.tsx`:

```typescript
/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next-themes to avoid SSR issues
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: () => {} }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock motion/react to avoid animation complexity in tests
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

// Mock Web Audio API
vi.mock("@/hooks/use-sound", () => ({
  useSound: () => ({ play: () => {} }),
}));

import HomePage from "@/page";

describe("HomePage accessibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does NOT use role=application on root div", () => {
    const { container } = render(<HomePage />);
    const appRoot = container.querySelector('[role="application"]');
    expect(appRoot).toBeNull();
  });

  it("has a skip-to-content link as first focusable element", () => {
    render(<HomePage />);
    const skipLink = screen.getByRole("link", { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("has main element with id=main-content", () => {
    render(<HomePage />);
    const main = document.querySelector("main");
    expect(main).toHaveAttribute("id", "main-content");
  });

  it("uses dynamic footer info (10 themes, 3 fonts)", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    render(<HomePage />);
    // footerInfo template: "{0} themes · {1} fonts · stored locally"
    expect(screen.getByText(/10 themes · 3 fonts/i)).toBeInTheDocument();
  });

  it("settings SheetTrigger is a real button", () => {
    render(<HomePage />);
    const settingsButton = screen.getByRole("button", { name: /settings/i });
    expect(settingsButton.tagName).toBe("BUTTON");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/components/__tests__/page-a11y.test.tsx`
Expected: FAIL — `role="application"` exists, no skip link, main has no id, footer shows "10 themes · 6 fonts" (wrong number), SheetTrigger is not a `<button>`.

- [ ] **Step 3: Update page.tsx — remove role=application, add skip-link, add main id, fix footer params**

In `app/page.tsx`, make the following edits:

**Edit 1: Add imports for THEME_PRESETS, FONT_FAMILIES, and useThemeMounted**

Replace the import block (lines 5-23) — add after the existing imports:

```tsx
import { motion, useReducedMotion } from "motion/react";
import { Sun, Moon, Settings2, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTheme, useThemeMounted } from "next-themes";
import { useDraw } from "@/hooks/use-draw";
import { useSound } from "@/hooks/use-sound";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { THEME_PRESETS, FONT_FAMILIES } from "@/components/theme-provider";
import { DrawButton } from "@/components/draw/draw-button";
import { SettingsPanel } from "@/components/draw/settings-panel";
import { HistoryList } from "@/components/draw/history-list";
import { DrawDisplay } from "@/components/draw/draw-display";
import { createTranslator } from "@/lib/i18n";
```

**Edit 2: Add useThemeMounted and resolve theme safely**

Replace lines 24-39 (the function body up to `lang`):

```tsx
export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useThemeMounted();
  const { theme, setTheme } = useTheme();

  // 1. 统一状态管理
  const { play } = useSound();
  const draw = useDraw(play);

  // 2. 面板状态
  const [panelOpen, setPanelOpen] = React.useState(false);
  const t = React.useMemo(() => createTranslator(draw.language), [draw.language]);

  // 3. 键盘快捷键
  useKeyboardShortcuts({ draw, panelOpen, setPanelOpen });

  const lang = draw.language;
  const resolvedTheme = mounted ? theme : undefined;
  const isDark = resolvedTheme === "dark";
```

**Edit 4: Remove role=application and add skip-link + main id**

Replace lines 41-46 (the outer div + role):

```tsx
  return (
    <div className="min-h-screen w-full bg-background text-foreground antialiased">
      {/* Skip to content — 无障碍快捷导航 (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        {t("skipToContent")}
      </a>
```

**Edit 5: Fix theme toggle button to use isDark**

Replace the theme toggle button (lines 70-86):

```tsx
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={isDark ? t("switchLight") : t("switchDark")}
              title={isDark ? t("switchLight") : t("switchDark")}
              className="rounded-full"
            >
              {isDark ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </Button>
```

**Edit 6: Replace SheetTrigger div with Button asChild**

Replace the SheetTrigger block (lines 89-95):

```tsx
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t("settings")}
                    className="rounded-full"
                  />
                }
              >
                <Settings2 className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t("settings")}</span>
              </SheetTrigger>
```

**Edit 7: Add id and aria-labelledby to main**

Replace the main element (line 146):

```tsx
      <main id="main-content" aria-label={t("drawMainArea")} className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12 pb-16">
```

**Edit 8: Fix footerInfo to use dynamic counts**

Replace the footer paragraph (line 169):

```tsx
          {t("footerInfo", String(THEME_PRESETS.length), String(FONT_FAMILIES.length))}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/components/__tests__/page-a11y.test.tsx`
Expected: PASS — 5 tests green.

- [ ] **Step 5: Run type-check and lint**

Run: `npm run type-check && npm run lint`
Expected: Both pass. Note: `@base-ui/react` SheetTrigger uses `render` prop pattern (not `asChild`).

- [ ] **Step 6: Run build to verify production compiles**

Run: `npm run build`
Expected: Build succeeds with 4/4 static pages.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/components/__tests__/page-a11y.test.tsx
git commit -m "feat(page): a11y — skip-link, remove role=application, dynamic footer counts, Button SheetTrigger"
```

---

## Task 7: 更新 SPEC.md 文档

**Files:**
- Modify: `openspec/SPEC.md:71-122` (directory tree), `openspec/SPEC.md:439-469` (translation keys), `openspec/SPEC.md:517-519` (error boundary)

- [ ] **Step 1: Update translation key count and list**

In `openspec/SPEC.md`, replace section 7.2 header (line 439):

```markdown
### 7.2 翻译键（108 个）
```

And append the 9 new keys to the key list (after `listPlaceholder, recordLabel, resultsCount, settingsPanel` on line 468):

```markdown
errorPageTitle, errorPageDesc, errorRetry, errorBackHome, errorIdLabel,
notFoundTitle, notFoundDesc, notFoundBackHome,
skipToContent
```

- [ ] **Step 2: Update error boundary section**

In `openspec/SPEC.md`, replace section 8.5 (lines 517-519):

```markdown
### 8.5 错误边界
- `app/error.tsx` — 全局错误捕获 + i18n + 重试按钮 + 返回首页 + error.digest 展示 + reduce-motion 支持
- `app/not-found.tsx` — 404 友好提示 + i18n + lucide 图标 + Button 样式
- `app/hooks/use-language.ts` — SSR 安全语言读取 Hook（供 error/not-found 共用）
```

- [ ] **Step 3: Update directory tree**

In `openspec/SPEC.md`, in the hooks directory listing (around line 113), add after `use-keyboard-shortcuts.ts`:

```markdown
│   │   ├── use-language.ts           # SSR 安全语言读取 Hook + LanguageSync 组件
```

- [ ] **Step 4: Update locales count note**

In `openspec/SPEC.md` line 119, update the comment:

```markdown
│   │   ├── types.ts              # TranslationKey（108 键）
```

- [ ] **Step 5: Commit**

```bash
git add openspec/SPEC.md
git commit -m "docs(spec): update translation keys to 108, document use-language hook and error boundary"
```

---

## Task 8: 最终验证与提交推送

**Files:** None (verification only)

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All test files pass (existing 3 + new translations 5 + use-language 5 + not-found 4 + error 6 + page-a11y 5 = 28 tests total).

- [ ] **Step 2: Run type-check, lint, and build together**

Run: `npm run type-check && npm run lint && npm run build`
Expected: All three pass. Build shows 4/4 static pages.

- [ ] **Step 3: Verify i18n parity**

Run:
```bash
diff <(grep -oE "^\s+[a-zA-Z][a-zA-Z0-9_]*:" app/locales/zh.ts | tr -d ' :' | sort -u) <(grep -oE "^\s+[a-zA-Z][a-zA-Z0-9_]*:" app/locales/en.ts | tr -d ' :' | sort -u) && echo "PARITY OK"
```
Expected: `PARITY OK` (empty diff).

- [ ] **Step 4: Verify no source file exceeds 200 lines (excluding ui/**)**

Run:
```bash
find app -name "*.ts" -o -name "*.tsx" | grep -v "/ui/" | xargs wc -l | awk '$1>200 && $2!="total" {print}'
```
Expected: Empty output (no files over 200 lines).

- [ ] **Step 5: Push to remote**

Run:
```bash
git push origin trae/solo-agent-S0tS3o
```
Expected: Push succeeds, all commits uploaded.

- [ ] **Step 6: Final git status check**

Run: `git status -sb`
Expected: `## trae/solo-agent-S0tS3o` with nothing to commit (clean working tree).

---

## Self-Review Checklist

**Spec coverage:**
- ✅ i18n 全覆盖：9 个新键覆盖 404/error/skip-link
- ✅ 多语言切换正常：error/not-found 通过 useLanguage hook 响应语言
- ✅ 代码符合规范：layout lang、page a11y、统一用 createTranslator
- ✅ 视觉对齐 prototype：lucide 图标、Button 组件、motion 动画
- ✅ 鲁棒性与错误处理：error.digest 展示、reduce-motion、SSR 安全
- ✅ 文件 ≤200 行：所有新/改文件均在阈值内

**Placeholder scan:** No TBD/TODO/fill-in-later. All code blocks contain complete implementations.

**Type consistency:**
- `Language` type from `@/locales` used consistently
- `TranslationKey` extended in types.ts, used by createTranslator
- `useLanguage(): Language` return type matches `createTranslator(language: Language)`
- `THEME_PRESETS` / `FONT_FAMILIES` imported from `@/components/theme-provider` (existing exports)
