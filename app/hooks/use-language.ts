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
