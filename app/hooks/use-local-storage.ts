// hooks/use-local-storage.ts v5.2.1 — 本地存储 Hook
"use client";

import * as React from "react";

/**
 * 带类型安全的 localStorage Hook
 * - 与 React 状态同步
 * - SSR 安全（window 检测 + useEffect 中读取）
 * - 自动 JSON 序列化
 * - 跨组件事件同步（storage 事件）
 */
/**
 * 安全校验器：当 localStorage 中读取到的数据与期望结构不符时返回默认值，
 * 避免存储被污染（如 customList 存成非数组）导致下游白屏。
 */
type Validator<T> = (value: unknown) => value is T;

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  validator?: Validator<T>,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // 统一的默认值解析，避免重复逻辑
  const resolveDefault = React.useCallback((): T => {
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  }, [initialValue]);

  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      // SSR 环境直接使用默认值
      return resolveDefault();
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return resolveDefault();
      }
      const parsed = JSON.parse(item) as unknown;
      // 若提供校验器且数据不合规，回退默认值
      if (validator && !validator(parsed)) {
        return resolveDefault();
      }
      return parsed as T;
    } catch {
      // JSON 解析失败时使用默认值
      return resolveDefault();
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

  // validator 存入 ref，避免每次 render 内联箭头函数变化触发 effect 重建
  const validatorRef = React.useRef(validator);
  React.useEffect(() => {
    validatorRef.current = validator;
  }, [validator]);

  // 跨标签页同步：监听 storage 事件
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        const parsed = JSON.parse(e.newValue) as unknown;
        if (validatorRef.current && !validatorRef.current(parsed)) return;
        setStoredValue(parsed as T);
      } catch {
        // 忽略解析错误
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [storedValue, setValue];
}

