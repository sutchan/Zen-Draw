// hooks/use-local-storage.ts v1.0 — 本地存储 Hook
"use client";

import * as React from "react";

/**
 * 带类型安全的 localStorage Hook
 * - 与 React 状态同步
 * - SSR 安全（window 检测 + useEffect 中读取）
 * - 自动 JSON 序列化
 * - 跨组件事件同步（storage 事件）
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      // SSR 环境直接使用默认值
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue;
      }
      return JSON.parse(item) as T;
    } catch {
      // JSON 解析失败时使用默认值
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
  });

  // 同步到 localStorage
  const setValue = React.useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (value) => {
      setStoredValue((prev) => {
        const next =
          typeof value === "function"
            ? (value as (p: T) => T)(prev)
            : value;
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch (e) {
          // localStorage 可能已满（QuotaExceededError）或在隐私模式下不可用
          if (e instanceof DOMException && e.name === "QuotaExceededError") {
            console.warn(`[useLocalStorage] localStorage 已满，无法保存键"${key}"`);
          } else {
            console.warn(`[useLocalStorage] 写入失败（键"${key}"）:`, e);
          }
        }
        return next;
      });
    },
    [key]
  );

  // 跨标签页同步：监听 storage 事件
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setStoredValue(JSON.parse(e.newValue) as T);
      } catch {
        // 忽略解析错误
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [storedValue, setValue];
}
